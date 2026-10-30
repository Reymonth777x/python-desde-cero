import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import InvitationsManager from '@/components/InvitationsManager';
import { listInvitations } from './actions';

export default async function InvitacionesPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.is_admin !== true) redirect('/estudiante');

  const { invitations, error } = await listInvitations();

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:py-5">
          <Link href="/" className="flex min-h-11 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center bg-[var(--theme-accent)] font-serif text-xl text-[var(--theme-ink-inverse)]">Py</span>
            <span>
              <span className="block text-sm font-bold tracking-wide">PYTHON</span>
              <span className="block text-xs tracking-[0.16em] text-[var(--theme-muted)]">DESDE CERO</span>
            </span>
          </Link>
          <Link href="/admin" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">
            Volver al panel de administración
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="max-w-5xl">
          <h1 className="mb-2 font-serif text-3xl leading-tight sm:text-4xl">Gestión de invitaciones</h1>
          <p className="mt-2 max-w-3xl leading-7 text-[var(--theme-muted)]">
            Crea códigos automáticos o personalizados, define su vencimiento y administra los códigos utilizados.
          </p>
          <InvitationsManager invitations={invitations} listError={error} />
        </div>
      </div>
    </main>
  );
}
