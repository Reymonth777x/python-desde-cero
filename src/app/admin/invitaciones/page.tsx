
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createInvitation } from './actions';

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

  const { data: invitations, error: invitationsError } = await supabase
    .from('invitations')
    .select('id, code, is_used, expires_at, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <main className="min-h-screen bg-[#f4f2e9] px-5 py-8 text-[#252b25] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <a href="/practica" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#294936] underline underline-offset-4">
          ← Volver al laboratorio
        </a>

        <h1 className="mt-6 font-serif text-3xl font-semibold sm:text-4xl">
          Administración de invitaciones
        </h1>

        <p className="mt-3 text-[#596259]">
          Gestiona los códigos de acceso de Python desde cero.
        </p>

        {params?.created === '1' && (
          <p role="status" className="mt-6 border-l-4 border-[#294936] bg-[#ebe9df] px-4 py-3 text-sm text-[#203d31]">
            Invitación creada correctamente.
          </p>
        )}

        {params?.error === 'create' && (
          <p role="alert" className="mt-6 border-l-4 border-[#a04435] bg-white px-4 py-3 text-sm text-[#7f3027]">
            No se pudo crear la invitación. Comprueba los permisos de Supabase.
          </p>
        )}

        <section className="mt-8 border border-[#d3d3c7] bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold">Crear una invitación</h2>

          <p className="mt-2 text-sm text-[#596259]">
            Los códigos tendrán una vigencia de siete días.
          </p>

          <form action={createInvitation} className="mt-5">
            <button
              type="submit"
              className="min-h-12 w-full px-5 py-3 font-semibold text-white transition-colors hover:bg-[#203d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936] sm:w-auto bg-[#294936]"
            >
              Generar código de invitación
            </button>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold">Códigos existentes</h2>

          {invitationsError ? (
            <p role="alert" className="mt-4 text-sm text-[#7f3027]">
              No se pudieron cargar las invitaciones.
            </p>
          ) : !invitations?.length ? (
            <p className="mt-4 text-sm text-[#596259]">
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
                  ? 'bg-[#ebe9df] text-[#596259]'
                  : expired
                    ? 'bg-[#f7e8df] text-[#7f3027]'
                    : 'bg-[#e5ecdf] text-[#203d31]';

                return (
                  <article
                    key={invitation.id}
                    className="border border-[#d3d3c7] bg-white p-4 sm:p-5"
                  >
                    <p className="break-all font-mono text-base font-semibold text-[#203d31] sm:text-lg" title={invitation.code}>
                      {invitation.code}
                    </p>
                    <p className="mt-1 text-sm text-[#596259]">
                      Creada: {new Date(invitation.created_at).toLocaleDateString('es-CR', { timeZone: 'America/Costa_Rica' })}
                    </p>
                    <p className="text-sm text-[#596259]">
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
