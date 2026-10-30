'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getRunnerWorker,
  postToRunner,
  setRunnerMessageHandler,
  terminateRunnerWorker,
} from '@/lib/runner-worker';

type RunnerResponse =
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
  const lastRunIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { error: initError } = getRunnerWorker();

  const postToParent = useCallback((data: RunnerResponse) => {
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

  const startRequestTimeout = useCallback((id: number) => {
    clearRequestTimeout();
    requestTimeoutRef.current = setTimeout(() => {
      terminateRunnerWorker();
      pendingRef.current = null;
      setReady(false);
      postToParent({ status: 'error', id, error: 'Tiempo de ejecución agotado' });
    }, MAX_EXECUTION_TIME_MS + 1000);
  }, [clearRequestTimeout, postToParent]);

  const runnerMessageHandler = useCallback((data: RunnerResponse) => {
    if (data.status === 'ready') {
      clearRequestTimeout();
      setReady(true);
      setError(null);

      const pending = pendingRef.current;
      if (pending) {
        pendingRef.current = null;
        const id = lastRunIdRef.current ?? ++requestIdRef.current;
        startRequestTimeout(id);
        postToRunner({ type: 'run', id, code: pending.code, input: pending.input });
      }
      return;
    }

    clearRequestTimeout();
    if (data.status === 'init-error') {
      setError(data.error || 'No se pudo cargar Python.');
      postToParent(data);
      terminateRunnerWorker();
      return;
    }
    if (data.status === 'error' || data.status === 'result') {
      postToParent(data);
    }
  }, [clearRequestTimeout, postToParent, startRequestTimeout]);

  useEffect(() => {
    setRunnerMessageHandler(runnerMessageHandler);
    return () => {
      clearRequestTimeout();
      terminateRunnerWorker();
    };
  }, [runnerMessageHandler, clearRequestTimeout]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<ParentMessage>) => {
      if (event.source !== window.parent) return;
      if (event.origin !== window.location.origin) return;
      if (!event.data || typeof event.data.type !== 'string') return;

      parentOriginRef.current = event.origin;

      if (event.data.type === 'init') {
        clearRequestTimeout();
        if (ready) postToParent({ status: 'ready' });
        else postToRunner({ type: 'init' });
        return;
      }

      if (event.data.type === 'run') {
        const id = ++requestIdRef.current;
        lastRunIdRef.current = id;
        startRequestTimeout(id);

        if (!ready) {
          pendingRef.current = event.data;
          postToRunner({ type: 'init' });
        } else {
          postToRunner({ type: 'run', id, code: event.data.code, input: event.data.input });
        }
        return;
      }

      if (event.data.type === 'terminate') {
        clearRequestTimeout();
        pendingRef.current = null;
        terminateRunnerWorker();
        setReady(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [ready, postToParent, clearRequestTimeout, startRequestTimeout]);

  useEffect(() => {
    if (ready && parentOriginRef.current) postToParent({ status: 'ready' });
  }, [ready, postToParent]);

  const displayError = error ?? initError;
  if (displayError) return <div className="p-4 text-sm text-[var(--theme-error)]">{displayError}</div>;
  return null;
}
