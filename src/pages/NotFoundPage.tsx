import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, ShieldAlert, MessageCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Página Não Encontrada (404)"
        description="A página que você está procurando não existe ou foi movida. Acesse a página inicial ou consulte nossos canais oficiais."
      />

      <section className="min-h-[75vh] flex items-center justify-center pt-8 sm:pt-12 pb-16 bg-white dark:bg-[#141416] px-4 transition-colors">
        <div className="max-w-xl w-full text-center space-y-6 bg-slate-50 dark:bg-neutral-900 p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xl">
          
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-[#B43034] mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white font-mono">
              404
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
              Página Não Encontrada
            </h1>
            <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed max-w-md mx-auto">
              O endereço acessado não corresponde a nenhuma página ativa do site institucional da Vapt Vupt.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded shadow-lg transition-colors w-full sm:w-auto font-heading"
            >
              <Home className="w-4 h-4" />
              <span>Voltar para o Início</span>
            </Link>

            <Link
              to="/servicos"
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-white text-xs font-semibold px-5 py-3 rounded border border-slate-300 dark:border-neutral-700 transition-colors w-full sm:w-auto shadow-xs"
            >
              <span>Ver Nossos Serviços</span>
              <ArrowRight className="w-4 h-4 text-[#B43034]" />
            </Link>
          </div>

          {/* Quick links */}
          <div className="pt-6 border-t border-slate-200 dark:border-neutral-800/80 text-xs text-slate-500 dark:text-neutral-400 space-y-2">
            <p>Outros links úteis:</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-700 dark:text-neutral-300">
              <Link to="/empresa" className="hover:text-[#B43034] dark:hover:text-white transition-colors">
                A Empresa
              </Link>
              <span>•</span>
              <Link to="/frota" className="hover:text-[#B43034] dark:hover:text-white transition-colors">
                Estrutura & Frota
              </Link>
              <span>•</span>
              <Link to="/perguntas-frequentes" className="hover:text-white transition-colors">
                FAQ
              </Link>
              <span>•</span>
              <Link to="/contato" className="hover:text-white transition-colors">
                Contato
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
