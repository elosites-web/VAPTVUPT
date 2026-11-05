import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Car } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppContactForm } from '../components/WhatsAppContactForm';
import { ZigZagItem, ZigZagHeading } from '../components/ZigZagMotion';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { CinematicHero } from '../components/CinematicHero';
import { RevealSection } from '../components/RevealSection';

export const Home: React.FC = () => {
  const verifiedServices = COMPANY_CONFIG.services.filter((s) => !s.isPendingConfirmation);

  return (
    <>
      <SEOHead
        title="Início - Guincho Leve e Pesado"
        description="Conheça a Vapt Vupt Remoção de Veículos. Soluções em remoção e transporte de veículos leves e pesados. Entre em contato para consultar atendimento."
      />

      {/* Scroll-Controlled Cinematic Hero */}
      <CinematicHero />

      {/* Institutional Overview Teaser */}
      <RevealSection className="py-20 bg-slate-50 dark:bg-[#161618] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest">
                <span className="w-6 h-0.5 bg-[#B43034]" />
                <span>Apresentação Institucional</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase font-heading">
                Estrutura e Atendimento Direto
              </h2>

              <p className="text-slate-700 dark:text-neutral-300 text-base leading-relaxed">
                A <strong className="text-slate-900 dark:text-white">Vapt Vupt Remoção de Veículos</strong> atua no transporte, guincho e remoção de automóveis, utilitários e veículos comerciais pesados.
              </p>

              <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed">
                Nosso atendimento prioriza o cuidado com o veículo durante o embarque e o deslocamento, com comunicação direta pelo WhatsApp oficial para avaliar cada solicitação e verificar a disponibilidade operacional.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-[#B43034] shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm leading-snug">Veículos Leves</h4>
                  </div>
                  <p className="text-slate-600 dark:text-neutral-400 text-xs leading-relaxed">
                    Caminhão com plataforma para embarque e transporte de automóveis e utilitários.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-[#B43034] shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm leading-snug">Veículos Pesados</h4>
                  </div>
                  <p className="text-slate-600 dark:text-neutral-400 text-xs leading-relaxed">
                    Cavalo mecânico e caminhão pesado para demandas avaliadas sob consulta.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/empresa"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B43034] hover:text-red-700 dark:hover:text-red-400 transition-colors"
                >
                  <span>Conhecer mais sobre a empresa e estrutura</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-700/80 shadow-2xl group bg-white dark:bg-neutral-950 flex flex-col justify-between">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden flex items-center justify-center p-3 sm:p-5 bg-white">
                  <img
                    src={COMPANY_CONFIG.fleet[1].image}
                    alt="Guincho Leve Plataforma Vapt Vupt"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-slate-900 dark:bg-neutral-900 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#B43034]">
                      Registro Fotográfico Real
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Guincho Leve Plataforma (Delivery)
                    </div>
                  </div>
                  <Link
                    to="/frota"
                    className="text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1"
                  >
                    <span>Galeria</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B43034]" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </RevealSection>

      {/* Featured Services Section */}
      <RevealSection className="py-20 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <ZigZagHeading from="left">
              <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-2 font-heading">
                <span className="w-6 h-0.5 bg-[#B43034]" />
                <span>Modalidades de Atendimento</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase font-heading">
                Serviços Especializados
              </h2>
            </ZigZagHeading>
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Ver todos os serviços</span>
              <ArrowRight className="w-4 h-4 text-[#B43034]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedServices.map((service, index) => (
              <ZigZagItem
                key={service.id}
                index={index}
                direction="up"
                className="bg-slate-50 dark:bg-neutral-900/90 rounded-xl border border-slate-200 dark:border-neutral-800 p-6 flex flex-col justify-between hover:border-red-400/50 dark:hover:border-neutral-700 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#B43034] mb-3">
                    {service.tag}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                  <Link
                    to={`/servicos/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white hover:text-[#B43034] transition-colors"
                  >
                    <span>Detalhes da Modalidade</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B43034]" />
                  </Link>

                  <a
                    href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                      `Olá! Gostaria de consultar atendimento para ${service.title}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-neutral-800 rounded transition-colors"
                    title={`Consultar ${service.title} no WhatsApp`}
                    aria-label={`Consultar ${service.title} no WhatsApp`}
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#B43034]" />
                  </a>
                </div>
              </ZigZagItem>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Fleet Showcase Teaser */}
      <RevealSection className="py-20 bg-slate-50 dark:bg-[#161618] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <ZigZagHeading from="left">
              <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-2 font-heading">
                <span className="w-6 h-0.5 bg-[#B43034]" />
                <span>Equipamentos e Fotografias Reais</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase font-heading">
                Nossa Frota Operacional
              </h2>
            </ZigZagHeading>
            <Link
              to="/frota"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Ver galeria completa e demonstração 3D</span>
              <ArrowRight className="w-4 h-4 text-[#B43034]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMPANY_CONFIG.fleet.map((item, index) => (
              <ZigZagItem
                key={item.id}
                index={index}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 overflow-hidden flex flex-col group shadow-md hover:shadow-xl hover:border-red-400/50 dark:hover:border-neutral-700 transition-all"
              >
                <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-white dark:bg-neutral-950 flex items-center justify-center">
                  <img
                    src={item.image}
                    srcSet={`${item.image} 480w, ${item.image} 800w, ${item.image} 1200w`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                    decoding="async"
                    alt={item.title}
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                      item.id === 'cavalo-1635'
                        ? 'object-cover object-[center_28%]'
                        : 'object-contain p-2.5 sm:p-3.5 bg-white'
                    }`}
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 dark:bg-neutral-900/90 text-[11px] font-bold uppercase tracking-wider text-[#B43034] px-2.5 py-1 rounded border border-slate-700 dark:border-neutral-800 shadow-sm">
                    {item.badge}
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-heading">{item.title}</h3>
                    <p className="text-slate-600 dark:text-neutral-400 text-xs leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-neutral-500 font-medium">{item.category}</span>
                    <Link
                      to="/frota"
                      className="text-[#B43034] font-semibold hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1"
                    >
                      <span>Inspecionar</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </ZigZagItem>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* How to Request Steps */}
      <RevealSection className="py-20 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ZigZagHeading from="center" className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-2 font-heading">
              <span>Fluxo Transparente</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase font-heading">
              Como Solicitar Atendimento
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
              Atendimento ágil pelo WhatsApp oficial, com dimensionamento adequado do equipamento.
            </p>
          </ZigZagHeading>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMPANY_CONFIG.steps.map((step, index) => (
              <ZigZagItem
                key={step.number}
                index={index}
                className="bg-slate-50 dark:bg-neutral-900/70 p-6 rounded-xl border border-slate-200 dark:border-neutral-800 relative shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-black text-[#B43034] font-mono mb-3">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 font-heading">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">{step.desc}</p>
              </ZigZagItem>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                COMPANY_CONFIG.whatsapp.defaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-cta-button button-3d inline-flex items-center justify-center gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg shadow-lg transition-all font-heading"
            >
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="whitespace-nowrap">CHAMAR NO WHATSAPP</span>
            </a>
          </div>
        </div>
      </RevealSection>

      {/* Integrated Native Contact Form */}
      <RevealSection className="py-20 bg-slate-50 dark:bg-[#161618] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <WhatsAppContactForm />
        </div>
      </RevealSection>
    </>
  );
};
