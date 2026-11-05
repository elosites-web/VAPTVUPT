import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * CustomTruckCursor
 * Cursor visual complementar inspirado em volante clássico de caminhão/veículo pesado.
 * Ativo exclusivamente em dispositivos desktop com mouse de alta precisão (pointer: fine)
 * e sem preferência por movimento reduzido. Nunca oculta o cursor nativo do sistema.
 * 
 * Cores adaptativas para dia/noite com contorno duplo e drop-shadow de alta nitidez,
 * garantindo legibilidade imediata sobre qualquer imagem, fundo escuro ou claro.
 */
export const CustomTruckCursor: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateAvailability = () => {
      setEnabled(finePointerQuery.matches && !reducedMotionQuery.matches);
    };

    updateAvailability();
    finePointerQuery.addEventListener('change', updateAvailability);
    reducedMotionQuery.addEventListener('change', updateAvailability);

    return () => {
      finePointerQuery.removeEventListener('change', updateAvailability);
      reducedMotionQuery.removeEventListener('change', updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest('a, button, input, select, textarea, label, [role="button"]')
      );

      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        setIsInteractive(interactive);
        if (!visible) setVisible(true);
      });
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, visible]);

  if (!enabled || !visible) return null;

  // Paleta de cores do volante adaptada ao tema e ao estado interativo
  const primaryStroke = isInteractive
    ? '#B43034'
    : isDarkMode
      ? '#F1F5F9'
      : '#0F172A';

  const secondaryStroke = isInteractive
    ? '#E53E3E'
    : isDarkMode
      ? '#94A3B8'
      : '#334155';

  const outlineStroke = isDarkMode ? '#000000' : '#FFFFFF';

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[80] hidden lg:block will-change-transform"
      style={{
        transform: `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0) scale(${isInteractive ? 1.15 : 1})`,
        transition: 'transform 0.12s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.15s ease',
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        style={{
          filter: isDarkMode
            ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 1px rgba(0, 0, 0, 0.9))'
            : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 1px rgba(255, 255, 255, 0.95))',
        }}
      >
        {/* Camada 1: Contorno sobressalente de alto contraste (garante nitidez em qualquer fundo) */}
        <circle
          cx="16"
          cy="16"
          r="13"
          stroke={outlineStroke}
          strokeWidth="3.2"
          strokeOpacity={isDarkMode ? 0.9 : 0.8}
        />
        <path
          d="M3.5 16H11M21 16H28.5M16 20.5V28.5"
          stroke={outlineStroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity={isDarkMode ? 0.9 : 0.8}
        />

        {/* Camada 2: Aro externo principal do volante de caminhão */}
        <circle
          cx="16"
          cy="16"
          r="13"
          stroke={primaryStroke}
          strokeWidth="2"
        />

        {/* Anel interno do volante (reforço estrutural de caminhão pesado) */}
        <circle
          cx="16"
          cy="16"
          r="9.5"
          stroke={secondaryStroke}
          strokeWidth="0.8"
          strokeDasharray="1.5 2.5"
          strokeOpacity={0.65}
        />

        {/* Raios de direção em T característicos de caminhões */}
        <path
          d="M3.5 16H11.5M20.5 16H28.5M16 20.5V28.5"
          stroke={primaryStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Cubo central (buzina/miolo da direção) */}
        <circle
          cx="16"
          cy="16"
          r="3.5"
          fill={isDarkMode ? '#1E1E24' : '#F8FAFC'}
          stroke={isInteractive ? '#B43034' : secondaryStroke}
          strokeWidth="1.6"
        />

        {/* Detalhe central em vermelho da marca */}
        <circle
          cx="16"
          cy="16"
          r="1.4"
          fill="#B43034"
        />
      </svg>
    </div>
  );
};
