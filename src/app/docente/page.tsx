import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DocentePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/estudiante');
  }

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:py-5">
          <Link href="/" className="flex min-h-11 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center bg-[var(--theme-accent)] font-serif text-xl text-[var(--theme-ink-inverse)]">
              Py
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide">PYTHON</span>
              <span className="block text-xs tracking-[0.16em] text-[var(--theme-muted)]">DESDE CERO</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/estudiante" className="text-sm text-[var(--theme-muted)] hover:text-[var(--theme-accent)]">
              Volver a mi panel
            </Link>
            <span className="text-xs px-2 py-1 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded text-[var(--theme-muted)]">
              Docente
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="max-w-4xl">
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl mb-2">
            Panel de docente
          </h1>
          <p className="mt-2 leading-7 text-[var(--theme-muted)]">
            Aquí puedes revisar el progreso de tus estudiantes y gestionar sus proyectos.
          </p>

          <div className="mt-8 bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg">
            <h2 className="font-serif text-2xl leading-tight mb-4">Progreso del grupo</h2>
            <p className="text-[var(--theme-muted)]">
              Esta sección se conectará con las tablas de progreso una vez que Docker/Supabase local esté disponible.
              Por ahora, redirige a tus estudiantes a su panel individual.
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/estudiante" className="flex-1 min-h-12 border border-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-accent)] text-center transition-colors hover:bg-[var(--theme-bg-secondary)]">
              Mi panel de estudiante
            </Link>
            <Link href="/academia" className="flex-1 min-h-12 border border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-3 text-base font-semibold text-[var(--theme-ink)] text-center transition-colors hover:bg-[var(--theme-bg-secondary)]">
              Academia
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}