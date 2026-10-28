import fs from 'fs';
const path = 'c:/Users/USUARIO/python-pe1-academy/src/components/ThemeSelector.tsx';
const content = `'use client';

import { useTheme } from '@/app/theme-provider';
import { useState } from 'react';

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

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex min-h-11 items-center gap-2 px-3 py-2 text-xs font-semibold text-[var(--theme-muted)] underline underline-offset-4 hover:[color:var(--theme-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
        aria-label="Seleccionar tema visual"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current" style={{ color: THEMES.find((t) => t.id === theme)?.color }}>
            <span className="h-2 w-2 rounded-full bg-current" />
          </span>
          <span style={{ color: 'var(--theme-ink)' }}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
          <span className="text-xs opacity-60">▾</span>
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)', borderWidth: '1px', borderStyle: 'solid' }}>
          <p className="mx-3 mb-2 text-[10px] font-bold tracking-[0.2em] text-[var(--theme-muted)] uppercase">Tema visual</p>
          <div className="space-y-1">
            {THEMES.map((themeOption) => (
              <button
                key={themeOption.id}
                type="button"
                onClick={() => { setTheme(themeOption.id); setIsOpen(false); }}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors"
                style={{ backgroundColor: theme === themeOption.id ? 'var(--theme-accent-light)' : 'transparent', color: theme === themeOption.id ? 'var(--theme-accent)' : 'var(--theme-muted)' }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current" style={{ color: themeOption.color }}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                </span>
                <span style={{ color: 'var(--theme-ink)' }}>{themeOption.label}</span>
                <span className="text-[10px] opacity-50" style={{ color: 'var(--theme-muted)' }}>{themeOption.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path, content, 'utf8');
console.log('ThemeSelector written');
