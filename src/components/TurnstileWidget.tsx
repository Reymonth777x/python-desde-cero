'use client';

import { useEffect, useRef, useState } from 'react';

type TurnstileStatus = 'loading' | 'ready' | 'verified' | 'expired' | 'error';

type Props = {
  siteKey: string;
  action?: 'login' | 'signup' | 'password-reset';
};

export function TurnstileWidget({ siteKey, action = 'login' }: Props) {
  const widgetRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isReady, setIsReady] = useState(
    () => typeof window !== 'undefined' && Boolean(window.turnstile),
  );
  const [status, setStatus] = useState<TurnstileStatus>(
    () => (typeof window !== 'undefined' && window.turnstile ? 'ready' : 'loading'),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // State initializers already reflect a script loaded before this component mounted.
    if (window.turnstile) return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-turnstile-loader="true"]',
    );

    const handleLoad = () => {
      if (window.turnstile) {
        setIsReady(true);
        setStatus('ready');
      } else {
        setStatus('error');
      }
    };
    const handleError = () => setStatus('error');

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        queueMicrotask(handleLoad);
      } else {
        existingScript.addEventListener('load', handleLoad);
        existingScript.addEventListener('error', handleError);
      }

      return () => {
        existingScript.removeEventListener('load', handleLoad);
        existingScript.removeEventListener('error', handleError);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.turnstileLoader = 'true';
    script.onload = () => {
      script.dataset.loaded = 'true';
      handleLoad();
    };
    script.onerror = handleError;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  useEffect(() => {
    if (
      !isReady ||
      !containerRef.current ||
      typeof window === 'undefined' ||
      !window.turnstile
    ) {
      return;
    }

    try {
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        callback: (token: string) => {
          if (inputRef.current) inputRef.current.value = token;
          setStatus('verified');
        },
        'expired-callback': () => {
          if (inputRef.current) inputRef.current.value = '';
          setStatus('expired');
          if (widgetRef.current !== null) {
            window.turnstile?.reset(widgetRef.current);
          }
        },
        'error-callback': () => {
          if (inputRef.current) inputRef.current.value = '';
          setStatus('error');
        },
      });
    } catch {
      queueMicrotask(() => setStatus('error'));
    }

    return () => {
      if (widgetRef.current !== null) {
        window.turnstile?.remove(widgetRef.current);
        widgetRef.current = null;
      }
    };
  }, [action, isReady, siteKey]);

  const statusMessage = {
    loading: 'Cargando verificación de seguridad…',
    ready: '',
    verified: 'Verificación completada.',
    expired: 'La verificación caducó. Completa de nuevo el control.',
    error: 'No se pudo cargar la verificación. Recarga la página e inténtalo de nuevo.',
  }[status];

  return (
    <div className="space-y-2" role="group" aria-label="Verificación de seguridad">
      <div
        ref={containerRef}
        data-testid="turnstile-widget"
        data-sitekey={siteKey}
      />
      {statusMessage && (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className="text-xs text-[var(--theme-muted)]"
        >
          {statusMessage}
        </p>
      )}
      <input
        ref={inputRef}
        type="hidden"
        name="captchaToken"
        defaultValue=""
      />
    </div>
  );
}
