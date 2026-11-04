import React from 'react';
import { Instagram, Phone, ArrowUpRight, ShieldCheck, MapPin } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Contact: React.FC = () => {
  return (
    <section id="contato" className="py-20 lg:py-28 bg-[#18181b] relative overflow-hidden border-t border-neutral-800">
      
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 industrial-grid opacity-25" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#B43034]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-red-900/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* High Conversion Banner Card */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-neutral-800 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          
          {/* Top brand accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B43034] via-red-500 to-[#B43034]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 bg-neutral-950 px-3.5 py-1.5 rounded-full border border-neutral-800 text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-[#B43034]" />
                <span>Atendimento & Informações</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight mb-4">
                PRECISA DE UMA SOLUÇÃO EM REMOÇÃO DE VEÍCULOS?
              </h2>

              <p className="text-base sm:text-xl text-neutral-300 font-normal max-w-2xl leading-relaxed mb-8">
                Entre em contato com nossa equipe e consulte as condições de atendimento para veículos leves e pesados.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    COMPANY_CONFIG.whatsapp.defaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#B43034] hover:bg-[#8F2428] text-white text-base font-bold uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl shadow-red-950/40 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                  <span>Falar pelo WhatsApp</span>
                </a>

                <a
                  href={COMPANY_CONFIG.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 text-sm font-semibold uppercase tracking-wider px-6 py-4 rounded-xl transition-all"
                >
                  <Instagram className="w-5 h-5 text-[#B43034]" />
                  <span>{COMPANY_CONFIG.instagram.handle}</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                </a>
              </div>
            </div>

            {/* Right Information Summary Card */}
            <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Canais Oficiais Verificados
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-800/80">
                    <div className="text-[11px] uppercase font-bold text-neutral-400">WhatsApp Oficial</div>
                    <div className="text-base font-bold text-white tracking-wide mt-0.5">
                      {COMPANY_CONFIG.whatsapp.display}
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-800/80">
                    <div className="text-[11px] uppercase font-bold text-neutral-400">Instagram Oficial</div>
                    <div className="text-base font-bold text-white tracking-wide mt-0.5">
                      {COMPANY_CONFIG.instagram.handle}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-400 space-y-1.5">
                <div className="flex items-center gap-2 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-[#B43034]" />
                  <span>Atendimento rápido via aplicativo</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Consulte a disponibilidade de rota e deslocamento diretamente com a equipe técnica.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
