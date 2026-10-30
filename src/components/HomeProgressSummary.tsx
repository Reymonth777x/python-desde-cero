'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { courseModules } from '@/lib/course';
import { createClient } from '@/lib/supabase/client';

type State =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'error' }
  | { status: 'member'; completed: number; total: number };

const TOTAL_LESSONS = courseModules.reduce((sum, courseModule) => sum + courseModule.lessons.length, 0);

export default function HomeProgressSummary() {
  const supabase = useMemo(() => createClient(), []);
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    async function loadProgress(userId: string) {
      const { data, error } = await supabase
        .from('progress')
        .select('is_completed')
        .eq('user_id', userId);

      if (!active) return;
      if (error) {
        setState({ status: 'error' });
        return;
      }

      const completed = (data ?? []).filter((row) => row.is_completed === true).length;
      setState({ status: 'member', completed, total: TOTAL_LESSONS });
    }

    supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error || !data.user) {
        setState({ status: 'guest' });
        return;
      }
      void loadProgress(data.user.id);
    }).catch(() => {
      if (active) setState({ status: 'guest' });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) {
        void loadProgress(session.user.id);
      } else {
        setState({ status: 'guest' });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (state.status === 'loading' || state.status === 'guest') return null;

  if (state.status === 'error') {
    return (
      <div className="mt-6 max-w-xl border-l-2 border-[var(--theme-border)] px-4 py-3 text-sm text-[var(--theme-muted)]">
        Tu sesión está iniciada, pero no se pudo consultar el avance ahora.
        <Link href="/academia" className="ml-2 font-semibold text-[var(--theme-accent)] underline underline-offset-4">Abrir mi ruta</Link>
      </div>
    );
  }

  const percent = state.total > 0 ? Math.round((state.completed / state.total) * 100) : 0;
  return (
    <section aria-label="Tu progreso de aprendizaje" className="mt-6 max-w-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-[0.14em] text-[var(--theme-accent)]">TU PROGRESO</p>
        <p className="font-mono text-sm text-[var(--theme-ink)]">{state.completed}/{state.total} lecciones · {percent}%</p>
      </div>
      <div className="mt-3 h-2 w-full bg-[var(--theme-bg-secondary)]" role="progressbar" aria-label="Progreso del curso" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="h-full bg-[var(--theme-accent)] transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      <Link href="/academia" className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">Continuar aprendiendo</Link>
    </section>
  );
}
