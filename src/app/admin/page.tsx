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
            Gestión de usuarios, auditoría y configuración del sistema.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg">
              <h3 className="font-semibold text-[var(--theme-ink)] mb-3">Usuarios</h3>
              <p className="text-sm text-[var(--theme-muted)] mb-4">
                Revisa perfiles, roles y estado de cuenta de todos los estudiantes.
              </p>
              <Link href="/admin/usuarios" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-accent)]">
                Ver usuarios <span>→</span>
              </Link>
            </div>
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg">
              <h3 className="font-semibold text-[var(--theme-ink)] mb-3">Auditoría</h3>
              <p className="text-sm text-[var(--theme-muted)] mb-4">
                Registro de acciones sensibles en el sistema.
              </p>
              <Link href="/admin/auditoria" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-accent)]">
                Ver auditoría <span>→</span>
              </Link>
            </div>
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