import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowUpRight, ShieldCheck, Clock } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { useNav } from '../context/NavContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { mobileMenuOpen, setMobileMenuOpen } = useNav();
  const { isDarkMode } = useTheme();
  const location = useLocation();

  // Detect scroll offset for adaptive glass blur & height
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer and remove veil on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll and handle ESC key when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Início', path: '/' },
    { label: 'A Empresa', path: '/empresa' },
    { label: 'Serviços', path: '/servicos' },
    { label: 'Estrutura & Frota', path: '/frota' },
    { label: 'Perguntas Frequentes', path: '/perguntas-frequentes' },
    { label: 'Trabalhe Conosco', path: '/trabalhe-conosco' },
    { label: 'Contato', path: '/contato' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-header-entrance ${
          isDarkMode
            ? isScrolled
              ? 'glass-header-dark-scrolled border-b border-neutral-800/80 shadow-2xl py-2.5 sm:py-3'
              : 'glass-header-dark border-b border-white/[0.06] shadow-lg shadow-black/20 py-3.5 sm:py-4'
            : isScrolled
              ? 'glass-header-light-scrolled border-b border-neutral-200/90 shadow-xl py-2.5 sm:py-3'
              : 'glass-header-light border-b border-neutral-200/60 shadow-md py-3.5 sm:py-4'
        }`}
      >
        {/* Top Institutional Gradient Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B43034] via-[#E53E3E] to-transparent opacity-90 pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Brand Logo with adaptive theme and responsive width limit */}
            <Link
              to="/"
              className="flex items-center shrink-0 min-w-0 focus:outline-none focus:ring-2 focus:ring-[#B43034] rounded-md transition-all duration-200 hover:opacity-95 hover:scale-[1.01]"
              aria-label="Vapt Vupt Remoção de Veículos - Início"
            >
              <img
                src={isDarkMode ? COMPANY_CONFIG.logos.horizontalWhite : COMPANY_CONFIG.logos.horizontalOriginal}
                alt="Vapt Vupt Remoção de Veículos"
                className="h-7 sm:h-9 md:h-10 w-auto max-w-[125px] xs:max-w-[155px] sm:max-w-none object-contain transition-all duration-300"
              />
            </Link>

            {/* Desktop Navigation Capsule */}
            <nav
              className="navbar hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-6"
              aria-label="Navegação Principal"
            >
              <div
                className={`navbar-container flex items-center justify-center gap-1.5 xl:gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-neutral-900/80 border border-neutral-800/90 shadow-inner shadow-black/40 backdrop-blur-md'
                    : 'bg-white/80 border border-neutral-200 shadow-sm backdrop-blur-md'
                }`}
              >
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `px-3.5 xl:px-4 py-1.5 font-heading text-xs xl:text-sm font-bold tracking-wider transition-all duration-200 rounded-full flex items-center justify-center text-center whitespace-nowrap leading-none ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-[#B43034] to-[#982226] shadow-md shadow-red-950/60'
                          : isDarkMode
                            ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
                            : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
                      }`
                    }
                  >
                    <span className="flex items-center justify-center leading-none">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
              {/* Real-time Status Badge (Desktop & Tablet) */}
              <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium px-2.5 py-1 rounded-full bg-neutral-900/40 border border-neutral-800/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-neutral-300 font-semibold tracking-wide">Remoção Leve e Pesada</span>
              </div>

              {/* Theme Toggle Component (Light / Dark / Auto) - Oculto quando menu mobile estiver aberto */}
              {!mobileMenuOpen && (
                <div className="shrink-0 transition-opacity duration-200" title="Alternar Modo de Tema">
                  <ThemeToggle variant="compact" />
                </div>
              )}

              {/* Direct WhatsApp Call CTA - Oculto quando menu mobile estiver aberto */}
              {!mobileMenuOpen && (
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    COMPANY_CONFIG.whatsapp.defaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group button-3d relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B43034] via-[#C7383D] to-[#982226] text-white text-xs font-bold uppercase tracking-wider p-2 sm:px-4 sm:py-2.5 rounded-lg border border-red-500/30 overflow-hidden shrink-0 focus:outline-none focus:ring-2 focus:ring-[#B43034] focus:ring-offset-2 focus:ring-offset-neutral-900"
                  aria-label="Solicitar Atendimento via WhatsApp"
                  title="Solicitar Atendimento no WhatsApp"
                >
                  {/* Subtle light sweep reflection */}
                  <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />

                  <WhatsAppIcon className="w-4 h-4 text-white fill-white shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline">Solicitar Atendimento</span>
                </a>
              )}

              {/* Mobile Menu Toggle Button (Hamburguer / Fechar) - Explicit visibility controls on mobile breakpoints */}
              <div className="inline-flex lg:hidden shrink-0 relative z-30 items-center justify-center">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`p-2 transition-colors rounded-lg border shrink-0 relative z-30 focus:outline-none focus:ring-2 focus:ring-[#B43034] ${
                    isDarkMode
                      ? 'text-neutral-300 hover:text-white bg-neutral-900/90 border-neutral-800 hover:bg-neutral-800'
                      : 'text-neutral-700 hover:text-neutral-900 bg-white/90 border-neutral-300 hover:bg-neutral-100'
                  }`}
                  aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? (
                    <X className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                  ) : (
                    <Menu className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Véu transparente opaco atrás do menu hamburguer aberto */}
      {/* Removido completamente da tela e do DOM quando o menu for fechado */}
      {mobileMenuOpen && (
        <>
          {/* Véu Transparente Opaco (Backdrop Overlay) */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Hambúrguer Mobile Drawer (sobre o véu, z-50) */}
          <div
            className={`lg:hidden fixed inset-x-0 top-[56px] sm:top-[64px] z-50 max-h-[calc(100vh-64px)] overflow-y-auto ${
              isDarkMode
                ? 'bg-[#141416]/98 border-neutral-800/80 text-white'
                : 'bg-white/98 border-slate-200 text-slate-900 shadow-2xl'
            } border-b px-4 pt-4 pb-8 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200`}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de Navegação Mobile"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick status bar inside mobile menu */}
            <div className={`flex items-center justify-between px-3 py-2 mb-2.5 rounded-lg text-xs ${
              isDarkMode
                ? 'bg-neutral-900/80 border border-neutral-800/70 text-neutral-300'
                : 'bg-slate-100 border border-slate-200 text-slate-700'
            }`}>
              <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                <Clock className="w-3.5 h-3.5 text-[#B43034]" />
                Atendimento Direto
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operação Disponível
              </span>
            </div>

            {/* Mobile Theme Toggle (3-state segmented pill: Claro / Escuro / Automático) */}
            <div className="mb-3.5 px-0.5">
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1 ${
                isDarkMode ? 'text-neutral-400' : 'text-slate-500'
              }`}>
                Preferência de Tema
              </p>
              <ThemeToggle variant="segmented" />
            </div>

            {/* Navigation links */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-between ${
                      isActive
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-[#B43034]/25 to-transparent text-white font-bold border-l-4 border-[#B43034]'
                          : 'bg-red-50 text-[#B43034] font-bold border-l-4 border-[#B43034]'
                        : isDarkMode
                          ? 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className={`w-4 h-4 ${isDarkMode ? 'text-neutral-500' : 'text-slate-400'}`} />
                </NavLink>
              ))}

              {/* Mobile CTA section */}
              <div className={`pt-4 mt-3 border-t ${
                isDarkMode ? 'border-neutral-800/80' : 'border-slate-200'
              } space-y-2.5`}>
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    COMPANY_CONFIG.whatsapp.defaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full button-3d flex items-center justify-center gap-2 bg-gradient-to-r from-[#B43034] via-[#C7383D] to-[#982226] text-white font-bold uppercase tracking-wider py-3.5 rounded-lg text-xs shadow-xl"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white fill-white shrink-0" />
                  <span>Chamar no WhatsApp Oficial</span>
                </a>

                <div className={`flex items-center justify-center gap-3 pt-2 text-xs ${
                  isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                }`}>
                  <a
                    href={`tel:${COMPANY_CONFIG.whatsapp.raw}`}
                    className={`flex items-center gap-1.5 transition-colors ${
                      isDarkMode ? 'hover:text-white' : 'hover:text-slate-900'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B43034]" />
                    <span>{COMPANY_CONFIG.whatsapp.display}</span>
                  </a>
                  <span className={isDarkMode ? 'text-neutral-700' : 'text-slate-300'}>•</span>
                  <span className={`flex items-center gap-1 ${
                    isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                  }`}>
                    <ShieldCheck className={`w-3.5 h-3.5 ${isDarkMode ? 'text-neutral-500' : 'text-slate-400'}`} />
                    Frota Própria
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
