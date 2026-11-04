import React from 'react';
import { MessageCircle, Instagram, Phone, Building } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppContactForm } from '../components/WhatsAppContactForm';

export const ContactPage: React.FC = () => {

  return (
    <>
      <SEOHead
        title="Contato e Atendimento"
        description="Fale com a Vapt Vupt Remoção de Veículos pelo WhatsApp oficial. Consulte disponibilidade para guincho leve e pesado."
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Canais Oficiais</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight">
              Fale Conosco
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
              Atendimento técnico direto pelo canal oficial do WhatsApp. Envie as informações do seu veículo para consultar condições e disponibilidade operacional.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Interactive WhatsApp Contact Form with LGPD compliance */}
            <div className="lg:col-span-7">
              <WhatsAppContactForm />
            </div>

            {/* Official Channels Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Direct WhatsApp Call */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/80 text-[#B43034] border border-red-200 dark:border-red-900/60">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Canal WhatsApp Oficial</h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">Atendimento operacional</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-center shadow-inner">
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mb-2">
                    {COMPANY_CONFIG.whatsapp.display}
                  </div>
                  <a
                    href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                      COMPANY_CONFIG.whatsapp.defaultMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded transition-colors w-full justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Iniciar Conversa Direta</span>
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-neutral-800 text-[#B43034]">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Instagram Institucional</h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">Acompanhe nossas operações</p>
                  </div>
                </div>

                <a
                  href={COMPANY_CONFIG.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-center text-sm font-semibold text-slate-800 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700 transition-colors shadow-sm"
                >
                  {COMPANY_CONFIG.instagram.handle}
                </a>
              </div>

              {/* Registration & Governance Notice */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-3 text-xs text-slate-600 dark:text-neutral-400">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                  <Building className="w-4 h-4 text-[#B43034]" />
                  <span>Governança e Transparência</span>
                </div>
                <p>
                  <strong className="text-slate-800 dark:text-neutral-200">{COMPANY_CONFIG.legalName}</strong>
                </p>
                <p>
                  Nossos registros em São Paulo (Matriz), Campinas e Jundiaí destinam-se a controle administrativo e base operacional. Os atendimentos são realizados mediante acionamento das equipes móveis via WhatsApp.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
};
