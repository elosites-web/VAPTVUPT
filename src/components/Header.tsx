import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowUpRight, ShieldCheck, Clock, ChevronDown } from 'lucide-react';
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

  const headerRef = useRef<HTMLElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const [headerHeight, setHeaderHeight] = useState(78);

  // Monitor dynamic header height on mount, resize, scroll, and orientation change
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('orientationchange', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('orientationchange', updateHeaderHeight);
    };
  }, [mobileMenuOpen, isScrolled]);

  // Detect scroll offset for adaptive glass blur & height
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  // Lock body scroll, manage accessible focus and ESC key when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      wasOpenRef.current = true;
      document.body.style.overflow = 'hidden';

      // Move focus to first interactive element inside drawer
      const focusTimer = window.setTimeout(() => {
        const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 20);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setMobileMenuOpen(false);
          toggleButtonRef.current?.focus();
          return;
        }

        if (e.key === 'Tab' && drawerRef.current) {
          const focusables = Array.from(
            drawerRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute('disabled'));

          if (toggleButtonRef.current) {
            focusables.unshift(toggleButtonRef.current);
          }

          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.clearTimeout(focusTimer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        toggleButtonRef.current?.focus();
      }
    }
  }, [mobileMenuOpen, setMobileMenuOpen]);

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
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[70] w-full max-w-[100vw] overflow-x-clip box-border transition-colors duration-300 animate-header-entrance ${
          isDarkMode
            ? isScrolled
              ? 'glass-header-dark-scrolled border-b border-neutral-800/80 shadow-2xl pb-2 sm:pb-2.5 landscape:pb-1.5'
              : 'glass-header-dark border-b border-white/[0.06] shadow-lg shadow-black/20 pb-2.5 sm:pb-3.5 landscape:pb-1.5'
            : isScrolled
              ? 'glass-header-light-scrolled border-b border-neutral-200/90 shadow-xl pb-2 sm:pb-2.5 landscape:pb-1.5'
              : 'glass-header-light border-b border-neutral-200/60 shadow-md pb-2.5 sm:pb-3.5 landscape:pb-1.5'
        }`}
      >
        {/* Top Institutional Gradient Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B43034] via-[#E53E3E] to-transparent opacity-90 pointer-events-none"
          aria-hidden="true"
        />

        {/* Identificação Minimalista de Protótipo Visual e Proposta Comercial (Sempre acima da Progress Bar) */}
        <div
          className={`w-full border-b px-2 sm:px-4 py-0.5 text-[9.5px] sm:text-[10.5px] leading-tight transition-colors select-none ${
            isDarkMode
              ? 'bg-neutral-950/90 border-neutral-800/80 text-yellow-400'
              : 'bg-amber-50/90 border-amber-200/80 text-amber-900'
          }`}
          role="region"
          aria-label="Aviso de Protótipo Comercial"
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                isDarkMode
                  ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.15)]'
                  : 'border-yellow-500/50 bg-yellow-300/30 text-amber-950 shadow-xs'
              }`}
            >
              {/* Bolinha pulsante antes da palavra 'PROTÓTIPO' */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
              </span>

              <span>{COMPANY_CONFIG.prototype.badge}</span>

              {/* Seta pulsante apontando para baixo após a palavra 'COMERCIAL' */}
              <ChevronDown className="w-3.5 h-3.5 text-yellow-400 animate-pulse shrink-0" />
            </span>
          </div>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-2.5 sm:px-4 lg:px-4 xl:px-6 pt-2 sm:pt-2.5 landscape:pt-1.5 box-border">
          <div className="relative flex items-center justify-between gap-1.5 sm:gap-2.5 xl:gap-3 w-full min-w-0 min-h-[40px] sm:min-h-[44px] landscape:min-h-[38px]">
            {/* Brand Logo with adaptive theme and true horizontal centering when mobile menu is open (ignoring the X button) */}
            <Link
              to="/"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[#B43034] rounded-md transition-all duration-200 hover:opacity-95 ${
                mobileMenuOpen
                  ? 'absolute left-1/2 -translate-x-1/2 z-20 lg:static lg:left-auto lg:translate-x-0'
                  : ''
              }`}
              aria-label="Vapt Vupt Remoção de Veículos - Início"
            >
              <img
                src={isDarkMode ? COMPANY_CONFIG.logos.horizontalWhite : COMPANY_CONFIG.logos.horizontalOriginal}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('branco')) {
                    target.src = '/assets/logo-horizontal-original.png';
                  } else {
                    target.src = '/assets/logo-horizontal-branco.png';
                  }
                }}
                alt="Vapt Vupt Remoção de Veículos"
                className="block mx-auto h-8 sm:h-9 landscape:h-7.5 lg:h-9 xl:h-10 w-auto max-w-[135px] sm:max-w-[160px] lg:max-w-[160px] xl:max-w-[185px] 2xl:max-w-[205px] object-contain object-center shrink-0 transition-opacity duration-300"
              />
            </Link>

            {/* Desktop Navigation Capsule */}
            <nav
              className="navbar hidden lg:flex items-center justify-center flex-1 min-w-0 mx-0.5 xl:mx-1.5"
              aria-label="Navegação Principal"
            >
              <div
                className={`navbar-container inline-flex items-center justify-start gap-0.5 xl:gap-1 px-1.5 xl:px-2 py-1 xl:py-1.5 rounded-full transition-colors duration-300 max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                  isDarkMode
                    ? 'bg-neutral-900/90 border border-neutral-800/90 shadow-inner shadow-black/40 backdrop-blur-md'
                    : 'bg-slate-100/95 border border-slate-200/90 shadow-inner backdrop-blur-md'
                }`}
              >
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `shrink-0 px-1.5 xl:px-2.5 2xl:px-3 py-1 xl:py-1.5 text-[10px] xl:text-[11px] 2xl:text-xs font-bold transition-colors duration-200 rounded-full flex items-center justify-center text-center whitespace-nowrap leading-none ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-[#B43034] to-[#982226] shadow-md shadow-red-950/60'
                          : isDarkMode
                            ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
                            : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
                      }`
                    }
                  >
                    <span className="flex items-center justify-center leading-none">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto lg:ml-0">
              {/* Theme Toggle Component (Automático / Dia / Noite) - Oculto quando menu mobile estiver aberto */}
              {!mobileMenuOpen && (
                <div className="shrink-0 transition-opacity duration-200" title="Alternar Modo de Tema">
                  <ThemeToggle variant="compact" />
                </div>
              )}

              {/* Mobile Menu Toggle Button (Hamburguer / Fechar) */}
              <div className="inline-flex lg:hidden shrink-0 relative z-30 items-center justify-center">
                <button
                  ref={toggleButtonRef}
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`h-8 w-8 sm:h-9 sm:w-9 landscape:h-8 landscape:w-8 p-0 inline-flex items-center justify-center transition-colors rounded-lg border shrink-0 relative z-30 focus:outline-none focus:ring-2 focus:ring-[#B43034] ${
                    isDarkMode
                      ? 'text-neutral-300 hover:text-white bg-neutral-900/90 border-neutral-800 hover:bg-neutral-800'
                      : 'text-neutral-700 hover:text-neutral-900 bg-white/90 border-neutral-300 hover:bg-neutral-100'
                  }`}
                  aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation-drawer"
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

      {/* Menu Mobile Fullscreen + Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/65 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Hambúrguer Mobile/Tablet (dinamicamente posicionado abaixo do cabeçalho) */}
          <div
            id="mobile-navigation-drawer"
            ref={drawerRef}
            style={{ top: `${headerHeight}px` }}
            className={`lg:hidden fixed inset-x-0 bottom-0 z-50 overflow-y-auto flex flex-col justify-between ${
              isDarkMode
                ? 'bg-[#141416] border-neutral-800/80 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            } border-t px-4 pt-4 pb-8 landscape:px-5 landscape:pt-2.5 landscape:pb-4 shadow-2xl`}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de Navegação Mobile"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Quick status bar inside mobile menu */}
              <div
                className={`flex items-center justify-between px-3 py-2 mb-3 landscape:py-1 landscape:px-2.5 landscape:mb-2 rounded-lg text-xs landscape:text-[11px] ${
                  isDarkMode
                    ? 'bg-neutral-900/80 border border-neutral-800/70 text-neutral-300'
                    : 'bg-slate-100 border border-slate-200 text-slate-700'
                }`}
              >
                <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-neutral-300' : 'text-slate-700'}`}>
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                  <span>Atendimento sob consulta</span>
                </span>
                <span className="pulse-indicator flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="pulse-indicator relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-pulse" />
                  </span>
                  <span>Canal Oficial</span>
                </span>
              </div>

              {/* Mobile Theme Toggle (3-state segmented pill: Claro / Escuro / Automático) */}
              <div className="mb-4 landscape:mb-2 px-0.5">
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1 ${
                    isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                  }`}
                >
                  Preferência de Tema
                </p>
                <ThemeToggle variant="segmented" />
              </div>

              {/* Navigation links - em formato grid de 2 colunas no modo paisagem de mobile e tablet */}
              <nav className="flex flex-col space-y-1 landscape:grid landscape:grid-cols-2 landscape:gap-1.5 landscape:space-y-0" aria-label="Menu Mobile">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 landscape:px-3 landscape:py-2 text-sm landscape:text-xs font-semibold rounded-lg transition-colors flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#B43034] ${
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
              </nav>
            </div>

            {/* Mobile CTA section */}
            <div
              className={`pt-4 mt-4 landscape:pt-2 landscape:mt-2 border-t ${
                isDarkMode ? 'border-neutral-800/80' : 'border-slate-200'
              } space-y-2.5 landscape:space-y-1.5`}
            >
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.defaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="whatsapp-cta-button button-3d w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#B43034] via-[#C7383D] to-[#982226] text-white font-bold uppercase tracking-wider py-3.5 landscape:py-2.5 rounded-lg text-xs shadow-xl focus:outline-none focus:ring-2 focus:ring-[#B43034] text-center"
              >
                <WhatsAppIcon className="w-4 h-4 text-white fill-white shrink-0" />
                <span className="whitespace-nowrap">CHAMAR NO WHATSAPP</span>
              </a>

              <div
                className={`flex items-center justify-center gap-3 pt-2 landscape:pt-1 text-xs landscape:text-[11px] ${
                  isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                }`}
              >
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
                <span
                  className={`flex items-center gap-1 ${
                    isDarkMode ? 'text-neutral-400' : 'text-slate-500'
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${isDarkMode ? 'text-neutral-500' : 'text-slate-400'}`} />
                  <span>Leves e Pesados</span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
