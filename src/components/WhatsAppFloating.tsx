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
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex items-end flex-col gap-2 pointer-events-none">
      {/* Tooltip speech bubble */}
      {!tooltipDismissed && (
        <div className="hidden sm:block pointer-events-auto bg-white dark:bg-[#18181b] border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white p-3 rounded-xl shadow-2xl max-w-[220px] text-xs relative">
          <button
            type="button"
            onClick={() => setTooltipDismissed(true)}
            className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white p-0.5"
            aria-label="Fechar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="font-bold text-[#B43034] uppercase tracking-wider mb-0.5">
            Atendimento WhatsApp
          </div>
          <div className="text-slate-600 dark:text-neutral-300 text-[11px] leading-tight">
            Fale conosco e consulte o suporte para o seu veículo.
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
          COMPANY_CONFIG.whatsapp.defaultMessage
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#B43034] hover:bg-[#8F2428] text-white shadow-2xl shadow-red-950/60 transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/40"
        aria-label="Conversar no WhatsApp com Vapt Vupt Remoção de Veículos"
        title="Conversar no WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
      </a>
    </div>
  );
};
