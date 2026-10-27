import { requestPasswordReset } from '../actions';
import { TurnstileWidget } from '@/components/TurnstileWidget';

type Props = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <main className="min-h-screen bg-[#f4f2e9] px-5 py-12 text-[#252b25] sm:py-16">
      <section className="mx-auto max-w-xl border-t-2 border-[#294936] pt-5">
        <a href="/login" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#294936] underline underline-offset-4">
          Volver al acceso
        </a>
        <h1 className="mt-6 font-serif text-3xl sm:text-4xl">Recuperar contraseña</h1>
        <p className="mt-3 leading-7 text-[#596259]">
          Te enviaremos un enlace si existe una cuenta asociada a ese correo.
        </p>

        {params?.error && (
          <p role="alert" className="mt-6 border-l-4 border-[#a04435] bg-white px-4 py-3 text-sm leading-6">
            {params.error === 'configuration'
              ? 'La recuperación no está configurada para este entorno.'
              : params.error === 'confirmation'
                ? 'El enlace expiró o no es válido. Solicita uno nuevo.'
                : 'Escribe un correo electrónico válido para continuar.'}
          </p>
        )}

        {params?.message === 'sent' && (
          <p role="status" className="mt-6 border-l-4 border-[#294936] bg-white px-4 py-3 text-sm leading-6">
            Si la cuenta existe, recibirás un correo con los siguientes pasos.
          </p>
        )}

        <form action={requestPasswordReset} className="mt-7 space-y-5">
          <div>
            <label htmlFor="reset-email" className="text-sm font-semibold">Correo electrónico</label>
            <input id="reset-email" name="email" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full border border-[#d3d3c7] bg-white px-3 py-3 text-base outline-none focus:border-[#294936] focus:ring-1 focus:ring-[#294936]" />
          </div>

          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <TurnstileWidget
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onReset={() => {}}
            />
          )}

          <button type="submit" className="min-h-12 w-full bg-[#294936] px-5 py-3 text-base font-semibold text-white hover:bg-[#203d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936]">
            Enviar instrucciones
          </button>
        </form>
      </section>
    </main>
  );
}
