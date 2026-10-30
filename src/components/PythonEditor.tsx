'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { usePythonWorker } from '@/lib/use-python-worker';
import { matchesExerciseOutput, type ExerciseTestResult } from '@/lib/exercise-output';
import { useTheme } from '@/app/theme-provider';

const RUNNER_FRAME_TITLE = 'Entorno de ejecución Python aislado';

// Configura Monaco Editor para usar workers autohospedados desde /monaco/vs/
if (typeof window !== 'undefined' && !window.MonacoEnvironment) {
  window.MonacoEnvironment = {
    baseUrl: '/monaco/vs/',
  };
}

type ExerciseTestCase = { input: string[]; expected: string };
type TestProgress = { completed: number; passed: number; total: number };
type TestBatch = { code: string; cases: ExerciseTestCase[]; index: number; passed: number };

export default function PythonEditor({
  defaultCode,
  instructions,
  tests,
  onTestsComplete,
}: {
  defaultCode: string;
  instructions: string;
  tests?: ExerciseTestCase[];
  onTestsComplete?: (result: ExerciseTestResult) => void;
}) {
  const [code, setCode] = useState(defaultCode);
  const [input, setInput] = useState('');
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const outputRef = useRef<HTMLElement | null>(null);
  const testBatchRef = useRef<TestBatch | null>(null);
  const onTestsCompleteRef = useRef(onTestsComplete);
  const [testProgress, setTestProgress] = useState<TestProgress | null>(null);
  const [testResult, setTestResult] = useState<ExerciseTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    onTestsCompleteRef.current = onTestsComplete;
  }, [onTestsComplete]);

  const revealOutput = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 767px)').matches) return;
    window.requestAnimationFrame(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const onWorkerOutput = useCallback((out: string, err?: string) => {
    const batch = testBatchRef.current;
    if (!batch) {
      revealOutput();
      return;
    }

    const passed = matchesExerciseOutput(out, batch.cases[batch.index].expected, err);
    const completed = batch.index + 1;
    const passedCount = batch.passed + Number(passed);
    const total = batch.cases.length;
    setTestProgress({ completed, passed: passedCount, total });

    if (completed >= total) {
      testBatchRef.current = null;
      const result = { allPassed: passedCount === total, passed: passedCount, total };
      setTestResult(result);
      setIsTesting(false);
      onTestsCompleteRef.current?.(result);
      revealOutput();
      return;
    }

    testBatchRef.current = { ...batch, index: completed, passed: passedCount };
  }, [revealOutput]);

  const onWorkerStatusChange = useCallback((status: 'idle' | 'loading' | 'ready' | 'error') => {
    if (status === 'error') revealOutput();
  }, [revealOutput]);

  const {
    workerState,
    output,
    error,
    turtleCommands,
    isRunning,
    createWorker,
    runCode: runWorkerCode,
    stopWorker,
    sandboxFrameRef,
    handleSandboxFrameLoad,
    handleSandboxFrameError,
  } = usePythonWorker({
    onStatusChange: onWorkerStatusChange,
    onOutput: onWorkerOutput,
  });

  const applyEditorTheme = useCallback((monaco: Monaco) => {
    const styles = getComputedStyle(document.documentElement);
    const readColor = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;

    monaco.editor.defineTheme('python-desde-cero', {
      base: resolvedTheme === 'dark' ? 'vs-dark' : 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '72816F', fontStyle: 'italic' },
        { token: 'keyword', foreground: resolvedTheme === 'dark' ? '8AB4F8' : '294936', fontStyle: 'bold' },
        { token: 'string', foreground: resolvedTheme === 'dark' ? 'A5D6A7' : '8A4B27' },
        { token: 'number', foreground: resolvedTheme === 'dark' ? 'D7A8F7' : '8054A1' },
        { token: 'type.identifier', foreground: resolvedTheme === 'dark' ? '80CBC4' : '356B70' },
      ],
      colors: {
        'editor.background': readColor('--theme-code-bg', '#ebe9df'),
        'editor.foreground': readColor('--theme-ink', '#252b25'),
        'editorLineNumber.foreground': readColor('--theme-muted', '#596259'),
        'editorLineNumber.activeForeground': readColor('--theme-accent', '#294936'),
        'editorCursor.foreground': readColor('--theme-accent', '#294936'),
        'editor.selectionBackground': readColor('--theme-accent-light', '#dce5d8'),
        'editor.inactiveSelectionBackground': readColor('--theme-bg-secondary', '#ebe9df'),
        'editor.lineHighlightBackground': readColor('--theme-bg-secondary', '#ebe9df'),
        'editorGutter.background': readColor('--theme-code-bg', '#ebe9df'),
        'editorWidget.background': readColor('--theme-surface', '#ffffff'),
        'editorWidget.border': readColor('--theme-border', '#9c865e'),
        'editorSuggestWidget.background': readColor('--theme-surface', '#ffffff'),
        'editorSuggestWidget.foreground': readColor('--theme-ink', '#252b25'),
        'editorSuggestWidget.selectedBackground': readColor('--theme-bg-secondary', '#ebe9df'),
      },
    });
    monaco.editor.setTheme('python-desde-cero');
  }, [resolvedTheme]);

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    const frame = window.requestAnimationFrame(() => applyEditorTheme(monaco));
    return () => window.cancelAnimationFrame(frame);
  }, [applyEditorTheme]);

  const needsInput = /\binput\s*\(/.test(code);
  const usesTurtle = /\b(?:import\s+turtle|from\s+turtle\s+import)\b/.test(code);
  const runCode = useCallback(() => {
    if (isRunning || testBatchRef.current) return;
    if (tests?.length) {
      const cases = tests.map((test) => ({ input: [...test.input], expected: test.expected }));
      testBatchRef.current = { code, cases, index: 0, passed: 0 };
      setTestProgress({ completed: 0, passed: 0, total: cases.length });
      setTestResult(null);
      setIsTesting(true);
      onTestsCompleteRef.current?.({ allPassed: false, passed: 0, total: cases.length });
      runWorkerCode(code, cases[0].input);
      return;
    }
    const workerInput = input === '' ? [] : input.split(/\r?\n/).slice(0, 20);
    runWorkerCode(code, workerInput);
  }, [code, input, isRunning, runWorkerCode, tests]);

  useEffect(() => {
    const batch = testBatchRef.current;
    if (!batch || workerState !== 'ready' || isRunning) return;
    runWorkerCode(batch.code, batch.cases[batch.index].input);
  }, [isRunning, runWorkerCode, testProgress, workerState]);

  useEffect(() => {
    if (workerState !== 'error') return;
    const batch = testBatchRef.current;
    if (!batch) return;
    testBatchRef.current = null;
    const result = { allPassed: false, passed: testProgress?.passed ?? 0, total: batch.cases.length };
    setTestResult(result);
    setIsTesting(false);
    onTestsCompleteRef.current?.(result);
  }, [testProgress, workerState]);

  const invalidateTests = useCallback(() => {
    if (!tests?.length) return;
    testBatchRef.current = null;
    setTestProgress(null);
    setTestResult(null);
    setIsTesting(false);
    onTestsCompleteRef.current?.({ allPassed: false, passed: 0, total: tests.length });
  }, [tests]);

  const cancelExecution = useCallback(() => {
    if (testBatchRef.current && tests?.length) {
      testBatchRef.current = null;
      setTestProgress(null);
      setIsTesting(false);
      const result = { allPassed: false, passed: testResult?.passed ?? 0, total: tests.length };
      setTestResult(result);
      onTestsCompleteRef.current?.(result);
    }
    stopWorker();
  }, [stopWorker, testResult?.passed, tests]);

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
    <section className="w-full space-y-6" aria-label="Laboratorio de Python">
      <iframe
        ref={sandboxFrameRef}
        onLoad={handleSandboxFrameLoad}
        onError={handleSandboxFrameError}
        title={RUNNER_FRAME_TITLE}
        aria-hidden="true"
        tabIndex={-1}
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
        loading="eager"
        className="pointer-events-none absolute -left-[10000px] top-0 h-px w-px overflow-hidden border-0 opacity-0"
      />
      <section aria-labelledby="python-lab-guide" className="border-l-2 border-[var(--theme-border-dark)] bg-[var(--theme-bg-secondary)] p-4 sm:p-5">
        <p className="text-[0.68rem] font-bold tracking-[0.14em] text-[var(--theme-accent)]">LABORATORIO · EN TRES PASOS</p>
        <h2 id="python-lab-guide" className="mt-1 font-serif text-xl text-[var(--theme-ink)]">Prueba tu código</h2>
        <ol className="mt-3 grid gap-2 text-sm leading-5 sm:grid-cols-3">
          <li className="flex items-start gap-2">
            <span className="font-mono font-bold text-[var(--theme-accent)]">01</span>
            <span><strong className="block text-[var(--theme-ink)]">Escribe</strong><span className="text-[var(--theme-muted)]">Edita el ejemplo en el cuadro de código.</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono font-bold text-[var(--theme-accent)]">02</span>
            <span><strong className="block text-[var(--theme-ink)]">Ejecuta</strong><span className="text-[var(--theme-muted)]">Pulsa el botón que aparece debajo del editor.</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono font-bold text-[var(--theme-accent)]">03</span>
            <span><strong className="block text-[var(--theme-ink)]">Revisa</strong><span className="text-[var(--theme-muted)]">El resultado aparece justo después.</span></span>
          </li>
        </ol>
        <details className="mt-3 border-t border-[var(--theme-border)] pt-3">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-[var(--theme-accent)]">Ver indicaciones de esta actividad</summary>
          <p className="pb-2 text-sm leading-6 text-[var(--theme-muted)]">{instructions}</p>
        </details>
      </section>

      <section aria-labelledby="python-editor-title" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="python-editor-title" className="font-serif text-xl text-[var(--theme-ink)]">Tu código Python</h2>
          <span className="text-xs text-[var(--theme-muted)]">Puedes modificar el ejemplo</span>
        </div>

        {workerState !== 'ready' ? (
          <p role="status" aria-live="polite" className="flex min-h-11 items-center gap-2 text-sm text-[var(--theme-muted)]">
            {workerState === 'loading' && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--theme-border)] border-t-[var(--theme-accent)] motion-reduce:animate-none" />}
            {workerState === 'idle'
              ? 'Python se prepara al ejecutar tu primer programa. La primera carga puede tardar un poco.'
              : workerState === 'loading'
                ? 'Preparando Python en este dispositivo…'
                : 'No se pudo iniciar Python. Revisa el resultado y vuelve a intentar.'}
          </p>
        ) : (
          <p role="status" className="text-xs text-[var(--theme-muted)]">Python está listo y se ejecuta en este dispositivo.</p>
        )}

        <div data-testid="python-editor-frame" className="h-[min(52svh,460px)] min-h-[280px] w-full overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-code-bg)] sm:h-[460px]">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="python-desde-cero"
            onMount={(editorInstance, monaco) => {
              editorRef.current = editorInstance;
              monacoRef.current = monaco;
              applyEditorTheme(monaco);
            }}
            value={code}
            onChange={(value) => { setCode(value ?? ''); invalidateTests(); }}
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

        <div className="space-y-2 md:hidden">
          <p className="text-xs font-semibold text-[var(--theme-muted)]">Atajos para escribir en la pantalla táctil</p>
          <div aria-label="Teclas de Python para pantalla táctil" className="grid grid-cols-4 gap-2">
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
                className="flex min-h-11 min-w-0 items-center justify-center border border-[var(--theme-border)] bg-[var(--theme-surface)] px-1 font-mono text-sm text-[var(--theme-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
              >
                {key.label}
              </button>
            ))}
          </div>
        </div>

        {needsInput && !tests?.length && (
          <label className="block text-sm font-semibold text-[var(--theme-ink)]">
            Datos que pide tu programa con input()
            <span className="mt-1 block text-xs font-normal leading-5 text-[var(--theme-muted)]">Escribe una respuesta por línea y luego ejecuta el código.</span>
            <textarea
              value={input}
              onChange={(event) => { setInput(event.target.value); invalidateTests(); }}
              maxLength={10000}
              rows={3}
              placeholder="Escribe aquí las respuestas"
              className="mt-2 block min-h-24 w-full resize-y border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 font-mono text-base font-normal text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]"
            />
          </label>
        )}

        <div className="grid gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            data-testid="python-run"
            onClick={runCode}
            disabled={isRunning || isTesting || workerState === 'loading'}
            className="flex min-h-12 w-full items-center justify-center bg-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isTesting
              ? 'Comprobando ejercicio…'
              : isRunning && workerState === 'loading'
                ? 'Preparando Python…'
                : isRunning
                  ? 'Ejecutando…'
                  : tests?.length
                    ? 'Comprobar ejercicio'
                    : 'Ejecutar código'}
          </button>

          {isRunning && (
            <button
              type="button"
              onClick={cancelExecution}
              className="flex min-h-12 w-full items-center justify-center border border-[var(--theme-border-dark)] px-5 py-3 text-base font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-border-dark)] sm:w-auto"
            >
              Detener ejecución
            </button>
          )}

          {workerState === 'error' && (
            <button
              type="button"
              onClick={() => {
                stopWorker();
                createWorker();
              }}
              className="flex min-h-12 w-full items-center justify-center border border-[var(--theme-accent)] px-4 py-3 text-sm font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] sm:w-auto"
            >
              Reintentar carga de Python
            </button>
          )}
        </div>
      </section>

      <section
        ref={outputRef}
        id="practice-panel-output"
        data-testid="python-output"
        aria-labelledby="python-output-title"
        tabIndex={-1}
        className="scroll-mt-4 space-y-3 border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="python-output-title" className="font-serif text-xl text-[var(--theme-ink)]">{tests?.length ? 'Resultado de tu ejercicio' : 'Resultado del programa'}</h2>
          <span className="text-xs text-[var(--theme-muted)]">{isRunning ? 'Ejecución en curso' : workerState === 'ready' ? 'Entorno Python listo' : 'Esperando la primera ejecución'}</span>
        </div>
        <pre
          aria-live="polite"
          aria-atomic="true"
          className="max-h-[42svh] min-h-32 overflow-auto whitespace-pre-wrap break-words border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] p-4 font-mono text-sm leading-6 text-[var(--theme-ink)] sm:max-h-64"
        >
          {error
            ? 'Error de ejecución: ' + error
            : output || (workerState === 'ready'
              ? '> Entorno listo. Ejecuta tu programa para ver el resultado.'
              : workerState === 'idle'
                ? '> El resultado aparecerá aquí después de ejecutar el código.'
                : '> Preparando el entorno Python…')}
        </pre>
        {tests?.length ? (
          <p role="status" aria-live="polite" className="text-sm text-[var(--theme-muted)]">
            {testResult
              ? testResult.allPassed
                ? 'Ejercicio superado: ' + testResult.passed + ' de ' + testResult.total + ' pruebas correctas.'
                : 'Resultado: ' + testResult.passed + ' de ' + testResult.total + ' pruebas correctas. Ajusta el código e inténtalo de nuevo.'
              : testProgress
                ? testProgress.completed < testProgress.total
                  ? 'Comprobando prueba ' + (testProgress.completed + 1) + ' de ' + testProgress.total + '…'
                  : 'Pruebas revisadas: ' + testProgress.completed + ' de ' + testProgress.total + '.'
                : 'Pulsa «Comprobar ejercicio» para revisar tu respuesta.'}
          </p>
        ) : null}
      </section>

      {usesTurtle && (
      <div
        id="practice-panel-turtle"
        aria-labelledby="python-turtle-title"
        data-testid="python-turtle-output"
        className="mt-6 space-y-3"
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 id="python-turtle-title" className="text-sm font-semibold text-[var(--theme-ink)]">Gráficos de Turtle</h2>
          <span className="text-xs text-[var(--theme-muted)]">{turtleCommands.length > 0 ? `${turtleCommands.length} trazo(s) dibujado(s)` : 'Ejecuta código con Turtle para ver el dibujo'}</span>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[200px] max-h-[600px] overflow-auto border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] rounded-lg">
          {turtleCommands.length === 0 ? (
            <p className="text-sm text-[var(--theme-muted)] py-4">
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
                }
                if (cmd.type === 'bgcolor') {
                  return (
                    <rect
                      key={`turtle-bgcolor-${idx}`}
                      x="-250"
                      y="-250"
                      width="500"
                      height="500"
                      fill={cmd.color ?? 'white'}
                    />
                  );
                }
                if (cmd.type === 'cursor') {
                  return (
                    <g
                      data-turtle-cursor="true"
                      key={`turtle-cursor-${idx}`}
                      transform={`translate(${cmd.x ?? 0} ${-(cmd.y ?? 0)}) rotate(${-(cmd.heading ?? 0)})`}
                    >
                      {cmd.shape === 'turtle' ? (
                        <>
                          <ellipse cx="0" cy="0" rx="8" ry="5.5" fill={cmd.color ?? 'blue'} stroke="#17251d" strokeWidth="1" />
                          <circle cx="10" cy="0" r="3.5" fill="#76a85d" stroke="#17251d" strokeWidth="0.8" />
                          <circle cx="-5" cy="-6" r="2.7" fill="#76a85d" />
                          <circle cx="4" cy="-6" r="2.7" fill="#76a85d" />
                          <circle cx="-5" cy="6" r="2.7" fill="#76a85d" />
                          <circle cx="4" cy="6" r="2.7" fill="#76a85d" />
                          <path d="M-9 0 L-13 0" stroke="#17251d" strokeWidth="2" strokeLinecap="round" />
                        </>
                      ) : (
                        <path d="M12 0 L-8 -6 L-5 0 L-8 6 Z" fill={cmd.color ?? 'blue'} stroke="#17251d" strokeWidth="1" />
                      )}
                    </g>
                  );
                }
                return null;
              })}
            </svg>
          )}
        </div>
      </div>
      )}
    </section>
  );
}
