import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Building } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="A Empresa"
        description="Conheça a Vapt Vupt Remoção de Veículos. Estrutura, capacidade técnica e compromisso operacional com transporte de veículos leves e pesados."
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Identidade Institucional</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight font-heading">
              A Empresa
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
              Estrutura, capacidade técnica e compromisso ético com a segurança no transporte e remoção de veículos leves e pesados.
            </p>
          </div>
        </div>
      </section>

      {/* Main Institutional Content */}
      <section className="py-16 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase font-heading">
                Quem Somos
              </h2>

              <p className="text-slate-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                A <strong className="text-slate-900 dark:text-white">Vapt Vupt Remoção de Veículos</strong> ({COMPANY_CONFIG.legalName}) é uma empresa dedicada a fornecer soluções técnicas e seguras de remoção, reboque e logística de veículos.
              </p>

              <p className="text-slate-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                Nosso propósito é oferecer atendimento pautado pelo respeito ao patrimônio do cliente, pontualidade nas operações programadas e precisão técnica nas manobras, seja para um automóvel de passeio ou um veículo comercial de grande porte.
              </p>

              <div className="border-l-4 border-[#B43034] pl-4 py-2 bg-slate-50 dark:bg-neutral-900/60 border-t border-r border-b border-slate-200 dark:border-neutral-800 rounded-r-lg">
                <p className="text-slate-900 dark:text-white font-medium text-sm italic">
                  "{COMPANY_CONFIG.slogan}."
                </p>
                <span className="text-xs text-slate-500 dark:text-neutral-400 mt-1 block">
                  Identidade e compromisso com o cliente e frotistas parceiros.
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider font-heading">
                  Pilares de Atuação
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Preservação Patrimonial:</strong> Procedimentos de embarque e ancoragem que eliminam riscos de avarias em lataria, para-choques e mecânica.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Dimensionamento Correto:</strong> Envio do equipamento adequado à carga (prancha para leves ou cavalo mecânico para pesados).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Transparência Operacional:</strong> Informações claras sobre disponibilidade, previsão de chegada e rotas.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Photo Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-700/80 shadow-2xl bg-slate-100 dark:bg-neutral-950">
                <img
                  src={COMPANY_CONFIG.heroImage}
                  alt="Cavalo mecânico 1635 Vapt Vupt"
                  className="w-full h-80 object-cover"
                />
                <div className="p-4 bg-white dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800">
                  <div className="text-xs font-bold text-[#B43034] uppercase tracking-wider">
                    Frota Pesada
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Cavalo Mecânico 1635 em operação
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 text-xs text-slate-600 dark:text-neutral-400">
                <p>
                  <strong className="text-slate-900 dark:text-neutral-200">Segmento Econômico:</strong> {COMPANY_CONFIG.segment}.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cadastral & Operational Governance Section */}
      <section className="py-16 bg-slate-50 dark:bg-[#161618] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-2 font-heading">
              <Building className="w-4 h-4 text-[#B43034]" />
              <span>Identificação Cadastral</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase font-heading">
              Dados Cadastrais da Empresa
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">
              Informações oficiais de registro empresarial para fins de transparência fiscal e contratual. Os endereços cadastrais não realizam atendimento presencial nem visitação ao público.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 p-6 shadow-sm max-w-3xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-white border border-slate-200 dark:border-neutral-700">
                Razão Social & Matriz
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                Registro Ativo
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 font-heading">
              {COMPANY_CONFIG.legalName}
            </h3>

            <div className="text-xs text-slate-600 dark:text-neutral-400 space-y-1.5 mb-4">
              <p>
                <span className="text-slate-800 dark:text-neutral-300 font-semibold">CNPJ Matriz:</span>{' '}
                {COMPANY_CONFIG.privacy.cnpjMatriz}
              </p>
              <p>
                <span className="text-slate-800 dark:text-neutral-300 font-semibold">Registro Administrativo:</span>{' '}
                {COMPANY_CONFIG.registrosCadastrais[0].address}, {COMPANY_CONFIG.registrosCadastrais[0].city} -{' '}
                {COMPANY_CONFIG.registrosCadastrais[0].state}, CEP {COMPANY_CONFIG.registrosCadastrais[0].cep}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 text-[11px] text-slate-500 dark:text-neutral-400">
              <strong>Nota Importante:</strong> Este endereço destina-se exclusivamente a registro administrativo e fiscal. O atendimento aos clientes e solicitações de remoção ocorrem exclusivamente pelos canais digitais oficiais (WhatsApp).
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-white dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800/80 text-xs text-slate-600 dark:text-neutral-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <p>
              Para agendar transferências, vistorias de frotas ou orçamentos corporativos, utilize nossos canais oficiais de comunicação.
            </p>
            <Link
              to="/servicos"
              className="inline-flex items-center gap-1.5 font-bold text-[#B43034] hover:text-red-700 dark:hover:text-red-400 shrink-0 uppercase tracking-wider text-xs"
            >
              <span>Conhecer nossos serviços</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white dark:bg-[#141416] transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase font-heading">
            Precisa de Atendimento Técnico em Remoção?
          </h2>
          <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto">
            Fale diretamente com nossos operadores pelo WhatsApp para consultar a disponibilidade do equipamento adequado para o seu veículo.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
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
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-800 dark:text-white text-xs font-semibold px-5 py-3.5 rounded border border-slate-300 dark:border-neutral-700 transition-colors shadow-xs"
            >
              <span>Acessar Página de Contato</span>
              <ArrowRight className="w-4 h-4 text-[#B43034]" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
