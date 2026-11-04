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

/**
 * Avalia se o horário local do dispositivo está na faixa noturna:
 * - Das 06:00 às 17:59 -> Dia (Claro) => isDark = false
 * - Das 18:00 às 05:59 -> Noite (Escuro) => isDark = true
 */
export function isLocalNightTime(date: Date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= 18 || hour < 6;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
        if (stored === 'light' || stored === 'dark' || stored === 'auto') {
          return stored;
        }
      } catch {
        // Ignore storage access errors
      }
    }
    return 'auto'; // Automático por padrão quando não houver escolha manual salva
  });

  const [clockIsDark, setClockIsDark] = useState<boolean>(() => isLocalNightTime());

  // Reavalia periodicamente o horário local para atualizar automaticamente ao cruzar 06:00 ou 18:00
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkLocalTime = () => {
      const night = isLocalNightTime();
      setClockIsDark((prev) => (prev !== night ? night : prev));
    };

    checkLocalTime();
    const intervalId = window.setInterval(checkLocalTime, 30000);
    window.addEventListener('focus', checkLocalTime);
    document.addEventListener('visibilitychange', checkLocalTime);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', checkLocalTime);
      document.removeEventListener('visibilitychange', checkLocalTime);
    };
  }, []);

  // Compute resolved boolean: whether the interface should render dark (Noite)
  const isDarkMode = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return clockIsDark; // 'auto' mode follows 06:00-17:59 Dia / 18:00-05:59 Noite
  }, [theme, clockIsDark]);

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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('themechange'));
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
    // Cycle between: auto -> light (Dia) -> dark (Noite) -> auto
    if (theme === 'auto') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('auto');
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
    const fallbackDark = isLocalNightTime();
    return {
      theme: 'auto',
      isDarkMode: fallbackDark,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
};
