import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PythonEditor from '@/components/PythonEditor';
import { courseModules } from '@/lib/course';
import { toPublicSampleLesson } from '@/lib/server-quiz/public-sample';

export const metadata: Metadata = {
  title: 'Prueba la primera lección',
  description:
    'Lee una lección real de Python, modifica el ejercicio y ejecuta tu código en el navegador, sin crear una cuenta.',
  alternates: { canonical: '/muestra' },
};

export default function PublicLessonPreviewPage() {
  const firstLesson = courseModules[0]?.lessons.find((lesson) => lesson.id === 'b1-l1');
  if (!firstLesson) notFound();

  const lesson = toPublicSampleLesson(firstLesson);

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <div className="mx-auto flex min-h-16 max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <Link href="/" className="inline-flex min-h-11 items-center font-serif text-lg font-semibold text-[var(--theme-accent)]">
            Python desde cero
          </Link>
          <Link href="/login" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">
            Iniciar sesión
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm text-[var(--theme-muted)] underline underline-offset-4">
          ← Volver al inicio
        </Link>

        <div className="mt-6 max-w-3xl border-b border-[var(--theme-border)] pb-7">
          <p className="text-xs font-bold tracking-[0.15em] text-[var(--theme-accent)]">
            MUESTRA ABIERTA · MÓDULO 1 · LECCIÓN {lesson.section}
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--theme-muted)] sm:text-base">
            Esta es una lección real del recorrido. Puedes leerla, modificar el ejercicio y ejecutar Python en este dispositivo sin crear una cuenta.
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="min-w-0 space-y-8">
            <section aria-labelledby="preview-objectives">
              <h2 id="preview-objectives" className="font-serif text-2xl">Al terminar podrás</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--theme-muted)]">
                {lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}
              </ul>
            </section>

            <section aria-labelledby="preview-concepts" className="space-y-4">
              <h2 id="preview-concepts" className="font-serif text-2xl">Conceptos clave</h2>
              {lesson.explanation.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-[var(--theme-muted)]">{paragraph}</p>
              ))}
            </section>

            <section aria-labelledby="preview-example" className="border border-[var(--theme-border)] bg-[var(--theme-surface)]">
              <div className="border-b border-[var(--theme-border)] px-4 py-3">
                <h2 id="preview-example" className="text-xs font-bold tracking-[0.12em] text-[var(--theme-accent)]">EJEMPLO EXPLICADO</h2>
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
            </section>

            <section aria-labelledby="preview-exercise" className="space-y-4">
              <div className="border-l-2 border-[var(--theme-border-dark)] bg-[var(--theme-bg-secondary)] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="preview-exercise" className="font-serif text-xl">{lesson.exercise.title}</h2>
                  <span className="text-xs font-semibold text-[var(--theme-muted)]">{lesson.estimatedMinutes} min</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--theme-muted)]">{lesson.exercise.statement}</p>
                <h3 className="mt-4 text-xs font-bold tracking-[0.12em] text-[var(--theme-muted)]">PISTAS</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--theme-muted)]">
                  {lesson.exercise.hints.map((hint) => <li key={hint}>{hint}</li>)}
                </ul>
              </div>

              <PythonEditor
                defaultCode={lesson.example}
                instructions={'Ejecuta el ejemplo y luego modifícalo para resolver este reto: ' + lesson.exercise.statement}
              />
            </section>
          </article>

          <aside className="space-y-5">
            <div className="border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5">
              <p className="text-xs font-bold tracking-[0.12em] text-[var(--theme-accent)]">SIN REGISTRO</p>
              <h2 className="mt-3 font-serif text-xl">Prueba antes de decidir</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
                Esta muestra no guarda código, respuestas ni progreso. Al entrar a la academia podrás continuar el recorrido y conservar tus avances.
              </p>
              <Link
                href="/login?next=%2Facademia%2Fmodule-1%2Fb1-l1"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center bg-[var(--theme-accent)] px-4 py-3 text-sm font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)]"
              >
                Crear cuenta o entrar
              </Link>
            </div>
            <div className="border-l-2 border-[var(--theme-border)] px-4 py-2">
              <p className="text-xs leading-6 text-[var(--theme-muted)]">
                La ejecución de Python ocurre en tu navegador. La muestra no envía tu código al servidor ni registra tu actividad.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
