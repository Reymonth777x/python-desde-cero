'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getRunnerWorker,
  postToRunner,
  setRunnerMessageHandler,
  terminateRunnerWorker,
} from '@/lib/runner-worker';

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
} | {
  status: 'error';
  id: number;
  error: string;
};

type ParentMessage = { type: 'run'; code: string; input: string[] } | { type: 'init' } | { type: 'terminate' };

// Tiempo m !ximo de ejecuci 3n (ms). Coincide con el timeout del worker.
const MAX_EXECUTION_TIME_MS = 15000;

export default function PythonRunner() {
  const requestIdRef = useRef(0);
  const pendingRef = useRef<ParentMessage | null>(null);
  const parentOriginRef = useRef<string | null>(null);
  const requestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRunIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { worker: runnerWorker, error: initError } = getRunnerWorker();

  const postToParent = useCallback((data: RunnerResponse) => {
    const origin = parentOriginRef.current;
    if (!origin) return;
    window.parent.postMessage(data, origin);
  }, []);

  const clearRequestTimeout = useCallback(() => {
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
  }, []);

  const runnerMessageHandler = useCallback(
    (data: RunnerResponse) => {
      clearRequestTimeout();
      if (data.status === 'ready') {
        setReady(true);
        setError(null);
        const pending = pendingRef.current;
        if (pending) {
          pendingRef.current = null;
          postToRunner({ type: 'init' });
        }
        return;
      }
      if (data.status === 'init-error') {
        setError(data.error ?? 'No se pudo cargar Pyodide');
        terminateRunnerWorker();
        return;
      }
      if (data.status === 'error') {
        postToParent(data);
        return;
      }
      if (data.status === 'result') {
        postToParent(data);
      }
    },
    [postToParent, clearRequestTimeout],
  );

  // Configurar el handler del worker (API imperativa, fuera de React).
  useEffect(() => {
    setRunnerMessageHandler(runnerMessageHandler);
    return () => {
      clearRequestTimeout();
      terminateRunnerWorker();
    };
  }, [runnerMessageHandler, postToParent, clearRequestTimeout]);

  // Escuchar mensajes del padre (la p !gina que emite el iframe)
  useEffect(() => {
    const handleMessage = (event: MessageEvent<ParentMessage>) => {
      // Solo acepta mensajes del mismo origen y del window.parent (iframe same-origin).
      // Un postMessage de cualquier otro origen/ventana es ignorado.
      if (event.source !== window.parent) return;
      if (event.origin !== window.location.origin) return;
      if (parentOriginRef.current === null) {
        parentOriginRef.current = event.origin;
      }
      if (!event.data || !event.data.type) return;

      if (event.data.type === 'init') {
        clearRequestTimeout();
        // The parent handshake establishes a safe reply origin. Do not send a
        // fake "init" payload to python-worker.js: it expects executable code.
        if (ready) postToParent({ status: 'ready' });
      } else if (event.data.type === 'run') {
        clearRequestTimeout();
        // Timeout real desde el hilo principal: un setTimeout dentro del worker
        // no interrumpe la ejecuci 3n s -ncrona de Pyodide; terminate() s - lo hace.
        lastRunIdRef.current = requestIdRef.current + 1;
        requestTimeoutRef.current = setTimeout(() => {
          terminateRunnerWorker();
          setReady(false);
          postToParent({
            status: 'error',
            id: lastRunIdRef.current ?? 0,
            error: 'Tiempo de ejecuci 3n agotado',
          });
        }, MAX_EXECUTION_TIME_MS + 1000);
        if (!ready) {
          pendingRef.current = event.data;
        } else {
          postToRunner({ type: 'run', id: lastRunIdRef.current, code: event.data.code, input: event.data.input });
        }
      } else if (event.data.type === 'terminate') {
        clearRequestTimeout();
        terminateRunnerWorker();
        setReady(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [ready, postToParent, clearRequestTimeout]);

  // Notificar al padre que el runner est ! listo
  useEffect(() => {
    if (ready) {
      postToParent({ status: 'ready' });
    }
  }, [ready, postToParent]);

  const displayError = error ?? initError;
  if (displayError) {
    return <div className="p-4 text-sm text-[var(--theme-error)]">{displayError}</div>;
  }

  return null; // Runner se comunica exclusivamente v -a postMessage
}
