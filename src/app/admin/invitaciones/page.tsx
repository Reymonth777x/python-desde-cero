
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createInvitation } from './actions';

type InvitationRow = {
  id: string;
  code: string;
  is_used: boolean;
  expires_at: string | null;
  created_at: string;
};

type Props = {
  searchParams?: Promise<{
    created?: string;
    error?: string;
  }>;
};

function isInvitationExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

export default async function InvitationsPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : undefined;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.is_admin !== true) {
    redirect('/practica');
  }

  const invitationsResult = await supabase
    .from('invitations')
    .select('id, code, is_used, expires_at, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  const invitations = invitationsResult.data as InvitationRow[] | null;
  const invitationsError = invitationsResult.error;

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] px-5 py-8 text-[var(--theme-ink)] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <a href="/practica" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">
          ← Volver al laboratorio
        </a>

        <h1 className="mt-6 font-serif text-3xl font-semibold sm:text-4xl">
          Administración de invitaciones
        </h1>

        <p className="mt-3 text-[var(--theme-muted)]">
          Gestiona los códigos de acceso de Python desde cero.
        </p>

        {params?.created === '1' && (
          <p role="status" className="mt-6 border-l-4 border-[var(--theme-accent)] bg-[var(--theme-bg-secondary)] px-4 py-3 text-sm text-[var(--theme-accent-dark)]">
            Invitación creada correctamente.
          </p>
        )}

        {params?.error === 'create' && (
          <p role="alert" className="mt-6 border-l-4 border-[var(--theme-error)] bg-[var(--theme-surface)] px-4 py-3 text-sm text-[var(--theme-error)]">
            No se pudo crear la invitación. Comprueba los permisos de Supabase.
          </p>
        )}

        <section className="mt-8 border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold">Crear una invitación</h2>

          <p className="mt-2 text-sm text-[var(--theme-muted)]">
            Los códigos tendrán una vigencia de siete días.
          </p>

          <form action={createInvitation} className="mt-5">
            <button
              type="submit"
              className="min-h-12 w-full px-5 py-3 font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] sm:w-auto bg-[var(--theme-accent)]"
            >
              Generar código de invitación
            </button>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold">Códigos existentes</h2>

          {invitationsError ? (
            <p role="alert" className="mt-4 text-sm text-[var(--theme-error)]">
              No se pudieron cargar las invitaciones.
            </p>
          ) : !invitations?.length ? (
            <p className="mt-4 text-sm text-[var(--theme-muted)]">
              Todavía no hay invitaciones creadas.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {invitations.map((invitation) => {
                const expired = isInvitationExpired(invitation.expires_at);

                const status = invitation.is_used
                  ? 'Usada'
                  : expired
                    ? 'Caducada'
                    : 'Disponible';
                const statusStyle = invitation.is_used
                  ? 'bg-[var(--theme-bg-secondary)] text-[var(--theme-muted)]'
                  : expired
                    ? 'bg-[var(--theme-warning-light)] text-[var(--theme-error)]'
                    : 'bg-[var(--theme-accent-light)] text-[var(--theme-accent-dark)]';

                return (
                  <article
                    key={invitation.id}
                    className="border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 sm:p-5"
                  >
                    <p className="break-all font-mono text-base font-semibold text-[var(--theme-accent-dark)] sm:text-lg" title={invitation.code}>
                      {invitation.code}
                    </p>
                    <p className="mt-1 text-sm text-[var(--theme-muted)]">
                      Creada: {new Date(invitation.created_at).toLocaleDateString('es-CR', { timeZone: 'America/Costa_Rica' })}
                    </p>
                    <p className="text-sm text-[var(--theme-muted)]">
                      Caducidad:{' '}
                      {invitation.expires_at
                        ? new Date(invitation.expires_at).toLocaleDateString('es-CR', { timeZone: 'America/Costa_Rica' })
                        : 'Sin fecha'}
                    </p>
                    <p className={`mt-3 inline-flex px-2.5 py-1 text-xs font-semibold ${statusStyle}`}>
                      {status}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
