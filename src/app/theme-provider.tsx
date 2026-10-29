'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

export type ThemeName =
  | 'original'
  | 'dark'
  | 'dracula'
  | 'cyberpunk'
  | 'hacker'
  | 'rosa'
  | 'sistema';

type ThemeContextValue = {
  theme: ThemeName;
  resolvedTheme: 'original' | 'dark';
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = 'python-desde-cero-theme';

function leerTemaGuardado(): ThemeName {
  if (typeof window === 'undefined') return 'sistema';
  try {
    const guardado = localStorage.getItem(THEME_KEY);
    if (
      guardado === 'original' ||
      guardado === 'dark' ||
      guardado === 'dracula' ||
      guardado === 'cyberpunk' ||
      guardado === 'hacker' ||
      guardado === 'rosa' ||
      guardado === 'sistema'
    ) {
      return guardado;
    }
  } catch {
    // Ignorar errores de localStorage
  }
  return 'sistema';
}

function resolverTemaSistema(): 'original' | 'dark' {
  if (typeof window === 'undefined') return 'original';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'original';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('sistema');

  const resolvedTheme = useMemo(() => {
    if (theme === 'sistema') return resolverTemaSistema();
    return theme === 'dark' ? 'dark' : 'original';
  }, [theme]);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Silently ignore if localStorage is unavailable
    }
  }, []);

  useEffect(() => {
    // Read localStorage after hydration to keep the server and client initial render identical.
    setThemeState(leerTemaGuardado());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme === 'sistema' ? resolvedTheme : theme);
    root.setAttribute('data-color-scheme', resolvedTheme);
  }, [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
