'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PayloadTramo, ResultadoOrilla } from './types';

export type EstadoWorkerOrilla = 'inactivo' | 'cargando' | 'listo' | 'error';
type Pendiente = { resolve: (resultado: ResultadoOrilla) => void; reject: (error: Error) => void; timer: number };
const ESPERA_CARGA_MS = 90_000;
const ESPERA_EJECUCION_MS = 20_000;

/** Orilla comparte el worker aislado de la academia y usa su MessagePort privado. */
export function useOrillaWorker() {
  const workerRef = useRef<Worker | null>(null);
  const portRef = useRef<MessagePort | null>(null);
  const listoRef = useRef<Promise<void> | null>(null);
  const pendientes = useRef(new Map<number, Pendiente>());
  const contador = useRef(0);
  const [estado, setEstado] = useState<EstadoWorkerOrilla>('inactivo');

  const detener = useCallback(() => {
    portRef.current?.close();
    portRef.current = null;
    workerRef.current?.terminate();
    workerRef.current = null;
    listoRef.current = null;
    for (const p of pendientes.current.values()) { window.clearTimeout(p.timer); p.reject(new Error('Se detuvo la ejecución.')); }
    pendientes.current.clear();
  }, []);

  useEffect(() => detener, [detener]);

  const preparar = useCallback((): Promise<void> => {
    if (workerRef.current && listoRef.current) return listoRef.current;
    const worker = new Worker('/python-worker.js');
    const canal = new MessageChannel();
    workerRef.current = worker;
    portRef.current = canal.port1;
    setEstado('cargando');
    listoRef.current = new Promise<void>((resolve, reject) => {
      let asentado = false;
      const limite = window.setTimeout(() => { if (!asentado) reject(new Error('Python tardó demasiado en cargar.')); }, ESPERA_CARGA_MS);
      worker.onerror = () => { window.clearTimeout(limite); reject(new Error('No se pudo iniciar el worker de Python.')); };
      canal.port1.onmessage = (evento: MessageEvent) => {
        const datos = evento.data as Record<string, unknown> | null;
        if (!datos) return;
        if (datos.status === 'ready') { asentado = true; window.clearTimeout(limite); setEstado('listo'); resolve(); return; }
        if (datos.status === 'init-error') { asentado = true; window.clearTimeout(limite); reject(new Error(typeof datos.error === 'string' ? datos.error : 'No se pudo cargar Python.')); return; }
        if (datos.type !== 'orilla:result' && datos.type !== 'orilla:error') return;
        const pendiente = pendientes.current.get(datos.id as number);
        if (!pendiente) return;
        window.clearTimeout(pendiente.timer); pendientes.current.delete(datos.id as number);
        if (datos.type === 'orilla:result') pendiente.resolve(datos.result as ResultadoOrilla);
        else pendiente.reject(new Error(typeof datos.error === 'string' ? datos.error : 'Falló el motor de Orilla.'));
      };
      canal.port1.onmessageerror = () => reject(new Error('Se perdió el canal privado con Python.'));
      canal.port1.start();
      worker.postMessage({ type: 'connect' }, [canal.port2]);
    });
    return listoRef.current;
  }, []);

  const ejecutar = useCallback(async (code: string, tramo: PayloadTramo): Promise<ResultadoOrilla> => {
    try { await preparar(); }
    catch (error) { detener(); setEstado('error'); throw error instanceof Error ? error : new Error(String(error)); }
    const port = portRef.current;
    if (!port) throw new Error('Python no está disponible.');
    const id = ++contador.current;
    return new Promise<ResultadoOrilla>((resolve, reject) => {
      const timer = window.setTimeout(() => { detener(); setEstado('inactivo'); reject(new Error('El programa tardó demasiado y se detuvo.')); }, ESPERA_EJECUCION_MS);
      pendientes.current.set(id, { resolve, reject, timer });
      port.postMessage({ type: 'orilla:run', id, code, tramo });
    });
  }, [detener, preparar]);

  const reiniciar = useCallback(() => { detener(); setEstado('inactivo'); }, [detener]);
  return { estado, ejecutar, reiniciar };
}
