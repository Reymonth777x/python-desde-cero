'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type ThemeName = 'original' | 'dark';

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = 'python-desde-cero-theme';

function leerTemaGuardado(): ThemeName {
  if (typeof window === 'undefined') return 'original';
  try {
    const guardado = localStorage.getItem(THEME_KEY);
    if (guardado === 'original' || guardado === 'dark') {
      return guardado;
    }
  } catch {
    // Ignorar errores de localStorage
  }
  return 'original';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(leerTemaGuardado);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Silently ignore if localStorage is unavailable
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
