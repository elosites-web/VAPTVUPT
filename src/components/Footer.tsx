import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Briefcase, ChevronRight, HelpCircle, ArrowUp, Phone } from 'lucide-react';
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
          ? 'bg-[#121214] border-neutral-800/80 text-neutral-400'
          : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:pb-16"
        style={{ paddingBottom: 'max(6rem, calc(3.5rem + env(safe-area-inset-bottom, 0px)))' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
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
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('branco')) {
                    target.src = '/assets/logo-horizontal-original.png';
                  } else {
                    target.src = '/assets/logo-horizontal-branco.png';
                  }
                }}
                alt="Vapt Vupt Remoção de Veículos"
                className="h-10 w-auto object-contain shrink-0 transition-opacity duration-300"
              />
            </Link>
            <p className={`text-sm max-w-sm leading-relaxed ${isDarkMode ? 'text-neutral-300' : 'text-slate-700'}`}>
              Especializada em serviços de guincho e reboque 24 horas para veículos leves e pesados, atuando em parceria com grandes seguradoras.
            </p>
            <div className={`text-xs space-y-1 ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
              <div>
                <span className={`font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-slate-800'}`}>Razão Social:</span>{' '}
                {COMPANY_CONFIG.legalName}
              </div>
              <div>
                <span className={`font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-slate-800'}`}>{COMPANY_CONFIG.branchJundiai.label}:</span>{' '}
                <span className="font-mono">CNPJ {COMPANY_CONFIG.branchJundiai.cnpj}</span>
              </div>
            </div>

            {/* Botão Institucional Voltar ao Topo */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleScrollToTop}
                className={`btn-3d inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-200 border cursor-pointer ${
                  isDarkMode
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border-neutral-700/80 shadow-md'
                    : 'bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 border-slate-300 shadow-sm'
                }`}
                aria-label="Voltar ao topo da página"
              >
                <ArrowUp className="w-4 h-4 text-[#B43034] shrink-0" />
                <span>Voltar ao Topo</span>
              </button>
            </div>
          </div>

          {/* Navegação do Site Estilizada */}
          <div id="component-container-id-h4" className="lg:col-span-4 space-y-3">
            <h4
              className={`text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-white max-md:text-[#cbd5e1]' : 'text-slate-900'
              } flex items-center gap-2 transition-all duration-200 hover:font-extrabold hover:tracking-widest cursor-default select-none`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B43034]" />
              <span>NAVEGAÇÃO DO SITE</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { to: '/', label: 'Início' },
                { to: '/empresa', label: 'A Empresa' },
                { to: '/servicos', label: 'Todos os Serviços' },
                { to: '/servicos/remocao-veiculos-leves', label: 'Veículos Leves' },
                { to: '/servicos/remocao-veiculos-pesados', label: 'Veículos Pesados' },
                { to: '/servicos/solucoes-em-remocao', label: 'Soluções' },
                { to: '/frota', label: 'Estrutura & Frota' },
                { to: '/perguntas-frequentes', label: 'Dúvidas (FAQ)' },
                { to: '/trabalhe-conosco', label: 'Trabalhe Conosco' },
                { to: '/contato', label: 'Fale Conosco' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-lg border transition-all text-left flex items-center justify-between group ${
                    isDarkMode
                      ? 'bg-neutral-900/70 border-neutral-800 text-neutral-200 hover:text-white hover:border-[#B43034]/60 hover:bg-neutral-800/80 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-800 hover:text-slate-950 hover:border-[#B43034]/50 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <span className={`font-semibold ${isDarkMode ? 'text-neutral-200 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950'}`}>
                    {item.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#B43034] shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Official Channels & Careers */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Canais Oficiais Verificados</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              {/* Central de Atendimento */}
              <Link
                to="/contato"
                className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all group ${
                  isDarkMode
                    ? 'bg-neutral-900/60 border-neutral-800/80 text-neutral-200 hover:text-white hover:bg-neutral-800/70 hover:border-[#B43034]/40'
                    : 'bg-white border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-50 hover:border-[#B43034]/40 shadow-xs'
                }`}
                title="Central de Atendimento: (11) 4934-1997 e demais números"
              >
                <div className="p-1 rounded-md bg-[#B43034]/15 text-[#B43034] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">Central de Atendimento</div>
                  <div className={`text-[11px] font-mono truncate ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
                    {COMPANY_CONFIG.centralPhones[0].display}
                  </div>
                </div>
              </Link>

              {/* WhatsApp com cor oficial #25D366 */}
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.defaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all group ${
                  isDarkMode
                    ? 'bg-neutral-900/60 border-neutral-800/80 text-neutral-200 hover:text-white hover:bg-neutral-800/70 hover:border-emerald-500/40'
                    : 'bg-white border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-50 hover:border-emerald-500/40 shadow-xs'
                }`}
              >
                <div className="p-1 rounded-md bg-[#25D366]/15 text-[#25D366] shrink-0">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-[#25D366]">{COMPANY_CONFIG.whatsapp.channelLabel}</div>
                  <div className={`text-[11px] font-mono truncate ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>{COMPANY_CONFIG.whatsapp.display}</div>
                </div>
              </a>

              {/* Instagram com cor oficial #E1306C */}
              <a
                href={COMPANY_CONFIG.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all group ${
                  isDarkMode
                    ? 'bg-neutral-900/60 border-neutral-800/80 text-neutral-200 hover:text-white hover:bg-neutral-800/70 hover:border-[#E1306C]/40'
                    : 'bg-white border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-50 hover:border-[#E1306C]/40 shadow-xs'
                }`}
              >
                <div className="p-1 rounded-md bg-[#E1306C]/15 text-[#E1306C] shrink-0">
                  <Instagram className="w-4 h-4 text-[#E1306C]" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-[#E1306C]">Instagram</div>
                  <div className={`text-[11px] truncate ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>{COMPANY_CONFIG.instagram.handle}</div>
                </div>
              </a>

              {/* Facebook com cor oficial #1877F2 */}
              <a
                href={COMPANY_CONFIG.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all group ${
                  isDarkMode
                    ? 'bg-neutral-900/60 border-neutral-800/80 text-neutral-200 hover:text-white hover:bg-neutral-800/70 hover:border-[#1877F2]/40'
                    : 'bg-white border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-50 hover:border-[#1877F2]/40 shadow-xs'
                }`}
              >
                <div className="p-1 rounded-md bg-[#1877F2]/15 text-[#1877F2] shrink-0">
                  <Facebook className="w-4 h-4 text-[#1877F2] fill-[#1877F2]" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-[#1877F2]">Facebook</div>
                  <div className={`text-[11px] truncate ${isDarkMode ? 'text-neutral-400' : 'text-slate-600'}`}>{COMPANY_CONFIG.facebook.handle}</div>
                </div>
              </a>
            </div>

            {/* Direct Links to Careers and FAQ */}
            <div className={`pt-2 border-t space-y-2 ${isDarkMode ? 'border-neutral-800' : 'border-slate-200'}`}>
              <Link
                to="/trabalhe-conosco"
                className={`flex items-center justify-between text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
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
                className={`flex items-center justify-between text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                  isDarkMode
                    ? 'text-neutral-300 hover:text-white bg-neutral-900/40 border-neutral-800/80'
                    : 'text-slate-800 hover:text-slate-950 bg-white border-slate-300 shadow-xs'
                }`}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dúvidas Frequentes</span>
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${isDarkMode ? 'text-neutral-500' : 'text-slate-400'}`} />
              </Link>
            </div>
          </div>
        </div>

        {/* Prototype Identification Notice in Footer */}
        <div
          className={`mb-6 p-3 rounded-xl border text-center text-[11px] leading-relaxed ${
            isDarkMode
              ? 'bg-neutral-900/50 border-neutral-800/80 text-neutral-400'
              : 'bg-white border-slate-200 text-slate-600 shadow-xs'
          }`}
        >
          <span
            className={`font-bold uppercase tracking-wider mr-2 ${
              isDarkMode
                ? 'text-yellow-400'
                : 'bg-yellow-300/80 text-neutral-950 px-1.5 py-0.5 rounded-sm'
            }`}
          >
            {COMPANY_CONFIG.prototype.badge}:
          </span>
          <span>{COMPANY_CONFIG.prototype.shortNotice}</span>
        </div>

        {/* Bottom Bar: Main Company Credits with Legal Links (Sem o div redundante de 2 ícones de redes sociais excluído) */}
        <div
          className={`pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isDarkMode ? 'border-neutral-800/80 text-neutral-400' : 'border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 flex-wrap">
            <span className="font-normal">
              © {new Date().getFullYear()} {COMPANY_CONFIG.legalName}
            </span>
            <span className="hidden sm:inline text-neutral-400 dark:text-neutral-600 select-none">•</span>
            <div className="flex items-center gap-2.5 font-medium">
              <Link
                to="/politica-de-privacidade"
                className={`transition-colors duration-200 underline-offset-4 hover:underline ${
                  isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Política de Privacidade
              </Link>
              <span className="select-none text-neutral-400 dark:text-neutral-600">•</span>
              <Link
                to="/termos-de-uso"
                className={`transition-colors duration-200 underline-offset-4 hover:underline ${
                  isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>

        {/* Single-Line Developer Credit: CRIADO E DESENVOLVIDO POR [logo-elosites.png] O MELHOR SITE PELO MELHOR PREÇO */}
        <div
          className={`mt-6 pt-4 border-t ${
            isDarkMode ? 'border-neutral-800/60' : 'border-slate-300/80'
          } w-full flex items-center justify-center overflow-x-auto`}
        >
          <div
            className={`inline-flex flex-nowrap items-center justify-center whitespace-nowrap gap-1 sm:gap-1.5 font-bold uppercase tracking-tight sm:tracking-normal leading-none select-none shrink-0 ${
              isDarkMode ? 'text-neutral-400' : 'text-slate-600'
            }`}
            style={{ fontSize: 'clamp(7.5px, 2.1vw, 11px)', whiteSpace: 'nowrap' }}
          >
            <span className="shrink-0 leading-none">CRIADO E DESENVOLVIDO POR</span>
            <a
              href="https://elosites.ia.br"
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
                <span className={`font-bold shrink-0 leading-none uppercase ${isDarkMode ? 'text-neutral-200' : 'text-slate-800'}`}>
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
