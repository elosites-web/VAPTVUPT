import React from 'react';
import { Instagram, Phone, Building, MapPin, ArrowUpRight } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppContactForm } from '../components/WhatsAppContactForm';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { RevealSection } from '../components/RevealSection';

export const ContactPage: React.FC = () => {

  return (
    <>
      <SEOHead
        title="Contato e Atendimento"
        description="Central de Atendimento: (11) 4934-1997, (11) 94149-4402, (11) 4402-3115 e (19) 2042-2350. WhatsApp (Vagas/Contato): (11) 91372-1849. Unidade em Jundiaí (Filial)."
      />

      {/* Header Banner */}
      <RevealSection className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800">
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
      </RevealSection>

      {/* Main Contact Section */}
      <RevealSection className="py-16 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Interactive WhatsApp Contact Form with LGPD compliance */}
            <div className="lg:col-span-7">
              <WhatsAppContactForm />
            </div>

            {/* Official Channels Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Central de Atendimento / Telefones */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/80 text-[#B43034] border border-red-200 dark:border-red-900/60">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      Central de Atendimento / Telefones
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">Atendimento telefônico direto</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {COMPANY_CONFIG.centralPhones.map((phone) => (
                    <a
                      key={phone.raw}
                      href={phone.telUri}
                      aria-label={phone.ariaLabel}
                      className="p-3 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 hover:border-[#B43034] dark:hover:border-[#B43034] text-slate-900 dark:text-white font-mono font-bold text-sm sm:text-base flex items-center justify-between transition-colors shadow-xs group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-[#B43034] shrink-0" />
                        <span>{phone.display}</span>
                      </span>
                      <span className="text-[11px] font-sans font-semibold text-slate-500 dark:text-neutral-400 group-hover:text-[#B43034] uppercase tracking-wider">
                        Ligar
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp — Vagas/Contato */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#25D366] border border-emerald-200 dark:border-emerald-900/60">
                    <WhatsAppIcon className="w-6 h-6 text-[#25D366] fill-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      WhatsApp — Vagas/Contato
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">Canal oficial para vagas e contato</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-center shadow-inner space-y-3">
                  <div className="text-xs font-semibold text-slate-600 dark:text-neutral-400">
                    WhatsApp (Vagas/Contato):
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                    {COMPANY_CONFIG.whatsapp.display}
                  </div>
                  <a
                    href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                      COMPANY_CONFIG.whatsapp.defaultMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-[11px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider px-4 py-2.5 rounded transition-colors w-full text-center leading-tight shadow-md"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>Iniciar Conversa no WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Unidade em Jundiaí (Filial) */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-3 text-xs text-slate-600 dark:text-neutral-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider font-heading">
                    <Building className="w-4 h-4 text-[#B43034]" />
                    <span>{COMPANY_CONFIG.branchJundiai.label}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200">
                    {COMPANY_CONFIG.branchJundiai.tag}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 text-slate-700 dark:text-neutral-300">
                  <p>
                    <strong className="text-slate-900 dark:text-white">CNPJ:</strong>{' '}
                    <span className="font-mono">{COMPANY_CONFIG.branchJundiai.cnpj}</span>
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Endereço:</strong>{' '}
                    {COMPANY_CONFIG.branchJundiai.address}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={COMPANY_CONFIG.branchJundiai.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B43034] hover:underline uppercase tracking-wider"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Ver no Google Maps</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800 text-[#B43034]">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instagram Institucional</h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">Acompanhe nossas operações</p>
                  </div>
                </div>

                <a
                  href={COMPANY_CONFIG.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-center text-xs sm:text-sm font-semibold text-slate-800 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700 transition-colors shadow-xs"
                >
                  {COMPANY_CONFIG.instagram.handle}
                </a>
              </div>

            </div>

          </div>
        </div>
      </RevealSection>
    </>
  );
};
