'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  resolvePythonRunnerOrigin,
  sanitizeTurtleCommands,
  type TurtleCommand,
} from './python-runner-protocol';

type WorkerResponse = {
  id?: number;
  status: 'ready' | 'init-error' | 'runtime-error' | 'stopped' | 'success' | 'error';
  output?: string;
  error?: string;
  turtle_commands?: unknown;
};

type ExecutionRequest = { code: string; input: string[] };

type UsePythonWorkerOptions = {
  onStatusChange?: (status: 'idle' | 'loading' | 'ready' | 'error') => void;
  onOutput?: (output: string, error?: string, turtleCommands?: TurtleCommand[]) => void;
};

const MAX_EXECUTION_TIME_MS = 15000;
const INITIALIZATION_TIMEOUT_MS = 60000;
const MAX_CODE_LENGTH = 50000;
const MAX_INPUT_LINES = 20;
const MAX_INPUT_LINE_LENGTH = 1000;

export function usePythonWorker({
  onStatusChange,
  onOutput,
}: UsePythonWorkerOptions = {}) {
  const sandboxFrameRef = useRef<HTMLIFrameElement | null>(null);
  const runnerOriginRef = useRef<string | null>(null);
  const frameRequestedRef = useRef(false);
  const frameLoadedRef = useRef(false);
  const frameBootIdRef = useRef(0);
  const requestIdRef = useRef(0);
  const activeRequestIdRef = useRef<number | null>(null);
  const pendingExecutionRef = useRef<ExecutionRequest | null>(null);
  const isRunningRef = useRef(false);
  const initializationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const executeRef = useRef<(request: ExecutionRequest) => void>(() => {});
  const callbacksRef = useRef({ onStatusChange, onOutput });

  const [workerState, setWorkerState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [turtleCommands, setTurtleCommands] = useState<TurtleCommand[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const configuredRunnerOrigin = resolvePythonRunnerOrigin(
    process.env.NEXT_PUBLIC_PYTHON_RUNNER_ORIGIN,
    typeof window === 'undefined' ? '' : window.location.origin,
  );
  useEffect(() => {
    callbacksRef.current = { onStatusChange, onOutput };
  }, [onStatusChange, onOutput]);

  useEffect(() => {
    runnerOriginRef.current = configuredRunnerOrigin;
  }, [configuredRunnerOrigin]);

  const clearInitializationTimeout = useCallback(() => {
    if (initializationTimeoutRef.current !== null) {
      clearTimeout(initializationTimeoutRef.current);
      initializationTimeoutRef.current = null;
    }
  }, []);

  const clearExecutionTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const sendToRunner = useCallback((message: Record<string, unknown>) => {
    const origin = runnerOriginRef.current;
    const frame = sandboxFrameRef.current;
    if (!origin || !frame?.contentWindow || !frameRequestedRef.current) return false;

    frame.contentWindow.postMessage(message, origin);
    return true;
  }, []);

  const startInitializationWatchdog = useCallback(() => {
    clearInitializationTimeout();
    initializationTimeoutRef.current = setTimeout(() => {
      initializationTimeoutRef.current = null;
      pendingExecutionRef.current = null;
      activeRequestIdRef.current = null;
      isRunningRef.current = false;
      setIsRunning(false);
      setWorkerState('error');
      setError('La carga del entorno Python aislado tardó demasiado. Reintenta la carga.');
      callbacksRef.current.onStatusChange?.('error');
      sendToRunner({ type: 'stop' });
    }, INITIALIZATION_TIMEOUT_MS);
  }, [clearInitializationTimeout, sendToRunner]);

  const executeRequest = useCallback((request: ExecutionRequest) => {
    const requestId = ++requestIdRef.current;
    activeRequestIdRef.current = requestId;
    clearExecutionTimeout();

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      if (activeRequestIdRef.current !== requestId) return;

      activeRequestIdRef.current = null;
      pendingExecutionRef.current = null;
      isRunningRef.current = false;
      setIsRunning(false);
      setWorkerState('error');
      setError('Tiempo de ejecución agotado. El proceso se ha detenido.');
      callbacksRef.current.onStatusChange?.('error');
      sendToRunner({ type: 'stop' });
    }, MAX_EXECUTION_TIME_MS);

    const sent = sendToRunner({
      type: 'execute',
      id: requestId,
      code: request.code,
      input: request.input,
    });

    if (!sent) {
      clearExecutionTimeout();
      activeRequestIdRef.current = null;
      isRunningRef.current = false;
      setIsRunning(false);
      setWorkerState('error');
      setError('No se pudo contactar con el ejecutor Python aislado.');
      callbacksRef.current.onStatusChange?.('error');
    }
  }, [clearExecutionTimeout, sendToRunner]);
  executeRef.current = executeRequest;

  const handleWindowMessage = useCallback((event: MessageEvent<WorkerResponse>) => {
    const frame = sandboxFrameRef.current;
    const origin = runnerOriginRef.current;
    if (!frame?.contentWindow || !origin) return;
    if (event.source !== frame.contentWindow || event.origin !== origin) return;

    const message = event.data;
    if (!message || typeof message !== 'object') return;

    if (message.status === 'ready') {
      clearInitializationTimeout();
      setWorkerState('ready');
      setError(null);
      callbacksRef.current.onStatusChange?.('ready');
      const pending = pendingExecutionRef.current;
      if (pending) {
        pendingExecutionRef.current = null;
        executeRef.current(pending);
      }
      return;
    }

    if (message.status === 'init-error' || message.status === 'runtime-error') {
      clearInitializationTimeout();
      clearExecutionTimeout();
      activeRequestIdRef.current = null;
      pendingExecutionRef.current = null;
      isRunningRef.current = false;
      setIsRunning(false);
      setWorkerState('error');
      setError(
        typeof message.error === 'string'
          ? message.error.slice(0, 2000)
          : 'El ejecutor Python aislado encontró un error.',
      );
      callbacksRef.current.onStatusChange?.('error');
      return;
    }

    if (message.status === 'stopped') {
      return;
    }

    if (
      (message.status !== 'success' && message.status !== 'error') ||
      !Number.isSafeInteger(message.id) ||
      message.id !== activeRequestIdRef.current
    ) {
      return;
    }

    clearExecutionTimeout();
    activeRequestIdRef.current = null;
    isRunningRef.current = false;
    setIsRunning(false);

    const nextOutput = typeof message.output === 'string'
      ? message.output.slice(0, 20000)
      : '';
    const nextError = typeof message.error === 'string'
      ? message.error.slice(0, 2000)
      : null;
    const nextCommands = sanitizeTurtleCommands(message.turtle_commands);

    setOutput(nextOutput);
    setError(nextError);
    setTurtleCommands(nextCommands);
    callbacksRef.current.onOutput?.(nextOutput, nextError ?? undefined, nextCommands);
  }, [clearExecutionTimeout, clearInitializationTimeout]);

  useEffect(() => {
    window.addEventListener('message', handleWindowMessage);
    return () => {
      window.removeEventListener('message', handleWindowMessage);
      clearInitializationTimeout();
      clearExecutionTimeout();
      const frame = sandboxFrameRef.current;
      const origin = runnerOriginRef.current;
      if (frame?.contentWindow && origin) {
        frame.contentWindow.postMessage({ type: 'stop' }, origin);
      }
    };
  }, [clearExecutionTimeout, clearInitializationTimeout, handleWindowMessage]);

  const handleSandboxFrameLoad = useCallback(() => {
    if (!frameRequestedRef.current) return;
    frameLoadedRef.current = true;
    startInitializationWatchdog();
    if (!sendToRunner({ type: 'connect' })) {
      setWorkerState('error');
      setError('No se pudo conectar con el ejecutor Python aislado.');
      callbacksRef.current.onStatusChange?.('error');
    }
  }, [sendToRunner, startInitializationWatchdog]);

  const handleSandboxFrameError = useCallback(() => {
    if (!frameRequestedRef.current) return;
    clearInitializationTimeout();
    frameLoadedRef.current = false;
    pendingExecutionRef.current = null;
    activeRequestIdRef.current = null;
    isRunningRef.current = false;
    setIsRunning(false);
    setWorkerState('error');
    setError('No se pudo cargar el entorno aislado de Python. Reintenta la carga.');
    callbacksRef.current.onStatusChange?.('error');
  }, [clearInitializationTimeout]);

  const createWorker = useCallback(() => {
    const origin = runnerOriginRef.current;
    const frame = sandboxFrameRef.current;

    if (!origin) {
      setWorkerState('error');
      setError('El ejecutor Python aislado no está configurado para este entorno.');
      callbacksRef.current.onStatusChange?.('error');
      return;
    }

    if (!frame) {
      setWorkerState('error');
      setError('No se encontró el contenedor del ejecutor Python aislado.');
      callbacksRef.current.onStatusChange?.('error');
      return;
    }

    setError(null);
    setWorkerState('loading');
    callbacksRef.current.onStatusChange?.('loading');

    const mustReload = !frameRequestedRef.current || !frameLoadedRef.current || workerState === 'error';
    if (mustReload) {
      clearInitializationTimeout();
      frameRequestedRef.current = true;
      frameLoadedRef.current = false;
      frameBootIdRef.current += 1;
      const runnerUrl = new URL('/', origin);
      runnerUrl.searchParams.set('boot', String(frameBootIdRef.current));
      frame.src = runnerUrl.toString();
      startInitializationWatchdog();
      return;
    }

    startInitializationWatchdog();
    sendToRunner({ type: 'connect' });
  }, [clearInitializationTimeout, sendToRunner, startInitializationWatchdog, workerState]);

  const runCode = useCallback((code: string, input: string[] = []) => {
    if (isRunningRef.current) return;

    isRunningRef.current = true;
    setIsRunning(true);
    setError(null);
    setTurtleCommands([]);

    const normalizedInput = input
      .slice(0, MAX_INPUT_LINES)
      .map((line) => String(line).slice(0, MAX_INPUT_LINE_LENGTH));

    if (code.length > MAX_CODE_LENGTH) {
      isRunningRef.current = false;
      setIsRunning(false);
      setError('El programa supera el límite de ' + MAX_CODE_LENGTH + ' caracteres.');
      return;
    }

    if (!runnerOriginRef.current) {
      isRunningRef.current = false;
      setIsRunning(false);
      setWorkerState('error');
      setError('El ejecutor Python aislado no está configurado para este entorno.');
      callbacksRef.current.onStatusChange?.('error');
      return;
    }

    pendingExecutionRef.current = { code, input: normalizedInput };
    setOutput('Preparando Python en el entorno aislado…');

    if (workerState === 'ready') {
      const pending = pendingExecutionRef.current;
      pendingExecutionRef.current = null;
      if (pending) executeRef.current(pending);
      return;
    }

    if (workerState === 'error' || !frameRequestedRef.current || !frameLoadedRef.current) {
      createWorker();
      return;
    }

    setWorkerState('loading');
    callbacksRef.current.onStatusChange?.('loading');
    startInitializationWatchdog();
    sendToRunner({ type: 'connect' });
  }, [createWorker, sendToRunner, startInitializationWatchdog, workerState]);

  const stopWorker = useCallback(() => {
    clearInitializationTimeout();
    clearExecutionTimeout();
    pendingExecutionRef.current = null;
    activeRequestIdRef.current = null;
    isRunningRef.current = false;
    setIsRunning(false);

    if (frameLoadedRef.current) {
      sendToRunner({ type: 'stop' });
    } else {
      frameRequestedRef.current = false;
    }

    setWorkerState('idle');
    callbacksRef.current.onStatusChange?.('idle');
  }, [clearExecutionTimeout, clearInitializationTimeout, sendToRunner]);

  return {
    workerState,
    output,
    error,
    turtleCommands,
    isRunning,
    createWorker,
    runCode,
    stopWorker,
    sandboxFrameRef,
    handleSandboxFrameLoad,
    handleSandboxFrameError,
  };
}
