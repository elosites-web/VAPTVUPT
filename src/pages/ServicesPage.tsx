import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Truck, ShieldAlert, ArrowRight, MessageCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';

export const ServicesPage: React.FC = () => {
  const verifiedServices = COMPANY_CONFIG.services.filter((s) => !s.isPendingConfirmation);

  return (
    <>
      <SEOHead
        title="Serviços de Remoção e Guincho"
        description="Conheça nossos serviços de remoção de veículos leves, pesados e soluções especiais. Equipamentos dedicados e equipe capacitada."
      />

      {/* Header Banner */}
      <section className="pt-28 pb-14 bg-[#111113] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Modalidades Operacionais</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              Serviços Especializados
            </h1>
            <p className="mt-3 text-base text-neutral-300 leading-relaxed">
              Soluções técnicas dimensionadas para cada tipo de veículo. Conheça as especificações operacionais de cada modalidade e solicite atendimento com nossa equipe.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid with Detailed Links */}
      <section className="py-16 bg-[#141416] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {verifiedServices.map((service, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Text Details */}
                  <div className={`lg:col-span-7 space-y-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-neutral-800 text-[11px] font-bold uppercase tracking-widest text-[#B43034]">
                      {service.tag}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
                      {service.title}
                    </h2>

                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                      {service.fullDesc}
                    </p>

                    {service.technicalHighlights && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                          Destaques Técnicos:
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400">
                          {service.technicalHighlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#B43034] mt-0.5 shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Link
                        to={`/servicos/${service.slug}`}
                        className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded border border-neutral-700 transition-colors"
                      >
                        <span>Página do Serviço & Procedimentos</span>
                        <ArrowRight className="w-4 h-4 text-[#B43034]" />
                      </Link>

                      <a
                        href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                          `Olá! Gostaria de consultar atendimento para ${service.title}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded transition-colors shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Solicitar Atendimento</span>
                      </a>
                    </div>
                  </div>

                  {/* Image / Visual Asset */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative rounded-xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-950 aspect-[4/3] group">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-600">
                          <Truck className="w-16 h-16" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141416]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-xs text-white/90 font-medium bg-neutral-900/80 px-3 py-1.5 rounded backdrop-blur-sm border border-neutral-800">
                        {service.title} — Operação Vapt Vupt
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety and Protocol Callout */}
      <section className="py-16 bg-[#161618]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-[#B43034]" />
                <span>Segurança em Primeiro Lugar</span>
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
                Dúvidas sobre o Procedimento Operacional?
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Consulte nossa seção de Perguntas Frequentes para saber mais sobre ancoragem com cintas regulamentares, remoção de carros com câmbio automático, trancados ou sem chave.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to="/perguntas-frequentes"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider border border-neutral-700 transition-colors"
              >
                <span>Acessar FAQ Completo</span>
                <ArrowRight className="w-4 h-4 text-[#B43034]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
