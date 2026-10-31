'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, LogOut } from 'lucide-react';
import { logout } from '@/app/login/actions';
import type { ClientSafeLesson } from '@/lib/course-types';
import { submitQuiz, type SubmitQuizResult } from '@/lib/server-quiz/submit-quiz.action';
import PythonEditor from '@/components/PythonEditor';
import type { ExerciseTestResult } from '@/lib/exercise-output';
import { acquireSubmissionLock, releaseSubmissionLock } from '@/lib/submission-lock';
import { tramoDeLeccion } from '@/lib/orilla/catalog';

type Props = {
  lesson: ClientSafeLesson;
  moduleId: string;
  moduleNumber: string;
  moduleTitle: string;
  initialCompleted: boolean;
  initialScore: number;
  progressUnavailable: boolean;
  expectedUserId: string;
  previousHref: string | null;
  nextHref: string | null;
};

export default function LessonStudy({
  lesson,
  moduleId,
  moduleNumber,
  moduleTitle,
  initialCompleted,
  initialScore,
  progressUnavailable,
  expectedUserId,
  previousHref,
  nextHref,
}: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<SubmitQuizResult | null>(null);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const submissionLockRef = useRef(false);
  const [completed, setCompleted] = useState(initialCompleted);
  const [savedScore, setSavedScore] = useState(initialScore);
  const [projectTestsPassed, setProjectTestsPassed] = useState(false);

  const orillaTramo = tramoDeLeccion(lesson.id);
  const answersJson = JSON.stringify(
    lesson.questions.map((_q, index) => answers[index] ?? -1)
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (lesson.finalProject && !projectTestsPassed) {
      setFeedback(`Ejecuta el proyecto y supera las ${lesson.exercise.tests.length} pruebas automáticas antes de registrar su revisión.`);
      return;
    }

    if (lesson.questions.some((_question, index) => answers[index] === undefined)) {
      setFeedback('Responde todas las preguntas antes de comprobar la evaluación.');
      return;
    }

    // State updates are rendered asynchronously. A ref closes the same-tick
    // double-submit window so one click sequence can trigger only one RPC.
    if (!acquireSubmissionLock(submissionLockRef)) return;

    setSaving(true);
    setFeedback('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.set('moduleId', moduleId);
      formData.set('lessonId', lesson.id);
      formData.set('expectedUserId', expectedUserId);
      formData.set('answers', answersJson);

      const serverResult = await submitQuiz(null, formData);

      if (serverResult.error) {
        setFeedback(serverResult.error);
        return;
      }

      setResult(serverResult);

      if (serverResult.passed) {
        setCompleted(true);
        setSavedScore(Math.max(savedScore, serverResult.score));
        setFeedback(lesson.finalProject ? 'Pruebas locales superadas, revisión conceptual aprobada y progreso guardado.' : lesson.finalAssessment ? 'Examen final aprobado y progreso guardado en tu cuenta.' : 'Evaluación aprobada y progreso guardado en tu cuenta.');
      } else {
        setFeedback('Aún no alcanzas el puntaje necesario. Revisa la retroalimentación y vuelve a intentarlo.');
      }
    } catch {
      setFeedback('No se pudo guardar el progreso por un error de conexión. Inténtalo de nuevo.');
    } finally {
      releaseSubmissionLock(submissionLockRef);
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/academia" className="inline-flex min-h-11 items-center font-serif text-lg font-semibold text-[var(--theme-accent)]">Python desde cero</Link>
          <nav aria-label="Navegación de la lección" className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/practica" className="inline-flex min-h-11 items-center text-[var(--theme-accent)] underline underline-offset-4">Laboratorio</Link>
            <form action={logout}>
              <button type="submit" className="inline-flex min-h-11 items-center gap-2 text-[var(--theme-muted)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--theme-focus-ring)]">
                <LogOut aria-hidden="true" size={16} /> Cerrar sesión
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/academia" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">
          <ArrowLeft aria-hidden="true" size={16} /> Ruta formativa
        </Link>

        <div className="mt-7 border-b border-[var(--theme-border)] pb-7">
          <p className="text-xs font-bold tracking-[0.15em] text-[var(--theme-accent)]">MÓDULO {moduleNumber} · {lesson.section}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl">{lesson.title}</h1>
          <p className="mt-3 text-sm text-[var(--theme-muted)]">{moduleTitle}</p>
          {orillaTramo && <Link href={`/orilla/${orillaTramo}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">Practicar este concepto en Orilla <ArrowRight aria-hidden="true" className="ml-2" size={16} /></Link>}
        </div>

        {progressUnavailable && (
          <p role="alert" className="mt-6 border-l-4 border-[var(--theme-error)] bg-[var(--theme-surface)] px-4 py-3 text-sm leading-6 text-[var(--theme-error)]">
            No se pudo consultar el progreso anterior. La evaluación seguirá disponible y se intentará guardar al aprobarla.
          </p>
        )}
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="min-w-0 space-y-8">
            <section aria-labelledby="objectives-title">
              <h2 id="objectives-title" className="font-serif text-2xl">Al terminar podrás</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--theme-muted)]">
                {lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}
              </ul>
            </section>

            <section aria-labelledby="explanation-title" className="space-y-4">
              <h2 id="explanation-title" className="font-serif text-2xl">Conceptos clave</h2>
              {lesson.explanation.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-[var(--theme-muted)]">{paragraph}</p>
              ))}
            </section>

            <section aria-labelledby="example-title">
              <div className="border border-[var(--theme-border)] bg-[var(--theme-surface)]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--theme-border)] px-4 py-3">
                  <h2 id="example-title" className="text-xs font-bold tracking-[0.12em] text-[var(--theme-accent)]">EJEMPLO EXPLICADO</h2>
                  <span className="text-xs text-[var(--theme-muted)]">Código didáctico original</span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-sm leading-7 text-[var(--theme-accent-dark)] sm:p-5"><code>{lesson.example}</code></pre>
                <div className="border-t border-[var(--theme-border)] px-4 py-4 sm:px-5">
                  <h3 className="text-xs font-bold tracking-[0.12em] text-[var(--theme-muted)]">SALIDA ESPERADA</h3>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded bg-[var(--theme-bg-secondary)] p-3 font-mono text-sm leading-6 text-[var(--theme-ink)]">{lesson.exampleOutput}</pre>
                  <h3 className="mt-4 text-xs font-bold tracking-[0.12em] text-[var(--theme-muted)]">CÓMO FUNCIONA</h3>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--theme-muted)]">
                    {lesson.walkthrough.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                  <h3 className="mt-4 text-xs font-bold tracking-[0.12em] text-[var(--theme-muted)]">ERRORES FRECUENTES</h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--theme-muted)]">
                    {lesson.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            {!lesson.finalAssessment && (
              <section aria-labelledby="exercise-title" className="space-y-4">
                <div className="border-l-2 border-[var(--theme-border-dark)] bg-[var(--theme-bg-secondary)] p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 id="exercise-title" className="font-serif text-xl">{lesson.exercise.title}</h2>
                    <span className="text-xs font-semibold text-[var(--theme-muted)]">Nivel {lesson.exercise.difficulty} · {lesson.exercise.xp} XP · {lesson.estimatedMinutes} min</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--theme-muted)]">{lesson.exercise.statement}</p>
                  <h3 className="mt-4 text-xs font-bold tracking-[0.12em] text-[var(--theme-muted)]">PISTA</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--theme-muted)]">
                    {lesson.exercise.hints.map((hint) => <li key={hint}>{hint}</li>)}
                  </ul>
                  {lesson.exercise.tests[0]?.expected && (
                    <details className="mt-4 border-t border-[var(--theme-border)] pt-3">
                      <summary className="min-h-10 cursor-pointer text-sm font-semibold text-[var(--theme-accent)]">Ver salida esperada cuando termines tu intento</summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded bg-[var(--theme-surface)] p-3 font-mono text-sm leading-6">{lesson.exercise.tests[0].expected}</pre>
                      <p className="mt-2 text-xs leading-5 text-[var(--theme-muted)]">Compara tu ejecución con este resultado. La evaluación conceptual se comprueba y guarda por separado.</p>
                    </details>
                  )}
                </div>
                <PythonEditor
                  defaultCode={lesson.exercise.starterCode || lesson.example}
                  instructions={lesson.exercise.statement}
                  tests={lesson.exercise.tests}
                  onTestsComplete={lesson.finalProject ? (testResult: ExerciseTestResult) => setProjectTestsPassed(testResult.allPassed) : undefined}
                />
                <Link href="/practica" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">Abrir el laboratorio completo</Link>
              </section>
            )}

            <section aria-labelledby="quiz-title">
              <div className="border-b border-[var(--theme-border)] pb-4">
                <h2 id="quiz-title" className="font-serif text-2xl">{lesson.finalAssessment ? 'Examen final PE1' : lesson.finalProject ? 'Revisión del proyecto final' : lesson.assessment ? 'Evaluación del módulo' : 'Comprueba lo aprendido'}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
                  {lesson.finalAssessment ? 'Este examen integra los cuatro módulos. Necesitas al menos 75% para aprobar. Es una evaluación formativa y no sustituye una certificación externa.' : lesson.finalProject ? `La revisión conceptual se habilita cuando las ${lesson.exercise.tests.length} pruebas locales del proyecto pasan. Necesitas al menos 75% para registrar la actividad.` : lesson.assessment ? 'Necesitas al menos 75% para aprobar. Esta evaluación original es formativa y no sustituye una prueba oficial.' : 'Responde correctamente para registrar esta actividad como completada.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-7">
                {lesson.questions.map((question, questionIndex) => (
                  <fieldset key={question.prompt} className="space-y-3">
                    <legend className="font-semibold leading-6">
                      {lesson.questions.length > 1 ? `${questionIndex + 1}. ` : ''}{question.prompt}
                    </legend>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const id = `${lesson.id}-q${questionIndex}-a${optionIndex}`;
                        const isSelected = answers[questionIndex] === optionIndex;

                        return (
                          <label key={option} htmlFor={id} className={`flex cursor-pointer items-start gap-3 border px-3 py-3 text-sm leading-6 ${isSelected ? 'border-[var(--theme-accent)] bg-[var(--theme-surface)]' : 'border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-bg-secondary)]'}`}>
                            <input
                              id={id}
                              type="radio"
                              name={`${lesson.id}-question-${questionIndex}`}
                              value={optionIndex}
                              checked={isSelected}
                              onChange={() => {
                                setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
                                setResult(null);
                                setFeedback('');
                              }}
                              disabled={saving}
                              className="mt-1 accent-[#294936]"
                            />
                            <span>{option}</span>
                          </label>
                        );
                      })}
                    </div>
                    {result && (
                      <p className="text-sm leading-6 text-[var(--theme-muted)]">
                        {result.explanations[questionIndex]}
                      </p>
                    )}
                  </fieldset>
                ))}

                <button type="submit" disabled={saving} className="min-h-12 bg-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? 'Guardando resultado…' : 'Comprobar respuestas'}
                </button>
              </form>

              {result && (
                <div role="status" aria-live="polite" className={`mt-5 border-l-4 px-4 py-3 text-sm leading-6 ${result.passed ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-light)] text-[var(--theme-accent-dark)]' : 'border-[var(--theme-border-dark)] bg-[var(--theme-bg-secondary)] text-[var(--theme-muted)]'}`}>
                  Resultado: {result.correct} de {result.total} · {result.score}%.
                  {result.passed && savedScore >= result.score && ` Mejor puntaje guardado: ${savedScore}%.`}
                  {feedback && <span className="mt-1 block">{feedback}</span>}
                </div>
              )}
              {!result && feedback && (
                <p role="status" aria-live="polite" className="mt-4 text-sm text-[var(--theme-error)]">{feedback}</p>
              )}
              {completed && (
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-accent)]">
                  <CheckCircle2 aria-hidden="true" size={18} /> Actividad completada en tu cuenta.
                </p>
              )}
            </section>

            <nav aria-label="Navegación entre lecciones" className="flex flex-wrap justify-between gap-4 border-t border-[var(--theme-border)] pt-5">
              {previousHref ? (
                <Link href={previousHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4"><ArrowLeft aria-hidden="true" size={16} /> Lección anterior</Link>
              ) : <span />}
              {nextHref ? (
                completed ? (
                  <Link href={nextHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">Siguiente lección <ArrowRight aria-hidden="true" size={16} /></Link>
                ) : (
                  <span className="inline-flex min-h-11 items-center text-right text-xs text-[var(--theme-muted)]" aria-disabled="true">
                    Aprueba esta lección para desbloquear la siguiente.
                  </span>
                )
              ) : <Link href="/academia" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">Volver a la ruta <ArrowRight aria-hidden="true" size={16} /></Link>}
            </nav>
          </article>

          <aside className="h-fit border-t-2 border-[var(--theme-accent)] bg-[var(--theme-bg-secondary)] p-5">
            <h2 className="font-serif text-xl">Tu avance</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
              {completed ? 'Esta actividad ya figura como completada.' : 'Aprueba la comprobación para guardar esta actividad.'}
            </p>
            {savedScore > 0 && (
              <p className="mt-3 text-sm font-semibold text-[var(--theme-accent)]">Mejor puntaje guardado: {savedScore}%</p>
            )}
            {progressUnavailable && <p className="mt-3 text-xs leading-5 text-[var(--theme-error)]">No se logró leer el puntaje anterior.</p>}
            <Link href="/academia" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">Ver todos los módulos</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
