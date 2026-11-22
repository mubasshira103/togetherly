'use client';

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
});

const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

const listeners = new Set<() => void>();

// The stored value is either "light", "dark", or absent ("follow the OS").
function readDark() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
  } catch {
    // localStorage can throw (private mode, blocked storage) — fall back to the OS.
  }
  return window.matchMedia(DARK_QUERY).matches;
}

// Mirrors the inline script in layout.tsx so the DOM and React agree.
function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
}

// Hydration-safe: React uses getServerSnapshot for the first client render,
// then re-renders with the real value, so the markup always matches.
function getSnapshot() {
  return readDark();
}

function getServerSnapshot() {
  return false;
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);

  // Keep <html> in sync when the OS theme or another tab changes it.
  const sync = () => {
    applyTheme(readDark());
    onChange();
  };

  listeners.add(onChange);
  media.addEventListener('change', sync);
  window.addEventListener('storage', sync);

  return () => {
    listeners.delete(onChange);
    media.removeEventListener('change', sync);
    window.removeEventListener('storage', sync);
  };
}

function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore: the theme still applies for this page view.
  }
  applyTheme(theme === 'dark');
  for (const listener of listeners) listener();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Re-apply after hydration. In development React remounts once and resets
  // <html> attributes, which drops the class the inline script set before paint.
  useEffect(() => {
    applyTheme(readDark());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: isDark ? 'dark' : 'light', setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
