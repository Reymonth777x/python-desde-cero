import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { listInvitations, createInvitation, deleteInvitation } from "./actions";

type InvitationRow = {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  expires_at: string | null;
  created_at: string;
  created_by: string;
};

async function handleCreateInvitation(formData: FormData): Promise<void> {
  const result = await createInvitation(formData);
  if (result.error) {
    redirect(`/admin/invitaciones?error=${encodeURIComponent(result.error)}`);
  }
  redirect('/admin/invitaciones?message=invitation-created');
}

async function handleDeleteInvitation(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const result = await deleteInvitation(id);
  if (result.error) {
    redirect(`/admin/invitaciones?error=${encodeURIComponent(result.error)}`);
  }
  redirect('/admin/invitaciones?message=invitation-deleted');
}

export default async function InvitacionesPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
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

  const { invitations, error: listError } = await listInvitations();

  return (
    <main className='min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]'>
      <header className='border-b border-[var(--theme-border)]'>
        <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:py-5'>
          <Link href='/' className='flex min-h-11 items-center gap-3'>
            <span className='flex h-10 w-10 items-center justify-center bg-[var(--theme-accent)] font-serif text-xl text-[var(--theme-ink-inverse)]'>Py</span>
            <span>
              <span className='block text-sm font-bold tracking-wide'>PYTHON</span>
              <span className='block text-xs tracking-[0.16em] text-[var(--theme-muted)]'>DESDE CERO</span>
            </span>
          </Link>
          <Link href='/admin' className='inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4'>
            Volver al panel de administración
          </Link>
        </div>
      </header>

      <div className='mx-auto max-w-6xl px-5 py-8 sm:py-12'>
        <div className='max-w-4xl'>
          <h1 className='font-serif text-3xl leading-tight sm:text-4xl mb-2'>
            Gestión de Invitaciones
          </h1>
          <p className='mt-2 leading-7 text-[var(--theme-muted)]'>
            Crea códigos de invitación para permitir el registro de nuevos estudiantes.
          </p>

          {listError && (
            <div role='alert' className='mt-6 border-l-4 border-[var(--theme-error)] bg-[var(--theme-error-light)] px-4 py-3 text-sm leading-6 text-[var(--theme-error-dark)]'>
              {listError}
            </div>
          )}
          {params.error && (
            <div role='alert' className='mt-6 border-l-4 border-[var(--theme-error)] bg-[var(--theme-error-light)] px-4 py-3 text-sm leading-6 text-[var(--theme-error-dark)]'>
              {params.error}
            </div>
          )}
          {params.message && (
            <div role='status' className='mt-6 border-l-4 border-[var(--theme-accent)] bg-[var(--theme-accent-light)] px-4 py-3 text-sm leading-6 text-[var(--theme-ink)]'>
              {params.message}
            </div>
          )}

          <div className='mt-8 space-y-4'>
            <form action={handleCreateInvitation} className='bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg space-y-4'>
              <h3 className='font-semibold text-[var(--theme-ink)]'>Nueva invitación</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='code' className='block text-sm font-semibold text-[var(--theme-ink)] mb-1'>
                    Código (16 caracteres hexadecimales)
                  </label>
                  <input
                    id='code'
                    name='code'
                    type='text'
                    maxLength={16}
                    autoComplete='off'
                    className='mt-1 min-h-12 w-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 text-base text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='expires_at' className='block text-sm font-semibold text-[var(--theme-ink)] mb-1'>
                    Fecha de expiración (opcional)
                  </label>
                  <input
                    id='expires_at'
                    name='expires_at'
                    type='datetime-local'
                    className='mt-1 min-h-12 w-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 text-base text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]'
                  />
                </div>
              </div>
              <button type='submit' className='min-h-12 w-full bg-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-ink-inverse)] hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]'>
                Crear invitación
              </button>
            </form>
          </div>

          {invitations.length > 0 && (
            <div className='mt-8'>
              <h2 className='font-semibold text-[var(--theme-ink)] mb-4'>Invitaciones existentes</h2>
              <table className='w-full border-collapse border border-[var(--theme-border)]'>
                <thead>
                  <tr className='bg-[var(--theme-bg-secondary)]'>
                    <th className='border border-[var(--theme-border)] px-3 py-2 text-left text-xs font-semibold text-[var(--theme-muted)]'>Código</th>
                    <th className='border border-[var(--theme-border)] px-3 py-2 text-left text-xs font-semibold text-[var(--theme-muted)]'>Estado</th>
                    <th className='border border-[var(--theme-border)] px-3 py-2 text-left text-xs font-semibold text-[var(--theme-muted)]'>Creada</th>
                    <th className='border border-[var(--theme-border)] px-3 py-2 text-left text-xs font-semibold text-[var(--theme-muted)]'>Expira</th>
                    <th className='border border-[var(--theme-border)] px-3 py-2 text-left text-xs font-semibold text-[var(--theme-muted)]'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv: InvitationRow) => (
                    <tr key={inv.id} className='border-b border-[var(--theme-border)]'>
                      <td className='border border-[var(--theme-border)] px-3 py-2 text-sm font-mono text-[var(--theme-ink)]'>{inv.code}</td>
                      <td className='border border-[var(--theme-border)] px-3 py-2 text-sm text-[var(--theme-ink)]'>
                        {inv.is_used ? (
                          <span className='text-[var(--theme-muted)]'>Usada</span>
                        ) : (
                          <span className='text-[var(--theme-accent)]'>Activa</span>
                        )}
                      </td>
                      <td className='border border-[var(--theme-border)] px-3 py-2 text-sm text-[var(--theme-muted)]'>
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                      <td className='border border-[var(--theme-border)] px-3 py-2 text-sm text-[var(--theme-muted)]'>
                        {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : 'Sin expiración'}
                      </td>
                      <td className='border border-[var(--theme-border)] px-3 py-2'>
                        {!inv.is_used && (
                          <form action={handleDeleteInvitation} className='inline'>
                            <input type='hidden' name='id' value={inv.id} />
                            <button type='submit' className='text-xs text-[var(--theme-error)] hover:underline'>
                              Eliminar
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className='mt-8 flex gap-4'>
            <Link href='/admin' className='flex-1 min-h-12 border border-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-accent)] text-center transition-colors hover:bg-[var(--theme-bg-secondary)]'>
              Volver al panel
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


