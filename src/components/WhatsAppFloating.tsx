import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';

export const WhatsAppFloating: React.FC = () => {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2 pointer-events-none">
      {/* Tooltip speech bubble */}
      {!tooltipDismissed && (
        <div className="pointer-events-auto bg-[#18181b] border border-neutral-700 text-white p-3 rounded-xl shadow-2xl max-w-[220px] text-xs relative animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => setTooltipDismissed(true)}
            className="absolute top-1.5 right-1.5 text-neutral-400 hover:text-white p-0.5"
            aria-label="Fechar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="font-bold text-[#B43034] uppercase tracking-wider mb-0.5">
            Atendimento Rápido
          </div>
          <div className="text-neutral-300 text-[11px] leading-tight">
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
        className="pointer-events-auto inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#B43034] hover:bg-[#8F2428] text-white shadow-2xl shadow-red-950/60 transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/40"
        aria-label="Conversar no WhatsApp com Vapt Vupt Remoção de Veículos"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  );
};
