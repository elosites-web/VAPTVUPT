import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Car, CheckCircle2 } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppContactForm } from '../components/WhatsAppContactForm';
import { ZigZagItem, ZigZagHeading } from '../components/ZigZagMotion';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

export const Home: React.FC = () => {
  const verifiedServices = COMPANY_CONFIG.services.filter((s) => !s.isPendingConfirmation);

  return (
    <>
      <SEOHead
        title="Início - Guincho Leve e Pesado"
        description="Conheça a Vapt Vupt Remoção de Veículos. Soluções em remoção e transporte de veículos leves e pesados. Entre em contato para consultar atendimento."
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-28 sm:pt-32 pb-16 bg-[#141416] overflow-hidden keep-dark" data-keep-dark="true">
        {/* Subtle Background Image with Dark Editorial Vignette */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={COMPANY_CONFIG.heroImage}
            alt="Cavalo mecânico 1635 Vapt Vupt"
            className="w-full h-full object-cover object-center brightness-[0.26] contrast-110 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/75 to-[#141416]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141416] via-[#141416]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Editorial Hierarchy Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/85 border border-red-800/80 text-red-200 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#B43034]" />
                <span>{COMPANY_CONFIG.badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight uppercase leading-[1.08]">
                Estrutura e Soluções em <span className="text-[#B43034]">Remoção de Veículos</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl">
                Atuação dedicada ao transporte, guincho e remoção de <strong className="text-white">veículos leves e pesados</strong>. Fale diretamente com nossa equipe pelo WhatsApp oficial para consultar disponibilidade.
              </p>

              {/* CTAs */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    COMPANY_CONFIG.whatsapp.defaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-3d inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-[11px] min-[360px]:text-xs sm:text-sm font-bold uppercase tracking-tight min-[400px]:tracking-normal sm:tracking-wider px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg shadow-xl transition-colors duration-200 text-center leading-tight"
                >
                  <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="whitespace-normal sm:whitespace-nowrap">Solicitar Atendimento no WhatsApp</span>
                </a>

                <a
                  href="#solicitar-atendimento"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-[11px] min-[360px]:text-xs sm:text-sm font-bold uppercase tracking-tight min-[400px]:tracking-normal sm:tracking-wider px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg border border-white/25 transition-all backdrop-blur-md shadow-lg text-center leading-tight"
                >
                  <span className="whitespace-normal sm:whitespace-nowrap">Preencher Solicitação</span>
                  <ArrowRight className="w-4 h-4 text-[#B43034] shrink-0" />
                </a>
              </div>

              {/* Quick Differentiation: Atendimento Leve vs. Pesado */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-neutral-800/90">
                <Link
                  to="/servicos/remocao-veiculos-leves"
                  className="group p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-[#B43034]/60 transition-all flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-red-950/70 border border-red-900/60 text-[#B43034] shrink-0 mt-0.5">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span>Atendimento Leve</span>
                      <ArrowRight className="w-3 h-3 text-[#B43034] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
                      Automóveis e utilitários em caminhão plataforma sob consulta.
                    </p>
                  </div>
                </Link>

                <Link
                  to="/servicos/remocao-veiculos-pesados"
                  className="group p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-[#B43034]/60 transition-all flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-red-950/70 border border-red-900/60 text-[#B43034] shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span>Atendimento Pesado</span>
                      <ArrowRight className="w-3 h-3 text-[#B43034] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
                      Cavalo mecânico 1635 e estrutura para caminhões sob consulta.
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Real Truck Visual Showcase Column (Mercedes-Benz 1635) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-700/80 bg-neutral-900 shadow-2xl group">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden bg-neutral-950">
                  <img
                    src={COMPANY_CONFIG.heroImage}
                    srcSet={`${COMPANY_CONFIG.heroImage} 600w, ${COMPANY_CONFIG.heroImage} 1080w`}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    alt="Cavalo Mecânico 1635 Vapt Vupt Remoção de Veículos"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-950/85 border border-neutral-700/80 text-[10px] font-bold uppercase tracking-wider text-neutral-200 backdrop-blur-md">
                    <CheckCircle2 className="w-3 h-3 text-[#B43034]" />
                    <span>Fotografia Real da Frota</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-neutral-900/95 border-t border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#B43034]">
                      Unidade Pesada • Vapt Vupt
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white font-heading">
                      Cavalo Mecânico 1635
                    </div>
                  </div>
                  <Link
                    to="/frota"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider border border-neutral-700 transition-colors shrink-0"
                  >
                    <span>Ver Frota</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B43034]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Overview Teaser */}
      <section className="py-20 bg-slate-50 dark:bg-[#161618] border-b border-slate-200 dark:border-neutral-800 transition-colors">
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
                  <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-[#B43034] mb-3">
                    <Car className="w-4 h-4" />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">Veículos Leves</h4>
                  <p className="text-slate-600 dark:text-neutral-400 text-xs">
                    Caminhão com plataforma para embarque e transporte de automóveis e utilitários.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm">
                  <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-[#B43034] mb-3">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">Veículos Pesados</h4>
                  <p className="text-slate-600 dark:text-neutral-400 text-xs">
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
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-700/80 shadow-2xl group bg-white dark:bg-neutral-950">
                <img
                  src={COMPANY_CONFIG.fleet[1].image}
                  alt="Guincho Leve Plataforma Vapt Vupt"
                  className="w-full h-72 sm:h-80 object-contain p-3 sm:p-4 bg-white transition-transform duration-500 group-hover:scale-105"
                />
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
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
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
      </section>

      {/* Fleet Showcase Teaser */}
      <section className="py-20 bg-slate-50 dark:bg-[#161618] border-b border-slate-200 dark:border-neutral-800 transition-colors">
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
                <div className="relative h-56 overflow-hidden bg-white dark:bg-neutral-950 flex items-center justify-center">
                  <img
                    src={item.image}
                    srcSet={`${item.image} 480w, ${item.image} 800w, ${item.image} 1200w`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                    decoding="async"
                    alt={item.title}
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                      item.id === 'cavalo-1635'
                        ? 'object-cover object-center'
                        : 'object-contain p-2.5 bg-white'
                    }`}
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 dark:bg-neutral-900/90 text-[11px] font-bold uppercase tracking-wider text-[#B43034] px-2.5 py-1 rounded border border-slate-700 dark:border-neutral-800">
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
      </section>

      {/* How to Request Steps */}
      <section className="py-20 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
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
              className="inline-flex items-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded shadow-lg transition-colors font-heading"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chamar no WhatsApp ({COMPANY_CONFIG.whatsapp.display})</span>
            </a>
          </div>
        </div>
      </section>

      {/* Integrated Native Contact Form */}
      <section className="py-20 bg-slate-50 dark:bg-[#161618] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <WhatsAppContactForm />
        </div>
      </section>
    </>
  );
};
