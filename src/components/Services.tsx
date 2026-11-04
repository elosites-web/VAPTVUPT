import React, { useState } from 'react';
import { Car, Truck, ShieldAlert, ArrowRight, Check, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { COMPANY_CONFIG, ServiceItem } from '../data/companyData';

export const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Filter only public/confirmed services (guarda de veículos remains pending verification)
  const activeServices = COMPANY_CONFIG.services.filter((s) => !s.isPendingConfirmation);

  return (
    <section id="servicos" className="py-20 lg:py-28 bg-[#141416] relative overflow-hidden border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Nossas Soluções</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
              SERVIÇOS ESPECIALIZADOS EM REMOÇÃO
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-300">
              Operações estruturadas para atender desde veículos de passeio até composições pesadas com rapidez, segurança e equipamentos adequados.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(COMPANY_CONFIG.whatsapp.defaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B43034] hover:text-red-400 bg-red-950/40 border border-red-900/50 px-4 py-2.5 rounded transition-colors"
            >
              <span>Consultar condições no WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 3 Main Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeServices.map((service) => {
            const isHeavy = service.id === 'pesados';
            const isLight = service.id === 'leves';

            return (
              <div
                key={service.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-[#B43034] transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 flex flex-col group"
              >
                {/* Visual Image Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-700/80 text-[11px] font-bold text-neutral-200 uppercase tracking-wider px-3 py-1 rounded">
                    {service.tag}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-3 group-hover:text-red-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                      {service.shortDesc}
                    </p>

                    <div className="bg-neutral-950/60 p-4 rounded-lg border border-neutral-800/80 mb-6">
                      <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                        Características do Atendimento
                      </h4>
                      <ul className="text-xs text-neutral-300 space-y-1.5">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#B43034] shrink-0" />
                          <span>Içamento e amarração técnica de padrão profissional</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#B43034] shrink-0" />
                          <span>Orientação direta via WhatsApp</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#B43034] shrink-0" />
                          <span>Equipamentos específicos para a categoria</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Contextual CTA for this specific service */}
                  <div>
                    <a
                      href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                        isHeavy
                          ? COMPANY_CONFIG.whatsapp.heavyVehicleMessage
                          : isLight
                          ? COMPANY_CONFIG.whatsapp.lightVehicleMessage
                          : `Olá! Gostaria de obter informações sobre ${service.title} com a Vapt Vupt.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-[#B43034] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-md transition-colors duration-200 group-hover:bg-[#B43034]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Solicitar {service.title}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Note regarding pending client confirmations */}
        {/* TODO-CONFIRMAR-CLIENTE: Guarda e Hospedagem de veículos aguarda confirmação final */}
        <div className="mt-12 bg-neutral-900/60 border border-neutral-800/80 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-neutral-500" />
            <span>
              Outras demandas específicas de logística e transferência de frotas sob consulta operacional.
            </span>
          </div>
          <a
            href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
              'Olá! Gostaria de consultar sobre demandas específicas de remoção veicular ou transporte de frota.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B43034] hover:underline font-semibold uppercase tracking-wider inline-flex items-center gap-1 shrink-0"
          >
            <span>Consultar caso específico</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
