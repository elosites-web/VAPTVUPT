import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, ShieldAlert } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { RevealSection } from '../components/RevealSection';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Página Não Encontrada (404)"
        description="A página que você está procurando não existe ou foi movida. Acesse a página inicial ou consulte nossos canais oficiais."
      />

      <RevealSection
        className="min-h-[70vh] flex items-center justify-center pt-6 sm:pt-12 pb-20 sm:pb-16 bg-white dark:bg-[#141416] px-4 transition-colors"
        innerClassName="w-full flex justify-center"
      >
        <div className="max-w-xl w-full text-center space-y-5 sm:space-y-6 bg-slate-50 dark:bg-neutral-900 p-6 sm:p-11 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xl">
          <div className="w-14 h-1.5 rounded-full bg-[#B43034] mx-auto" aria-hidden="true" />

          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-[#B43034] mx-auto"
            aria-hidden="true"
          >
            <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest font-heading">
              <span>Erro 404</span>
              <span aria-hidden="true">•</span>
              <span>Endereço Indisponível</span>
            </div>
            <div className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              404
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
              Página Não Encontrada
            </h1>
            <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              O endereço acessado não corresponde a nenhuma página ativa do site institucional da Vapt Vupt. Utilize os acessos abaixo para continuar navegando ou falar diretamente com nossa equipe.
            </p>
          </div>

          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
            <Link
              to="/"
              className="button-3d inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded shadow-lg transition-colors w-full sm:w-auto font-heading"
            >
              <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Voltar para o Início</span>
            </Link>

            <Link
              to="/servicos"
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-white text-xs font-semibold px-5 py-3 rounded border border-slate-300 dark:border-neutral-700 transition-colors w-full sm:w-auto shadow-xs"
            >
              <span>Ver Nossos Serviços</span>
              <ArrowRight className="w-4 h-4 text-[#B43034] shrink-0" aria-hidden="true" />
            </Link>
          </div>

          <div className="pt-0.5">
            <a
              href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                COMPANY_CONFIG.whatsapp.defaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B43034] hover:text-[#8F2428] dark:hover:text-red-400 transition-colors font-heading"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Falar com a Equipe no WhatsApp</span>
            </a>
          </div>

          {/* Quick links */}
          <nav
            aria-label="Links úteis de navegação"
            className="pt-5 border-t border-slate-200 dark:border-neutral-800/80 text-xs text-slate-500 dark:text-neutral-400 space-y-2"
          >
            <p>Outros links úteis:</p>
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-neutral-300">
              <Link to="/empresa" className="hover:text-[#B43034] dark:hover:text-white transition-colors">
                A Empresa
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/frota" className="hover:text-[#B43034] dark:hover:text-white transition-colors">
                Estrutura & Frota
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/perguntas-frequentes" className="hover:text-[#B43034] dark:hover:text-white transition-colors">
                FAQ
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/contato" className="hover:text-[#B43034] dark:hover:text-white transition-colors">
                Contato
              </Link>
            </div>
          </nav>
        </div>
      </RevealSection>
    </>
  );
};
