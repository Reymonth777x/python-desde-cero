'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type PythonTestCase = { input: string[]; expected: string };
export type PythonTestResult = { index: number; expected: string; actual: string; passed: boolean; error?: string };

type WorkerResponse = {
  id?: number;
  status: 'ready' | 'init-error' | 'success' | 'error';
  output?: string;
  error?: string;
  turtle_commands?: unknown;
  test_results?: PythonTestResult[];
};

type WorkerRequest = { code: string; input: string[]; tests?: PythonTestCase[] };
type TurtleCommand = {
  type: 'line' | 'fill' | 'dot' | 'write' | 'bgcolor';
  x?: number; y?: number; x1?: number; y1?: number; x2?: number; y2?: number;
  color?: string; size?: number; points?: Array<[number, number]>; text?: string;
};
type UsePythonWorkerOptions = {
  onStatusChange?: (status: 'idle' | 'loading' | 'ready' | 'error') => void;
  onOutput?: (output: string, error?: string, turtleCommands?: TurtleCommand[]) => void;
};

export function usePythonWorker({ onStatusChange, onOutput }: UsePythonWorkerOptions = {}) {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const pendingExecutionRef = useRef<WorkerRequest | null>(null);
  const executeRef = useRef<(worker: Worker, request: WorkerRequest) => void>(() => {});
  const initializationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const executionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [workerState, setWorkerState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [turtleCommands, setTurtleCommands] = useState<TurtleCommand[]>([]);
  const [testResults, setTestResults] = useState<PythonTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const clearTimers = useCallback(() => {
    if (initializationTimeoutRef.current !== null) clearTimeout(initializationTimeoutRef.current);
    if (executionTimeoutRef.current !== null) clearTimeout(executionTimeoutRef.current);
    initializationTimeoutRef.current = null;
    executionTimeoutRef.current = null;
  }, []);

  const createWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    setWorkerState('loading');
    setError(null);

    let worker: Worker;
    try {
      worker = new Worker('/python-worker.js');
    } catch (cause) {
      setWorkerState('error');
      setError(cause instanceof Error ? cause.message : 'No se pudo iniciar Python.');
      onStatusChange?.('error');
      return null;
    }

    initializationTimeoutRef.current = setTimeout(() => {
      if (workerRef.current !== worker) return;
      worker.terminate();
      workerRef.current = null;
      setWorkerState('error');
      setError('La carga de Python tardó demasiado. Comprueba tu conexión y vuelve a intentarlo.');
      pendingExecutionRef.current = null;
      setIsRunning(false);
      onStatusChange?.('error');
    }, 90000);

    const startExecutionWatchdog = () => {
      if (executionTimeoutRef.current !== null) clearTimeout(executionTimeoutRef.current);
      // Only the main thread can reliably stop a synchronous infinite loop:
      // terminating the Worker interrupts Pyodide itself.
      executionTimeoutRef.current = setTimeout(() => {
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
        executionTimeoutRef.current = null;
        setWorkerState('error');
        setError('Tiempo de ejecución agotado: el proceso se detuvo para proteger el navegador.');
        pendingExecutionRef.current = null;
        setIsRunning(false);
        onStatusChange?.('error');
      }, 18000);
    };

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data;
      if (data.status === 'ready') {
        if (initializationTimeoutRef.current !== null) clearTimeout(initializationTimeoutRef.current);
        initializationTimeoutRef.current = null;
        setWorkerState('ready');
        onStatusChange?.('ready');
        const pending = pendingExecutionRef.current;
        if (pending) {
          pendingExecutionRef.current = null;
          executeRef.current(worker, pending);
        }
        return;
      }

      if (executionTimeoutRef.current !== null) clearTimeout(executionTimeoutRef.current);
      executionTimeoutRef.current = null;

      if (data.status === 'init-error') {
        if (initializationTimeoutRef.current !== null) clearTimeout(initializationTimeoutRef.current);
        initializationTimeoutRef.current = null;
        setWorkerState('error');
        setError(data.error ?? 'No se pudo cargar Python.');
        onStatusChange?.('error');
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
        pendingExecutionRef.current = null;
        setIsRunning(false);
        return;
      }

      // A Python exception ends the current run, not the Worker itself.
      // Keep the editor ready so the student can fix the code and run again.
      setWorkerState('ready');
      setIsRunning(false);
      setOutput(data.output ?? (data.status === 'success' ? 'Ejecución completada sin salida.' : ''));
      setError(data.status === 'error' ? (data.error ?? 'Error desconocido.') : null);
      setTestResults(data.test_results ?? []);
      const turtle = Array.isArray(data.turtle_commands) ? data.turtle_commands as TurtleCommand[] : [];
      setTurtleCommands(turtle);
      onOutput?.(data.output ?? '', data.error, turtle);
    };

    worker.onerror = () => {
      clearTimers();
      setWorkerState('error');
      setError('Error inesperado del ejecutor de Python. Puedes volver a cargarlo.');
      onStatusChange?.('error');
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      pendingExecutionRef.current = null;
      setIsRunning(false);
    };

    workerRef.current = worker;
    executeRef.current = (target, request) => {
      const requestId = ++requestIdRef.current;
      startExecutionWatchdog();
      target.postMessage({
        id: requestId,
        code: request.code,
        input: request.input,
        tests: request.tests,
      });
    };
    return worker;
  }, [clearTimers, onOutput, onStatusChange]);

  const runRequest = useCallback((request: WorkerRequest) => {
    if (isRunning) return;
    setTestResults([]);
    setTurtleCommands([]);
    setError(null);
    setIsRunning(true);
    setWorkerState('loading');

    const worker = workerRef.current;
    if (worker && workerState === 'ready') {
      executeRef.current(worker, request);
      return;
    }
    pendingExecutionRef.current = request;
    setOutput('Preparando Python en este dispositivo…');
    if (!worker) createWorker();
  }, [createWorker, isRunning, workerState]);

  const runCode = useCallback((code: string, input: string[] = []) => {
    runRequest({ code, input });
  }, [runRequest]);

  const runTests = useCallback((code: string, tests: PythonTestCase[]) => {
    runRequest({ code, input: [], tests });
  }, [runRequest]);

  const stopWorker = useCallback(() => {
    clearTimers();
    workerRef.current?.terminate();
    workerRef.current = null;
    pendingExecutionRef.current = null;
    setWorkerState('idle');
    setIsRunning(false);
    setError(null);
  }, [clearTimers]);

  const clearTurtle = useCallback(() => setTurtleCommands([]), []);

  useEffect(() => () => stopWorker(), [stopWorker]);

  return {
    workerState, output, error, turtleCommands, testResults, isRunning,
    createWorker, runCode, runTests, stopWorker, clearTurtle,
  };
}
