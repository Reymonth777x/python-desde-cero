import Link from 'next/link';
import ThemeSelector from '@/components/ThemeSelector';
import { ArrowRight, BookOpenCheck, Circle, Lock, LogOut } from 'lucide-react';
import { logout } from '@/app/login/actions';
import { courseCatalog } from '@/lib/course-catalog';
import { canAccessLessonInSequence } from '@/lib/lesson-access';

export type ProgressRow = {
  module_id: string;
  lesson_id: string;
  is_completed: boolean;
  best_score: number | null;
};

type Props = {
  displayName: string;
  progressRows: ProgressRow[];
  progressUnavailable: boolean;
  isAdmin: boolean;
};

/** Returns true if the module at moduleIndex is accessible given the progress rows. */
function isModuleUnlocked(moduleIndex: number, progressRows: ProgressRow[]): boolean {
  if (moduleIndex === 0) return true;
  const prevModule = courseCatalog[moduleIndex - 1];
  const requiredCompletion = prevModule
    ? [...prevModule.lessons].reverse().find((lesson) => lesson.finalAssessment || lesson.assessment)
    : undefined;
  if (!prevModule || !requiredCompletion) return true; // no gate lesson — allow access
  return progressRows.some(
    (row) =>
      row.module_id === prevModule.id &&
      row.lesson_id === requiredCompletion.id &&
      row.is_completed,
  );
}

