import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { updatePassword } from '../actions';

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : undefined;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login/forgot-password?error=confirmation');
  }

  const errorMessage = params?.error === 'password'
    ? 'La contraseña debe tener al menos 8 caracteres.'
    : params?.error === 'mismatch'
      ? 'Las contraseñas no coinciden.'
      : params?.error === 'update'
        ? 'No se pudo actualizar la contraseña. Solicita un enlace nuevo e inténtalo otra vez.'
        : null;

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] px-5 py-12 text-[var(--theme-ink)] sm:py-16">
      <section className="mx-auto max-w-xl border-t-2 border-[var(--theme-accent)] pt-5">
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl">Elige una contraseña nueva</h1>
        <p className="mt-3 leading-7 text-[var(--theme-muted)]">Usa al menos ocho caracteres para proteger tu cuenta.</p>

        {errorMessage && (
          <p role="alert" className="mt-6 border-l-4 border-[var(--theme-error)] bg-[var(--theme-surface)] px-4 py-3 text-sm leading-6">{errorMessage}</p>
        )}

        <form action={updatePassword} className="mt-7 space-y-5">
          <div>
            <label htmlFor="new-password" className="text-sm font-semibold">Nueva contraseña</label>
            <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} required className="mt-2 min-h-12 w-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 text-base outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]" />
          </div>
          <div>
            <label htmlFor="password-confirmation" className="text-sm font-semibold">Confirma la contraseña</label>
            <input id="password-confirmation" name="password_confirmation" type="password" autoComplete="new-password" minLength={8} required className="mt-2 min-h-12 w-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 text-base outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]" />
          </div>
          <button type="submit" className="min-h-12 w-full bg-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-ink-inverse)] hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">
            Actualizar contraseña
          </button>
        </form>
      </section>
    </main>
  );
}
