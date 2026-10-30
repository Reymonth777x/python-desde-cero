'use client';

import { useEffect, useRef, useState } from 'react';

export function TurnstileWidget({ siteKey }: { siteKey: string }) {
  const widgetRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isReady, setIsReady] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!window.turnstile;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsReady(true);
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (
      !isReady ||
      !containerRef.current ||
      typeof window === 'undefined' ||
      !window.turnstile
    )
      return;

    widgetRef.current = window.turnstile!.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        if (inputRef.current) inputRef.current.value = token;
      },
      action: 'login',
    });

    return () => {
      if (widgetRef.current !== null) {
        window.turnstile!.remove(widgetRef.current);
        widgetRef.current = null;
      }
    };
  }, [isReady, siteKey]);

  return (
    <>
      <div ref={containerRef} />
      <input
        ref={inputRef}
        type="hidden"
        name="captchaToken"
        defaultValue=""
      />
    </>
  );
}
