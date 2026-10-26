'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, LogOut } from 'lucide-react';
import { logout } from '@/app/login/actions';
import { createClient } from '@/lib/supabase/client';
import type { CourseLesson } from '@/lib/course';
import { gradeQuiz } from '@/lib/course-grading';

type Props = {
  lesson: CourseLesson;
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
  const supabase = useMemo(() => createClient(), []);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ReturnType<typeof gradeQuiz> | null>(null);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(initialCompleted);
  const [savedScore, setSavedScore] = useState(initialScore);
  const [sessionValid, setSessionValid] = useState(true);
  const authGenerationRef = useRef(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const generation = ++authGenerationRef.current;
        const matchesExpectedUser = session?.user.id === expectedUserId;
        setSessionValid(matchesExpectedUser);
        if (!matchesExpectedUser) {
          setCompleted(false);
          setSavedScore(0);
          setFeedback('La sesión cambió. Vuelve a iniciar sesión para guardar tu avance.');
          return;
        }

        Promise.resolve().then(async () => {
          const { data, error } = await supabase
            .from('progress')
            .select('is_completed, best_score')
            .eq('user_id', expectedUserId)
            .eq('module_id', moduleId)
            .eq('lesson_id', lesson.id)
            .maybeSingle();

          if (generation !== authGenerationRef.current) return;
          if (error) {
            setFeedback('No se pudo volver a consultar el progreso de esta cuenta.');
            return;
          }

          setCompleted(data?.is_completed === true);
          setSavedScore(Number(data?.best_score ?? 0));
        });
      },
    );

    return () => {
      authGenerationRef.current += 1;
      subscription.unsubscribe();
    };
  }, [expectedUserId, lesson.id, moduleId, supabase]);

  async function submitQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !sessionValid) return;

    if (lesson.questions.some((_question, index) => answers[index] === undefined)) {
      setFeedback('Responde todas las preguntas antes de comprobar la evaluación.');
      return;
    }

    const answerList = lesson.questions.map((_question, index) => answers[index]);
    const grade = gradeQuiz(lesson.questions, answerList);
    setResult(grade);

    if (!grade.passed) {
      setFeedback('Aún no alcanzas el puntaje necesario. Revisa la retroalimentación y vuelve a intentarlo.');
      return;
    }

    setSaving(true);
    setFeedback('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || user.id !== expectedUserId) {
        setSessionValid(false);
        setCompleted(false);
        setFeedback('No se pudo confirmar tu sesión. Inicia sesión de nuevo para guardar el resultado.');
        return;
      }

      const { error } = await supabase
        .from('progress')
        .upsert(
          {
            user_id: user.id,
            module_id: moduleId,
            lesson_id: lesson.id,
            is_completed: true,
            best_score: Math.max(initialScore, grade.score),
            last_attempt: new Date().toISOString(),
          },
          { onConflict: 'user_id,module_id,lesson_id' },
        );

      if (error) {
        setFeedback('Tus respuestas son correctas, pero no se pudo guardar el progreso. Inténtalo de nuevo.');
        return;
      }

      setCompleted(true);
      setSavedScore(Math.max(initialScore, grade.score));
      setFeedback('Evaluación aprobada y progreso guardado en tu cuenta.');
    } catch {
      setFeedback('No se pudo guardar el progreso por un error de conexión. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f2e9] text-[#252b25]">
      <header className="border-b border-[#d3d3c7]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/academia" className="inline-flex min-h-11 items-center font-serif text-lg font-semibold text-[#294936]">Python desde cero</Link>
          <nav aria-label="Navegación de la lección" className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/practica" className="inline-flex min-h-11 items-center text-[#294936] underline underline-offset-4">Laboratorio</Link>
            <form action={logout}>
              <button type="submit" className="inline-flex min-h-11 items-center gap-2 text-[#596259] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#294936]">
                <LogOut aria-hidden="true" size={16} /> Cerrar sesión
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/academia" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#294936] underline underline-offset-4">
          <ArrowLeft aria-hidden="true" size={16} /> Ruta formativa
        </Link>

        <div className="mt-7 border-b border-[#d3d3c7] pb-7">
          <p className="text-xs font-bold tracking-[0.15em] text-[#294936]">MÓDULO {moduleNumber} · {lesson.section}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl">{lesson.title}</h1>
          <p className="mt-3 text-sm text-[#596259]">{moduleTitle}</p>
        </div>

        {progressUnavailable && (
          <p role="alert" className="mt-6 border-l-4 border-[#a04435] bg-white px-4 py-3 text-sm leading-6 text-[#7f3027]">
            No se pudo consultar el progreso anterior. La evaluación seguirá disponible y se intentará guardar al aprobarla.
          </p>
        )}
        {!sessionValid && (
          <p role="alert" className="mt-6 border-l-4 border-[#a04435] bg-white px-4 py-3 text-sm leading-6 text-[#7f3027]">
            Tu sesión ya no corresponde a esta cuenta. Vuelve a autenticarte antes de guardar.
          </p>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="min-w-0 space-y-8">
            <section aria-labelledby="objectives-title">
              <h2 id="objectives-title" className="font-serif text-2xl">Al terminar podrás</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[#596259]">
                {lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}
              </ul>
            </section>

            <section aria-labelledby="explanation-title" className="space-y-4">
              <h2 id="explanation-title" className="font-serif text-2xl">Conceptos clave</h2>
              {lesson.explanation.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-[#3f4940]">{paragraph}</p>
              ))}
            </section>

            <section aria-labelledby="example-title">
              <div className="border border-[#d3d3c7] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d3d3c7] px-4 py-3">
                  <h2 id="example-title" className="text-xs font-bold tracking-[0.12em] text-[#294936]">EJEMPLO EXPLICADO</h2>
                  <span className="text-xs text-[#596259]">Código didáctico original</span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-sm leading-7 text-[#203d31] sm:p-5"><code>{lesson.example}</code></pre>
              </div>
            </section>

            <section aria-labelledby="exercise-title" className="border-l-2 border-[#b7a77d] bg-[#ebe9df] p-5 sm:p-6">
              <h2 id="exercise-title" className="font-serif text-xl">Práctica sugerida</h2>
              <p className="mt-3 text-sm leading-7 text-[#3f4940]">{lesson.exercise}</p>
              <Link href="/practica" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#294936] underline underline-offset-4">Abrir el laboratorio</Link>
            </section>

            <section aria-labelledby="quiz-title">
              <div className="border-b border-[#d3d3c7] pb-4">
                <h2 id="quiz-title" className="font-serif text-2xl">{lesson.assessment ? 'Evaluación del módulo' : 'Comprueba lo aprendido'}</h2>
                <p className="mt-2 text-sm leading-6 text-[#596259]">
                  {lesson.assessment ? 'Necesitas al menos 75% para aprobar. Esta evaluación original es formativa y no sustituye una prueba oficial.' : 'Responde correctamente para registrar esta actividad como completada.'}
                </p>
              </div>

              <form onSubmit={submitQuiz} className="mt-5 space-y-7">
                {lesson.questions.map((question, questionIndex) => (
                  <fieldset key={question.prompt} className="space-y-3">
                    <legend className="font-semibold leading-6">
                      {lesson.questions.length > 1 ? `${questionIndex + 1}. ` : ''}{question.prompt}
                    </legend>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const id = `${lesson.id}-q${questionIndex}-a${optionIndex}`;
                        const isSelected = answers[questionIndex] === optionIndex;
                        const showWrong = result && isSelected && optionIndex !== question.answer;
                        const showCorrect = result && optionIndex === question.answer;

                        return (
                          <label key={option} htmlFor={id} className={`flex cursor-pointer items-start gap-3 border px-3 py-3 text-sm leading-6 ${showWrong ? 'border-[#a04435] bg-[#fff4f1]' : showCorrect ? 'border-[#294936] bg-[#e5ecdf]' : isSelected ? 'border-[#294936] bg-white' : 'border-[#d3d3c7] bg-white hover:bg-[#ebe9df]'}`}>
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
                              disabled={saving || !sessionValid}
                              className="mt-1 accent-[#294936]"
                            />
                            <span>{option}</span>
                          </label>
                        );
                      })}
                    </div>
                    {result && (
                      <p className="text-sm leading-6 text-[#596259]">{question.explanation}</p>
                    )}
                  </fieldset>
                ))}

                <button type="submit" disabled={saving || !sessionValid} className="min-h-12 bg-[#294936] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#203d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? 'Guardando resultado…' : 'Comprobar respuestas'}
                </button>
              </form>

              {result && (
                <div role="status" aria-live="polite" className={`mt-5 border-l-4 px-4 py-3 text-sm leading-6 ${result.passed ? 'border-[#294936] bg-[#e5ecdf] text-[#203d31]' : 'border-[#b7a77d] bg-[#ebe9df] text-[#3f4940]'}`}>
                  Resultado: {result.correct} de {result.total} · {result.score}%.
                  {result.passed && savedScore >= result.score && ` Mejor puntaje guardado: ${savedScore}%.`}
                  {feedback && <span className="mt-1 block">{feedback}</span>}
                </div>
              )}
              {!result && feedback && (
                <p role="status" aria-live="polite" className="mt-4 text-sm text-[#7f3027]">{feedback}</p>
              )}
              {completed && (
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#294936]">
                  <CheckCircle2 aria-hidden="true" size={18} /> Actividad completada en tu cuenta.
                </p>
              )}
            </section>

            <nav aria-label="Navegación entre lecciones" className="flex flex-wrap justify-between gap-4 border-t border-[#d3d3c7] pt-5">
              {previousHref ? (
                <Link href={previousHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#294936] underline underline-offset-4"><ArrowLeft aria-hidden="true" size={16} /> Lección anterior</Link>
              ) : <span />}
              {nextHref ? (
                <Link href={nextHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#294936] underline underline-offset-4">Siguiente lección <ArrowRight aria-hidden="true" size={16} /></Link>
              ) : <Link href="/academia" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#294936] underline underline-offset-4">Volver a la ruta <ArrowRight aria-hidden="true" size={16} /></Link>}
            </nav>
          </article>

          <aside className="h-fit border-t-2 border-[#294936] bg-[#ebe9df] p-5">
            <h2 className="font-serif text-xl">Tu avance</h2>
            <p className="mt-3 text-sm leading-6 text-[#596259]">
              {completed ? 'Esta actividad ya figura como completada.' : 'Aprueba la comprobación para guardar esta actividad.'}
            </p>
            {savedScore > 0 && (
              <p className="mt-3 text-sm font-semibold text-[#294936]">Mejor puntaje guardado: {savedScore}%</p>
            )}
            {progressUnavailable && <p className="mt-3 text-xs leading-5 text-[#7f3027]">No se logró leer el puntaje anterior.</p>}
            <Link href="/academia" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#294936] underline underline-offset-4">Ver todos los módulos</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
