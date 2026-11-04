import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Car, MapPin, CheckCircle2, MessageCircle, ArrowRight, Building, Award } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="A Empresa"
        description="Conheça a Vapt Vupt Remoção de Veículos. Estrutura, capacidade técnica e compromisso operacional com transporte de veículos leves e pesados."
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-[#111113] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Identidade Institucional</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              A Empresa
            </h1>
            <p className="mt-3 text-base text-neutral-300 leading-relaxed">
              Estrutura, capacidade técnica e compromisso ético com a segurança no transporte e remoção de veículos leves e pesados.
            </p>
          </div>
        </div>
      </section>

      {/* Main Institutional Content */}
      <section className="py-16 bg-[#141416] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                Quem Somos
              </h2>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                A <strong>Vapt Vupt Remoção de Veículos</strong> ({COMPANY_CONFIG.legalName}) é uma empresa dedicada a fornecer soluções técnicas e seguras de remoção, reboque e logística de veículos.
              </p>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Nosso propósito é oferecer atendimento pautado pelo respeito ao patrimônio do cliente, pontualidade nas operações programadas e precisão técnica nas manobras, seja para um automóvel de passeio ou um veículo comercial de grande porte.
              </p>

              <div className="border-l-4 border-[#B43034] pl-4 py-2 bg-neutral-900/60 rounded-r-lg">
                <p className="text-white font-medium text-sm italic">
                  "{COMPANY_CONFIG.slogan}."
                </p>
                <span className="text-xs text-neutral-400 mt-1 block">
                  Identidade e compromisso com o cliente e frotistas parceiros.
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Pilares de Atuação
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                    <span><strong>Preservação Patrimonial:</strong> Procedimentos de embarque e ancoragem que eliminam riscos de avarias em lataria, para-choques e mecânica.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                    <span><strong>Dimensionamento Correto:</strong> Envio do equipamento adequado à carga (prancha para leves ou cavalo mecânico para pesados).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                    <span><strong>Transparência Operacional:</strong> Informações claras sobre disponibilidade, previsão de chegada e rotas.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Photo Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-950">
                <img
                  src={COMPANY_CONFIG.heroImage}
                  alt="Cavalo mecânico 1635 Vapt Vupt"
                  className="w-full h-80 object-cover"
                />
                <div className="p-4 bg-neutral-900 border-t border-neutral-800">
                  <div className="text-xs font-bold text-[#B43034] uppercase tracking-wider">
                    Frota Pesada
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Cavalo Mecânico 1635 em operação
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400">
                <p>
                  <strong className="text-neutral-200">Segmento Econômico:</strong> {COMPANY_CONFIG.segment}.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cadastral & Operational Governance Section */}
      <section className="py-16 bg-[#161618] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-2">
              <Building className="w-4 h-4 text-[#B43034]" />
              <span>Transparência Cadastral</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Estrutura e Registros da Empresa
            </h2>
            <p className="mt-2 text-sm text-neutral-300">
              Registros cadastrais oficiais mantidos para conformidade fiscal e governança operacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMPANY_CONFIG.registrosCadastrais.map((registro, idx) => (
              <div
                key={idx}
                className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-white">
                      {registro.type}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                      CNPJ Ativo
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    Unidade {registro.city} - {registro.state}
                  </h3>

                  <div className="text-xs text-neutral-400 space-y-1.5 mb-4">
                    <p><span className="text-neutral-300 font-semibold">CNPJ:</span> {registro.cnpj}</p>
                    <p><span className="text-neutral-300 font-semibold">Endereço:</span> {registro.address}</p>
                    <p><span className="text-neutral-300 font-semibold">CEP:</span> {registro.cep}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 italic">
                  * Finalidade administrativa e base operacional. Atendimento presencial sujeito a consulta prévia; solicite deslocamento via WhatsApp.
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 text-xs text-neutral-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p>
              Para agendar transferências, vistorias de frotas ou orçamentos corporativos, utilize nossos canais oficiais de comunicação.
            </p>
            <Link
              to="/servicos"
              className="inline-flex items-center gap-1.5 font-bold text-[#B43034] hover:text-red-400 shrink-0 uppercase tracking-wider text-xs"
            >
              <span>Conhecer nossos serviços</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#141416]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Precisa de Atendimento Técnico em Remoção?
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto">
            Fale diretamente com nossos operadores pelo WhatsApp para consultar a disponibilidade do equipamento adequado para o seu veículo.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                COMPANY_CONFIG.whatsapp.defaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded shadow-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar no WhatsApp ({COMPANY_CONFIG.whatsapp.display})</span>
            </a>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-3.5 rounded border border-neutral-700 transition-colors"
            >
              <span>Acessar Página de Contato</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
