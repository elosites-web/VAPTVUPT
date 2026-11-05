import React from 'react';
import { ChevronRight, Shield, Award, CheckCircle2 } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Hero: React.FC = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-24 pb-16 lg:py-0 overflow-hidden bg-[#141416] keep-dark"
      data-keep-dark="true"
    >
      {/* Background Graphic Elements & Dynamic Diagonals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 industrial-grid opacity-40" />

        {/* Diagonal speed slash inspired by Vapt Vupt brand symbol */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[1200px] bg-gradient-to-b from-[#B43034]/15 via-[#B43034]/5 to-transparent -rotate-12 transform origin-top pointer-events-none"
          style={{ clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' }}
        />

        {/* Ambient radial glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B43034]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Identity Badge */}
            <div className="inline-flex items-center gap-2.5 bg-neutral-900/90 border border-neutral-700/80 px-3.5 py-1.5 rounded-full w-fit mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#B43034]" />
              <span className="text-xs uppercase font-semibold tracking-wider text-neutral-300">
                {COMPANY_CONFIG.badge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-white uppercase leading-[0.95] mb-5">
              ESTRUTURA E SOLUÇÕES EM{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-[#B43034] to-red-400">
                REMOÇÃO DE VEÍCULOS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed mb-8">
              Remoção técnica de veículos leves e pesados, com capacidade operacional e soluções estruturadas para diferentes demandas de transporte.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.defaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#B43034] hover:bg-[#8F2428] text-white text-base font-bold uppercase tracking-wider px-7 py-4 rounded-md shadow-lg shadow-red-950/40 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#B43034]"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>Solicitar Atendimento</span>
              </a>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 text-base font-semibold uppercase tracking-wider px-6 py-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              >
                <span>Conheça Nossos Serviços</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </a>
            </div>

            {/* Pillar badges based strictly on actual documents */}
            <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#B43034] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Veículos Leves</div>
                  <div className="text-[11px] text-neutral-400">Automóveis & utilitários</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#B43034] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Veículos Pesados</div>
                  <div className="text-[11px] text-neutral-400">Caminhões & tração</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-5 h-5 text-[#B43034] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Canal Direto</div>
                  <div className="text-[11px] text-neutral-400">Agilidade no WhatsApp</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual featuring the real 1635 truck */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Decorative angular frame backing */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#B43034]/40 via-neutral-800 to-neutral-900 rounded-xl transform rotate-1 scale-95 opacity-70 blur-sm" />
              
              {/* Main image container */}
              <div className="relative bg-neutral-900 border-2 border-neutral-800/90 rounded-xl overflow-hidden shadow-2xl">
                
                {/* Header ribbon on card */}
                <div className="bg-neutral-950/80 border-b border-neutral-800 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                    <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                      Equipamento Real em Operação
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono">MODELO 1635</span>
                </div>

                {/* Real Photograph */}
                <div className="relative overflow-hidden aspect-[4/3] bg-neutral-950">
                  <img
                    src={COMPANY_CONFIG.heroImage}
                    alt="Cavalo mecânico 1635 da Vapt Vupt Remoção de Veículos"
                    className="w-full h-full object-cover object-[center_28%] transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Subtle gradient vignette to blend base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Operational caption overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800/80 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wide">
                        Cavalo Mecânico Especializado
                      </div>
                      <div className="text-[11px] text-neutral-300">
                        Capacidade para transporte e remoção pesada
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#B43034] bg-red-950/60 px-2 py-1 rounded border border-red-800/50">
                      PESADOS
                    </span>
                  </div>
                </div>

                {/* Lower strip with brand identity */}
                <div className="bg-[#18181b] px-4 py-3 flex items-center justify-between border-t border-neutral-800 text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Shield className="w-4 h-4 text-[#B43034]" />
                    <span className="font-medium">Equipamento com identificação padrão</span>
                  </div>
                  <span className="text-neutral-500 font-mono text-[11px]">VAPT VUPT</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
