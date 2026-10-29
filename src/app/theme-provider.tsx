'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  useState,
} from 'react';

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
const THEME_CHANGE_EVENT = 'python-desde-cero-theme-change';

function isThemeName(value: string | null): value is ThemeName {
  return value === 'original' ||
    value === 'dark' ||
    value === 'dracula' ||
    value === 'cyberpunk' ||
    value === 'hacker' ||
    value === 'rosa' ||
    value === 'sistema';
}

function readStoredTheme(): ThemeName {
  if (typeof window === 'undefined') return 'sistema';
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    return isThemeName(stored) ? stored : 'sistema';
  } catch {
    return 'sistema';
  }
}

function subscribeToTheme(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_KEY || event.key === null) callback();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getServerThemeSnapshot(): ThemeName {
  // Must match the default HTML attributes during SSR and hydration.
  return 'sistema';
}

function resolveSystemTheme(): 'original' | 'dark' {
  if (typeof window === 'undefined') return 'original';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'original';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const persistedTheme = useSyncExternalStore(
    subscribeToTheme,
    readStoredTheme,
    getServerThemeSnapshot,
  );
  // Keep an immediate in-memory selection as well as the persisted snapshot.
  // This makes a click update the UI synchronously; the subscription remains
  // responsible for re-reading a saved theme on reload and across browser tabs.
  const [themeOverride, setThemeOverride] = useState<ThemeName | null>(null);
  const theme = themeOverride ?? persistedTheme;

  const resolvedTheme = useMemo(() => {
    if (theme === 'sistema') return resolveSystemTheme();
    return theme === 'dark' ? 'dark' : 'original';
  }, [theme]);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeOverride(next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // The current page still changes theme if localStorage is unavailable.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
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
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
