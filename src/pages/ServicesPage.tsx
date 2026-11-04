import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { ZigZagItem, ZigZagHeading } from '../components/ZigZagMotion';
import { WhatsAppContactForm } from '../components/WhatsAppContactForm';

export const ServicesPage: React.FC = () => {
  const verifiedServices = COMPANY_CONFIG.services.filter((s) => !s.isPendingConfirmation);

  return (
    <>
      <SEOHead
        title="Serviços de Remoção e Guincho"
        description="Conheça nossos serviços de remoção de veículos leves, pesados e soluções sob consulta. Solicite atendimento pelo WhatsApp oficial."
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Modalidades Operacionais</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight font-heading">
              Serviços Especializados
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
              Soluções dimensionadas para veículos leves e pesados. Conheça cada modalidade de atendimento e consulte disponibilidade com nossa equipe pelo WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid with Detailed Links */}
      <section className="py-16 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {verifiedServices.map((service, index) => {
              const isEven = index % 2 === 1;
              return (
                <ZigZagItem
                  key={service.id}
                  index={index}
                  direction={isEven ? 'right' : 'left'}
                  distance={16}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 hover:border-red-400/50 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-xl ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Text Details */}
                  <div className={`lg:col-span-7 space-y-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-200/80 dark:bg-neutral-800 text-[11px] font-bold uppercase tracking-widest text-[#B43034]">
                      {service.tag}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
                      {service.title}
                    </h2>

                    <p className="text-slate-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                      {service.fullDesc}
                    </p>

                    {service.technicalHighlights && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-neutral-200 uppercase tracking-wider font-heading">
                          Destaques do Atendimento:
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-neutral-400">
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
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded border border-slate-300 dark:border-neutral-700 transition-colors shadow-xs"
                      >
                        <span>Detalhes & Solicitação</span>
                        <ArrowRight className="w-4 h-4 text-[#B43034]" />
                      </Link>

                      <a
                        href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                          `Olá! Gostaria de consultar atendimento para ${service.title}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded transition-colors shadow-md font-heading"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        <span>Solicitar no WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Image / Visual Asset */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-700/80 shadow-xl bg-white dark:bg-neutral-950 aspect-[16/10] group flex items-center justify-center">
                      {service.image ? (
                        <img
                          src={service.image}
                          srcSet={`${service.image} 480w, ${service.image} 800w, ${service.image} 1200w`}
                          sizes="(max-width: 1024px) 100vw, 42vw"
                          loading="lazy"
                          decoding="async"
                          alt={service.title}
                          className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                            service.id === 'pesados'
                              ? 'object-cover object-center'
                              : 'object-contain p-2 sm:p-3 bg-white'
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-neutral-900 text-neutral-400">
                          <Truck className="w-16 h-16" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-medium bg-slate-900/90 dark:bg-neutral-900/85 px-3 py-1.5 rounded backdrop-blur-sm border border-slate-700 dark:border-neutral-800">
                        {service.title} — Fotografia Real Vapt Vupt
                      </div>
                    </div>
                  </div>
                </ZigZagItem>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrated Native Contact Form */}
      <section className="py-16 bg-slate-50 dark:bg-[#161618] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <WhatsAppContactForm />
        </div>
      </section>

      {/* Safety and Protocol Callout */}
      <section className="py-16 bg-white dark:bg-[#141416] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ZigZagHeading from="left" className="sr-only">
            <h2>Perguntas Frequentes</h2>
          </ZigZagHeading>
          <ZigZagItem
            index={0}
            distance={14}
            className="p-8 sm:p-10 rounded-2xl bg-slate-50 dark:bg-gradient-to-r dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8"
          >
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest font-heading">
                <ShieldCheck className="w-4 h-4 text-[#B43034]" />
                <span>Transparência no Atendimento</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
                Dúvidas sobre o Atendimento?
              </h3>
              <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed">
                Consulte nossa seção de Perguntas Frequentes para saber mais sobre como solicitar atendimento, informações necessárias e consulta de disponibilidade pelo WhatsApp.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to="/perguntas-frequentes"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-white hover:bg-slate-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-white text-xs font-bold uppercase tracking-wider border border-slate-300 dark:border-neutral-700 transition-colors shadow-xs"
              >
                <span>Acessar FAQ Completo</span>
                <ArrowRight className="w-4 h-4 text-[#B43034]" />
              </Link>
            </div>
          </ZigZagItem>
        </div>
      </section>
    </>
  );
};
