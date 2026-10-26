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
    <main className="min-h-screen bg-[#f4f2e9] px-5 py-12 text-[#252b25] sm:py-16">
      <section className="mx-auto max-w-xl border-t-2 border-[#294936] pt-5">
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl">Elige una contraseña nueva</h1>
        <p className="mt-3 leading-7 text-[#596259]">Usa al menos ocho caracteres para proteger tu cuenta.</p>

        {errorMessage && (
          <p role="alert" className="mt-6 border-l-4 border-[#a04435] bg-white px-4 py-3 text-sm leading-6">{errorMessage}</p>
        )}

        <form action={updatePassword} className="mt-7 space-y-5">
          <div>
            <label htmlFor="new-password" className="text-sm font-semibold">Nueva contraseña</label>
            <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={8} required className="mt-2 min-h-12 w-full border border-[#d3d3c7] bg-white px-3 py-3 text-base outline-none focus:border-[#294936] focus:ring-1 focus:ring-[#294936]" />
          </div>
          <div>
            <label htmlFor="password-confirmation" className="text-sm font-semibold">Confirma la contraseña</label>
            <input id="password-confirmation" name="password_confirmation" type="password" autoComplete="new-password" minLength={8} required className="mt-2 min-h-12 w-full border border-[#d3d3c7] bg-white px-3 py-3 text-base outline-none focus:border-[#294936] focus:ring-1 focus:ring-[#294936]" />
          </div>
          <button type="submit" className="min-h-12 w-full bg-[#294936] px-5 py-3 text-base font-semibold text-white hover:bg-[#203d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936]">
            Actualizar contraseña
          </button>
        </form>
      </section>
    </main>
  );
}
