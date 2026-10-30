import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminPage() {
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
    redirect('/academia');
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
            <Link href="/academia" className="text-sm text-[var(--theme-muted)] hover:text-[var(--theme-accent)]">
              Volver a mi ruta de aprendizaje
            </Link>
            <span className="text-xs px-2 py-1 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded text-[var(--theme-muted)]">
              Administrador
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="max-w-4xl">
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl mb-2">
            Panel de administración
          </h1>
          <p className="mt-2 leading-7 text-[var(--theme-muted)]">
            Gestiona códigos de invitación y revisa el acceso de nuevos estudiantes.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg">
              <h3 className="font-semibold text-[var(--theme-ink)] mb-3">Invitaciones</h3>
              <p className="text-sm text-[var(--theme-muted)] mb-4">
                Gestiona códigos de invitación para nuevos estudiantes.
              </p>
              <Link href="/admin/invitaciones" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-accent)]">
                Gestionar invitaciones <span>→</span>
              </Link>
            </div>
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg">
              <h3 className="font-semibold text-[var(--theme-ink)] mb-3">Otras funciones</h3>
              <p className="text-sm text-[var(--theme-muted)] mb-4">
                Esta versión del panel permite gestionar invitaciones. La administración de usuarios y la auditoría todavía no están disponibles.
              </p>
              <p className="text-xs text-[var(--theme-muted)]">
                Las funciones no disponibles no se muestran como herramientas operativas.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/academia" className="inline-flex min-h-12 w-full items-center justify-center border border-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-accent)] transition-colors hover:bg-[var(--theme-bg-secondary)] sm:w-auto">
              Volver a Academia
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}