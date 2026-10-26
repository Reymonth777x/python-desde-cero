'use client';

import { useTheme } from '@/app/theme-provider';
import { useState } from 'react';

type ThemeOption = {
  id: 'original' | 'dark' | 'hacker' | 'dracula' | 'cyberpunk';
  label: string;
  description: string;
  color: string;
};

const THEMES: ThemeOption[] = [
  {
    id: 'original',
    label: 'Original',
    description: 'Diseño crema y verde bosque',
    color: '#294936',
  },
  {
    id: 'dark',
    label: 'Oscuro',
    description: 'Espacio de trabajo sobrio',
    color: '#3b82f6',
  },
  {
    id: 'hacker',
    label: 'Hacker',
    description: 'Terminal verde carbón',
    color: '#00ff41',
  },
  {
    id: 'dracula',
    label: 'Dracula',
    description: 'Editor morado y violeta',
    color: '#bd93f9',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    description: 'Laboratorio futurista cian',
    color: '#00ffff',
  },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex min-h-11 items-center gap-2 px-3 py-2 text-xs font-semibold text-[#596259] underline underline-offset-4 hover:text-[#294936] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936]"
        aria-label="Seleccionar tema visual"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current" style={{ color: THEMES.find((t) => t.id === theme)?.color }}>
            <span className="h-2 w-2 rounded-full bg-current" />
          </span>
          <span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
          <span className="text-xs opacity-60">▾</span>
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#ffffff] border border-[#d3d3c7] rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="mx-3 mb-2 text-[10px] font-bold tracking-[0.2em] text-[#596259] uppercase">Tema visual</p>
          <div className="space-y-1">
            {THEMES.map((themeOption) => (
              <button
                key={themeOption.id}
                type="button"
                onClick={() => {
                  setTheme(themeOption.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  theme === themeOption.id
                    ? 'bg-[#ebe9df] text-[#294936]'
                    : 'text-[#596259] hover:bg-[#f4f2e9] hover:text-[#294936]'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current" style={{ color: themeOption.color }}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                </span>
                <span>{themeOption.label}</span>
                <span className="text-[10px] opacity-50">{themeOption.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
