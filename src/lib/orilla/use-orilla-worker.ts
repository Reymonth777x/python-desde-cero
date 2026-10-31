'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { resolvePythonRunnerOrigin } from '@/lib/python-runner-protocol';
import type { PayloadTramo, ResultadoOrilla } from './types';

export type EstadoWorkerOrilla = 'inactivo' | 'cargando' | 'listo' | 'error';
type Pendiente = { resolve: (resultado: ResultadoOrilla) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };
type MensajeRunner = {
  status?: string;
  type?: string;
  id?: number;
  error?: string;
  result?: ResultadoOrilla;
};

const ESPERA_CARGA_MS = 60_000;
const ESPERA_EJECUCION_MS = 20_000;

/**
 * Reutiliza el mismo iframe de origen distinto y MessagePort que el laboratorio.
 * No crea un Worker en el origen de la academia: Pyodide solo vive en Cloudflare runner.
 */
export function useOrillaWorker() {
  const sandboxFrameRef = useRef<HTMLIFrameElement | null>(null);
  const runnerPortRef = useRef<MessagePort | null>(null);
  const runnerOriginRef = useRef<string | null>(null);
  const frameRequestedRef = useRef(false);
  const frameLoadedRef = useRef(false);
  const bootIdRef = useRef(0);
  const requestIdRef = useRef(0);
  const pendingRef = useRef(new Map<number, Pendiente>());
  const readyPromiseRef = useRef<Promise<void> | null>(null);
  const readyResolveRef = useRef<(() => void) | null>(null);
  const readyRejectRef = useRef<((error: Error) => void) | null>(null);
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const estadoRef = useRef<EstadoWorkerOrilla>('inactivo');
  const [estado, setEstado] = useState<EstadoWorkerOrilla>('inactivo');

  const configurarEstado = useCallback((nuevo: EstadoWorkerOrilla) => {
    estadoRef.current = nuevo;
    setEstado(nuevo);
  }, []);

  const configuredRunnerOrigin = resolvePythonRunnerOrigin(
    process.env.NEXT_PUBLIC_PYTHON_RUNNER_ORIGIN,
    typeof window === 'undefined' ? '' : window.location.origin,
  );

  useEffect(() => {
    runnerOriginRef.current = configuredRunnerOrigin;
  }, [configuredRunnerOrigin]);

  const clearReadyTimer = useCallback(() => {
    if (readyTimerRef.current !== null) {
      clearTimeout(readyTimerRef.current);
      readyTimerRef.current = null;
    }
  }, []);

  const rechazarPreparacion = useCallback((error: Error) => {
    clearReadyTimer();
    const reject = readyRejectRef.current;
    readyPromiseRef.current = null;
    readyResolveRef.current = null;
    readyRejectRef.current = null;
    configurarEstado('error');
    reject?.(error);
  }, [clearReadyTimer, configurarEstado]);

  const enviar = useCallback((message: Record<string, unknown>) => {
    const port = runnerPortRef.current;
    if (!port || !frameRequestedRef.current) return false;
    try {
      port.postMessage(message);
      return true;
    } catch {
      return false;
    }
  }, []);

  const manejarMensaje = useCallback((event: MessageEvent) => {
    const message = event.data as MensajeRunner | null;
    if (!message || typeof message !== 'object') return;

    if (message.status === 'ready') {
      clearReadyTimer();
      configurarEstado('listo');
      readyResolveRef.current?.();
      readyPromiseRef.current = null;
      readyResolveRef.current = null;
      readyRejectRef.current = null;
      return;
    }

    if (message.status === 'init-error' || message.status === 'runtime-error') {
      rechazarPreparacion(new Error(typeof message.error === 'string'
        ? message.error.slice(0, 2000)
        : 'No se pudo iniciar el ejecutor Python aislado.'));
      return;
    }

    if (message.type !== 'orilla:result' && message.type !== 'orilla:error') return;
    if (!Number.isSafeInteger(message.id)) return;
    const pendiente = pendingRef.current.get(message.id as number);
    if (!pendiente) return;
    clearTimeout(pendiente.timer);
    pendingRef.current.delete(message.id as number);

    if (message.type === 'orilla:result' && message.result) {
      pendiente.resolve(message.result);
    } else {
      pendiente.reject(new Error(typeof message.error === 'string'
        ? message.error.slice(0, 2000)
        : 'El motor de Orilla no pudo ejecutar el programa.'));
    }
  }, [clearReadyTimer, configurarEstado, rechazarPreparacion]);

  const cerrarCanal = useCallback(() => {
    const port = runnerPortRef.current;
    if (!port) return;
    port.onmessage = null;
    port.onmessageerror = null;
    port.close();
    runnerPortRef.current = null;
  }, []);

  const handleSandboxFrameLoad = useCallback(() => {
    if (!frameRequestedRef.current) return;
    const frame = sandboxFrameRef.current;
    const origin = runnerOriginRef.current;
    if (!frame?.contentWindow || !origin) {
      rechazarPreparacion(new Error('No se pudo preparar el canal seguro del ejecutor Python.'));
      return;
    }

    cerrarCanal();
    const channel = new MessageChannel();
    const parentPort = channel.port1;
    parentPort.onmessage = manejarMensaje;
    parentPort.onmessageerror = () => {
      if (runnerPortRef.current === parentPort) runnerPortRef.current = null;
      parentPort.close();
      rechazarPreparacion(new Error('Se perdió la comunicación con el ejecutor Python aislado.'));
    };
    parentPort.start();
    runnerPortRef.current = parentPort;
    frameLoadedRef.current = true;

    try {
      // La página runner valida event.source y el origen exacto antes de aceptar el puerto.
      frame.contentWindow.postMessage({ type: 'connect' }, origin, [channel.port2]);
    } catch {
      channel.port2.close();
      cerrarCanal();
      frameLoadedRef.current = false;
      rechazarPreparacion(new Error('No se pudo abrir el canal privado con Python.'));
    }
  }, [cerrarCanal, manejarMensaje, rechazarPreparacion]);

  const handleSandboxFrameError = useCallback(() => {
    if (!frameRequestedRef.current) return;
    frameLoadedRef.current = false;
    cerrarCanal();
    rechazarPreparacion(new Error('No se pudo cargar el entorno aislado de Python.'));
  }, [cerrarCanal, rechazarPreparacion]);

  const preparar = useCallback((): Promise<void> => {
    if (estadoRef.current === 'listo' && runnerPortRef.current) return Promise.resolve();
    if (readyPromiseRef.current) return readyPromiseRef.current;

    const origin = runnerOriginRef.current;
    const frame = sandboxFrameRef.current;
    if (!origin || !frame) {
      return Promise.reject(new Error(!origin
        ? 'El ejecutor Python aislado no está configurado para este entorno.'
        : 'No se encontró el contenedor del ejecutor Python aislado.'));
    }

    configurarEstado('cargando');
    readyPromiseRef.current = new Promise<void>((resolve, reject) => {
      readyResolveRef.current = resolve;
      readyRejectRef.current = reject;
      readyTimerRef.current = setTimeout(() => {
        rechazarPreparacion(new Error('La carga de Python tardó demasiado. Reintenta la carga.'));
      }, ESPERA_CARGA_MS);
    });

    if (!frameRequestedRef.current || !frameLoadedRef.current || !runnerPortRef.current) {
      frameRequestedRef.current = true;
      frameLoadedRef.current = false;
      bootIdRef.current += 1;
      const runnerUrl = new URL('/', origin);
      runnerUrl.searchParams.set('boot', String(bootIdRef.current));
      frame.src = runnerUrl.toString();
    } else {
      enviar({ type: 'connect' });
    }

    return readyPromiseRef.current;
  }, [configurarEstado, enviar, rechazarPreparacion]);

  const ejecutar = useCallback(async (code: string, tramo: PayloadTramo): Promise<ResultadoOrilla> => {
    if (code.length > 20_000) throw new Error('El programa de Orilla supera el límite de 20000 caracteres.');
    await preparar();
    const port = runnerPortRef.current;
    if (!port) throw new Error('No se pudo contactar con el ejecutor Python aislado.');

    const id = ++requestIdRef.current;
    return new Promise<ResultadoOrilla>((resolve, reject) => {
      const timer = setTimeout(() => {
        pendingRef.current.delete(id);
        enviar({ type: 'stop' });
        configurarEstado('error');
        reject(new Error('El programa tardó demasiado y se detuvo.'));
      }, ESPERA_EJECUCION_MS);
      pendingRef.current.set(id, { resolve, reject, timer });
      try {
        port.postMessage({ type: 'orilla:run', id, code, tramo });
      } catch {
        clearTimeout(timer);
        pendingRef.current.delete(id);
        reject(new Error('No se pudo enviar el programa al ejecutor Python.'));
      }
    });
  }, [configurarEstado, enviar, preparar]);

  const reiniciar = useCallback(() => {
    clearReadyTimer();
    enviar({ type: 'stop' });
    readyPromiseRef.current = null;
    readyResolveRef.current = null;
    readyRejectRef.current = null;
    for (const pendiente of pendingRef.current.values()) {
      clearTimeout(pendiente.timer);
      pendiente.reject(new Error('Se reinició el ejecutor Python.'));
    }
    pendingRef.current.clear();
    configurarEstado('inactivo');
  }, [clearReadyTimer, configurarEstado, enviar]);

  useEffect(() => () => {
    clearReadyTimer();
    try { runnerPortRef.current?.postMessage({ type: 'stop' }); } catch { /* iframe cerrado */ }
    cerrarCanal();
    for (const pendiente of pendingRef.current.values()) {
      clearTimeout(pendiente.timer);
      pendiente.reject(new Error('Se cerró Orilla.'));
    }
    pendingRef.current.clear();
  }, [cerrarCanal, clearReadyTimer]);

  return { estado, ejecutar, reiniciar, sandboxFrameRef, handleSandboxFrameLoad, handleSandboxFrameError };
}
