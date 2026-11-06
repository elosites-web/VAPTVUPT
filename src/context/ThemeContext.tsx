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

/**
 * Avalia a preferência do sistema operacional por tema escuro:
 * Utiliza matchMedia('(prefers-color-scheme: dark)') e tem fallback para o horário local.
 */
export function getSystemIsDark(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia) {
      const query = window.matchMedia('(prefers-color-scheme: dark)');
      if (query && typeof query.matches === 'boolean') {
        return query.matches;
      }
    }
  } catch {
    // Fallback para horário local se matchMedia não estiver disponível
  }
  return isLocalNightTime();
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa o modo lendo a preferência salva no localStorage, ou 'auto' por padrão
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'auto';
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('vaptvupt-theme');
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        return saved;
      }
    } catch {
      // Ignora erro de acesso a storage
    }
    return 'auto';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => getSystemIsDark());

  // Escuta alterações na preferência do sistema operacional e no relógio local
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSystemTheme = () => {
      const dark = getSystemIsDark();
      setSystemIsDark((prev) => (prev !== dark ? dark : prev));
    };

    updateSystemTheme();

    let mediaQuery: MediaQueryList | null = null;
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    if (window.matchMedia) {
      try {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleMediaChange);
        } else if (mediaQuery.addListener) {
          mediaQuery.addListener(handleMediaChange);
        }
      } catch {
        // Ignora erro
      }
    }

    // Reavaliação periódica (cruzar fronteiras de horário local 06h / 18h se sistema for neutro)
    const intervalId = window.setInterval(updateSystemTheme, 30000);
    window.addEventListener('focus', updateSystemTheme);
    document.addEventListener('visibilitychange', updateSystemTheme);

    return () => {
      if (mediaQuery) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleMediaChange);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleMediaChange);
        }
      }
      window.clearInterval(intervalId);
      window.removeEventListener('focus', updateSystemTheme);
      document.removeEventListener('visibilitychange', updateSystemTheme);
    };
  }, []);

  // Compute resolved boolean: whether the interface should render dark (Noite)
  const isDarkMode = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return systemIsDark; // 'auto' mode segue a preferência do sistema operacional
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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('themechange'));
    }
  }, [isDarkMode]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignora erro de gravação no storage
    }
  };

  const toggleTheme = () => {
    // Ciclo entre: auto -> light (Dia) -> dark (Noite) -> auto
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
