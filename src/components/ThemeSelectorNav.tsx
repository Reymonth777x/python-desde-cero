'use client';

import { useTheme, type ThemeName } from '@/app/theme-provider';

const THEMES: Array<{ id: ThemeName; label: string; color: string }> = [
  { id: 'sistema', label: 'Sistema', color: '#6b7280' },
  { id: 'original', label: 'Original', color: '#294936' },
  { id: 'dark', label: 'Oscuro', color: '#1e293b' },
  { id: 'dracula', label: 'Drácula', color: '#bd93f9' },
  { id: 'cyberpunk', label: 'Cyberpunk', color: '#00ffff' },
  { id: 'hacker', label: 'Hacker', color: '#00ff41' },
  { id: 'rosa', label: 'Rosa', color: '#be185d' },
];

export default function ThemeSelectorNav() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-[var(--theme-muted)] hover:text-[var(--theme-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
        aria-label="Seleccionar tema"
        aria-haspopup="true"
      >
        <span
          className="flex h-4 w-4 items-center justify-center rounded-full border border-current"
          style={{ color: THEMES.find((item) => item.id === theme)?.color }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      </button>
      <div
        className="absolute right-0 mt-1 w-48 rounded-lg shadow-lg py-2 z-50"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <p className="mx-3 mb-1 text-[10px] font-bold tracking-[0.2em] text-[var(--theme-muted)] uppercase">
          Tema
        </p>
        <div className="space-y-0.5">
          {THEMES.map((item) => {
            const isSelected = theme === item.id;
            const optionClass = isSelected
              ? 'bg-[var(--theme-accent)] text-[var(--theme-ink-inverse)]'
              : 'text-[var(--theme-ink)] hover:bg-[var(--theme-surface)] hover:text-[var(--theme-accent)]';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                aria-pressed={isSelected}
                className={[
                  'flex w-full items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                  optionClass,
                ].join(' ')}
              >
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full border border-current"
                  style={{ color: item.color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </span>
                <span style={{ color: 'var(--theme-ink)' }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
