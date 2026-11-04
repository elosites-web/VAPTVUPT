import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface ThemeToggleProps {
  /**
   * 'compact': Dropdown / icon button with menu (ideal for Desktop Header)
   * 'segmented': 3-button segmented pill (ideal for Mobile Drawer / Settings)
   */
  variant?: 'compact' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, isDarkMode, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      mode: 'auto',
      label: 'Automático',
      icon: <Laptop className="w-3.5 h-3.5 text-emerald-400" />,
      desc: 'Dia (06h–17h59) e Noite (18h–05h59) pelo horário local',
    },
    {
      mode: 'light',
      label: 'Dia',
      icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
      desc: 'Visual diurno claro de alto contraste',
    },
    {
      mode: 'dark',
      label: 'Noite',
      icon: <Moon className="w-3.5 h-3.5 text-blue-400" />,
      desc: 'Tema industrial noturno escuro',
    },
  ];

  // Render Segmented Pill (Used in Mobile Menu & Full width areas)
  if (variant === 'segmented') {
    return (
      <div
        className={`w-full p-1.5 rounded-xl border shadow-inner transition-colors ${
          isDarkMode
            ? 'bg-neutral-900/90 border-neutral-800/80'
            : 'bg-slate-100 border-slate-200'
        } ${className}`}
        role="radiogroup"
        aria-label="Seleção de Tema Visual"
      >
        <div className="grid grid-cols-3 gap-1">
          {options.map((opt) => {
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTheme(opt.mode)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B43034] ${
                  isSelected
                    ? 'bg-[#B43034] text-white shadow-md shadow-red-950/40'
                    : isDarkMode
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title={`${opt.label}: ${opt.desc}`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Render Compact Dropdown (Used in Desktop Header)
  const currentOpt = options.find((o) => o.mode === theme) || options[0];

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`theme-toggle-compact-btn inline-flex items-center gap-1.5 px-2.5 xl:px-3 h-8 sm:h-9 rounded-lg text-xs font-bold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B43034] ${
          isDarkMode
            ? 'bg-neutral-900/90 text-neutral-100 border-neutral-700/90 hover:bg-neutral-800 hover:text-white shadow-md shadow-black/30'
            : 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200/80 hover:border-slate-400 shadow-xs'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Tema visual ativo: ${currentOpt.label} (${isDarkMode ? 'Noite' : 'Dia'}). Clique para alterar entre Automático, Dia e Noite.`}
        title={`Tema: ${currentOpt.label} (${isDarkMode ? 'Noite' : 'Dia'})`}
      >
        <span className="shrink-0 flex items-center">{currentOpt.icon}</span>
        <span
          className={`theme-toggle-compact-label hidden md:inline tracking-wide capitalize ${
            isDarkMode ? 'text-neutral-100' : 'text-slate-900'
          }`}
        >
          {currentOpt.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isDarkMode ? 'text-neutral-400' : 'text-slate-600'
          } ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Opções de tema visual"
          className={`absolute right-0 mt-1.5 w-48 rounded-xl py-1.5 border z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl ${
            isDarkMode
              ? 'bg-neutral-900/95 border-neutral-800 text-neutral-200 shadow-2xl'
              : 'bg-white border-slate-200 text-slate-800 shadow-xl'
          }`}
        >
          <div
            className={`px-3 py-1.5 border-b mb-1 ${
              isDarkMode ? 'border-neutral-800/70 text-neutral-400' : 'border-slate-100 text-slate-500'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider">
              Tema Visual
            </p>
          </div>

          {options.map((opt) => {
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => {
                  setTheme(opt.mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                  isSelected
                    ? isDarkMode
                      ? 'text-white bg-[#B43034]/20 border-l-2 border-[#B43034]'
                      : 'text-[#B43034] bg-red-50 border-l-2 border-[#B43034] font-bold'
                    : isDarkMode
                      ? 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0">{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#B43034]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
