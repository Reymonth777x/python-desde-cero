
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type ProgressStatus =
  | 'loading'
  | 'signed-out'
  | 'pending'
  | 'completed'
  | 'error';

export default function LessonProgress() {
  const [status, setStatus] = useState<ProgressStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    let requestId = 0;
    const supabase = createClient();

    async function loadProgress() {
      const currentRequestId = ++requestId;
      setStatus('loading');
      setMessage('');

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (active && currentRequestId === requestId) {
            setStatus('signed-out');
            setMessage('No se detectó una sesión activa. Inicia sesión e inténtalo de nuevo.');
          }
          return;
        }

        const { data, error } = await supabase
          .from('progress')
          .select('is_completed')
          .eq('user_id', user.id)
          .eq('module_id', 'module-1')
          .eq('lesson_id', 'b1-l1')
          .maybeSingle();

        if (error) {
          console.error('Error leyendo el progreso:', error);
          throw error;
        }

        if (!active || currentRequestId !== requestId) return;

        if (data?.is_completed === true) {
          setStatus('completed');
          setMessage('Tu progreso se recuperó correctamente.');
        } else {
          setStatus('pending');
          setMessage(
            'No se encontró una lección completada para esta cuenta. Comprueba que el usuario y la lección coincidan.'
          );
        }
      } catch (error) {
        console.error('No se pudo recuperar el progreso:', error);

        if (active && currentRequestId === requestId) {
          setStatus('error');
          setMessage(
            'No se pudo leer el progreso. Revisa la consola del navegador para ver el error.'
          );
        }
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setStatus('loading');
      setMessage('');
      Promise.resolve().then(() => void loadProgress());
    });

    void loadProgress();

    return () => {
      active = false;
      requestId += 1;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <section className="mt-6 border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] p-5">
      <h2 className="text-lg font-semibold">Progreso de la lección</h2>

      <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">
        Tu avance se guarda en tu cuenta y se recupera al volver al laboratorio.
      </p>

      <p className="mt-4 text-sm text-[var(--theme-muted)]" aria-live="polite">
        {status === 'loading' && 'Consultando tu progreso...'}
        {status === 'signed-out' && 'Estado: sesión no iniciada'}
        {status === 'pending' && 'Estado: pendiente'}
        {status === 'completed' && 'Estado: completada'}
        {status === 'error' && 'Estado: no se pudo comprobar'}
      </p>

      {status === 'signed-out' && (
        <Link href="/login" className="mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">
          Iniciar sesión para consultar tu avance
        </Link>
      )}
      {(status === 'pending' || status === 'error') && (
        <Link href="/academia/module-1/b1-l1" className="mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">
          Completar la comprobación en la academia
        </Link>
      )}
      {status === 'completed' && (
        <Link href="/academia" className="mt-4 inline-flex min-h-11 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">
          Ver el resto de la ruta formativa
        </Link>
      )}

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 text-sm text-[var(--theme-muted)]"
        >
          {message}
        </p>
      )}
    </section>
  );
}
