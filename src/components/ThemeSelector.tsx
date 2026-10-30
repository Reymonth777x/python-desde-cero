'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/app/theme-provider';

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
  const id = useId();
  const selectorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const desktopPanelRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (
        selectorRef.current?.contains(target) ||
        mobilePanelRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const firstOption = isMobile
      ? mobilePanelRef.current?.querySelector<HTMLButtonElement>('[data-theme-option]')
      : desktopPanelRef.current?.querySelector<HTMLButtonElement>('[data-theme-option]');

    firstOption?.focus();
  }, [isOpen]);

  const selectTheme = (nextTheme: ThemeOption['id']) => {
    setTheme(nextTheme);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const themeButtons = THEMES.map((themeOption) => {
    const selected = theme === themeOption.id;

    return (
      <button
        key={themeOption.id}
        type="button"
        data-theme-option
        aria-pressed={selected}
        onClick={() => selectTheme(themeOption.id)}
        className="flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--theme-focus-ring)]"
        style={{
          backgroundColor: selected ? 'var(--theme-accent-light)' : 'transparent',
        }}
      >
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current"
          style={{ color: themeOption.color }}
          aria-hidden="true"
        >
          <span className="h-2 w-2 rounded-full bg-current" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className="block font-medium leading-5"
            style={{ color: 'var(--theme-ink)' }}
          >
            {themeOption.label}
          </span>
          <span
            className="block whitespace-normal break-words text-[11px] leading-4"
            style={{ color: 'var(--theme-muted)' }}
          >
            {themeOption.description}
          </span>
        </span>
        {selected && (
          <span
            className="shrink-0 text-sm font-bold"
            style={{ color: 'var(--theme-accent)' }}
            aria-hidden="true"
          >
            ✓
          </span>
        )}
      </button>
    );
  });

  return (
    <div ref={selectorRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-11 items-center gap-2 px-3 py-2 text-xs font-semibold text-[var(--theme-muted)] underline underline-offset-4 hover:[color:var(--theme-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
        aria-label="Seleccionar tema visual"
        aria-expanded={isOpen}
        aria-controls={`theme-options-desktop-${id} theme-options-mobile-${id}`}
        aria-haspopup="dialog"
      >
        <span className="flex items-center gap-1.5">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full border border-current"
            style={{ color: THEMES.find((item) => item.id === theme)?.color }}
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full bg-current" />
          </span>
          <span style={{ color: 'var(--theme-ink)' }}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </span>
          <span className="text-xs opacity-60" aria-hidden="true">▾</span>
        </span>
      </button>

      {isOpen && (
        <div
          id={`theme-options-desktop-${id}`}
          ref={desktopPanelRef}
          role="group"
          aria-labelledby={`theme-title-desktop-${id}`}
          className="absolute right-0 z-50 mt-2 hidden w-72 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-lg border py-2 shadow-xl md:block"
          style={{
            maxHeight: 'min(70vh, 32rem)',
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <p
            id={`theme-title-desktop-${id}`}
            className="mx-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'var(--theme-muted)' }}
          >
            Tema visual
          </p>
          <div className="space-y-1 px-1">{themeButtons}</div>
        </div>
      )}

      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-3 py-4 md:hidden"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            id={`theme-options-mobile-${id}`}
            ref={mobilePanelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`theme-title-mobile-${id}`}
            className="flex w-full max-w-sm flex-col overflow-hidden rounded-xl border shadow-2xl"
            style={{
              maxHeight: 'min(82dvh, 36rem)',
              backgroundColor: 'var(--theme-surface)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--theme-border)' }}>
              <div className="min-w-0">
                <p
                  id={`theme-title-mobile-${id}`}
                  className="text-sm font-bold"
                  style={{ color: 'var(--theme-ink)' }}
                >
                  Tema visual
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--theme-muted)' }}>
                  Elige cómo quieres ver la academia.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xl leading-none hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
                style={{ color: 'var(--theme-ink)' }}
                aria-label="Cerrar selección de tema"
              >
                ×
              </button>
            </div>
            <div data-theme-options className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              <div className="space-y-1">{themeButtons}</div>
            </div>
          </section>
        </div>,
        document.body,
      )}
    </div>
  );
}
