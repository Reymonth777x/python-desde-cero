'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type RunnerMessage = {
  type: 'run';
  code: string;
  input: string[];
} | {
  type: 'init';
} | {
  type: 'terminate';
};

type RunnerResponse = {
  status: 'ready';
} | {
  status: 'init-error';
  error: string;
} | {
  status: 'result';
  id: number;
  resultStatus: 'success' | 'error';
  output?: string;
  error?: string;
  turtle_commands?: unknown;
};

export default function PythonRunner() {
  const requestIdRef = useRef(0);
  const pendingRef = useRef<RunnerMessage | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postToWorker = useCallback((msg: RunnerMessage) => {
    const w = workerRef.current;
    if (!w || !ready) return;
    if (msg.type === 'run') {
      requestIdRef.current += 1;
      w.postMessage({ id: requestIdRef.current, code: msg.code, input: msg.input });
    } else {
      w.postMessage(msg);
    }
  }, [ready]);

  useEffect(() => {
    let worker: Worker | null = null;
    let initError: string | null = null;
    try {
      worker = new Worker('/python-worker.js');
    } catch (err) {
      initError = err instanceof Error ? err.message : 'No se pudo iniciar el ejecutor';
    }
    // Aplazar el setState al microtask para no llamarlo directamente dentro del cuerpo del effect
    // (evita renders en cascada en modo concurrente; respeta react-hooks/set-state-in-effect).
    if (initError) {
      queueMicrotask(() => setError(initError));
      return;
    }
    workerRef.current = worker!;

    worker!.onmessage = (event: MessageEvent<RunnerResponse>) => {
      const data = event.data;
      if (data.status === 'ready') {
        setReady(true);
        setError(null);
        const pending = pendingRef.current;
        if (pending) {
          pendingRef.current = null;
          postToWorker(pending);
        }
        return;
      }
      if (data.status === 'init-error') {
        setError(data.error ?? 'No se pudo cargar Pyodide');
        worker!.terminate();
        workerRef.current = null;
        return;
      }
      if (data.status === 'result') {
        window.parent.postMessage(data, '*');
      }
    };

    worker!.onerror = () => {
      setError('Error inesperado del ejecutor');
      setReady(false);
    };

    return () => {
      worker!.terminate();
    };
  }, [postToWorker]);

  // Escuchar mensajes del padre (la página que emite el iframe)
  useEffect(() => {
    const handleMessage = (event: MessageEvent<RunnerMessage>) => {
      // Validar origen del mensaje (en producción restringir a dominios esperados)
      if (event.data && event.data.type) {
        if (event.data.type === 'init') {
          postToWorker({ type: 'init' });
        } else if (event.data.type === 'run') {
          if (!ready) {
            pendingRef.current = event.data;
          } else {
            postToWorker(event.data);
          }
        } else if (event.data.type === 'terminate') {
          workerRef.current?.terminate();
          workerRef.current = null;
          setReady(false);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [ready, postToWorker]);

  // Notificar al padre que el runner está listo
  useEffect(() => {
    if (ready) {
      window.parent.postMessage({ type: 'ready' }, '*');
    }
  }, [ready]);

  if (error) {
    return <div className="p-4 text-sm text-red-600">{error}</div>;
  }

  return null; // Runner se comunica exclusivamente vía postMessage
}