export default function AcademyDashboard({
  displayName,
  progressRows,
  progressUnavailable,
  isAdmin,
}: Props) {
  const completed = (moduleId: string, lessonId: string) =>
    progressRows.some(
      (row) =>
        row.module_id === moduleId &&
        row.lesson_id === lessonId &&
        row.is_completed,
    );

  const coreModules = courseCatalog.filter((courseModule) => !courseModule.optional);
  const extensionModules = courseCatalog.filter((courseModule) => courseModule.optional);
  const completedCount = coreModules.reduce(
    (total, courseModule) =>
      total + courseModule.lessons.filter((lesson) => completed(courseModule.id, lesson.id)).length,
    0,
  );
  const lessonCount = coreModules.reduce(
    (total, courseModule) => total + courseModule.lessons.length,
    0,
  );
  const extensionCompletedCount = extensionModules.reduce(
    (total, courseModule) =>
      total + courseModule.lessons.filter((lesson) => completed(courseModule.id, lesson.id)).length,
    0,
  );
  const extensionLessonCount = extensionModules.reduce(
    (total, courseModule) => total + courseModule.lessons.length,
    0,
  );

  // The four core modules form the completion path; the applied project is an optional extension.
  const findNextLesson = (modules: typeof courseCatalog) => modules
    .flatMap((courseModule) => {
      const moduleIndex = courseCatalog.findIndex((item) => item.id === courseModule.id);
      const moduleUnlocked = progressUnavailable
        ? moduleIndex === 0
        : isModuleUnlocked(moduleIndex, progressRows);
      if (!moduleUnlocked) return [];

      return courseModule.lessons.map((lesson, lessonIndex) => ({
        courseModule,
        lesson,
        lessonIndex,
        lessonUnlocked: completed(courseModule.id, lesson.id) ||
          canAccessLessonInSequence(
            courseModule.id,
            lessonIndex,
            courseModule.lessons,
            progressRows,
            progressUnavailable,
          ),
      }));
    })
    .find(({ courseModule, lesson, lessonUnlocked }) =>
      lessonUnlocked && !completed(courseModule.id, lesson.id),
    );

  const coreComplete = !progressUnavailable && completedCount === lessonCount;
  const nextLesson = findNextLesson(coreModules) ?? findNextLesson(extensionModules);

  const completionPercent = lessonCount > 0
    ? Math.round((completedCount / lessonCount) * 100)
    : 0;

  const hasProgress = completedCount > 0;
  const ctaLabel = progressUnavailable
    ? 'Abrir primera lección'
    : coreComplete
      ? extensionLessonCount > extensionCompletedCount
        ? 'Explorar la extensión práctica'
        : 'Repasar el curso principal'
      : hasProgress
        ? 'Continuar aprendiendo'
        : 'Comenzar a aprender';

  const ctaHref = nextLesson
    ? `/academia/${nextLesson.courseModule.id}/${nextLesson.lesson.id}`
    : '/academia/module-1/b1-l1';

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="inline-flex min-h-11 items-center font-serif text-lg font-semibold text-[var(--theme-accent)]">
            Python desde cero
          </Link>
          <nav aria-label="Navegación de la academia" className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/practica" className="inline-flex min-h-11 items-center text-[var(--theme-accent)] underline underline-offset-4">
              Laboratorio
            </Link>
            {isAdmin && (
              <Link href="/admin" className="inline-flex min-h-11 items-center text-[var(--theme-accent)] underline underline-offset-4">
                Administración
              </Link>
            )}
            <form action={logout}>
              <button type="submit" className="inline-flex min-h-11 items-center gap-2 text-[var(--theme-muted)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--theme-focus-ring)]">
                <LogOut aria-hidden="true" size={16} />
                Cerrar sesión
              </button>
            </form>
            <ThemeSelector />
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Hero / next action */}
        <div className="flex flex-col gap-6 border-b border-[var(--theme-border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.16em] text-[var(--theme-accent)]">
              TU RUTA DE APRENDIZAJE
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
              {displayName ? `Hola, ${displayName}.` : 'Python desde cero'}
            </h1>
            <p className="mt-4 leading-7 text-[var(--theme-muted)]">
              Estudia conceptos, practica con ejemplos y comprueba lo aprendido módulo a módulo.
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
          >
            {ctaLabel}
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>

        {/* Progress summary */}
        {progressUnavailable ? (
          <p role="alert" className="mt-6 border-l-4 border-[var(--theme-error)] bg-[var(--theme-surface)] px-4 py-3 text-sm leading-6 text-[var(--theme-error)]">
            No se pudo consultar el progreso guardado. Puedes estudiar; la aplicación mostrará un error si no logra guardar una evaluación.
          </p>
        ) : (
          <section aria-label="Progreso general" className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <BookOpenCheck aria-hidden="true" className="text-[var(--theme-accent)]" size={18} />
            <span className="font-semibold">{completedCount} de {lessonCount} lecciones del curso principal</span>
            <span className="text-[var(--theme-muted)]">({completionPercent}%)</span>
            {extensionLessonCount > 0 && (
              <span className="w-full text-xs text-[var(--theme-muted)]">
                Extensión práctica opcional: {extensionCompletedCount} de {extensionLessonCount} actividades
              </span>
            )}
            <div className="h-2 w-full bg-[var(--theme-bg-secondary)] sm:max-w-sm" role="progressbar" aria-label="Porcentaje completado" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completionPercent}>
              <div className="h-full bg-[var(--theme-accent)] transition-[width]" style={{ width: `${completionPercent}%` }} />
            </div>
          </section>
        )}

        {/* Module list */}
        <div className="mt-10 space-y-10">
          {courseCatalog.map((courseModule, moduleIndex) => {
            const unlocked = progressUnavailable
              ? moduleIndex === 0
              : isModuleUnlocked(moduleIndex, progressRows);
            const moduleCompleted = courseModule.lessons.filter((lesson) =>
              completed(courseModule.id, lesson.id),
            ).length;
            const percentage = Math.round(
              (moduleCompleted / courseModule.lessons.length) * 100,
            );
            const prevModule = courseCatalog[moduleIndex - 1];
            const prevAssessment = prevModule?.lessons.slice().reverse().find((l) => l.finalAssessment || l.assessment);

            return (
              <section key={courseModule.id} aria-labelledby={`${courseModule.id}-title`}>
                <div className="flex flex-col gap-2 border-b border-[var(--theme-border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className={`text-xs font-bold tracking-[0.14em] ${unlocked ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-muted)]'}`}>
                      MÓDULO {courseModule.number}
                      {!unlocked && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Lock aria-hidden="true" size={12} />
                          BLOQUEADO
                        </span>
                      )}
                    </p>
                    <h2 id={`${courseModule.id}-title`} className={`mt-2 font-serif text-2xl sm:text-3xl ${unlocked ? '' : 'text-[var(--theme-muted)]'}`}>
                      {courseModule.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--theme-muted)]">
                      {unlocked
                        ? courseModule.summary
                        : prevAssessment
                          ? `Completa la evaluación del módulo ${prevModule.number} para desbloquear este módulo.`
                          : `Completa el módulo anterior para desbloquear este módulo.`}
                    </p>
                  </div>
                  {unlocked && !progressUnavailable && (
                    <p className="shrink-0 text-sm text-[var(--theme-muted)]" aria-live="polite">
                      {moduleCompleted}/{courseModule.lessons.length} completadas · {percentage}%
                    </p>
                  )}
                </div>

                <ol className="divide-y divide-[var(--theme-border)]">
                  {courseModule.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = completed(courseModule.id, lesson.id);
                    const lessonUnlocked = unlocked && (
                      isCompleted ||
                      canAccessLessonInSequence(
                        courseModule.id,
                        lessonIndex,
                        courseModule.lessons,
                        progressRows,
                        progressUnavailable,
                      )
                    );

                    if (!lessonUnlocked) {
                      const lockDescription = !unlocked
                        ? prevAssessment
                          ? `Completa la evaluación del módulo ${prevModule.number} para desbloquear este módulo.`
                          : 'Completa el módulo anterior para desbloquear este módulo.'
                        : lessonIndex > 0
                          ? `Completa «${courseModule.lessons[lessonIndex - 1].title}» para desbloquear esta lección.`
                          : 'El progreso no está disponible; actualiza la página para comprobar el siguiente paso.';

                      return (
                        <li key={`${courseModule.id}-${lesson.id}`}>
                          <div className="flex min-h-16 items-center justify-between gap-4 py-4 opacity-50">
                            <span className="flex min-w-0 items-start gap-3">
                              <Lock aria-label="Bloqueada" className="mt-0.5 shrink-0 text-[var(--theme-muted)]" size={18} />
                              <span className="min-w-0">
                                <span className="block text-xs font-semibold text-[var(--theme-muted)]">{lesson.section}{lesson.finalProject ? ' · PROYECTO FINAL' : lesson.finalAssessment ? ' · EXAMEN FINAL' : lesson.assessment ? ' · EVALUACIÓN' : ''}</span>
                                <span className="mt-1 block font-medium text-[var(--theme-ink)]">{lesson.title}</span>
                                <span className="mt-1 block text-xs leading-5 text-[var(--theme-muted)]">{lockDescription}</span>
                              </span>
                            </span>
                          </div>
                        </li>
                      );
                    }

                    return (
                      <li key={`${courseModule.id}-${lesson.id}`}>
                        <Link
                          href={`/academia/${courseModule.id}/${lesson.id}`}
                          className="group flex min-h-16 items-center justify-between gap-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
                        >
                          <span className="flex min-w-0 items-start gap-3">
                            {!progressUnavailable && isCompleted ? (
                              <BookOpenCheck aria-label="Completada" className="mt-0.5 shrink-0 text-[var(--theme-accent)]" size={18} />
                            ) : (
                              <Circle aria-label={progressUnavailable ? 'Estado no disponible' : 'Pendiente'} className="mt-0.5 shrink-0 text-[var(--theme-muted)]" size={18} />
                            )}
                            <span className="min-w-0">
                              <span className="block text-xs font-semibold text-[var(--theme-muted)]">{lesson.section}{lesson.assessment ? ' · EVALUACIÓN' : ''}</span>
                              <span className="mt-1 block font-medium text-[var(--theme-ink)] group-hover:text-[var(--theme-accent)]">{lesson.title}</span>
                            </span>
                          </span>
                          <ArrowRight aria-hidden="true" className="shrink-0 text-[var(--theme-muted)] transition-transform group-hover:translate-x-1" size={17} />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </div>

        <aside className="mt-12 border-l-2 border-[var(--theme-border-dark)] bg-[var(--theme-bg-secondary)] p-5 sm:p-6">
          <h2 className="font-serif text-xl">Practica el código en el laboratorio</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--theme-muted)]">
            El editor ejecuta Python en tu navegador. Las evaluaciones guardan el resultado solo después de comprobar tus respuestas.
          </p>
          <Link href="/practica" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">
            Abrir el laboratorio
          </Link>
        </aside>
      </div>
    </main>
  );
}
