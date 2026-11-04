import React, { useEffect, useState } from 'react';

/**
 * CustomTruckCursor
 * Cursor visual complementar e discreto inspirado em volante de caminhão,
 * ativo apenas em dispositivos com mouse fino (pointer: fine) e sem preferência
 * por movimento reduzido. Nunca oculta o cursor nativo do sistema nem intercepta cliques.
 */
export const CustomTruckCursor: React.FC = () => {
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

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-50 hidden lg:block transition-transform duration-100 ease-out"
      style={{
        transform: `translate3d(${pos.x - 14}px, ${pos.y - 14}px, 0) scale(${isInteractive ? 1.18 : 1})`,
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-opacity duration-150 ${isInteractive ? 'opacity-75' : 'opacity-40'}`}
      >
        {/* Aro externo do volante pesado */}
        <circle
          cx="14"
          cy="14"
          r="11.5"
          stroke={isInteractive ? '#B43034' : '#94a3b8'}
          strokeWidth="1.6"
        />
        {/* Raios de direção */}
        <path
          d="M4 13.5H10.5M17.5 13.5H24M14 17V24.5"
          stroke={isInteractive ? '#B43034' : '#94a3b8'}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Cubo central */}
        <circle
          cx="14"
          cy="14"
          r="2.6"
          stroke="#B43034"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
};
