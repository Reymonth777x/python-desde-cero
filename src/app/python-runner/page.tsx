'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getRunnerWorker,
  postToRunner,
  setRunnerMessageHandler,
  terminateRunnerWorker,
} from '@/lib/runner-worker';

type WorkerResponse =
  | { status: 'ready' }
  | { status: 'init-error'; error: string }
  | {
      status: 'success' | 'error';
      id?: number;
      output?: string;
      error?: string;
      turtle_commands?: unknown;
    };

type ParentResponse =
  | { status: 'ready' }
  | { status: 'init-error'; error: string }
  | {
      status: 'result';
      id: number;
      resultStatus: 'success' | 'error';
      output?: string;
      error?: string;
      turtle_commands?: unknown;
    }
  | { status: 'error'; id: number; error: string };

type ParentMessage =
  | { type: 'run'; code: string; input: string[] }
  | { type: 'init' }
  | { type: 'terminate' };

const MAX_EXECUTION_TIME_MS = 15000;

export default function PythonRunner() {
  const requestIdRef = useRef(0);
  const pendingRef = useRef<Extract<ParentMessage, { type: 'run' }> | null>(null);
  const parentOriginRef = useRef<string | null>(null);
  const requestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { error: initError } = getRunnerWorker();

  const postToParent = useCallback((data: ParentResponse) => {
    const origin = parentOriginRef.current;
    if (!origin) return;
    window.parent.postMessage(data, origin);
  }, []);

  const clearRequestTimeout = useCallback(() => {
    if (requestTimeoutRef.current !== null) {
      clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
  }, []);

  const dispatchRun = useCallback((request: { code: string; input: string[] }) => {
    clearRequestTimeout();
    const id = ++requestIdRef.current;

    requestTimeoutRef.current = setTimeout(() => {
      terminateRunnerWorker();
      setReady(false);
      pendingRef.current = null;
      requestTimeoutRef.current = null;
      postToParent({
        status: 'error',
        id,
        error: 'Tiempo de ejecución agotado. El proceso se ha detenido.',
      });
    }, MAX_EXECUTION_TIME_MS + 1000);

    postToRunner({ type: 'run', id, code: request.code, input: request.input });
  }, [clearRequestTimeout, postToParent]);

  const runnerMessageHandler = useCallback((data: WorkerResponse) => {
    clearRequestTimeout();

    if (data.status === 'ready') {
      setReady(true);
      setError(null);
      const pending = pendingRef.current;
      if (pending) {
        pendingRef.current = null;
        dispatchRun(pending);
      }
      return;
    }

    if (data.status === 'init-error') {
      const message = data.error || 'No se pudo cargar Pyodide.';
      setError(message);
      setReady(false);
      pendingRef.current = null;
      terminateRunnerWorker();
      postToParent({ status: 'init-error', error: message });
      return;
    }

    const id = data.id ?? requestIdRef.current;
    postToParent({
      status: 'result',
      id,
      resultStatus: data.status,
      output: data.output,
      error: data.error,
      turtle_commands: data.turtle_commands,
    });
  }, [clearRequestTimeout, dispatchRun, postToParent]);

  useEffect(() => {
    setRunnerMessageHandler(runnerMessageHandler);
    return () => {
      clearRequestTimeout();
      terminateRunnerWorker();
    };
  }, [runnerMessageHandler, clearRequestTimeout]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<ParentMessage>) => {
      // Accept only the parent window and this document's origin.
      if (event.source !== window.parent) return;
      if (event.origin !== window.location.origin) return;

      if (parentOriginRef.current === null) {
        parentOriginRef.current = event.origin;
      }
      if (!event.data || !event.data.type) return;

      if (event.data.type === 'init') {
        clearRequestTimeout();
        // The init message only establishes the trusted reply origin. It is not
        // executable Python and must not be forwarded to python-worker.js.
        if (ready) postToParent({ status: 'ready' });
        return;
      }

      if (event.data.type === 'run') {
        clearRequestTimeout();
        if (!ready) {
          pendingRef.current = event.data;
          return;
        }
        dispatchRun(event.data);
        return;
      }

      clearRequestTimeout();
      pendingRef.current = null;
      terminateRunnerWorker();
      setReady(false);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [ready, dispatchRun, postToParent, clearRequestTimeout]);

  useEffect(() => {
    if (ready) postToParent({ status: 'ready' });
  }, [ready, postToParent]);

  if (error || initError) {
    return <div className="p-4 text-sm text-[var(--theme-error)]">{error ?? initError}</div>;
  }

  return null;
}
