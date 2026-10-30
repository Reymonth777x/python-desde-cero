'use client';

import { useTheme, type ThemeName } from '@/app/theme-provider';
import { useEffect, useId, useRef, useState } from 'react';

const THEMES = [
  { id: 'sistema', label: 'Sistema', color: '#6b7280' },
  { id: 'original', label: 'Original', color: '#294936' },
  { id: 'dark', label: 'Oscuro', color: '#1e293b' },
  { id: 'dracula', label: 'Drácula', color: '#bd93f9' },
  { id: 'cyberpunk', label: 'Cyberpunk', color: '#00ffff' },
  { id: 'hacker', label: 'Hacker', color: '#00ff41' },
  { id: 'rosa', label: 'Rosa', color: '#be185d' },
] as const;

export default function ThemeSelectorNav() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const closeWhenOutside = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', closeWhenOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeWhenOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${isOpen ? 'z-[90]' : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-10 items-center gap-2 rounded-md px-2 py-2 text-xs font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-surface)] hover:text-[var(--theme-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
        aria-label="Seleccionar tema"
        aria-controls={panelId}
        aria-expanded={isOpen}
      >
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current"
          style={{ color: THEMES.find((t) => t.id === theme)?.color }}
          aria-hidden="true"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        </span>
        <span>Tema</span>
        <span aria-hidden="true" className="opacity-60">▾</span>
      </button>
      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-label="Tema visual"
          className="absolute right-0 top-full z-50 mt-2 w-[min(13rem,calc(100vw-1.5rem))] rounded-xl border p-2 shadow-xl"
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
        >
          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-muted)]">
            Tema visual
          </p>
          <div className="space-y-1">
            {THEMES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setTheme(option.id as ThemeName);
                  setIsOpen(false);
                }}
                aria-pressed={theme === option.id}
                className="flex min-h-10 w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--theme-focus-ring)]"
                style={{
                  backgroundColor: theme === option.id ? 'var(--theme-accent-light)' : 'transparent',
                  color: 'var(--theme-ink)',
                }}
              >
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current"
                  style={{ color: option.color }}
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </span>
                <span className="min-w-0 flex-1 break-words">{option.label}</span>
                {theme === option.id && <span className="text-xs font-bold text-[var(--theme-accent)]" aria-label="Tema seleccionado">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
