
'use client';

import {
  createContext,
  useContext,
  useSyncExternalStore,
} from 'react';

type ThemeContextType = {
  dark: boolean;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  toggle: () => {},
});

const THEME_KEY = 'togetherly-theme';

function getThemeSnapshot() {
  return localStorage.getItem(THEME_KEY) === 'dark';
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('theme-change', callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('theme-change', callback);
  };
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dark = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerSnapshot
  );

  const toggle = () => {
    const next = !dark;

    localStorage.setItem(
      THEME_KEY,
      next ? 'dark' : 'light'
    );

    document.documentElement.classList.toggle('dark', next);

    window.dispatchEvent(new Event('theme-change'));
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);


