'use client';

import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { usePythonWorker, type PythonTestCase } from '@/lib/use-python-worker';

if (typeof window !== 'undefined' && !window.MonacoEnvironment) {
  window.MonacoEnvironment = { baseUrl: '/monaco/vs/' };
}

export type PythonEditorExercise = {
  id: string;
  title: string;
  statement: string;
  hints: string[];
  tests: PythonTestCase[];
  difficulty: 'facil' | 'medio' | 'dificil';
};

type Props = {
  defaultCode: string;
  instructions: string;
  storageKey?: string;
  exercise?: PythonEditorExercise;
};

export default function PythonEditor({
  defaultCode,
  instructions,
  storageKey = 'python-desde-cero:free-practice',
  exercise,
}: Props) {
  const [code, setCode] = useState(defaultCode);
  const [input, setInput] = useState('');
  const [loadedKey, setLoadedKey] = useState('');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const {
    workerState, output, error, turtleCommands, testResults, isRunning,
    createWorker, runCode, runTests, stopWorker, clearTurtle,
  } = usePythonWorker();

  useEffect(() => {
    setLoadedKey('');
    try {
      const saved = window.localStorage.getItem(storageKey);
      setCode(saved ?? defaultCode);
    } catch {
      setCode(defaultCode);
    }
    setLoadedKey(storageKey);
  }, [defaultCode, storageKey]);

  useEffect(() => {
    if (loadedKey !== storageKey) return;
    try {
      window.localStorage.setItem(storageKey, code);
    } catch {
      // Storage may be unavailable in private or restricted browsing modes.
    }
  }, [code, loadedKey, storageKey]);

  function execute() {
    runCode(code, input === '' ? [] : input.split(/\r?\n/).slice(0, 20));
  }

  function checkExercise() {
    if (!exercise || isRunning) return;
    runTests(code, exercise.tests);
  }

  function resetCode() {
    setCode(defaultCode);
    setInput('');
    editorRef.current?.setValue(defaultCode);
  }

  const inputClass = 'mt-2 block min-h-20 w-full resize-y border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 font-mono text-sm text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]';

  return (
    <section className="w-full space-y-6" aria-label="Laboratorio de Python">
      <div className="border-l-2 border-[var(--theme-accent)] bg-[var(--theme-bg-secondary)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-xl">{exercise?.title ?? 'Espacio de código'}</h2>
          <span className="text-xs text-[var(--theme-muted)]">
            {exercise ? `Nivel ${exercise.difficulty}` : 'Práctica libre'}
          </span>
        </div>
        <p className="mt-2 text-sm leading-7 text-[var(--theme-muted)]">{exercise?.statement ?? instructions}</p>
        {exercise && exercise.hints.length > 0 && (
          <details className="mt-3 text-sm">
            <summary className="min-h-10 cursor-pointer font-semibold text-[var(--theme-accent)]">Ver pistas</summary>
            <ul className="list-disc space-y-1 pl-5 pt-2 text-[var(--theme-muted)]">
              {exercise.hints.map((hint) => <li key={hint}>{hint}</li>)}
            </ul>
          </details>
        )}
      </div>

      <div className="overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--theme-border)] px-3 py-2">
          <span className="text-xs font-semibold text-[var(--theme-muted)]">EDITOR · PYTHON</span>
          <span className="text-xs text-[var(--theme-muted)]">
            {workerState === 'ready' ? 'Python preparado' : workerState === 'loading' ? 'Preparando Python…' : workerState === 'error' ? 'Necesita reinicio' : 'Carga al ejecutar'}
          </span>
        </div>
        <div className="h-[min(55svh,540px)] min-h-[300px] w-full">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs"
            value={code}
            onMount={(instance) => { editorRef.current = instance; }}
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
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={execute} disabled={isRunning} className="min-h-12 bg-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-[var(--theme-ink-inverse)] hover:bg-[var(--theme-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50">
          {isRunning ? 'Ejecutando…' : 'Ejecutar código'}
        </button>
        {exercise && (
          <button type="button" onClick={checkExercise} disabled={isRunning} className="min-h-12 border border-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50">
            {isRunning ? 'Comprobando…' : 'Comprobar ejercicio'}
          </button>
        )}
        <button type="button" onClick={resetCode} disabled={isRunning} className="min-h-12 border border-[var(--theme-border)] px-4 py-3 text-sm font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-bg-secondary)] disabled:opacity-50">
          Restaurar código inicial
        </button>
        {workerState === 'error' && (
          <button type="button" onClick={() => { stopWorker(); createWorker(); }} className="min-h-12 border border-[var(--theme-accent)] px-4 py-3 text-sm font-semibold text-[var(--theme-accent)]">
            Volver a cargar Python
          </button>
        )}
      </div>

      <p className="text-xs leading-5 text-[var(--theme-muted)]">
        El código se guarda automáticamente en este navegador. Ejecutar y comprobar ejercicios ocurre localmente; aprobar la evaluación de la lección es lo que registra el avance de la academia.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="python-input" className="block text-sm font-semibold text-[var(--theme-ink)]">
            Datos para input() <span className="font-normal text-[var(--theme-muted)]">(una línea por entrada)</span>
          </label>
          <textarea id="python-input" value={input} onChange={(event) => setInput(event.target.value)} maxLength={10000} rows={3} placeholder="Por ejemplo: Ana&#10;25" className={inputClass} />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[var(--theme-ink)]">Salida de Python</h3>
            {isRunning && <span className="text-xs text-[var(--theme-muted)]">En ejecución…</span>}
          </div>
          <pre aria-live="polite" className="min-h-28 max-h-64 overflow-auto whitespace-pre-wrap break-words border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] p-4 font-mono text-sm leading-6 text-[var(--theme-ink)]">
            {error ? `${output}${output ? '\n' : ''}Error: ${error}` : output || 'La salida aparecerá aquí cuando ejecutes el programa.'}
          </pre>
        </div>
      </div>

      {exercise && testResults.length > 0 && (
        <section aria-live="polite" className="border border-[var(--theme-border)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-[var(--theme-ink)]">Pruebas del ejercicio</h3>
            <span className="text-sm text-[var(--theme-muted)]">{testResults.filter((test) => test.passed).length} / {testResults.length} superadas</span>
          </div>
          <ol className="mt-3 space-y-3">
            {testResults.map((test) => (
              <li key={test.index} className="border-t border-[var(--theme-border)] pt-3 text-sm">
                <p className={test.passed ? 'font-semibold text-[var(--theme-accent)]' : 'font-semibold text-[var(--theme-error)]'}>
                  {test.passed ? 'Correcta' : 'Revisar'} · Prueba {test.index}
                </p>
                <p className="mt-1 text-[var(--theme-muted)]">Esperado: <code className="font-mono">{test.expected || '(sin salida)'}</code></p>
                <p className="mt-1 text-[var(--theme-muted)]">Obtenido: <code className="font-mono">{test.actual || '(sin salida)'}</code></p>
                {test.error && <p className="mt-1 text-[var(--theme-error)]">{test.error}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-[var(--theme-ink)]">Gráficos con Turtle</h3>
          <button type="button" onClick={clearTurtle} disabled={turtleCommands.length === 0} className="min-h-10 text-xs font-semibold text-[var(--theme-accent)] underline underline-offset-4 disabled:opacity-50">
            Limpiar gráfico
          </button>
        </div>
        <p className="mt-1 text-xs text-[var(--theme-muted)]">Los dibujos aparecen aquí después de ejecutar código que use Turtle.</p>
        <div className="mt-3 flex min-h-48 max-h-[600px] items-center justify-center overflow-auto border border-[var(--theme-border)] bg-white">
          {turtleCommands.length === 0 ? (
            <span className="px-4 py-8 text-sm text-[var(--theme-muted)]">Aún no hay trazos que mostrar.</span>
          ) : (
            <svg className="max-h-[500px] w-full max-w-[600px]" viewBox="-250 -250 500 500" preserveAspectRatio="xMidYMid meet">
              {turtleCommands.map((command, index) => {
                if (command.type === 'line') return <line key={index} x1={command.x1 ?? 0} y1={-(command.y1 ?? 0)} x2={command.x2 ?? 0} y2={-(command.y2 ?? 0)} stroke={command.color ?? 'black'} strokeWidth={command.size ?? 1} strokeLinecap="round" />;
                if (command.type === 'dot') return <circle key={index} cx={command.x ?? 0} cy={-(command.y ?? 0)} r={(command.size ?? 2) / 2} fill={command.color ?? 'black'} />;
                if (command.type === 'fill') return <polygon key={index} points={command.points?.map(([x, y]) => `${x},${-y}`).join(' ') ?? ''} fill={command.color ?? 'black'} fillOpacity="0.6" />;
                if (command.type === 'write') return <text key={index} x={command.x ?? 0} y={-(command.y ?? 0)} fill={command.color ?? 'black'} fontSize={12} fontFamily="monospace">{command.text}</text>;
                if (command.type === 'bgcolor') return <rect key={index} x="-250" y="-250" width="500" height="500" fill={command.color ?? 'white'} />;
                return null;
              })}
            </svg>
          )}
        </div>
      </section>
    </section>
  );
}
