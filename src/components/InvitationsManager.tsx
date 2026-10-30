'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createInvitation, deleteInvitation } from '@/app/admin/invitaciones/actions';

type InvitationRow = {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  expires_at: string | null;
  created_at: string;
  created_by: string;
};

type Props = {
  invitations: InvitationRow[];
  listError: string | null;
};

function generateCode() {
  const bytes = new Uint8Array(8);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function invitationStatus(invitation: InvitationRow) {
  if (invitation.is_used) return 'Usada';
  if (invitation.expires_at && new Date(invitation.expires_at).getTime() <= Date.now()) return 'Vencida';
  return 'Activa';
}

export default function InvitationsManager({ invitations, listError }: Props) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(
    listError ? { kind: 'error', text: listError } : null,
  );

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      const data = new FormData();
      data.set('code', code);
      data.set('expires_at', expiresAt ? new Date(expiresAt).toISOString() : '');
      const result = await createInvitation(data);
      if (result.error) {
        setFeedback({ kind: 'error', text: result.error });
        return;
      }
      setFeedback({ kind: 'success', text: result.success ?? 'Invitación creada.' });
      setCode('');
      setExpiresAt('');
      router.refresh();
    } catch {
      setFeedback({ kind: 'error', text: 'No se pudo completar la operación. Inténtalo de nuevo.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(invitation: InvitationRow) {
    if (busy) return;
    const confirmed = window.confirm(
      `¿Eliminar el código ${invitation.code}? Esto no elimina la cuenta ni el progreso del estudiante.`,
    );
    if (!confirmed) return;

    setBusy(true);
    setFeedback(null);
    try {
      const result = await deleteInvitation(invitation.id);
      if (result.error) {
        setFeedback({ kind: 'error', text: result.error });
        return;
      }
      setFeedback({ kind: 'success', text: result.success ?? 'Invitación eliminada.' });
      router.refresh();
    } catch {
      setFeedback({ kind: 'error', text: 'No se pudo eliminar la invitación. Inténtalo de nuevo.' });
    } finally {
      setBusy(false);
    }
  }

  const inputClass = 'mt-2 min-h-12 w-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 text-base text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]';

  return (
    <section className="mt-8 space-y-8">
      <form onSubmit={handleCreate} className="space-y-4 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6">
        <div>
          <h2 className="font-semibold text-[var(--theme-ink)]">Nueva invitación</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--theme-muted)]">
            Genera un código seguro o escribe uno que puedas compartir fácilmente.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block text-sm font-semibold text-[var(--theme-ink)]" htmlFor="invitation-code">
            Código personalizado
            <input
              id="invitation-code"
              name="code"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              minLength={4}
              maxLength={32}
              autoComplete="off"
              placeholder="PE1-EQUIPO-2026"
              pattern="[A-Za-z0-9]+(-[A-Za-z0-9]+)*"
              title="Entre 4 y 32 caracteres: letras, números y guiones."
              required
              className={inputClass}
            />
            <span className="mt-1 block text-xs font-normal text-[var(--theme-muted)]">
              De 4 a 32 caracteres. Puedes usar letras, números y guiones.
            </span>
          </label>
          <button
            type="button"
            onClick={() => setCode(generateCode())}
            disabled={busy}
            className="mt-7 min-h-12 border border-[var(--theme-accent)] px-4 py-3 text-sm font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-bg-secondary)] disabled:opacity-50"
          >
            Generar automáticamente
          </button>
        </div>
        <label className="block max-w-sm text-sm font-semibold text-[var(--theme-ink)]" htmlFor="invitation-expires">
          Fecha de expiración (opcional)
          <input
            id="invitation-expires"
            name="expires_at"
            type="datetime-local"
            value={expiresAt}
            onChange={(event) => setExpiresAt(event.target.value)}
            className={inputClass}
          />
          <span className="mt-1 block text-xs font-normal text-[var(--theme-muted)]">
            Si la dejas vacía, el código vencerá en 7 días.
          </span>
        </label>
        <button
          type="submit"
          disabled={busy || code.trim().length < 4}
          className="min-h-12 w-full bg-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-[var(--theme-ink-inverse)] hover:bg-[var(--theme-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Guardando…' : 'Guardar invitación'}
        </button>
      </form>

      {feedback && (
        <p role={feedback.kind === 'error' ? 'alert' : 'status'} className={`border-l-4 px-4 py-3 text-sm leading-6 ${feedback.kind === 'error' ? 'border-[var(--theme-error)] bg-[var(--theme-error-light)] text-[var(--theme-error-dark)]' : 'border-[var(--theme-accent)] bg-[var(--theme-surface)] text-[var(--theme-ink)]'}`}>
          {feedback.text}
        </p>
      )}

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[var(--theme-ink)]">Invitaciones existentes</h2>
            <p className="mt-1 text-sm text-[var(--theme-muted)]">{invitations.length} código(s) registrado(s).</p>
          </div>
          <button type="button" onClick={() => router.refresh()} disabled={busy} className="min-h-10 text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4 disabled:opacity-50">
            Actualizar lista
          </button>
        </div>
        {invitations.length === 0 ? (
          <p className="mt-4 border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] px-4 py-5 text-sm text-[var(--theme-muted)]">
            Todavía no hay invitaciones. Crea una con el formulario anterior.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto border border-[var(--theme-border)]">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="bg-[var(--theme-bg-secondary)]">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--theme-muted)]">Código</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--theme-muted)]">Estado</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--theme-muted)]">Creada</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--theme-muted)]">Expira</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[var(--theme-muted)]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invitation) => (
                  <tr key={invitation.id} className="border-t border-[var(--theme-border)]">
                    <td className="px-3 py-3 font-mono text-sm text-[var(--theme-ink)]">{invitation.code}</td>
                    <td className="px-3 py-3 text-sm text-[var(--theme-muted)]">{invitationStatus(invitation)}</td>
                    <td className="px-3 py-3 text-sm text-[var(--theme-muted)]">{new Date(invitation.created_at).toLocaleString('es-CR')}</td>
                    <td className="px-3 py-3 text-sm text-[var(--theme-muted)]">
                      {invitation.expires_at ? new Date(invitation.expires_at).toLocaleString('es-CR') : 'Sin fecha'}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => void handleDelete(invitation)}
                        disabled={busy}
                        className="min-h-10 text-sm font-semibold text-[var(--theme-error)] underline underline-offset-4 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs leading-5 text-[var(--theme-muted)]">
          Eliminar un código usado solo elimina la invitación del registro. No elimina al estudiante, sus datos ni su progreso.
        </p>
      </div>
    </section>
  );
}
