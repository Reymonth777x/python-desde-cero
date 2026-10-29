'use client';

import { useState, useCallback } from 'react';
import { usePythonWorker } from '@/lib/use-python-worker';

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

  const {
    workerState,
    output,
    error,
    turtleCommands,
    isRunning,
    createWorker,
    runCode: runWorkerCode,
  } = usePythonWorker();

  const runCode = useCallback(() => {
    if (isRunning) return;
    const workerInput: string[] = [];
    runWorkerCode(code, workerInput);
  }, [code, isRunning, runWorkerCode]);

  const resetOutput = useCallback(() => {
    // El hook gestiona el estado de salida internamente.
  }, []);

  return (
    <div id="ejemplo" className="border border-[var(--theme-border)] rounded-lg bg-[var(--theme-bg-secondary)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-accent-light)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--theme-accent)]" />
          <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--theme-warning)]" />
          <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--theme-error)]" />
        </div>
        <div className="text-[10px] font-bold tracking-[0.17em] text-[var(--theme-accent)]">
          PYTHON DESDE CERO / LABORATORIO
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--theme-accent)]">
          <span className={`px-2 py-0.5 rounded border border-current text-[10px] ${workerState === 'ready' ? 'bg-[var(--theme-accent)]/20 text-[var(--theme-accent)]' : 'bg-[var(--theme-bg)] text-[var(--theme-muted)]'}`}>
            {workerState === 'ready' ? 'Listo' : workerState === 'loading' ? 'Cargando...' : workerState === 'error' ? 'Error' : 'Inactivo'}
          </span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-[340px]">
        <div className="flex-1 border-r border-[var(--theme-border)] bg-[var(--theme-surface)] relative">
          <textarea
            className="h-full w-full p-4 whitespace-pre-wrap break-words border-0 bg-transparent font-mono text-sm leading-6 text-[var(--theme-ink)] focus:outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            placeholder="Escribe tu código Python aquí..."
          />
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-[var(--theme-bg)] border-t border-[var(--theme-border)] flex items-center justify-between">
            <button
              type="button"
              onClick={runCode}
              disabled={isRunning}
              className="flex min-h-9 items-center gap-2 px-3 py-1 text-xs font-semibold text-[var(--theme-accent)] border border-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-ink-inverse)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Ejecutando...' : 'Ejecutar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCode(defaultCode);
              }}
              className="flex min-h-9 items-center gap-2 px-3 py-1 text-xs font-semibold text-[var(--theme-muted)] border border-[var(--theme-border)] hover:bg-[var(--theme-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Restaurar
            </button>
          </div>
        </div>
        <div className="flex-1 border-l border-[var(--theme-border)] flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-accent-light)] px-3 py-2">
            <h3 className="text-xs font-semibold text-[var(--theme-accent)]">Resultado</h3>
            <span className="text-[10px] text-[var(--theme-accent)]">{isRunning ? 'Ejecutando...' : 'Listo'}</span>
          </div>
          <div className="flex-1 relative">
            <pre
              className="h-full w-full overflow-auto p-4 whitespace-pre-wrap break-words border-0 bg-transparent font-mono text-sm leading-6 text-[var(--theme-ink)]"
              aria-live="polite"
            >
              {output || (workerState === 'ready' ? '> Escribe código y pulsa Ejecutar.' : workerState === 'error' ? `> ${error ?? 'No se pudo iniciar Python. Pulsa Ejecutar para volver a intentarlo.'}` : '> Pulsa Ejecutar para cargar Python en este navegador.')}
            </pre>
            {turtleCommands.length > 0 && (
              <div className="absolute bottom-4 right-4 w-[140px] bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] rounded p-2 shadow-sm">
                <p className="text-[10px] font-semibold text-[var(--theme-accent)] mb-1">Salida gráfica (Turtle)</p>
                <div className="w-full h-[120px] border border-[var(--theme-border)] bg-[var(--theme-bg)] relative">
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
