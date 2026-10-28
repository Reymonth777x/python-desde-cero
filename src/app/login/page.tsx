
import { login, signup } from './actions';
import Link from 'next/link';
import { TurnstileWidget } from '@/components/TurnstileWidget';

type Props = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

const errors: Record<string, string> = {
  missing: 'Completa los campos obligatorios.',
  password: 'La contraseña debe tener al menos 8 caracteres.',
  invitationFormat: 'Introduce el código de invitación de 16 caracteres.',
  invitation:
    'El código no es válido, ha caducado o ya fue utilizado.',
  login:
    'No se pudo iniciar sesión. Comprueba tu correo, contraseña y confirmación de cuenta.',
  confirmation:
    'No se pudo confirmar la cuenta. Abre el enlace más reciente que recibiste por correo o solicita uno nuevo.',
  logout: 'No se pudo cerrar la sesión. Inténtalo de nuevo.',
  configuration:
    'El registro no está configurado para este entorno. Contacta al administrador de la academia.',
  signup:
    'No se pudo crear la cuenta. Revisa tus datos e inténtalo de nuevo.',
};

const inputStyle =
  'mt-2 min-h-12 w-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-3 text-base text-[var(--theme-ink)] outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-focus-ring)]';

export default async function LoginPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:py-5">
          <Link href="/" className="flex min-h-11 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center bg-[var(--theme-accent)] font-serif text-xl text-[var(--theme-ink-inverse)]">
              Py
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide">
                PYTHON
              </span>
                <span className="block text-xs tracking-[0.16em] text-[var(--theme-muted)]">
                DESDE CERO
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm text-[var(--theme-accent)] underline underline-offset-4"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.18em] text-[var(--theme-accent)]">
            TU ESPACIO DE APRENDIZAJE
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Cada programa empieza con una primera línea.
          </h1>

          <p className="mt-5 max-w-xl leading-7 text-[var(--theme-muted)]">
            Accede a tus lecciones, practica Python y guarda tus avances
            mientras avanzas paso a paso en tu ruta de aprendizaje.
          </p>
        </div>

        {params?.error && (
          <div
            role="alert"
            className="mt-8 max-w-3xl border-l-4 border-[var(--theme-error)] bg-[var(--theme-surface)] px-4 py-3 text-sm leading-6 text-[var(--theme-ink)]"
          >
            {errors[params.error] ??
              'Ocurrió un error. Revisa los datos e inténtalo de nuevo.'}
          </div>
        )}

        {params?.message === 'check-email' && (
          <div
            role="status"
            className="mt-8 max-w-3xl border-l-4 border-[var(--theme-accent)] bg-[var(--theme-surface)] px-4 py-3 text-sm leading-6 text-[var(--theme-ink)]"
          >
            Tu registro fue enviado. Revisa tu correo electrónico para
            confirmar la cuenta antes de iniciar sesión.
          </div>
        )}

        {params?.message === 'signed-out' && (
          <div
            role="status"
            className="mt-8 max-w-3xl border-l-4 border-[var(--theme-accent)] bg-[var(--theme-surface)] px-4 py-3 text-sm leading-6 text-[var(--theme-ink)]"
          >
            Cerraste la sesión correctamente.
          </div>
        )}

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
          <section className="border-t-2 border-[var(--theme-accent)] pt-5">
            <p className="text-xs font-bold tracking-[0.16em] text-[var(--theme-accent)]">
              01 / CUENTA EXISTENTE
            </p>

            <h2 className="mt-3 font-serif text-3xl">
              Iniciar sesión
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
              Continúa desde donde dejaste tus estudios.
            </p>

            <form action={login} className="mt-7 space-y-5">
              <div>
                <label htmlFor="login-email" className="text-sm font-semibold">
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold"
                >
                  Contraseña
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={inputStyle}
                />
              </div>

              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <TurnstileWidget
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onReset={() => {}}
                />
              )}

              <button
                type="submit"
                className="min-h-12 w-full bg-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
              >
                Entrar a mi cuenta
              </button>
            </form>
            <a href="/login/forgot-password" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">
              ¿Olvidaste tu contraseña?
            </a>
          </section>

          <section className="border-t-2 border-[var(--theme-border-dark)] pt-5">
            <p className="text-xs font-bold tracking-[0.16em] text-[var(--theme-warning)]">
              02 / NUEVO ESTUDIANTE
            </p>

            <h2 className="mt-3 font-serif text-3xl">
              Crear cuenta
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">
              Crea tu cuenta para comenzar. Si recibiste un código de invitación,
              puedes incluirlo al registrarte.
            </p>

            <form action={signup} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="invitation-code"
                  className="text-sm font-semibold"
                >
                  Código de invitación (opcional)
                </label>
                <input
                  id="invitation-code"
                  name="invitation_code"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  minLength={16}
                  maxLength={16}
                  pattern="[A-Fa-f0-9]{16}"
                  placeholder="Ej. 7AB93671EDD3FB06"
                  className={`${inputStyle} font-mono uppercase tracking-wider`}
                />
                <p className="mt-2 text-xs leading-5 text-[var(--theme-muted)]">
                  Si lo proporcionas, debe estar vigente y no haberse utilizado.
                </p>
              </div>

              <div>
                <label htmlFor="full-name" className="text-sm font-semibold">
                  Nombre completo
                </label>
                <input
                  id="full-name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="text-sm font-semibold">
                  Correo electrónico
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="text-sm font-semibold"
                >
                  Contraseña
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={inputStyle}
                />
                <p className="mt-2 text-xs text-[var(--theme-muted)]">
                  Mínimo 8 caracteres.
                </p>
              </div>

              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <TurnstileWidget
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onReset={() => {}}
                />
              )}

              <button
                type="submit"
                className="min-h-12 w-full border border-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-accent)] transition-colors hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
              >
                Crear cuenta
              </button>
            </form>
          </section>
        </div>

        <footer className="mt-16 border-t border-[var(--theme-border)] pt-5 text-xs leading-6 text-[var(--theme-muted)]">
          Python desde cero · Material educativo propio e independiente, no oficial ni afiliado a Cisco Networking Academy o Cisco.
        </footer>
      </div>
    </main>
  );
}
