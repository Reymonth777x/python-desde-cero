import PythonEditor from '@/components/PythonEditor';
import LessonProgress from '@/components/LessonProgress';
import { logout } from '@/app/login/actions';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PracticaPage() {
  'use server';
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">
            Python desde cero
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href="/academia" className="inline-flex min-h-11 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">Academia</Link>
            {profile?.is_admin === true && (
              <Link href="/admin/invitaciones" className="inline-flex min-h-11 items-center text-[var(--theme-muted)] underline underline-offset-4">Invitaciones</Link>
            )}
            <form action={logout}>
              <button type="submit" className="inline-flex min-h-11 items-center text-[var(--theme-muted)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--theme-focus-ring)]">Cerrar sesión</button>
            </form>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
        <p className="text-xs font-bold tracking-[0.17em] text-[var(--theme-accent)]">
          PYTHON DESDE CERO / LABORATORIO
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
          Laboratorio de Python
        </h1>
        <p className="mb-8 mt-4 max-w-2xl text-sm leading-7 text-[var(--theme-muted)]">
          Escribe código, ejecuta tus pruebas y guarda el progreso de tus lecciones.
        </p>

        <PythonEditor
          defaultCode={'precio = 1200\ncantidad = 3\ntotal = precio * cantidad\nprint(total)'}
          instructions="Edita el programa, pulsa Ejecutar y consulta la salida. Para probar input(), escribe una respuesta por línea en el campo de entrada antes de ejecutar. La ejecución tiene un límite de tiempo; si lo supera, el Worker se reinicia."
        />
        <LessonProgress />
      </div>
    </main>
  );
}
