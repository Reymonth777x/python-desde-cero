'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type WorkerResponse = {
  id?: number;
  status: 'ready' | 'init-error' | 'success' | 'error';
  output?: string;
  error?: string;
  turtle_commands?: unknown;
};

type TurtleCommand = {
  type: 'line' | 'fill' | 'dot' | 'write' | 'bgcolor' | 'cursor';
  heading?: number;
  shape?: string;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  color?: string;
  size?: number;
  points?: Array<[number, number]>;
  text?: string;
};

type UsePythonWorkerOptions = {
  onStatusChange?: (status: 'idle' | 'loading' | 'ready' | 'error') => void;
  onOutput?: (output: string, error?: string, turtleCommands?: TurtleCommand[]) => void;
};

export function usePythonWorker({
  onStatusChange,
  onOutput,
}: UsePythonWorkerOptions = {}) {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const pendingExecutionRef = useRef<{ code: string; input: string[] } | null>(null);
  const executeRef = useRef<(
    worker: Worker,
    request: { code: string; input: string[] }
  ) => void>(() => {});
  const initializationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [workerState, setWorkerState] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [turtleCommands, setTurtleCommands] = useState<TurtleCommand[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const MAX_EXECUTION_TIME_MS = 15000;

  const createWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    setWorkerState('loading');
    setError(null);

    let worker: Worker;
    try {
      worker = new Worker('/python-worker.js');
    } catch (err) {
      setWorkerState('error');
      setError(
        err instanceof Error ? err.message : 'No se pudo iniciar el ejecutor de Python.'
      );
      pendingExecutionRef.current = null;
      return null;
    }

    const startWatchdog = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        // Watchdog del hilo principal: setTimeout dentro del worker NO corta
        // código síncrono de Pyodide; worker.terminate() sí lo hace.
        worker.terminate();
        workerRef.current = null;
        setWorkerState('error');
        setError(
          'Tiempo de ejecución agotado. El proceso se ha detenido.'
        );
        onStatusChange?.('error');
        setIsRunning(false);
        pendingExecutionRef.current = null;
      }, MAX_EXECUTION_TIME_MS);
    };

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data;
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (data.status === 'ready') {
        if (initializationTimeoutRef.current !== null) {
          clearTimeout(initializationTimeoutRef.current);
          initializationTimeoutRef.current = null;
        }
        setWorkerState('ready');
        onStatusChange?.('ready');
        const pending = pendingExecutionRef.current;
        if (pending) {
          pendingExecutionRef.current = null;
          executeRef.current(worker, pending);
        }
        return;
      }

      if (data.status === 'init-error') {
        if (initializationTimeoutRef.current !== null) {
          clearTimeout(initializationTimeoutRef.current);
          initializationTimeoutRef.current = null;
        }
        setWorkerState('error');
        setError(
          data.error ?? 'No se pudo cargar Pyodide.'
        );
        onStatusChange?.('error');
        worker.terminate();
        workerRef.current = null;
        pendingExecutionRef.current = null;
        setIsRunning(false);
        return;
      }

      setIsRunning(false);
      if (data.status === 'success') {
        setOutput(data.output ?? 'Ejecución completada sin salida.');
        setError(null);
      } else {
        setOutput('');
        setError(data.error ?? 'Error desconocido.');
      }

      onOutput?.(
        data.output ?? '',
        data.error ?? undefined,
        (data.turtle_commands as TurtleCommand[] | undefined) ?? []
      );

      const turtleCmds = data.turtle_commands;
      if (Array.isArray(turtleCmds) && turtleCmds.length > 0) {
        setTurtleCommands(turtleCmds as TurtleCommand[]);
      } else if (data.status === 'success' && !turtleCmds) {
        setTurtleCommands([]);
      }
    };

    worker.onerror = () => {
      if (initializationTimeoutRef.current !== null) {
        clearTimeout(initializationTimeoutRef.current);
        initializationTimeoutRef.current = null;
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setWorkerState('error');
      setError('Error inesperado del ejecutor de Python.');
      onStatusChange?.('error');
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      pendingExecutionRef.current = null;
      setIsRunning(false);
    };

    workerRef.current = worker;
    initializationTimeoutRef.current = setTimeout(() => {
      if (workerRef.current !== worker) return;
      worker.terminate();
      workerRef.current = null;
      pendingExecutionRef.current = null;
      initializationTimeoutRef.current = null;
      setWorkerState('error');
      setError('La carga de Python tardó demasiado. Reintenta la carga.');
      setIsRunning(false);
      onStatusChange?.('error');
    }, 60_000);

    executeRef.current = (w, request) => {
      const requestId = ++requestIdRef.current;
      startWatchdog();
      w.postMessage({
        id: requestId,
        code: request.code,
        input: request.input,
      });
    };

    return worker;
  }, [onStatusChange, onOutput]);

  const runCode = useCallback(
    (code: string, input: string[] = []) => {
      if (isRunning) return;

      setTurtleCommands([]);
      setError(null);
      setIsRunning(true);

      const worker = workerRef.current;
      if (worker && workerState === 'ready') {
        // El entorno sigue listo entre ejecuciones; no volver a bloquear el editor.
        executeRef.current(worker, { code, input });
        return;
      }

      setWorkerState('loading');
      pendingExecutionRef.current = { code, input };
      setOutput('Preparando Python; la primera carga puede tardar un poco...');
      if (!worker) createWorker();
    },
    [isRunning, workerState, createWorker]
  );

  const stopWorker = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (initializationTimeoutRef.current !== null) {
      clearTimeout(initializationTimeoutRef.current);
      initializationTimeoutRef.current = null;
    }
    workerRef.current?.terminate();
    workerRef.current = null;
    pendingExecutionRef.current = null;
    setWorkerState('idle');
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      stopWorker();
    };
  }, [stopWorker]);

  return {
    workerState,
    output,
    error,
    turtleCommands,
    isRunning,
    createWorker,
    runCode,
    stopWorker,
  };
}
