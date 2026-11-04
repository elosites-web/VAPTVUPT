import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'vaptvupt-theme-mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        return stored;
      }
    }
    return 'dark'; // Dark theme default for institutional brand
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Listen to system OS preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Compute resolved boolean: whether the interface should render dark
  const isDarkMode = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return systemIsDark; // 'auto' mode
  }, [theme, systemIsDark]);

  // Apply classes and attributes to HTML document element
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDarkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
      body.classList.remove('light');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
  };

  const toggleTheme = () => {
    // Cycle between: dark -> light -> auto -> dark
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('auto');
    else setTheme('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback safe defaults if used outside provider
    return {
      theme: 'dark',
      isDarkMode: true,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
};
