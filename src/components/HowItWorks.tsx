import React, { useState } from 'react';
import { FileText, CheckCircle2, ArrowRight, Car, Truck, HelpCircle } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';
import { RevealSection } from './RevealSection';

export const HowItWorks: React.FC = () => {
  const [vehicleType, setVehicleType] = useState('Carro de Passeio');
  const [needType, setNeedType] = useState('Pane Mecânica / Imobilizado');
  const [locationNote, setLocationNote] = useState('');

  const steps = [
    {
      number: '01',
      icon: WhatsAppIcon,
      title: 'Entre em contato pelo WhatsApp',
      description: 'Clique no botão oficial e inicie o atendimento com nossa equipe de despacho.',
    },
    {
      number: '02',
      icon: FileText,
      title: 'Informe veículo e necessidade',
      description: 'Informe o modelo do veículo, a condição (leves ou pesados) e o ponto onde se encontra.',
    },
    {
      number: '03',
      icon: CheckCircle2,
      title: 'Consulte condições e disponibilidade',
      description: 'Receba a orientação imediata sobre o equipamento adequado e as condições de atendimento.',
    },
  ];

  const handleGenerateWhatsAppLink = () => {
    const text = COMPANY_CONFIG.whatsapp.quoteMessage(vehicleType, needType, locationNote.trim() || undefined);
    return `${COMPANY_CONFIG.whatsapp.link}?text=${text}`;
  };

  return (
    <RevealSection id="como-funciona" className="py-20 lg:py-28 bg-[#141416] relative overflow-hidden border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-center mx-auto">
          <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-6 h-0.5 bg-[#B43034]" />
            <span>Processo Ágil & Direto</span>
            <span className="w-6 h-0.5 bg-[#B43034]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
            COMO SOLICITAR SEU ATENDIMENTO
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300">
            Três passos práticos para solicitar o suporte e obter as informações sobre disponibilidade e deslocamento.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl relative overflow-hidden hover:border-[#B43034]/60 transition-all duration-300 group"
              >
                {/* Big watermark number */}
                <div className="absolute top-2 right-4 text-6xl font-black text-neutral-800/40 select-none pointer-events-none font-mono">
                  {step.number}
                </div>

                <div className="w-14 h-14 rounded-lg bg-neutral-800 flex items-center justify-center text-[#B43034] group-hover:bg-[#B43034] group-hover:text-white transition-colors duration-300 mb-6">
                  <Icon className="w-7 h-7" />
                </div>

                <div className="text-xs font-bold text-[#B43034] uppercase tracking-widest mb-1">
                  Passo {step.number}
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Direct WhatsApp Inquiry Builder */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs font-bold text-[#B43034] uppercase tracking-wider">
                Agilize sua Mensagem
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide mt-1">
                Personalize sua Solicitação de Atendimento
              </h4>
            </div>
            <span className="text-xs text-neutral-400 bg-neutral-800/80 px-3 py-1.5 rounded self-start sm:self-auto">
              Abre direto no seu WhatsApp
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Vehicle Type Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                1. Tipo de Veículo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Carro de Passeio', 'SUV / Picape', 'Van / Utilitário', 'Caminhão / Pesado'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVehicleType(v)}
                    className={`p-3 text-xs font-semibold rounded-lg border text-left transition-all ${
                      vehicleType === v
                        ? 'bg-[#B43034] text-white border-[#B43034] shadow-md'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Need Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                2. Situação / Necessidade
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'Pane Mecânica / Imobilizado',
                  'Transporte Programado',
                  'Remoção Especial / Acidente',
                ].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNeedType(n)}
                    className={`p-2.5 text-xs font-semibold rounded-lg border text-left transition-all ${
                      needType === n
                        ? 'bg-[#B43034] text-white border-[#B43034] shadow-md'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Note (Optional) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                3. Localização ou Trajeto aproximado (Opcional)
              </label>
              <input
                type="text"
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                placeholder="Ex: Cidade, bairro ou referência do local"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B43034] transition-colors"
              />
            </div>
          </div>

          {/* Action button sending to WhatsApp */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
            <div className="text-xs text-neutral-400">
              Ao clicar, seu aplicativo WhatsApp será aberto com o texto formatado para envio direto.
            </div>
            <a
              href={handleGenerateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-[11px] min-[360px]:text-xs sm:text-sm font-bold uppercase tracking-tight min-[400px]:tracking-normal sm:tracking-wider px-5 sm:px-8 py-3 sm:py-3.5 rounded-lg shadow-lg shadow-red-950/50 transition-all transform hover:-translate-y-0.5 text-center leading-tight"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span className="whitespace-normal sm:whitespace-nowrap">Enviar Consulta no WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </RevealSection>
  );
};
