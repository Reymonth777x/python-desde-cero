'use client';

import { useRef, useState } from 'react';

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

export default function PortadaLab({
  defaultCode,
}: {
  defaultCode: string;
}) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [workerState, setWorkerState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [turtleCommands, setTurtleCommands] = useState<TurtleCommand[]>([]);

  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);

  const createWorker = () => {
    if (workerRef.current) return workerRef.current;
    setWorkerState('loading');
    let worker: Worker;
    try {
      worker = new Worker('/python-worker.js');
    } catch {
      setWorkerState('error');
      setOutput('No se pudo iniciar el ejecutor');
      return null;
    }
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.status === 'ready') {
        setWorkerState('ready');
        return;
      }
      if (event.data.status === 'init-error') {
        setWorkerState('error');
        setOutput('No se pudo cargar Pyodide');
        worker.terminate();
        return;
      }
      setIsRunning(false);
      if (event.data.status === 'success') {
        setOutput(event.data.output || 'Ejecución completada sin salida.');
      } else {
        setOutput('Error: ' + (event.data.error ?? 'Error desconocido'));
      }
      const turtleCmds = event.data.turtle_commands;
      if (Array.isArray(turtleCmds) && turtleCmds.length > 0) {
        setTurtleCommands(turtleCmds as TurtleCommand[]);
      } else if (event.data.status === 'success' && !turtleCmds) {
        setTurtleCommands([]);
      }
    };
    worker.onerror = () => {
      setWorkerState('error');
      setOutput('Error inesperado del ejecutor.');
      setIsRunning(false);
    };
    workerRef.current = worker;
    return worker;
  };

  const runCode = () => {
    if (isRunning) return;
    setTurtleCommands([]);
    setIsRunning(true);
    setWorkerState('loading');
    const worker = createWorker();
    if (!worker) return;
    const requestId = ++requestIdRef.current;
    worker.postMessage({
      id: requestId,
      code,
      input: [],
    });
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.id !== requestId) return;
      setIsRunning(false);
      if (event.data.status === 'success') {
        setOutput(event.data.output || 'Ejecución completada sin salida.');
      } else {
        setOutput('Error: ' + (event.data.error ?? 'Error desconocido'));
      }
      const turtleCmds = event.data.turtle_commands;
      if (Array.isArray(turtleCmds) && turtleCmds.length > 0) {
        setTurtleCommands(turtleCmds as TurtleCommand[]);
      }
    };
  };

  return (
    <div className="border border-[#d3d3c7] rounded-lg bg-[#ebe9df] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#d3d3c7] bg-[#dce5d8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#294936]" />
          <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#f4a261]" />
          <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#e76f51]" />
        </div>
        <div className="text-[10px] font-bold tracking-[0.17em] text-[#294936]">
          PYTHON DESDE CERO / LABORATORIO
        </div>
        <div className="flex items-center gap-1 text-xs text-[#294936]">
          <span className={`px-2 py-0.5 rounded border border-current text-[10px] ${workerState === 'ready' ? 'bg-[#294936]/20 text-[#294936]' : 'bg-[#f4f2e9] text-[#596259]'}`}>
            {workerState === 'ready' ? 'Listo' : workerState === 'loading' ? 'Cargando...' : 'Error'}
          </span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-[340px]">
        <div className="flex-1 border-r border-[#d3d3c7] bg-white relative">
          <textarea
            className="h-full w-full p-4 whitespace-pre-wrap break-words border-0 bg-transparent font-mono text-sm leading-6 text-[#252b25] focus:outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder="Escribe tu código Python aquí..."
          />
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-[#f4f2e9] border-t border-[#d3d3c7] flex items-center justify-between">
            <button
              type="button"
              onClick={runCode}
              disabled={isRunning}
              className="flex min-h-9 items-center gap-2 px-3 py-1 text-xs font-semibold text-[#294936] border border-[#294936] hover:bg-[#294936] hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Ejecutando...' : 'Ejecutar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCode(defaultCode);
                setOutput('');
                setTurtleCommands([]);
              }}
              className="flex min-h-9 items-center gap-2 px-3 py-1 text-xs font-semibold text-[#596259] border border-[#d3d3c7] hover:bg-[#f4f2e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Restaurar
            </button>
          </div>
        </div>
        <div className="flex-1 border-l border-[#d3d3c7] flex flex-col">
          <div className="flex items-center justify-between border-b border-[#d3d3c7] bg-[#dce5d8] px-3 py-2">
            <h3 className="text-xs font-semibold text-[#294936]">Resultado</h3>
            <span className="text-[10px] text-[#294936]">{isRunning ? 'Ejecutando...' : 'Listo'}</span>
          </div>
          <div className="flex-1 relative">
            <pre
              className="h-full w-full overflow-auto p-4 whitespace-pre-wrap break-words border-0 bg-transparent font-mono text-sm leading-6 text-[#252b25]"
              aria-live="polite"
            >
              {output || (workerState === 'ready' ? '> Escribe código y pulsa Ejecutar.' : '> Preparando entorno Python...')}
            </pre>
            {turtleCommands.length > 0 && (
              <div className="absolute bottom-4 right-4 w-[140px] bg-[#ebe9df] border border-[#d3d3c7] rounded p-2 shadow-sm">
                <p className="text-[10px] font-semibold text-[#294936] mb-1">Salida gráfica (Turtle)</p>
                <div className="w-full h-[120px] border border-[#d3d3c7] bg-[#f4f2e9] relative">
                  <svg
                    className="w-full h-full"
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
                      }
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
                      return null;
                    })}
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
