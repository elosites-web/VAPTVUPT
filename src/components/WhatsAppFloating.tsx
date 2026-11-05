import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { useNav } from '../context/NavContext';
import { WhatsAppIcon } from './WhatsAppIcon';

export const WhatsAppFloating: React.FC = () => {
  const [buttonReady, setButtonReady] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { mobileMenuOpen } = useNav();
  const location = useLocation();

  const scrollTimerStartedRef = useRef(false);
  const popupDelayTimerRef = useRef<number | null>(null);
  const reopenTimerRef = useRef<number | null>(null);

  // Monitora a rolagem para:
  // 1. Iniciar o cronômetro de 35s no primeiro scroll da Hero
  // 2. Detectar se o usuário está ou não dentro da Hero
  useEffect(() => {
    const checkScrollAndHero = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Inicia a contagem de 35 segundos assim que o usuário começa a rolar
      if (scrollY > 15 && !scrollTimerStartedRef.current) {
        scrollTimerStartedRef.current = true;
        window.setTimeout(() => {
          setButtonReady(true);
        }, 35000); // 35 segundos após começar a rolar o scroll
      }

      // Verifica se a Hero ainda está visível na tela (somente na Home '/')
      if (location.pathname === '/') {
        const heroEl = document.getElementById('inicio');
        if (heroEl) {
          const rect = heroEl.getBoundingClientRect();
          // Hero ainda está cobrindo a viewport se o fundo dela estiver visível abaixo do cabeçalho
          setIsInHero(rect.bottom > 120);
        } else {
          setIsInHero(scrollY < 500);
        }
      } else {
        // Em subpáginas, o botão é liberado assim que o cronômetro completar
        setIsInHero(false);
      }
    };

    checkScrollAndHero();
    window.addEventListener('scroll', checkScrollAndHero, { passive: true });
    window.addEventListener('resize', checkScrollAndHero, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkScrollAndHero);
      window.removeEventListener('resize', checkScrollAndHero);
    };
  }, [location.pathname]);

  // Dispara o balão de popup exatamente 15 segundos após a aparição do botão flutuante
  useEffect(() => {
    if (buttonReady && !isInHero && !tooltipVisible) {
      if (popupDelayTimerRef.current === null) {
        popupDelayTimerRef.current = window.setTimeout(() => {
          setTooltipVisible(true);
        }, 15000); // 15 segundos após a aparição do botão
      }
    }
  }, [buttonReady, isInHero, tooltipVisible]);

  // Limpeza de timers ao desmontar
  useEffect(() => {
    return () => {
      if (popupDelayTimerRef.current) clearTimeout(popupDelayTimerRef.current);
      if (reopenTimerRef.current) clearTimeout(reopenTimerRef.current);
    };
  }, []);

  const handleDismissTooltip = () => {
    setTooltipVisible(false);
    // Reaparece sempre 2 minutos (120.000 ms) após ser fechado pelo usuário
    if (reopenTimerRef.current) clearTimeout(reopenTimerRef.current);
    reopenTimerRef.current = window.setTimeout(() => {
      setTooltipVisible(true);
    }, 120000);
  };

  // O botão não pode aparecer na Hero, nem antes dos 35s de scroll, nem com menu mobile aberto
  if (!buttonReady || isInHero || mobileMenuOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none transition-all duration-300">
      {/* Balão de diálogo com texto centralizado e reabertura após 2 minutos */}
      {tooltipVisible && (
        <div className="hidden sm:flex flex-col items-end pointer-events-auto relative animate-fade-in-up">
          <div
            role="status"
            aria-live="polite"
            className="relative bg-white dark:bg-[#1b1b1f] border-2 border-[#B43034] dark:border-[#B43034] text-slate-900 dark:text-white px-4 py-3 rounded-2xl shadow-2xl max-w-[240px] text-xs text-center flex flex-col items-center justify-center"
          >
            <button
              type="button"
              onClick={handleDismissTooltip}
              className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
              aria-label="Fechar balão de diálogo"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="font-bold text-[#B43034] uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Atendimento WhatsApp</span>
            </div>
            <div className="text-slate-600 dark:text-neutral-300 text-[11px] leading-snug text-center">
              Fale conosco e consulte o suporte para o seu veículo.
            </div>

            {/* Seta / Ponteiro CSS alinhado ao centro do botão flutuante */}
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

      {/* Botão Flutuante com Halo de Pulso Gradiente */}
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
