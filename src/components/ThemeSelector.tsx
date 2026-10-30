'use client';

import { useTheme } from '@/app/theme-provider';
import { useEffect, useId, useRef, useState } from 'react';

type ThemeOption = {
  id: 'original' | 'dark' | 'dracula' | 'cyberpunk' | 'hacker' | 'rosa' | 'sistema';
  label: string;
  description: string;
  color: string;
};

const THEMES: ThemeOption[] = [
  { id: 'sistema', label: 'Sistema', description: 'Modo claro/oscuro del dispositivo', color: '#6b7280' },
  { id: 'original', label: 'Original', description: 'Papel cálido y verde bosque', color: '#294936' },
  { id: 'dark', label: 'Oscuro', description: 'Superficies en capas, sin brillos', color: '#3b82f6' },
  { id: 'dracula', label: 'Drácula', description: 'Violeta profundo y carbón', color: '#bd93f9' },
  { id: 'cyberpunk', label: 'Cyberpunk', description: 'Neón cian y magenta sobre negro', color: '#00ffff' },
  { id: 'hacker', label: 'Hacker', description: 'Verde fósforo sobre negro', color: '#00ff41' },
  { id: 'rosa', label: 'Rosa', description: 'Rosas suaves con frambuesa oscuro', color: '#be185d' },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  return (
    <div className={`relative inline-block ${isOpen ? 'z-[90]' : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-11 items-center gap-2 px-3 py-2 text-xs font-semibold text-[var(--theme-muted)] underline underline-offset-4 hover:[color:var(--theme-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
        aria-label="Seleccionar tema visual"
        aria-controls={panelId}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current" style={{ color: THEMES.find((t) => t.id === theme)?.color }}>
            <span className="h-2 w-2 rounded-full bg-current" />
          </span>
          <span style={{ color: 'var(--theme-ink)' }}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
          <span className="text-xs opacity-60" aria-hidden="true">▾</span>
        </span>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Cerrar selector de tema"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[80] cursor-default bg-black/20 sm:bg-transparent"
          />
          <div
            id={panelId}
            role="region"
            aria-label="Tema visual"
            className="fixed left-3 right-3 top-[calc(env(safe-area-inset-top)+4.5rem)] z-[100] mx-auto max-h-[calc(100dvh-5.5rem)] w-auto max-w-md overflow-y-auto overscroll-contain rounded-xl border p-3 shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-[min(70vh,32rem)] sm:w-72 sm:max-w-none"
            style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
          >
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--theme-muted)] uppercase">Tema visual</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-9 items-center rounded-md px-3 text-xs font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] sm:hidden"
              >
                Cerrar
              </button>
            </div>
            <div className="space-y-1">
              {THEMES.map((themeOption) => (
                <button
                  key={themeOption.id}
                  type="button"
                  onClick={() => {
                    setTheme(themeOption.id);
                    setIsOpen(false);
                  }}
                  aria-pressed={theme === themeOption.id}
                  className="flex w-full min-w-0 items-start gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--theme-focus-ring)]"
                  style={{
                    backgroundColor: theme === themeOption.id ? 'var(--theme-accent-light)' : 'transparent',
                    color: theme === themeOption.id ? 'var(--theme-accent)' : 'var(--theme-muted)',
                  }}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current" style={{ color: themeOption.color }}>
                    <span className="h-2 w-2 rounded-full bg-current" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words font-medium" style={{ color: 'var(--theme-ink)' }}>{themeOption.label}</span>
                    <span className="mt-0.5 block whitespace-normal break-words text-xs leading-5" style={{ color: 'var(--theme-muted)' }}>{themeOption.description}</span>
                  </span>
                  {theme === themeOption.id && (
                    <span className="shrink-0 pt-0.5 text-xs font-bold" style={{ color: 'var(--theme-accent)' }} aria-label="Tema seleccionado">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
