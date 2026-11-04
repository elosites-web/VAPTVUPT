import React from 'react';
import { ShieldCheck, Truck, Wrench, Layers, CheckCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { useTheme } from '../context/ThemeContext';

export const About: React.FC = () => {
  const { isDarkMode } = useTheme();

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
    <section
      id="empresa"
      className={`py-20 lg:py-28 relative overflow-hidden border-t transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#18181b] border-neutral-800'
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Decorative background grid and diagonals */}
      <div className="absolute inset-0 industrial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-6 h-0.5 bg-[#B43034]" />
            <span>Apresentação Institucional</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            COMPROMISSO TÉCNICO COM O TRANSPORTE E A REMOÇÃO VEICULAR
          </h2>
          <p className={`mt-4 text-lg leading-relaxed ${
            isDarkMode ? 'text-neutral-300' : 'text-slate-700'
          }`}>
            A <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>Vapt Vupt Remoção de Veículos</strong> atua no segmento de remoção e transporte de veículos leves e pesados, oferecendo soluções estruturadas para diferentes necessidades de transporte rodoviário e urbano.
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
                  className={`p-6 rounded-lg transition-all duration-300 hover:shadow-lg group border ${
                    isDarkMode
                      ? 'bg-neutral-900/90 border-neutral-800 hover:border-[#B43034]/50 hover:shadow-red-950/20'
                      : 'bg-white border-slate-200 hover:border-[#B43034]/50 hover:shadow-slate-200/60 shadow-xs'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-5 transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-neutral-800/80 group-hover:bg-[#B43034]'
                      : 'bg-slate-100 group-hover:bg-[#B43034]'
                  }`}>
                    <Icon className="w-6 h-6 text-[#B43034] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className={`text-lg font-bold uppercase tracking-wide mb-2 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {pillar.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    isDarkMode ? 'text-neutral-400' : 'text-slate-600'
                  }`}>
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Institutional Highlights Card */}
          <div className={`lg:col-span-5 p-8 rounded-xl relative overflow-hidden shadow-xl border ${
            isDarkMode
              ? 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-neutral-800'
              : 'bg-white border-slate-200 shadow-md'
          }`}>
            {/* Top red accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B43034] via-red-500 to-[#B43034]" />

            <div className="flex items-center gap-3 mb-6">
              <img
                src={isDarkMode ? COMPANY_CONFIG.logos.symbolWhite : COMPANY_CONFIG.logos.symbolOriginal}
                alt="Símbolo Vapt Vupt"
                className="w-8 h-8 object-contain transition-all duration-300"
              />
              <div>
                <h4 className={`text-base font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {COMPANY_CONFIG.legalName}
                </h4>
                <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                  Atuação em Logística & Remoção
                </p>
              </div>
            </div>

            <p className={`text-sm leading-relaxed mb-6 ${
              isDarkMode ? 'text-neutral-300' : 'text-slate-700'
            }`}>
              Com foco contínuo em agilidade e segurança operacional, organizamos nossos processos para que cada chamada receba o direcionamento do equipamento mais adequado ao porte do veículo e às características da via.
            </p>

            <div className={`space-y-3 pt-4 border-t text-xs ${
              isDarkMode
                ? 'border-neutral-800 text-neutral-300'
                : 'border-slate-200 text-slate-700'
            }`}>
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
          </div>

        </div>

      </div>
    </section>
  );
};
