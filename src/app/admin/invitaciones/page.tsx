import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { listInvitations, createInvitation, deleteInvitation } from "./actions";

type InvitationRow = {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  used_by_name: string | null;
  used_by_email: string | null;
  expires_at: string | null;
  is_expired: boolean;
  created_at: string;
  created_by: string;
};

const FEEDBACK: Record<string, { ok: boolean; text: string }> = {
  created: { ok: true, text: 'Invitación creada.' },
  deleted: { ok: true, text: 'Invitación eliminada.' },
  invalid: { ok: false, text: 'Revisa los datos: el código y la fecha no son válidos.' },
  duplicate: { ok: false, text: 'Ya existe una invitación con ese código.' },
  failed: { ok: false, text: 'La operación no se pudo completar. Inténtalo de nuevo.' },
  used: { ok: false, text: 'El código ya fue utilizado. Se conserva para mantener el historial de la invitación.' },
};

function feedbackCode(error: string | null | undefined, success: string) {
  if (!error) return success;
  if (error.includes('Ya existe')) return 'duplicate';
  if (error.includes('se conserva como historial')) return 'used';
  if (error.includes('inválid') || error.includes('requerido') || error.includes('caracteres: letras') || error.includes('futura')) return 'invalid';
  return 'failed';
}


async function handleCreateInvitation(formData: FormData): Promise<void> {
  'use server';
  const result = await createInvitation(formData);
  revalidatePath('/admin/invitaciones');
  redirect(`/admin/invitaciones?r=${feedbackCode(result.error, 'created')}`);
}

async function handleDeleteInvitation(formData: FormData): Promise<void> {
  'use server';
  const result = await deleteInvitation(String(formData.get('id') ?? ''));
  revalidatePath('/admin/invitaciones');
  redirect(`/admin/invitaciones?r=${feedbackCode(result.error, 'deleted')}`);
}

type PageProps = { searchParams?: Promise<{ r?: string }> };

export default async function InvitacionesPage({ searchParams }: PageProps) {
  const query = (await searchParams) ?? {};
  const feedback = query.r && Object.hasOwn(FEEDBACK, query.r) ? FEEDBACK[query.r] : null;
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
            Crea un código para identificar a una persona invitada o a un grupo de difusión y compártelo directamente; no se envía por correo automáticamente. El registro sigue abierto aunque la persona no tenga código: la invitación es opcional y no concede permisos especiales. Si alguien la utiliza al crear su cuenta, queda marcada como usada y vinculada a ese registro. Los códigos sin fecha vencen en siete días.
          </p>

          {listError && (
            <div role='alert' className='mt-6 border-l-4 border-[var(--theme-error)] bg-[var(--theme-error-light)] px-4 py-3 text-sm leading-6 text-[var(--theme-error-dark)]'>
              {listError}
            </div>
          )}
          {feedback && (
            <div
              role={feedback.ok ? 'status' : 'alert'}
              className={feedback.ok
                ? 'mt-6 border-l-4 border-[var(--theme-accent)] bg-[var(--theme-surface)] px-4 py-3 text-sm leading-6'
                : 'mt-6 border-l-4 border-[var(--theme-error)] bg-[var(--theme-error-light)] px-4 py-3 text-sm leading-6 text-[var(--theme-error-dark)]'}
            >
              {feedback.text}
            </div>
          )}

          <div className='mt-8 space-y-4'>
            <form action={handleCreateInvitation} className='bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg space-y-4'>
              <h3 className='font-semibold text-[var(--theme-ink)]'>Nueva invitación</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='code' className='block text-sm font-semibold text-[var(--theme-ink)] mb-1'>
                    Código personalizado (opcional)
                  </label>
                  <input
                    id='code'
                    name='code'
                    type='text'
                    placeholder='CURSO-2026'
                    maxLength={32}
                    minLength={8}
                    pattern="[A-Za-z0-9-]{8,32}"
                    autoComplete='off'
                    className='mt-1 min-h-12 w-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 text-base text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]'
                  />
                  <p className='mt-2 text-xs text-[var(--theme-muted)]'>Es opcional: déjalo vacío para generar uno aleatorio. Si lo personalizas, usa 8–32 letras, números o guiones; no se admiten guiones dobles.</p>
                </div>
                <div>
                  <label htmlFor='expires_at' className='block text-sm font-semibold text-[var(--theme-ink)] mb-1'>
                    Fecha de expiración (opcional; por defecto 7 días)
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
                    <th className='border border-[var(--theme-border)] px-3 py-2 text-left text-xs font-semibold text-[var(--theme-muted)]'>Utilizada por</th>
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
                        ) : inv.is_expired ? (
                          <span className='text-[var(--theme-error)]'>Vencida</span>
                        ) : (
                          <span className='text-[var(--theme-accent)]'>Activa</span>
                        )}
                      </td>
                      <td className='border border-[var(--theme-border)] px-3 py-2 text-sm text-[var(--theme-muted)]'>
                        {inv.is_used
                          ? <span>{inv.used_by_name || 'Cuenta vinculada'}{inv.used_by_email ? <span className='block text-xs'>{inv.used_by_email}</span> : null}</span>
                          : 'Sin usar'}
                      </td>
                      <td className='border border-[var(--theme-border)] px-3 py-2 text-sm text-[var(--theme-muted)]'>
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                      <td className='border border-[var(--theme-border)] px-3 py-2 text-sm text-[var(--theme-muted)]'>
                        {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : 'Sin expiración'}
                      </td>
                      <td className='border border-[var(--theme-border)] px-3 py-2'>
                        {!inv.is_used ? (
                          <form action={handleDeleteInvitation} className='inline'>
                            <input type='hidden' name='id' value={inv.id} />
                            <button type='submit' className='text-xs text-[var(--theme-error)] hover:underline'>
                              Eliminar
                            </button>
                          </form>
                        ) : (
                          <span className='text-xs text-[var(--theme-muted)]' title='Se conserva por trazabilidad'>Registro conservado</span>
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


