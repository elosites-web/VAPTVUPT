import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { computeScrollProgressPercentage } from '../utils/uxPolish';

/**
 * ScrollProgressBar - Barra de progresso de leitura/rolagem
 * Posicionada acima da barra principal do cabeçalho (z-[75], acima do Header z-[70] e abaixo do aviso de protótipo).
 * 
 * Gradientes dinâmicos conforme especificação:
 * - Modo escuro: Vermelho, cinza, branco com brilho prata
 * - Modo claro: Cinza, preto, vermelho com brilho prata
 * 
 * A ponta brilhante possui rigorosamente a mesma espessura da barra.
 */
export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressStateRef = useRef(0);

  // Cálculo da porcentagem de rolagem sincronizado com requestAnimationFrame e atualização direta do DOM
  useEffect(() => {
    let rafId: number | null = null;

    const calculateScroll = () => {
      rafId = null;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const percent = computeScrollProgressPercentage(
        scrollTop,
        document.documentElement.scrollHeight,
        window.innerHeight
      );

      if (barRef.current) {
        barRef.current.style.width = `${percent}%`;
        barRef.current.style.opacity = percent > 0 ? '1' : '0';
      }
      if (containerRef.current) {
        containerRef.current.setAttribute('aria-valuenow', Math.round(percent).toString());
      }

      const rounded = Math.round(percent);
      if (
        (rounded > 0 && progressStateRef.current === 0) ||
        (rounded === 0 && progressStateRef.current > 0) ||
        Math.abs(rounded - progressStateRef.current) >= 2
      ) {
        progressStateRef.current = rounded;
        setProgress(rounded);
      }
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(calculateScroll);
      }
    };

    calculateScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    const timer = window.setTimeout(calculateScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.clearTimeout(timer);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [location.pathname]);

  // Configurações de cores e gradientes tricolores específicos por tema
  // Modo escuro: Vermelho (#B43034), Cinza (#9CA3AF), Branco (#FFFFFF) com brilho prata
  // Modo claro: Cinza (#6B7280), Preto (#18181B), Vermelho (#B43034) com brilho prata
  const gradientStyle = isDarkMode
    ? {
        background: 'linear-gradient(90deg, #B43034 0%, #9CA3AF 50%, #FFFFFF 100%)',
        boxShadow: '0 1px 4px rgba(180, 48, 52, 0.4), 0 0 8px rgba(229, 231, 235, 0.25)',
      }
    : {
        background: 'linear-gradient(90deg, #6B7280 0%, #18181B 50%, #B43034 100%)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.35), 0 0 6px rgba(180, 48, 52, 0.3)',
      };

  // Efeito de transição suave na ponta brilhante prateada
  const tipTransitionGradient = isDarkMode
    ? 'linear-gradient(90deg, transparent 0%, rgba(156, 163, 175, 0.4) 30%, rgba(229, 231, 235, 0.85) 70%, #FFFFFF 100%)'
    : 'linear-gradient(90deg, transparent 0%, rgba(180, 48, 52, 0.4) 30%, rgba(229, 231, 235, 0.85) 70%, #FFFFFF 100%)';

  // Brilho prata radiante (silver glow)
  const silverGlowBoxShadow = isDarkMode
    ? '0 0 6px 1px #FFFFFF, 0 0 12px 2px rgba(229, 231, 235, 0.95), 0 0 16px 3px rgba(156, 163, 175, 0.7)'
    : '0 0 6px 1px #FFFFFF, 0 0 12px 2px rgba(192, 192, 192, 0.95), 0 0 16px 3px rgba(148, 163, 184, 0.7)';

  return (
    <div
      ref={containerRef}
      className="fixed top-[25px] left-0 right-0 z-[75] h-[3.5px] pointer-events-none overflow-hidden"
      role="progressbar"
      aria-label="Progresso de leitura da página"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Trilho de fundo sutil adaptativo ao tema */}
      <div
        className={`absolute inset-0 backdrop-blur-[1px] transition-colors duration-300 ${
          isDarkMode ? 'bg-black/35' : 'bg-neutral-300/40'
        }`}
      />

      {/* Barra de Progresso com Gradiente Tricolor Dinâmico */}
      <div
        ref={barRef}
        className="relative h-full transition-[width] duration-75 ease-out will-change-[width]"
        style={{
          width: `${progress}%`,
          opacity: progress > 0 ? 1 : 0,
          ...gradientStyle,
        }}
      >
        {/* Camada de reflexo luminoso suave sobre a barra */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, transparent 100%)',
          }}
        />

        {/* Ponta Brilhante (Silver Glow Tip) - RIGOROSAMENTE na MESMA ESPESSURA da barra (h-full) */}
        {progress > 0 && (
          <div
            className="absolute top-0 right-0 h-full flex items-center justify-end pointer-events-none"
            style={{ width: '32px' }}
          >
            {/* Gradiente de transição para o prata/branco da ponta */}
            <div
              className="h-full w-full"
              style={{
                background: tipTransitionGradient,
              }}
            />

            {/* Núcleo Prateado Incandescente da Ponta Brilhante na mesma espessura */}
            <div
              className="absolute top-0 right-0 h-full w-[4px] bg-white rounded-r-full animate-tip-sparkle"
              style={{
                boxShadow: silverGlowBoxShadow,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
