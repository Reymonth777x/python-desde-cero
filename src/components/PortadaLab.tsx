'use client';

import { useState, useCallback } from 'react';
import { usePythonWorker } from '@/lib/use-python-worker';

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
    runCode: runWorkerCode,
  } = usePythonWorker();

  const runCode = useCallback(() => {
    if (isRunning) return;
    runWorkerCode(code, []);
  }, [code, isRunning, runWorkerCode]);

  const statusLabel = isRunning
    ? 'Ejecutando'
    : workerState === 'loading'
      ? 'Preparando Python'
      : workerState === 'ready'
        ? 'Entorno listo'
        : workerState === 'error'
          ? 'Revisar entorno'
          : 'Aún no iniciado';

  const resultText = error
    ? `Error de Python: ${error}`
    : output || (
      workerState === 'ready'
        ? 'El entorno está listo. Ejecuta el ejemplo para ver la salida.'
        : 'Pulsa Ejecutar para cargar Python en este navegador.'
    );

  return (
    <section
      aria-label="Laboratorio de Python"
      className="overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[6px_7px_0_var(--theme-shadow)]"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-error)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-warning)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-success)]" />
          </div>
          <span className="font-mono text-[10px] font-semibold tracking-[0.15em] text-[var(--theme-muted)]">
            PYTHON DESDE CERO / LAB
          </span>
        </div>
        <span className="inline-flex items-center gap-2 font-mono text-[10px] text-[var(--theme-muted)]" role="status" aria-live="polite">
          <span className={`h-1.5 w-1.5 rounded-full ${workerState === 'ready' ? 'bg-[var(--theme-success)]' : workerState === 'error' ? 'bg-[var(--theme-error)]' : 'bg-[var(--theme-warning)]'}`} />
          {statusLabel}
        </span>
      </header>

      <div className="grid min-w-0 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col border-b border-[var(--theme-border)] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-[var(--theme-border)] px-4 py-3">
            <h3 className="text-xs font-semibold text-[var(--theme-ink)]">01 / Editor</h3>
            <span className="font-mono text-[10px] text-[var(--theme-muted)]">.py</span>
          </div>

          <textarea
            aria-label="Código Python"
            className="min-h-[330px] w-full flex-1 resize-y border-0 bg-[var(--theme-code-bg)] p-4 font-mono text-xs leading-6 text-[var(--theme-ink)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--theme-focus-ring)] sm:min-h-[390px] sm:p-5 sm:text-sm"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            placeholder="Escribe tu código Python aquí..."
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3">
            <p className="text-[10px] text-[var(--theme-muted)]">Edita el ejemplo y ejecútalo.</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCode(defaultCode)}
                className="inline-flex min-h-10 items-center border border-[var(--theme-border)] px-3 text-xs font-semibold text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-bg-secondary)] hover:text-[var(--theme-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
              >
                Restaurar
              </button>
              <button
                type="button"
                aria-label="Ejecutar"
                onClick={runCode}
                disabled={isRunning || workerState === 'loading'}
                className="inline-flex min-h-10 items-center gap-2 bg-[var(--theme-accent)] px-4 text-xs font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRunning ? 'Ejecutando...' : 'Ejecutar'}
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between border-b border-[var(--theme-border)] px-4 py-3">
            <h3 className="text-xs font-semibold text-[var(--theme-ink)]">02 / Resultado</h3>
            <span className="font-mono text-[10px] text-[var(--theme-muted)]">
              {turtleCommands.length > 0 ? `${turtleCommands.length} comandos gráficos` : 'SALIDA'}
            </span>
          </div>

          {turtleCommands.length > 0 ? (
            <div className="relative min-h-[260px] flex-1 bg-[#101b16] sm:min-h-[330px]">
              <svg
                role="img"
                aria-label="Resultado gráfico de Turtle"
                className="h-full min-h-[260px] w-full sm:min-h-[330px]"
                viewBox="-250 -250 500 500"
                preserveAspectRatio="xMidYMid meet"
              >
                {turtleCommands.map((command: TurtleCommand, index) => {
                  if (command.type === 'line') {
                    return (
                      <line
                        key={`turtle-line-${index}`}
                        x1={command.x1 ?? 0}
                        y1={-(command.y1 ?? 0)}
                        x2={command.x2 ?? 0}
                        y2={-(command.y2 ?? 0)}
                        stroke={command.color ?? 'white'}
                        strokeWidth={command.size ?? 1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  }
                  if (command.type === 'dot') {
                    return (
                      <circle
                        key={`turtle-dot-${index}`}
                        cx={command.x ?? 0}
                        cy={-(command.y ?? 0)}
                        r={(command.size ?? 2) / 2}
                        fill={command.color ?? 'white'}
                      />
                    );
                  }
                  if (command.type === 'fill') {
                    return (
                      <polygon
                        key={`turtle-fill-${index}`}
                        points={command.points?.map(([x, y]) => `${x},${-y}`).join(' ') ?? ''}
                        fill={command.color ?? 'white'}
                        fillOpacity="0.65"
                      />
                    );
                  }
                  if (command.type === 'write') {
                    return (
                      <text
                        key={`turtle-write-${index}`}
                        x={command.x ?? 0}
                        y={-(command.y ?? 0)}
                        fill={command.color ?? 'white'}
                        fontSize={12}
                        fontFamily="monospace"
                        textAnchor="start"
                        dominantBaseline="middle"
                      >
                        {command.text}
                      </text>
                    );
                  }
                  if (command.type === 'bgcolor') {
                    return (
                      <rect
                        key={`turtle-background-${index}`}
                        x="-250"
                        y="-250"
                        width="500"
                        height="500"
                        fill={command.color ?? 'black'}
                      />
                    );
                  }
                  if (command.type === 'cursor') {
                    return (
                      <g
                        key={`turtle-cursor-${index}`}
                        transform={`translate(${command.x ?? 0} ${-(command.y ?? 0)}) rotate(${-(command.heading ?? 0)})`}
                      >
                        {command.shape === 'turtle' ? (
                          <>
                            <ellipse cx="0" cy="0" rx="8" ry="5.5" fill={command.color ?? 'lime'} stroke="#17251d" strokeWidth="1" />
                            <circle cx="10" cy="0" r="3.5" fill="#76a85d" stroke="#17251d" strokeWidth="0.8" />
                            <circle cx="-5" cy="-6" r="2.7" fill="#76a85d" />
                            <circle cx="4" cy="-6" r="2.7" fill="#76a85d" />
                            <circle cx="-5" cy="6" r="2.7" fill="#76a85d" />
                            <circle cx="4" cy="6" r="2.7" fill="#76a85d" />
                            <path d="M-9 0 L-13 0" stroke="#17251d" strokeWidth="2" strokeLinecap="round" />
                          </>
                        ) : (
                          <path d="M12 0 L-8 -6 L-5 0 L-8 6 Z" fill={command.color ?? 'white'} stroke="#17251d" strokeWidth="1" />
                        )}
                      </g>
                    );
                  }
                  return null;
                })}
              </svg>
              <span className="absolute bottom-3 right-3 bg-[#101b16]/80 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[#d6e7d1]">
                TURTLE / SVG
              </span>
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-1 flex-col items-center justify-center bg-[var(--theme-code-bg)] px-6 py-8 text-center sm:min-h-[250px]">
              <div className="flex h-12 w-12 items-center justify-center border border-[var(--theme-border)] font-mono text-xl text-[var(--theme-accent)]" aria-hidden="true">
                {'{}'}
              </div>
              <p className="mt-4 text-sm font-semibold text-[var(--theme-ink)]">Tu resultado aparecerá aquí</p>
              <p className="mt-2 max-w-xs text-xs leading-5 text-[var(--theme-muted)]">
                Ejecuta el ejemplo para ver texto o gráficos generados por Python.
              </p>
            </div>
          )}

          <div className="border-t border-[var(--theme-border)] bg-[var(--theme-bg-secondary)]">
            <div className="flex items-center justify-between border-b border-[var(--theme-border)] px-4 py-2">
              <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--theme-muted)]">CONSOLA</span>
              <span className="font-mono text-[10px] text-[var(--theme-muted)]">LOCAL / PYODIDE</span>
            </div>
            <pre
              aria-label="Salida del programa"
              aria-live="polite"
              aria-atomic="true"
              className="max-h-36 min-h-[76px] overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-xs leading-5 text-[var(--theme-ink)]"
            >
              {resultText}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
