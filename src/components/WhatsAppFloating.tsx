import React, { useState } from 'react';
import { X } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { useNav } from '../context/NavContext';
import { WhatsAppIcon } from './WhatsAppIcon';

export const WhatsAppFloating: React.FC = () => {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const { mobileMenuOpen } = useNav();

  // O botão flutuante não deve aparecer quando o menu hambúrguer estiver aberto
  if (mobileMenuOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none">
      {/* Estrutura envolvente do balão de diálogo com seta CSS apontando exatamente para o centro do botão flutuante */}
      {!tooltipDismissed && (
        <div className="hidden sm:flex flex-col items-end pointer-events-auto relative">
          <div
            role="status"
            aria-live="polite"
            className="relative bg-white dark:bg-[#1b1b1f] border-2 border-[#B43034] dark:border-[#B43034] text-slate-900 dark:text-white px-3.5 py-2.5 rounded-2xl shadow-2xl max-w-[235px] text-xs"
          >
            <button
              type="button"
              onClick={() => setTooltipDismissed(true)}
              className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white p-0.5 rounded-full transition-colors"
              aria-label="Fechar balão de diálogo"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="font-bold text-[#B43034] uppercase tracking-wider mb-0.5 pr-4 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Atendimento WhatsApp</span>
            </div>
            <div className="text-slate-600 dark:text-neutral-300 text-[11px] leading-snug">
              Fale conosco e consulte o suporte para o seu veículo.
            </div>

            {/* Seta / Ponteiro CSS alinhado exatamente ao eixo central do botão flutuante (28px a partir da direita em sm:w-14) */}
            <span
              aria-hidden="true"
              className="
                absolute -bottom-[8px] right-[20px] w-3.5 h-3.5 rotate-45
                bg-white dark:bg-[#1b1b1f]
                border-r-2 border-b-2 border-[#B43034] dark:border-[#B43034]
              "
            />
          </div>
        </div>
      )}

      {/* Botão Flutuante com Halo de Pulso Gradiente Vermelho e Prata */}
      <div className="relative flex items-center justify-center pointer-events-auto">
        <span
          className="absolute -inset-1 rounded-full animate-floating-pulse-1 pointer-events-none"
          aria-hidden="true"
        />
        <span
          className="absolute -inset-1 rounded-full animate-floating-pulse-2 pointer-events-none"
          aria-hidden="true"
        />
        <a
          href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
            COMPANY_CONFIG.whatsapp.defaultMessage
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#C7383D] via-[#B43034] to-[#8F2428] hover:from-[#D4383D] hover:to-[#982226] text-white border-2 border-slate-200/80 dark:border-slate-300/70 shadow-2xl shadow-red-950/70 transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/40"
          aria-label="Conversar no WhatsApp com Vapt Vupt Remoção de Veículos"
          title="Conversar no WhatsApp"
        >
          <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
        </a>
      </div>
    </div>
  );
};
