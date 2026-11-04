import React from 'react';
import { ShieldCheck, Truck, Clock, Wrench, Layers, CheckCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';

export const About: React.FC = () => {
  const pillars = [
    {
      icon: Truck,
      title: 'Versatilidade Operacional',
      description: 'Atuação consolidada tanto no segmento de automóveis e veículos leves quanto em composições pesadas e caminhões.',
    },
    {
      icon: ShieldCheck,
      title: 'Zelo e Preservação',
      description: 'Procedimentos de ancoragem e içamento planejados para assegurar a integridade estrutural do veículo transportado.',
    },
    {
      icon: Wrench,
      title: 'Equipamentos Específicos',
      description: 'Frota dotada de plataformas hidráulicas, guinchos de arraste e cavalos mecânicos com manutenção preventiva contínua.',
    },
    {
      icon: Layers,
      title: 'Atendimento Corporativo',
      description: 'Estrutura preparada para demandas particulares, empresas com frota própria e parcerias com seguradoras.',
    },
  ];

  return (
    <section id="empresa" className="py-20 lg:py-28 bg-[#18181b] relative overflow-hidden border-t border-neutral-800">
      {/* Decorative background grid and diagonals */}
      <div className="absolute inset-0 industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-6 h-0.5 bg-[#B43034]" />
            <span>Apresentação Institucional</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
            COMPROMISSO TÉCNICO COM O TRANSPORTE E A REMOÇÃO VEICULAR
          </h2>
          <p className="mt-4 text-lg text-neutral-300 leading-relaxed">
            A <strong>Vapt Vupt Remoção de Veículos</strong> atua no segmento de remoção e transporte de veículos leves e pesados, oferecendo soluções estruturadas para diferentes necessidades de transporte rodoviário e urbano.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Informational Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-neutral-900/90 border border-neutral-800 p-6 rounded-lg hover:border-[#B43034]/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-950/20 group"
                >
                  <div className="w-12 h-12 rounded-md bg-neutral-800/80 group-hover:bg-[#B43034] flex items-center justify-center mb-5 transition-colors duration-200">
                    <Icon className="w-6 h-6 text-[#B43034] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Institutional Highlights Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 p-8 rounded-xl relative overflow-hidden shadow-xl">
            {/* Top red accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B43034] via-red-500 to-[#B43034]" />

            <div className="flex items-center gap-3 mb-6">
              <img
                src={COMPANY_CONFIG.logos.symbolOriginal}
                alt="Símbolo Vapt Vupt"
                className="w-8 h-8 object-contain"
              />
              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-wider">
                  {COMPANY_CONFIG.legalName}
                </h4>
                <p className="text-xs text-neutral-400">Atuação em Logística & Remoção</p>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              Com foco contínuo em agilidade e segurança operacional, organizamos nossos processos para que cada chamada receba o direcionamento do equipamento mais adequado ao porte do veículo e às características da via.
            </p>

            <div className="space-y-3 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#B43034] shrink-0" />
                <span>Atendimento especializado para veículos leves e pesados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#B43034] shrink-0" />
                <span>Canal direto e ágil via WhatsApp para cotação e consulta</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#B43034] shrink-0" />
                <span>Condições transparentes informadas antes do deslocamento</span>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="mt-8">
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  'Olá! Gostaria de consultar informações institucionais e serviços da Vapt Vupt Remoção de Veículos.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white font-bold uppercase tracking-wider text-xs py-3 px-4 rounded-md transition-all shadow-md"
              >
                <span>Falar com Nossa Equipe</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
