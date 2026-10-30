import PythonEditor, { type PythonEditorExercise } from '@/components/PythonEditor';
import { logout } from '@/app/login/actions';
import { createClient } from '@/lib/supabase/server';
import { findCourseLesson, findCourseModule } from '@/lib/course';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ moduleId?: string; lessonId?: string }>;
};

export default async function PracticaPage({ searchParams }: Props) {
  const params = await searchParams;
  const hasCourseTarget = Boolean(params.moduleId || params.lessonId);
  const lesson = hasCourseTarget && params.moduleId && params.lessonId
    ? findCourseLesson(params.moduleId, params.lessonId)
    : undefined;
  const courseModule = lesson && params.moduleId ? findCourseModule(params.moduleId) : undefined;
  if (hasCourseTarget && (!lesson || !courseModule)) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
    : { data: null };

  const exercise: PythonEditorExercise | undefined = lesson ? {
    id: lesson.exercise.id,
    title: lesson.exercise.title,
    statement: lesson.exercise.statement,
    hints: lesson.exercise.hints,
    tests: lesson.exercise.tests,
    difficulty: lesson.exercise.difficulty,
  } : undefined;
  const defaultCode = lesson?.exercise.starterCode ?? 'precio = 1200\ncantidad = 3\ntotal = precio * cantidad\nprint(total)';

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">Python desde cero</Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href="/academia" className="inline-flex min-h-11 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">Academia</Link>
            {profile?.is_admin === true && <Link href="/admin/invitaciones" className="inline-flex min-h-11 items-center text-[var(--theme-muted)] underline underline-offset-4">Invitaciones</Link>}
            {user ? (
              <form action={logout}>
                <button type="submit" className="inline-flex min-h-11 items-center text-[var(--theme-muted)] underline underline-offset-4">Cerrar sesión</button>
              </form>
            ) : <Link href="/login" className="inline-flex min-h-11 items-center text-[var(--theme-muted)] underline underline-offset-4">Iniciar sesión</Link>}
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
        <p className="text-xs font-bold tracking-[0.17em] text-[var(--theme-accent)]">PYTHON DESDE CERO / LABORATORIO</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Laboratorio de Python</h1>
        {lesson && courseModule ? (
          <div className="mt-3 mb-8 space-y-2">
            <p className="text-sm text-[var(--theme-muted)]">Módulo {courseModule.number} · {courseModule.title}</p>
            <Link href={`/academia/${courseModule.id}/${lesson.id}`} className="inline-flex min-h-10 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">Volver a la lección</Link>
          </div>
        ) : (
          <p className="mb-8 mt-4 max-w-2xl text-sm leading-7 text-[var(--theme-muted)]">
            Escribe y ejecuta Python en el navegador. Puedes probar ideas sin alterar los resultados de tus evaluaciones.
          </p>
        )}
        <PythonEditor
          key={`${user?.id ?? 'guest'}:${lesson?.id ?? 'free'}`}
          defaultCode={defaultCode}
          instructions={lesson?.exercise.statement ?? 'Escribe código, pulsa Ejecutar y consulta la salida. Si tu programa usa input(), escribe una respuesta por línea en el campo de entrada.'}
          exercise={exercise}
          storageKey={`python-lab:${user?.id ?? 'guest'}:${lesson?.id ?? 'free'}`}
        />
      </div>
    </main>
  );
}
