import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Truck, Car, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const currentService = COMPANY_CONFIG.services.find(
    (s) => s.slug === slug && !s.isPendingConfirmation
  );

  if (!currentService) {
    return <Navigate to="/servicos" replace />;
  }

  const otherServices = COMPANY_CONFIG.services.filter(
    (s) => s.slug !== slug && !s.isPendingConfirmation
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-6 h-6 text-[#B43034]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-[#B43034]" />;
      default:
        return <Car className="w-6 h-6 text-[#B43034]" />;
    }
  };

  return (
    <>
      <SEOHead
        title={`${currentService.title}`}
        description={`${currentService.shortDesc} Atendimento técnico com guincho e remoção especializada.`}
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] font-bold uppercase tracking-widest text-[#B43034] mb-3 shadow-xs">
              {currentService.tag}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight">
              {currentService.title}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-neutral-300 leading-relaxed">
              {currentService.shortDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Main Service Content */}
      <section className="py-16 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Primary Details */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Photo Showcase */}
              {currentService.image && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-700/80 shadow-xl bg-slate-100 dark:bg-neutral-950">
                  <img
                    src={currentService.image}
                    srcSet={`${currentService.image} 480w, ${currentService.image} 800w, ${currentService.image} 1200w`}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    loading="lazy"
                    decoding="async"
                    alt={currentService.title}
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="p-4 bg-slate-50 dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">Equipamento Operacional Vapt Vupt</span>
                    <span className="text-slate-500 dark:text-neutral-400 font-mono">Registro Fotográfico Real</span>
                  </div>
                </div>
              )}

              {/* Comprehensive Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                  Visão Técnica da Operação
                </h2>
                <p className="text-slate-600 dark:text-neutral-300 text-base leading-relaxed">
                  {currentService.fullDesc}
                </p>
              </div>

              {/* Technical Highlights */}
              {currentService.technicalHighlights && (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-red-100 dark:bg-red-950/80 text-[#B43034]">
                      {getIcon(currentService.iconName)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                      Recursos e Especificações Técnicas
                    </h3>
                  </div>

                  <ul className="space-y-3 pt-2">
                    {currentService.technicalHighlights.map((tech, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Protocols */}
              {currentService.safetyProtocols && (
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-slate-200 dark:bg-neutral-800 text-[#B43034]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                      Protocolos de Segurança e Amarração
                    </h3>
                  </div>

                  <ul className="space-y-3 pt-2">
                    {currentService.safetyProtocols.map((protocol, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <span>{protocol}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Callout */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-red-50 to-slate-50 dark:from-red-950/40 dark:to-neutral-900 border border-red-200 dark:border-red-900/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold text-base mb-1">
                    Precisa deste serviço agora?
                  </h4>
                  <p className="text-slate-600 dark:text-neutral-400 text-xs">
                    Consulte a disponibilidade da equipe informando modelo e local da ocorrência.
                  </p>
                </div>
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    `Olá! Gostaria de consultar atendimento para ${currentService.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded shrink-0 shadow-lg transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Consultar no WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Sidebar with Navigation & Info */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Other Services Box */}
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Outras Modalidades
                </h3>
                <div className="space-y-2">
                  {otherServices.map((other) => (
                    <Link
                      key={other.id}
                      to={`/servicos/${other.slug}`}
                      className="block p-3 rounded-lg bg-white dark:bg-neutral-950/60 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800/80 transition-colors shadow-xs"
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white hover:text-[#B43034] flex items-center justify-between">
                        <span>{other.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 line-clamp-2">
                        {other.shortDesc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* FAQ Link Box */}
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-[#B43034]" />
                  <span>Dúvidas Frequentes</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                  Confira perguntas e respostas sobre como solicitar atendimento, tipos de veículos atendidos e consulta de disponibilidade.
                </p>
                <Link
                  to="/perguntas-frequentes"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B43034] hover:text-red-600 uppercase tracking-wider pt-1"
                >
                  <span>Ver todas as perguntas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Contact Box */}
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-3 text-xs">
                <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-wider">
                  Central de Atendimento
                </h4>
                <p className="text-slate-600 dark:text-neutral-400">
                  Fale com a Vapt Vupt pelo canal oficial:
                </p>
                <div className="font-semibold text-slate-900 dark:text-white">
                  WhatsApp: {COMPANY_CONFIG.whatsapp.display}
                </div>
                <div className="text-slate-500 dark:text-neutral-400">
                  Instagram: {COMPANY_CONFIG.instagram.handle}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
};
