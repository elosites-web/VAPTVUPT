import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, ShieldAlert, Car, Truck, Phone, ChevronRight, HelpCircle, Compass } from 'lucide-react';
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
        className="min-h-[72vh] flex items-center justify-center pt-6 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 bg-white dark:bg-[#141416] px-4 transition-colors"
        innerClassName="w-full flex justify-center"
      >
        <div className="w-full max-w-xl lg:max-w-5xl">
          {/* Main Container */}
          <div className="bg-slate-50 dark:bg-neutral-900/90 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            {/* Top red brand bar */}
            <div className="h-1.5 w-full bg-[#B43034]" aria-hidden="true" />

            <div className="p-6 sm:p-9 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: 404 Message & Primary Actions */}
                <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
                  {/* Status & Icon */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-center gap-3">
                    <div
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-[#B43034] shrink-0 shadow-xs"
                      aria-hidden="true"
                    >
                      <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest font-heading">
                        <span>Erro 404</span>
                        <span aria-hidden="true">•</span>
                        <span>Endereço Indisponível</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
                        Código de status HTTP: Rota não localizada
                      </div>
                    </div>
                  </div>

                  {/* Headline & Description */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                      404
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
                      Página Não Encontrada
                    </h1>
                    <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
                      O endereço acessado não corresponde a nenhuma página ativa do site institucional da Vapt Vupt.
                      O link pode ter sido movido, renomeado ou digitado incorretamente.
                    </p>
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                    <Link
                      to="/"
                      className="button-3d inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded shadow-lg transition-colors w-full sm:w-auto font-heading"
                    >
                      <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Voltar para o Início</span>
                    </Link>

                    <Link
                      to="/servicos"
                      className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-white text-xs font-semibold px-5 py-3.5 rounded border border-slate-300 dark:border-neutral-700 transition-colors w-full sm:w-auto shadow-xs"
                    >
                      <span>Ver Nossos Serviços</span>
                      <ArrowRight className="w-4 h-4 text-[#B43034] shrink-0" aria-hidden="true" />
                    </Link>
                  </div>

                  {/* WhatsApp Direct Link */}
                  <div className="pt-1">
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

                  {/* Phone Emergency Support Badge */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 text-xs text-slate-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-[#B43034]" aria-hidden="true" />
                      <span>Central Telefônica:</span>
                    </div>
                    <a
                      href="tel:+551149341997"
                      className="font-bold text-slate-800 dark:text-neutral-200 hover:text-[#B43034] dark:hover:text-white transition-colors"
                    >
                      (11) 4934-1997
                    </a>
                    <span className="hidden sm:inline" aria-hidden="true">•</span>
                    <span className="text-[11px] text-slate-500 dark:text-neutral-500">
                      Atendimento para Remoção
                    </span>
                  </div>
                </div>

                {/* Right Column: Desktop Quick Navigation Cards */}
                <div className="lg:col-span-5 flex flex-col gap-3.5 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-neutral-800 lg:pl-8">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 font-heading">
                    <Compass className="w-4 h-4 text-[#B43034]" aria-hidden="true" />
                    <span>Acesso Rápido às Soluções</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                    {/* Card 1: Veículos Leves */}
                    <Link
                      to="/servicos/remocao-veiculos-leves"
                      className="group flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 hover:border-[#B43034]/50 hover:shadow-md transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-[#B43034] shrink-0 group-hover:scale-105 transition-transform">
                        <Car className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#B43034] transition-colors truncate font-heading">
                            Veículos Leves
                          </h2>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B43034] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          Automóveis e utilitários em caminhão plataforma
                        </p>
                      </div>
                    </Link>

                    {/* Card 2: Veículos Pesados */}
                    <Link
                      to="/servicos/remocao-veiculos-pesados"
                      className="group flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 hover:border-[#B43034]/50 hover:shadow-md transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-[#B43034] shrink-0 group-hover:scale-105 transition-transform">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#B43034] transition-colors truncate font-heading">
                            Veículos Pesados
                          </h2>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B43034] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          Cavalos mecânicos, caminhões e carretas
                        </p>
                      </div>
                    </Link>

                    {/* Card 3: Frota */}
                    <Link
                      to="/frota"
                      className="group flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 hover:border-[#B43034]/50 hover:shadow-md transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-[#B43034] shrink-0 group-hover:scale-105 transition-transform">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#B43034] transition-colors truncate font-heading">
                            Estrutura & Frota
                          </h2>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B43034] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          Unidades leves, cavalos 1635 e equipamentos
                        </p>
                      </div>
                    </Link>

                    {/* Card 4: FAQ */}
                    <Link
                      to="/perguntas-frequentes"
                      className="group flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 hover:border-[#B43034]/50 hover:shadow-md transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-[#B43034] shrink-0 group-hover:scale-105 transition-transform">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#B43034] transition-colors truncate font-heading">
                            Dúvidas Frequentes
                          </h2>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B43034] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          Informações sobre chamados e atendimento
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Links Footer Bar inside card */}
            <nav
              aria-label="Links úteis de navegação"
              className="px-6 py-4 bg-slate-100/70 dark:bg-neutral-950/70 border-t border-slate-200 dark:border-neutral-800 text-xs text-slate-500 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
            >
              <span className="font-medium text-slate-600 dark:text-neutral-400">
                Navegação institucional:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-neutral-300">
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
                <Link to="/trabalhe-conosco" className="hover:text-[#B43034] dark:hover:text-white transition-colors">
                  Trabalhe Conosco
                </Link>
                <span aria-hidden="true">•</span>
                <Link to="/contato" className="hover:text-[#B43034] dark:hover:text-white transition-colors">
                  Contato
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </RevealSection>
    </>
  );
};

