import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, Phone, ArrowUpRight } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';

interface HeaderProps {
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Empresa', href: '#empresa' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Estrutura & Frota', href: '#frota' },
    { label: 'Modelo 3D', href: '#modelo-3d' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#141416]/95 backdrop-blur-md border-b border-neutral-800/80 shadow-xl py-3'
          : 'bg-gradient-to-b from-[#141416]/90 via-[#141416]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#inicio"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#B43034] rounded-md transition-transform hover:scale-[1.02]"
            aria-label="Vapt Vupt Remoção de Veículos - Início"
          >
            <img
              src={COMPANY_CONFIG.logos.horizontalWhite}
              alt="Vapt Vupt Remoção de Veículos"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navegação Principal">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm font-medium tracking-wide transition-colors relative rounded-md ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#B43034] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Direct WhatsApp Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                COMPANY_CONFIG.whatsapp.defaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 py-2.5 rounded-md shadow-md transition-all duration-200 hover:shadow-red-900/30 focus:outline-none focus:ring-2 focus:ring-[#B43034] focus:ring-offset-2 focus:ring-offset-neutral-900"
            >
              <MessageCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>Solicitar Atendimento</span>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#B43034] rounded-md"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#18181b] border-b border-neutral-800 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`px-3 py-2.5 text-base font-medium rounded-md transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#B43034]/20 text-[#B43034] font-semibold border-l-4 border-[#B43034]'
                      : 'text-neutral-200 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </a>
              );
            })}
            <div className="pt-4 border-t border-neutral-800">
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.defaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="w-full flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white font-semibold uppercase tracking-wider py-3 rounded-md text-sm shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chamar no WhatsApp</span>
              </a>
              <p className="text-center text-xs text-neutral-400 mt-2 flex items-center justify-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                {COMPANY_CONFIG.whatsapp.display}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
