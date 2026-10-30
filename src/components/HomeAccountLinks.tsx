'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { logout } from '@/app/login/actions';
import { createClient } from '@/lib/supabase/client';

export default function HomeAccountLinks() {
  const supabase = useMemo(() => createClient(), []);
  const [state, setState] = useState<'checking' | 'guest' | 'member'>('checking');

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (active) setState(!error && data.user ? 'member' : 'guest');
    }).catch(() => {
      if (active) setState('guest');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setState(session?.user ? 'member' : 'guest');
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (state === 'checking') {
    return <span aria-live="polite" className="inline-flex min-h-10 items-center text-sm text-[var(--theme-muted)]">Cuenta</span>;
  }

  if (state === 'member') {
    return (
      <>
        <Link href="/academia" className="inline-flex min-h-10 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">Mi progreso</Link>
        <form action={logout}>
          <button type="submit" className="inline-flex min-h-10 items-center text-sm text-[var(--theme-muted)] underline underline-offset-4 hover:text-[var(--theme-ink)]">Cerrar sesión</button>
        </form>
      </>
    );
  }

  return <Link href="/login" className="inline-flex min-h-10 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">Iniciar sesión</Link>;
}
