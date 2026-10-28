'use client';

import { useState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { TurnstileWidget } from '@/components/TurnstileWidget';
import { signup, login } from './actions';

type Props = {
  error?: string;
  message?: string;
};

function SubmitButton({
  children,
  pendingText,
}: {
  children: ReactNode;
  pendingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="min-h-12 w-full mt-4 border border-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-accent)] transition-colors hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? pendingText : children}
    </button>
  );
}

const inputStyle =
  'mt-2 min-h-12 w-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 text-base text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]';

export default function LoginForm({ error, message }: Props) {
  const [isSignup, setIsSignup] = useState(false);

  const btnClass = isSignup
    ? 'border-[var(--theme-accent)] text-[var(--theme-accent)]'
    : 'border-transparent text-[var(--theme-muted)]';

  const signupBtnClass = isSignup
    ? 'border-[var(--theme-accent)] text-[var(--theme-accent)]'
    : 'border-transparent text-[var(--theme-muted)]';

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
          <Link href="/" className="inline-flex min-h-11 items-center text-sm text-[var(--theme-accent)] underline underline-offset-4">Volver al inicio</Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="max-w-md">
          <p className="text-xs font-bold tracking-[0.18em] text-[var(--theme-accent)]">{isSignup ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">{isSignup ? 'Únete a Python desde cero' : 'Bienvenido de vuelta'}</h1>
          <p className="mt-4 max-w-md leading-7 text-[var(--theme-muted)]">{isSignup ? 'Regístrate gratis para guardar tu progreso y acceder a todas las lecciones.' : 'Accede a tus lecciones, practica Python y guarda tus avances.'}</p>
          {error && (
            <div role="alert" aria-live="polite" className="mt-6 max-w-md border-l-4 border-[var(--theme-error)] bg-[var(--theme-surface)] px-4 py-3 text-sm leading-6 text-[var(--theme-ink)]">{error}</div>
          )}
          {message && (
            <div role="status" aria-live="polite" className="mt-6 max-w-md border-l-4 border-[var(--theme-accent)] bg-[var(--theme-surface)] px-4 py-3 text-sm leading-6 text-[var(--theme-ink)]">{message}</div>
          )}
          <div className="mt-8">
            <div className="flex -mx-1">
              <button type="button" onClick={() => setIsSignup(false)} aria-pressed={!isSignup} className={["flex-1 py-3 text-sm font-semibold transition-colors border-b-2", btnClass].join(" ")}>Iniciar sesión</button>
              <button type="button" onClick={() => setIsSignup(true)} aria-pressed={isSignup} className={["flex-1 py-3 text-sm font-semibold transition-colors border-b-2", signupBtnClass].join(" ")}>Crear cuenta</button>
            </div>
            {isSignup ? (
              <form action={signup} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="full-name" className="text-sm font-semibold">Nombre completo</label>
                  <input id="full-name" name="full_name" type="text" autoComplete="name" maxLength={100} required className={inputStyle} />
                </div>
                <div>
                  <label htmlFor="signup-email" className="text-sm font-semibold">Correo electrónico</label>
                  <input id="signup-email" name="email" type="email" autoComplete="email" required className={inputStyle} />
                </div>
                <div>
                  <label htmlFor="signup-password" className="text-sm font-semibold">Contraseña</label>
                  <input id="signup-password" name="password" type="password" autoComplete="new-password" minLength={8} required className={inputStyle} />
                  <p className="mt-2 text-xs text-[var(--theme-muted)]">Mínimo 8 caracteres.</p>
                </div>
                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                  <TurnstileWidget siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onReset={() => {}} />
                )}
                <SubmitButton pendingText="Creando cuenta...">Crear cuenta</SubmitButton>
              </form>
            ) : (
              <form action={login} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="login-email" className="text-sm font-semibold">Correo electrónico</label>
                  <input id="login-email" name="email" type="email" autoComplete="email" required className={inputStyle} />
                </div>
                <div>
                  <label htmlFor="login-password" className="text-sm font-semibold">Contraseña</label>
                  <input id="login-password" name="password" type="password" autoComplete="current-password" required className={inputStyle} />
                </div>
                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                  <TurnstileWidget siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onReset={() => {}} />
                )}
                <SubmitButton pendingText="Iniciando sesión...">Iniciar sesión</SubmitButton>
              </form>
            )}
          </div>
          <p className="mt-6 text-sm text-[var(--theme-muted)] text-center">
            ¿No tienes cuenta?
            <button type="button" onClick={() => setIsSignup(true)} className="font-semibold text-[var(--theme-accent)] underline underline-offset-4">Crea una aquí</button>
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted)] text-center">
            ¿Olvidaste tu contraseña?
            <Link href="/login/forgot-password" className="font-semibold text-[var(--theme-accent)] underline underline-offset-4">Solicita restablecimiento</Link>
          </p>
        </div>
        <footer className="mt-16 border-t border-[var(--theme-border)] pt-5 text-xs leading-6 text-[var(--theme-muted)]">
          Python desde cero · Material educativo propio e independiente.
        </footer>
      </div>
    </main>
  );
}
