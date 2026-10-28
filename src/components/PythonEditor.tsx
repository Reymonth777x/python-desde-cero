'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { usePythonWorker } from '@/lib/use-python-worker';

// Configura Monaco Editor para usar workers autohospedados desde /monaco/vs/
if (typeof window !== 'undefined' && !window.MonacoEnvironment) {
  window.MonacoEnvironment = {
    baseUrl: '/monaco/vs/',
  };
}

export default function PythonEditor({
  defaultCode,
  instructions,
}: {
  defaultCode: string;
  instructions: string;
}) {
  const [code, setCode] = useState(defaultCode);
  const [input, setInput] = useState('');
  const [mobilePanel, setMobilePanel] = useState<'instructions' | 'editor' | 'output' | 'turtle'>('instructions');
  const [editorRequested, setEditorRequested] = useState(false);
  const [desktopLayout, setDesktopLayout] = useState(false);
  const [turtleError, setTurtleError] = useState<string | null>(null);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const {
    workerState,
    output,
    error,
    turtleCommands,
    isRunning,
    createWorker,
    runCode: runWorkerCode,
    stopWorker,
  } = usePythonWorker({
    onStatusChange: (status) => {
      if (status === 'error') {
        setMobilePanel('output');
      }
    },
    onOutput: (out, err) => {
      if (err) {
        setMobilePanel('output');
      }
    },
  });

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const updateLayout = () => setDesktopLayout(desktopQuery.matches);
    updateLayout();
    desktopQuery.addEventListener('change', updateLayout);

    return () => desktopQuery.removeEventListener('change', updateLayout);
  }, []);

  const runCode = useCallback(() => {
    if (isRunning) return;
    setMobilePanel('output');
    const workerInput = input === '' ? [] : input.split(/\r?\n/).slice(0, 20);
    runWorkerCode(code, workerInput);
  }, [code, input, isRunning, runWorkerCode]);

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
    <section className="w-full" aria-label="Espacio de prÃ¡ctica de Python">
      <div role="tablist" aria-label="Paneles del laboratorio" className="mb-4 grid grid-cols-3 border-b border-[var(--theme-border)] md:hidden">
        {([
          ['instructions', 'GuÃ­a'],
          ['editor', 'CÃ³digo'],
          ['output', 'Resultado'],
          ['turtle', 'GrÃ¡ficos'],
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
                if (workerState === 'idle') {
                }
              }
            }}
            className={`min-h-12 border-b-2 px-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] ${mobilePanel === panel ? 'border-[var(--theme-accent)] text-[var(--theme-accent)]' : 'border-transparent text-[var(--theme-muted)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {workerState !== 'ready' && (
        <p role="status" aria-live="polite" className="mb-4 flex min-h-11 items-center gap-2 text-sm text-[var(--theme-muted)]">
          {workerState === 'loading' && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--theme-border)] border-t-[var(--theme-accent)] motion-reduce:animate-none" />}
          {workerState === 'idle' ? 'Python se prepara al abrir el editor o iniciar la primera ejecuciÃ³n.' : workerState === 'loading' ? 'Preparando Python en este dispositivo. La primera carga puede tardar.' : 'El ejecutor necesita atenciÃ³n. Consulta el resultado para ver opciones.'}
        </p>
      )}

      <div
        id="practice-panel-instructions"
        role="tabpanel"
        aria-labelledby="practice-tab-instructions"
        className={`${mobilePanel === 'instructions' ? 'block' : 'hidden'} md:hidden`}
      >
        <section className="border-l-2 border-[var(--theme-border-dark)] bg-[var(--theme-bg-secondary)] p-4 sm:p-5">
          <h2 className="font-serif text-xl">GuÃ­a de prÃ¡ctica</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">{instructions}</p>
          <button
            type="button"
            onClick={() => {
              setMobilePanel('editor');
              setEditorRequested(true);
              if (workerState === 'idle') {
              }
            }}
            className="mt-4 min-h-12 w-full bg-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-[var(--theme-ink-inverse)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
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
        <div className="h-[min(42svh,420px)] min-h-[280px] w-full overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)] sm:h-[460px]">
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

        <div aria-label="Teclas de Python para pantalla tÃ¡ctil" className="flex flex-wrap gap-2 md:hidden">
          {[
            { label: '()', accessible: 'Insertar parÃ©ntesis', text: '()', cursor: 1 },
            { label: '""', accessible: 'Insertar comillas', text: '""', cursor: 1 },
            { label: ':', accessible: 'Insertar dos puntos', text: ':' },
            { label: '=', accessible: 'Insertar signo igual', text: '=' },
            { label: '+', accessible: 'Insertar signo mÃ¡s', text: '+' },
            { label: '*', accessible: 'Insertar asterisco', text: '*' },
            { label: 'Tab', accessible: 'Insertar sangrÃ­a de cuatro espacios', text: '    ' },
          ].map((key) => (
            <button
              key={key.accessible}
              type="button"
              aria-label={key.accessible}
              onClick={() => insertOnMobile(key.text, key.cursor)}
              className="min-h-11 min-w-11 border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 font-mono text-base text-[var(--theme-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
            >
              {key.label}
            </button>
          ))}
        </div>

        <label className="block text-base font-semibold text-[var(--theme-ink)] sm:text-sm">
          Entrada para input() <span className="font-normal text-[var(--theme-muted)]">(una lÃ­nea por solicitud)</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={10000}
            rows={3}
            placeholder="Escribe aquÃ­ las lÃ­neas que leerÃ¡ tu programa"
            className="mt-2 block min-h-20 w-full resize-y border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 font-mono text-base font-normal text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)] sm:text-sm"
          />
        </label>
          </>
        )}

        <button
          type="button"
          onClick={runCode}
          disabled={isRunning || workerState === 'loading'}
          className="flex min-h-12 w-full items-center justify-center bg-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm"
        >
          {isRunning ? 'Ejecutando...' : workerState === 'loading' ? 'Preparando Python...' : 'Ejecutar cÃ³digo'}
        </button>

        {workerState === 'error' && (
          <button
            type="button"
            onClick={() => {
            }}
            className="flex min-h-11 w-full items-center justify-center border border-[var(--theme-accent)] px-4 py-2 text-sm font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] sm:w-auto"
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
          <h2 className="text-sm font-semibold text-[var(--theme-ink)]">Salida del programa</h2>
          <span className="text-xs text-[var(--theme-muted)]">{isRunning ? 'EjecuciÃ³n en curso' : workerState === 'ready' ? 'EjecuciÃ³n local en el navegador' : 'Entorno Python'}</span>
        </div>
        <pre
          aria-live="polite"
          aria-atomic="true"
          className="max-h-[42svh] min-h-28 overflow-auto whitespace-pre-wrap break-words border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] p-4 font-mono text-sm leading-6 text-[var(--theme-ink)] sm:max-h-64"
        >
          {output || (workerState === 'ready' ? '> Entorno listo. Ejecuta cÃ³digo para consultar el resultado.' : '> Preparando el entorno Python en el navegador...')}
        </pre>
        <button
          type="button"
          onClick={runCode}
          disabled={isRunning || workerState === 'loading'}
          className="mt-3 flex min-h-12 w-full items-center justify-center border border-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
        >
          {isRunning ? 'Ejecutando...' : 'Ejecutar de nuevo'}
        </button>
        {isRunning && (
          <button
            type="button"
            onClick={stopWorker}
            className="mt-3 flex min-h-12 w-full items-center justify-center border border-[var(--theme-border-dark)] px-5 py-3 text-base font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-border-dark)] md:hidden"
          >
            Detener
          </button>
        )}
        {workerState === 'error' && (
          <button
            type="button"
            onClick={() => {
            }}
            className="mt-2 flex min-h-11 w-full items-center justify-center border border-[var(--theme-accent)] px-4 py-2 text-sm font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] md:hidden"
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
          <h2 className="text-sm font-semibold text-[var(--theme-ink)]">GrÃ¡ficos de Turtle</h2>
          <span className="text-xs text-[var(--theme-muted)]">{turtleCommands.length > 0 ? `${turtleCommands.length} trazo(s) dibujado(s)` : 'Ejecuta cÃ³digo con Turtle para ver el dibujo'}</span>
        </div>
        {turtleError && (
          <p className="mb-2 text-sm text-[var(--theme-error)] bg-[var(--theme-error-light)] border border-[var(--theme-error)] px-3 py-2 rounded">
            {turtleError}
          </p>
        )}
        <div className="flex flex-col items-center justify-center min-h-[200px] max-h-[600px] overflow-auto border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] rounded-lg">
          {turtleCommands.length === 0 ? (
            <p className="text-sm text-[var(--theme-muted)] py-4">
              Ejecuta cÃ³digo Python con la librerÃ­a turtle para ver el dibujo aquÃ­.
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
          onClick={() => {}}
          disabled={turtleCommands.length === 0}
          className="mt-3 flex min-h-11 w-full items-center justify-center border border-[var(--theme-accent)] px-4 py-2 text-sm font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
        >
          Limpiar grÃ¡fico
        </button>
      </div>
    </section>
  );
}
