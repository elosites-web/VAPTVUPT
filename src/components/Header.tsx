import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { MessageCircle, Menu, X, Phone, ArrowUpRight } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu mobile ao trocar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fechar menu com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#141416]/95 backdrop-blur-md border-b border-neutral-800 shadow-xl py-3'
          : 'bg-gradient-to-b from-[#141416]/95 via-[#141416]/80 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[#B43034] rounded-md transition-transform hover:scale-[1.01]"
            aria-label="Vapt Vupt Remoção de Veículos - Início"
          >
            <img
              src={COMPANY_CONFIG.logos.horizontalWhite}
              alt="Vapt Vupt Remoção de Veículos"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation (visible on lg and above) - Centralizada e Estilizada */}
          <nav className="navbar hidden lg:flex items-center justify-center flex-1 mx-3 xl:mx-6" aria-label="Navegação Principal">
            <div className="navbar-container flex items-center justify-center gap-2 xl:gap-3 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800/90 shadow-lg shadow-black/40 backdrop-blur-md">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-3.5 xl:px-4 py-2 font-heading text-sm xl:text-base font-bold tracking-wider transition-all duration-200 rounded-full flex items-center justify-center text-center whitespace-nowrap leading-none ${
                      isActive
                        ? 'text-white bg-[#B43034] shadow-md shadow-red-950/60'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800/70'
                    }`
                  }
                >
                  <span className="flex items-center justify-center leading-none">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Direct WhatsApp Call */}
            <a
              href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                COMPANY_CONFIG.whatsapp.defaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-2 sm:py-2.5 rounded shadow-md transition-all duration-200 hover:shadow-red-900/30 focus:outline-none focus:ring-2 focus:ring-[#B43034]"
            >
              <MessageCircle className="w-4 h-4 text-white shrink-0" />
              <span className="hidden sm:inline">Solicitar Atendimento</span>
              <span className="sm:hidden">Atendimento</span>
            </a>

            {/* Mobile menu toggle (Visible on all screens below lg: sm, md) */}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#B43034] rounded-md"
                aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161618] border-b border-neutral-800 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 text-sm font-medium rounded-md transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#B43034]/20 text-white font-semibold border-l-4 border-[#B43034]'
                      : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                  }`
                }
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </NavLink>
            ))}

            <div className="pt-4 mt-2 border-t border-neutral-800 space-y-2">
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.defaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white font-bold uppercase tracking-wider py-3 rounded text-xs shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chamar no WhatsApp Oficial</span>
              </a>
              <p className="text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5 pt-1">
                <Phone className="w-3.5 h-3.5 text-[#B43034]" />
                <span>{COMPANY_CONFIG.whatsapp.display}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
