import Link from 'next/link';
import { logout } from '@/app/login/actions';
import { createClient } from '@/lib/supabase/server';

export default async function HomeAccountLinks() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error && user) {
    return (
      <>
        <Link href="/academia" className="inline-flex min-h-10 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">
          Mi progreso
        </Link>
        <form action={logout}>
          <button type="submit" className="inline-flex min-h-10 items-center text-sm text-[var(--theme-muted)] underline underline-offset-4 hover:text-[var(--theme-ink)]">
            Cerrar sesión
          </button>
        </form>
      </>
    );
  }

  return (
    <Link href="/login" className="inline-flex min-h-10 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">
      Iniciar sesión
    </Link>
  );
}
