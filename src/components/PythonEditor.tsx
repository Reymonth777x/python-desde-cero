'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

type WorkerResponse = {
  id?: number;
  status: 'ready' | 'init-error' | 'success' | 'error';
  output?: string;
  error?: string;
  turtle_commands?: unknown;
};

type TurtleCommand = {
  type: 'line' | 'fill' | 'dot' | 'write' | 'bgcolor';
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

export default function PythonEditor({
  defaultCode,
  instructions,
}: {
  defaultCode: string;
  instructions: string;
}) {
  const [code, setCode] = useState(defaultCode);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [workerState, setWorkerState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [mobilePanel, setMobilePanel] = useState<'instructions' | 'editor' | 'output' | 'turtle'>('instructions');
  const [editorRequested, setEditorRequested] = useState(false);
  const [desktopLayout, setDesktopLayout] = useState(false);
  const [turtleCommands, setTurtleCommands] = useState<TurtleCommand[]>([]);
  const [turtleError, setTurtleError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const pendingExecutionRef = useRef<{ code: string; input: string[] } | null>(null);
  const executeRef = useRef<(worker: Worker, request: { code: string; input: string[] }) => void>(() => {});
  const requestIdRef = useRef(0);
  const initializationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const createWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    setWorkerState('loading');

    let worker: Worker;
    try {
      worker = new Worker('/python-worker.js');
    } catch (error) {
      setWorkerState('error');
      pendingExecutionRef.current = null;
      setOutput(`No se pudo iniciar el ejecutor: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.status === 'ready') {
        if (initializationTimeoutRef.current !== null) {
          clearTimeout(initializationTimeoutRef.current);
          initializationTimeoutRef.current = null;
        }
        setWorkerState('ready');
        const pendingExecution = pendingExecutionRef.current;
        if (pendingExecution) {
          pendingExecutionRef.current = null;
          executeRef.current(worker, pendingExecution);
        }
        return;
      }

      if (event.data.status === 'init-error') {
        if (initializationTimeoutRef.current !== null) {
          clearTimeout(initializationTimeoutRef.current);
          initializationTimeoutRef.current = null;
        }
        setWorkerState('error');
        setMobilePanel('output');
        setIsRunning(false);
        pendingExecutionRef.current = null;
        setOutput(`No se pudo cargar Pyodide: ${event.data.error ?? 'Error desconocido'}`);
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
        return;
      }

      if (event.data.id !== requestIdRef.current) return;

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setIsRunning(false);

      if (event.data.status === 'success') {
        setOutput(event.data.output || 'Ejecución completada sin salida.');
      } else {
        const partialOutput = event.data.output?.trimEnd();
        setOutput(`${partialOutput ? `${partialOutput}\n` : ''}Error:\n${event.data.error ?? 'Error desconocido'}`);
      }

      const turtleCmds = event.data.turtle_commands;
      if (Array.isArray(turtleCmds) && turtleCmds.length > 0) {
        setTurtleCommands(turtleCmds as TurtleCommand[]);
        setMobilePanel('turtle');
      } else if (event.data.status === 'success' && !turtleCmds) {
        setTurtleCommands([]);
      }
    };

    worker.onerror = (event) => {
      if (initializationTimeoutRef.current !== null) {
        clearTimeout(initializationTimeoutRef.current);
        initializationTimeoutRef.current = null;
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setIsRunning(false);
      setWorkerState('error');
      setMobilePanel('output');
      pendingExecutionRef.current = null;
      setOutput(`Error del ejecutor:\n${event.message || 'El Worker dejó de responder.'}`);
      worker.terminate();

      if (workerRef.current === worker) {
        workerRef.current = null;
      }
    };

    workerRef.current = worker;
    initializationTimeoutRef.current = setTimeout(() => {
      if (workerRef.current !== worker) return;
      worker.terminate();
      workerRef.current = null;
      setWorkerState('error');
      setMobilePanel('output');
      pendingExecutionRef.current = null;
      setOutput('La carga de Pyodide tardó demasiado. Comprueba la conexión e inténtalo de nuevo.');
      initializationTimeoutRef.current = null;
    }, 60000);
    return worker;
  }, []);

  useEffect(() => {
    executeRef.current = (worker, request) => {
    setIsRunning(true);
    setOutput('Ejecutando...');

    const id = requestIdRef.current + 1;
    requestIdRef.current = id;

    try {
      worker.postMessage({ id, code: request.code, input: request.input });
    } catch (error) {
      setIsRunning(false);
      setWorkerState('error');
      setOutput(`No se pudo enviar el programa al ejecutor: ${error instanceof Error ? error.message : String(error)}`);
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (workerRef.current !== worker) return;
      worker.terminate();
      workerRef.current = null;

      setIsRunning(false);
      setWorkerState('loading');
      setMobilePanel('output');
      setOutput(
        'Error: Tiempo de ejecución excedido. Posible bucle infinito. El entorno se está reiniciando para permitir otra ejecución.'
      );

      timeoutRef.current = null;
      createWorker();
    }, 5000);
    };
  }, [createWorker]);

  useEffect(() => () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    if (initializationTimeoutRef.current !== null) clearTimeout(initializationTimeoutRef.current);
    workerRef.current?.terminate();
    workerRef.current = null;
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const updateLayout = () => setDesktopLayout(desktopQuery.matches);
    updateLayout();
    desktopQuery.addEventListener('change', updateLayout);

    return () => desktopQuery.removeEventListener('change', updateLayout);
  }, []);

  const runCode = () => {
    if (isRunning) return;

    setTurtleCommands([]);
    setTurtleError(null);

    const request = {
      code,
      input: input === '' ? [] : input.split(/\r?\n/).slice(0, 20),
    };
    const worker = workerRef.current;
    setMobilePanel('output');

    if (worker && workerState === 'ready') {
      executeRef.current(worker, request);
      return;
    }

    pendingExecutionRef.current = request;
    setOutput('Preparando Python; la primera carga puede tardar un poco...');
    if (!worker) createWorker();
  };

  const insertOnMobile = (text: string, cursorOffset = text.length) => {
    const editorInstance = editorRef.current;
    const model = editorInstance?.getModel();
    const selection = editorInstance?.getSelection();
    if (!editorInstance || !model || !selection) return;

    const start = model.getOffsetAt(selection.getStartPosition());
    editorInstance.executeEdits('mobile-code-toolbar', [{
      range: selection,
      text,
      forceMoveMarkers: true,
    }]);
    editorInstance.setPosition(model.getPositionAt(start + cursorOffset));
    editorInstance.focus();
  };

  return (
    <section className="w-full" aria-label="Espacio de práctica de Python">
      <div role="tablist" aria-label="Paneles del laboratorio" className="mb-4 grid grid-cols-3 border-b border-[#d3d3c7] md:hidden">
        {([
          ['instructions', 'Guía'],
          ['editor', 'Código'],
          ['output', 'Resultado'],
          ['turtle', 'Gráficos'],
        ] as const).map(([panel, label]) => (
          <button
            key={panel}
            type="button"
            role="tab"
            id={`practice-tab-${panel}`}
            aria-controls={`practice-panel-${panel}`}
            aria-selected={mobilePanel === panel}
            onClick={() => {
              setMobilePanel(panel);
              if (panel === 'editor') {
                setEditorRequested(true);
                if (workerState === 'idle') createWorker();
              }
            }}
            className={`min-h-12 border-b-2 px-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] ${mobilePanel === panel ? 'border-[#294936] text-[#294936]' : 'border-transparent text-[#596259]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {workerState !== 'ready' && (
        <p role="status" aria-live="polite" className="mb-4 flex min-h-11 items-center gap-2 text-sm text-[#596259]">
          {workerState === 'loading' && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-[#d3d3c7] border-t-[#294936] motion-reduce:animate-none" />}
          {workerState === 'idle' ? 'Python se prepara al abrir el editor o iniciar la primera ejecución.' : workerState === 'loading' ? 'Preparando Python en este dispositivo. La primera carga puede tardar.' : 'El ejecutor necesita atención. Consulta el resultado para ver opciones.'}
        </p>
      )}

      <div
        id="practice-panel-instructions"
        role="tabpanel"
        aria-labelledby="practice-tab-instructions"
        className={`${mobilePanel === 'instructions' ? 'block' : 'hidden'} md:hidden`}
      >
        <section className="border-l-2 border-[#b7a77d] bg-[#ebe9df] p-4 sm:p-5">
          <h2 className="font-serif text-xl">Guía de práctica</h2>
          <p className="mt-2 text-sm leading-6 text-[#3f4940]">{instructions}</p>
          <button
            type="button"
            onClick={() => {
              setMobilePanel('editor');
              setEditorRequested(true);
              if (workerState === 'idle') createWorker();
            }}
            className="mt-4 min-h-12 w-full bg-[#294936] px-5 py-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936]"
          >
            Ir al editor
          </button>
        </section>
      </div>

      <div
        id="practice-panel-editor"
        role="tabpanel"
        aria-labelledby="practice-tab-editor"
        className={`${mobilePanel === 'editor' ? 'block' : 'hidden'} space-y-4 md:block`}
      >
        {(editorRequested || desktopLayout) && (
          <>
        <div className="h-[min(42svh,420px)] min-h-[280px] w-full overflow-hidden border border-[#d3d3c7] bg-white sm:h-[460px]">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs"
            onMount={(editorInstance) => { editorRef.current = editorInstance; }}
            value={code}
            onChange={(value) => setCode(value ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineHeight: 24,
              automaticLayout: true,
              tabSize: 4,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              scrollbar: { verticalScrollbarSize: 12, horizontalScrollbarSize: 12 },
            }}
          />
        </div>

        <div aria-label="Teclas de Python para pantalla táctil" className="flex flex-wrap gap-2 md:hidden">
          {[
            { label: '()', accessible: 'Insertar paréntesis', text: '()', cursor: 1 },
            { label: '""', accessible: 'Insertar comillas', text: '""', cursor: 1 },
            { label: ':', accessible: 'Insertar dos puntos', text: ':' },
            { label: '=', accessible: 'Insertar signo igual', text: '=' },
            { label: '+', accessible: 'Insertar signo más', text: '+' },
            { label: '*', accessible: 'Insertar asterisco', text: '*' },
            { label: 'Tab', accessible: 'Insertar sangría de cuatro espacios', text: '    ' },
          ].map((key) => (
            <button
              key={key.accessible}
              type="button"
              aria-label={key.accessible}
              onClick={() => insertOnMobile(key.text, key.cursor)}
              className="min-h-11 min-w-11 border border-[#d3d3c7] bg-white px-3 font-mono text-base text-[#252b25] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936]"
            >
              {key.label}
            </button>
          ))}
        </div>

        <label className="block text-base font-semibold text-[#252b25] sm:text-sm">
          Entrada para input() <span className="font-normal text-[#596259]">(una línea por solicitud)</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={10000}
            rows={3}
            placeholder="Escribe aquí las líneas que leerá tu programa"
            className="mt-2 block min-h-20 w-full resize-y border border-[#d3d3c7] bg-white px-3 py-3 font-mono text-base font-normal text-[#252b25] outline-none focus:border-[#294936] focus:ring-1 focus:ring-[#294936] sm:text-sm"
          />
        </label>
          </>
        )}

        <button
          type="button"
          onClick={runCode}
          disabled={isRunning || workerState === 'loading'}
          className="flex min-h-12 w-full items-center justify-center bg-[#294936] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#203d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm"
        >
          {isRunning ? 'Ejecutando...' : workerState === 'loading' ? 'Preparando Python...' : 'Ejecutar código'}
        </button>

        {workerState === 'error' && (
          <button
            type="button"
            onClick={() => {
              setOutput('Volviendo a cargar Pyodide...');
              createWorker();
            }}
            className="flex min-h-11 w-full items-center justify-center border border-[#294936] px-4 py-2 text-sm font-semibold text-[#294936] hover:bg-[#ebe9df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] sm:w-auto"
          >
            Reintentar carga
          </button>
        )}
      </div>

      <div
        id="practice-panel-output"
        role="tabpanel"
        aria-labelledby="practice-tab-output"
        className={`${mobilePanel === 'output' ? 'block' : 'hidden'} mt-4 md:block`}
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-[#252b25]">Salida del programa</h2>
          <span className="text-xs text-[#596259]">{isRunning ? 'Ejecución en curso' : workerState === 'ready' ? 'Ejecución local en el navegador' : 'Entorno Python'}</span>
        </div>
        <pre
          aria-live="polite"
          aria-atomic="true"
          className="max-h-[42svh] min-h-28 overflow-auto whitespace-pre-wrap break-words border border-[#d3d3c7] bg-[#ebe9df] p-4 font-mono text-sm leading-6 text-[#252b25] sm:max-h-64"
        >
          {output || (workerState === 'ready' ? '> Entorno listo. Ejecuta código para consultar el resultado.' : '> Preparando el entorno Python en el navegador...')}
        </pre>
        <button
          type="button"
          onClick={runCode}
          disabled={isRunning || workerState === 'loading'}
          className="mt-3 flex min-h-12 w-full items-center justify-center border border-[#294936] px-5 py-3 text-base font-semibold text-[#294936] hover:bg-[#ebe9df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
        >
          {isRunning ? 'Ejecutando...' : 'Ejecutar de nuevo'}
        </button>
        {workerState === 'error' && (
          <button
            type="button"
            onClick={() => {
              setOutput('Volviendo a cargar Pyodide...');
              createWorker();
            }}
            className="mt-2 flex min-h-11 w-full items-center justify-center border border-[#294936] px-4 py-2 text-sm font-semibold text-[#294936] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] md:hidden"
          >
            Reintentar carga de Python
          </button>
        )}
      </div>

      <div
        id="practice-panel-turtle"
        role="tabpanel"
        aria-labelledby="practice-tab-turtle"
        className={`${mobilePanel === 'turtle' ? 'block' : 'hidden'} mt-4 md:block`}
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-[#252b25]">Gráficos de Turtle</h2>
          <span className="text-xs text-[#596259]">{turtleCommands.length > 0 ? `${turtleCommands.length} trazo(s) dibujado(s)` : 'Ejecuta código con Turtle para ver el dibujo'}</span>
        </div>
        {turtleError && (
          <p className="mb-2 text-sm text-[#7f3027] bg-[#fdf3f3] border border-[#a04435] px-3 py-2 rounded">
            {turtleError}
          </p>
        )}
        <div className="flex flex-col items-center justify-center min-h-[200px] max-h-[600px] overflow-auto border border-[#d3d3c7] bg-[#ebe9df] rounded-lg">
          {turtleCommands.length === 0 ? (
            <p className="text-sm text-[#596259] py-4">
              Ejecuta código Python con la librería turtle para ver el dibujo aquí.
            </p>
          ) : (
            <svg
              className="w-full max-w-[600px] max-h-[500px]"
              viewBox="-250 -250 500 500"
              preserveAspectRatio="xMidYMid meet"
            >
              {turtleCommands.map((cmd, idx) => {
                if (cmd.type === 'line') {
                  return (
                    <line
                      key={`turtle-line-${idx}`}
                      x1={cmd.x1!}
                      y1={-cmd.y1!}
                      x2={cmd.x2!}
                      y2={-cmd.y2!}
                      stroke={cmd.color ?? 'black'}
                      strokeWidth={cmd.size ?? 1}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                }
                if (cmd.type === 'dot') {
                  return (
                    <circle
                      key={`turtle-dot-${idx}`}
                      cx={cmd.x!}
                      cy={-cmd.y!}
                      r={(cmd.size ?? 2) / 2}
                      fill={cmd.color ?? 'black'}
                    />
                  );
                }
                if (cmd.type === 'fill') {
                  return (
                    <polygon
                      key={`turtle-fill-${idx}`}
                      points={cmd.points?.map(([x, y]) => `${x},${-y}`).join(' ') ?? ''}
                      fill={cmd.color ?? 'black'}
                      fillOpacity="0.6"
                    />
                  );
                }
                if (cmd.type === 'write') {
                  return (
                    <text
                      key={`turtle-write-${idx}`}
                      x={cmd.x!}
                      y={-cmd.y!}
                      fill={cmd.color ?? 'black'}
                      fontSize={12}
                      fontFamily="monospace"
                      textAnchor="start"
                      dominantBaseline="middle"
                    >
                      {cmd.text}
                    </text>
                  );
                if (cmd.type === "bgcolor") {
                  return (
                    <rect
                      key={`turtle-bgcolor-${idx}`}
                      x="-250"
                      y="-250"
                      width="500"
                      height="500"
                      fill={cmd.color ?? "white"}
                    />
                  );
                }
                }
                return null;
              })}
            </svg>
          )}
        </div>
        <button
          type="button"
          onClick={() => setTurtleCommands([])}
          disabled={turtleCommands.length === 0}
          className="mt-3 flex min-h-11 w-full items-center justify-center border border-[#294936] px-4 py-2 text-sm font-semibold text-[#294936] hover:bg-[#ebe9df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
        >
          Limpiar gráfico
        </button>
      </div>
    </section>
  );
}
