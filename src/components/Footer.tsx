import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Briefcase, ChevronRight, HelpCircle, ArrowUp } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { useTheme } from '../context/ThemeContext';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [logoSrc, setLogoSrc] = useState<string>('/logo-elosites.png');
  const [logoError, setLogoError] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoError = () => {
    if (logoSrc === '/logo-elosites.png') {
      setLogoSrc('/logo-traco-elosites.png');
    } else {
      setLogoError(true);
    }
  };

  return (
    <footer
      className={`border-t transition-colors duration-300 text-sm ${
        isDarkMode
          ? 'bg-[#111113] border-neutral-800 text-neutral-400'
          : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-28 sm:pb-16"
        style={{ paddingBottom: 'max(6.5rem, calc(4rem + env(safe-area-inset-bottom, 0px)))' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand & Summary */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              to="/"
              onClick={handleScrollToTop}
              className="inline-block transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#B43034] rounded"
              aria-label="Vapt Vupt Remoção de Veículos - Início"
            >
              <img
                src={isDarkMode ? COMPANY_CONFIG.logos.horizontalWhite : COMPANY_CONFIG.logos.horizontalOriginal}
                alt="Vapt Vupt Remoção de Veículos"
                className="h-10 w-auto object-contain transition-opacity duration-300"
              />
            </Link>
            <p className={`text-sm max-w-sm leading-relaxed ${isDarkMode ? 'text-neutral-300' : 'text-slate-700'}`}>
              Atuação em remoção e transporte de veículos leves e pesados, com foco em atendimento direto e orientação pelo WhatsApp oficial.
            </p>
            <div className={`text-xs space-y-1 ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
              <div>
                <span className={`font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-slate-800'}`}>Razão Social:</span>{' '}
                {COMPANY_CONFIG.legalName}
              </div>
              <div>
                <span className={`font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-slate-800'}`}>Segmento:</span>{' '}
                {COMPANY_CONFIG.segment}
              </div>
            </div>

            {/* Botão Institucional Voltar ao Topo */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleScrollToTop}
                className={`btn-3d inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-200 border cursor-pointer ${
                  isDarkMode
                    ? 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border-neutral-800 hover:border-neutral-700 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 border-slate-300 shadow-xs'
                }`}
                aria-label="Voltar ao topo da página"
              >
                <ArrowUp className="w-4 h-4 text-[#B43034] shrink-0" />
                <span>Voltar ao Topo</span>
              </button>
            </div>
          </div>

          {/* Institutional Navigation Links */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Páginas Institucionais
            </h4>
            <div className={`grid grid-cols-2 gap-x-4 gap-y-2 text-xs ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
              <Link to="/" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Início
              </Link>
              <Link to="/empresa" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                A Empresa
              </Link>
              <Link to="/servicos" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Todos os Serviços
              </Link>
              <Link to="/servicos/remocao-veiculos-leves" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Veículos Leves
              </Link>
              <Link to="/servicos/remocao-veiculos-pesados" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Veículos Pesados
              </Link>
              <Link to="/servicos/solucoes-em-remocao" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Soluções em Remoção
              </Link>
              <Link to="/frota" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Estrutura & Frota
              </Link>
              <Link to="/perguntas-frequentes" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Perguntas (FAQ)
              </Link>
              <Link to="/trabalhe-conosco" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Trabalhe Conosco
              </Link>
              <Link to="/contato" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Fale Conosco
              </Link>
              <Link to="/politica-de-privacidade" className="hover:text-[#B43034] transition-colors font-medium">
                Privacidade (LGPD)
              </Link>
              <Link to="/termos-de-uso" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950 font-medium'}`}>
                Termos de Uso
              </Link>
            </div>
          </div>

          {/* Official Channels & Careers */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Canais Oficiais Verificados
            </h4>

            <div className="space-y-2.5 text-xs">
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.defaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 transition-colors group ${
                  isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <WhatsAppIcon className="w-4 h-4 text-[#B43034] shrink-0" />
                <span className="font-medium">WhatsApp: {COMPANY_CONFIG.whatsapp.display}</span>
              </a>

              <a
                href={COMPANY_CONFIG.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 transition-colors group ${
                  isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Instagram className="w-4 h-4 text-[#B43034] shrink-0" />
                <span className="font-medium">Instagram: {COMPANY_CONFIG.instagram.handle}</span>
              </a>
            </div>

            {/* Direct Links to Careers and FAQ */}
            <div className={`pt-3 border-t space-y-2 ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}>
              <Link
                to="/trabalhe-conosco"
                className={`flex items-center justify-between text-xs font-medium px-3 py-2 rounded border transition-colors ${
                  isDarkMode
                    ? 'text-neutral-300 hover:text-[#B43034] bg-neutral-900/80 border-neutral-800'
                    : 'text-slate-800 hover:text-[#B43034] bg-white border-slate-300 shadow-xs'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#B43034]" />
                  <span>Trabalhe Conosco</span>
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${isDarkMode ? 'text-neutral-500' : 'text-slate-400'}`} />
              </Link>

              <Link
                to="/perguntas-frequentes"
                className={`flex items-center justify-between text-xs font-medium px-3 py-2 rounded border transition-colors ${
                  isDarkMode
                    ? 'text-neutral-300 hover:text-white bg-neutral-900/40 border-neutral-800/80'
                    : 'text-slate-800 hover:text-slate-950 bg-white border-slate-300 shadow-xs'
                }`}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className={`w-3.5 h-3.5 ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`} />
                  <span>Dúvidas Frequentes</span>
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${isDarkMode ? 'text-neutral-500' : 'text-slate-400'}`} />
              </Link>
            </div>
          </div>
        </div>

        {/* Prototype Identification Notice in Footer */}
        <div
          className={`mb-6 p-3.5 rounded-xl border text-center text-[11px] leading-relaxed ${
            isDarkMode
              ? 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
              : 'bg-white/80 border-slate-200/90 text-slate-600'
          }`}
        >
          <span className="font-bold uppercase tracking-wider text-[#B43034] mr-2">
            {COMPANY_CONFIG.prototype.badge}:
          </span>
          <span>{COMPANY_CONFIG.prototype.shortNotice}</span>
        </div>

        {/* Bottom Bar: Copyright, Verified Social Icons & Institutional Links */}
        <div
          className={`pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${
            isDarkMode ? 'border-neutral-800/80 text-neutral-400' : 'border-slate-200 text-slate-600'
          }`}
        >
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} {COMPANY_CONFIG.legalName} • Controladora responsável pelos dados pessoais.
          </div>

          {/* Row of Verified Social Media Icons (WhatsApp & Instagram) */}
          <div
            className="inline-flex flex-nowrap items-center justify-center whitespace-nowrap gap-2.5 shrink-0"
            aria-label="Canais Oficiais Verificados"
          >
            <a
              href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                COMPANY_CONFIG.whatsapp.defaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Oficial"
              title="WhatsApp Oficial"
              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 ease-out transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 ${
                isDarkMode
                  ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white hover:border-[#B43034]'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-[#B43034] hover:border-[#B43034]'
              }`}
            >
              <WhatsAppIcon className="w-4 h-4 text-[#B43034] shrink-0" />
            </a>
            <a
              href={COMPANY_CONFIG.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Oficial"
              title="Instagram Oficial"
              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 ease-out transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 ${
                isDarkMode
                  ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white hover:border-[#B43034]'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-[#B43034] hover:border-[#B43034]'
              }`}
            >
              <Instagram className="w-4 h-4 text-[#B43034] shrink-0" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
            <Link
              to="/politica-de-privacidade"
              className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950'}`}
            >
              Política de Privacidade
            </Link>
            <span>•</span>
            <Link
              to="/termos-de-uso"
              className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950'}`}
            >
              Termos de Uso
            </Link>
            <span>•</span>
            <Link
              to="/contato"
              className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-slate-950'}`}
            >
              Canais Oficiais
            </Link>
          </div>
        </div>

        {/* Single-Line Credit: CRIADO E DESENVOLVIDO POR [logo-elosites.png] O MELHOR SITE PELO MELHOR PREÇO */}
        <div
          className={`mt-6 pt-4 border-t ${
            isDarkMode ? 'border-neutral-800/60' : 'border-slate-300/80'
          } w-full flex items-center justify-center overflow-x-auto`}
        >
          <div
            className={`inline-flex flex-nowrap items-center justify-center whitespace-nowrap gap-1 sm:gap-1.5 font-bold uppercase tracking-tight sm:tracking-normal leading-none select-none ${
              isDarkMode ? 'text-neutral-400' : 'text-slate-600'
            }`}
            style={{ fontSize: 'clamp(7.5px, 2.1vw, 11px)' }}
          >
            <span className="shrink-0 leading-none">CRIADO E DESENVOLVIDO POR</span>
            <a
              href="https://elosites.io.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity focus:outline-none focus:ring-1 focus:ring-[#B43034] rounded px-0.5"
              aria-label="Visitar site da ēloSites - O melhor site pelo melhor preço"
              title="ēloSites - O melhor site pelo melhor preço"
            >
              {!logoError ? (
                <img
                  src={logoSrc}
                  alt="ēloSites"
                  onError={handleLogoError}
                  className="h-2.5 min-[360px]:h-3 sm:h-3.5 w-auto object-contain shrink-0 inline-block align-middle"
                />
              ) : (
                <span className={`font-bold shrink-0 leading-none ${isDarkMode ? 'text-neutral-200' : 'text-slate-800'}`}>
                  ĒLOSITES
                </span>
              )}
            </a>
            <span className="shrink-0 leading-none">O MELHOR SITE PELO MELHOR PREÇO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
