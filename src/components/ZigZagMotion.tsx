import React, { useEffect, useState } from 'react';
import { MotionConfig, motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

function usePrefersReducedMotion(): boolean {
  const framerReducedMotion = useReducedMotion();
  const [mediaReducedMotion, setMediaReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setMediaReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return Boolean(framerReducedMotion || mediaReducedMotion);
}

interface ZigZagItemProps extends HTMLMotionProps<'div'> {
  index?: number;
  direction?: 'left' | 'right' | 'auto';
  distance?: number;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * ZigZagItem
 * Animação de entrada suave com efeito zig-zag alternado (esquerda/direita) e reentrada fluida no scroll:
 * - Distância curta (x: ±16px, y: 10px) e transição rápida (0.34s) sem atrasos longos.
 * - Reaparece suavemente ao rolar para cima ou para baixo (once: false, amount: 0.14).
 * - Respeita integralmente 'prefers-reduced-motion: reduce'.
 */
export const ZigZagItem: React.FC<ZigZagItemProps> = ({
  index = 0,
  direction = 'auto',
  distance = 16,
  delay,
  children,
  className = '',
  style,
  ...props
}) => {
  const shouldReduceMotion = usePrefersReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style as React.CSSProperties}>
        {children}
      </div>
    );
  }

  const resolvedDirection =
    direction === 'auto' ? (index % 2 === 0 ? 'left' : 'right') : direction;
  const clampedDistance = Math.min(Math.max(distance, 10), 20);
  const translateX = resolvedDirection === 'left' ? -clampedDistance : clampedDistance;
  const translateY = 10;
  const calculatedDelay =
    delay !== undefined ? Math.min(delay, 0.08) : Math.min((index % 3) * 0.03, 0.06);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{
          opacity: 0,
          x: translateX,
          y: translateY,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
          y: 0,
        }}
        viewport={{
          once: false,
          amount: 0.14,
          margin: '0px 0px -24px 0px',
        }}
        transition={{
          duration: 0.34,
          delay: calculatedDelay,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          willChange: 'transform, opacity',
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
};

interface ZigZagHeadingProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: 'left' | 'right' | 'center';
}

/**
 * ZigZagHeading
 * Animação de cabeçalho com leve deslocamento direcional e reentrada suave no scroll,
 * respeitando 'prefers-reduced-motion'.
 */
export const ZigZagHeading: React.FC<ZigZagHeadingProps> = ({
  children,
  className = '',
  delay = 0,
  from = 'center',
  style,
  ...props
}) => {
  const shouldReduceMotion = usePrefersReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style as React.CSSProperties}>
        {children}
      </div>
    );
  }

  const translateX = from === 'left' ? -14 : from === 'right' ? 14 : 0;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{
          opacity: 0,
          x: translateX,
          y: 8,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
          y: 0,
        }}
        viewport={{
          once: false,
          amount: 0.15,
        }}
        transition={{
          duration: 0.32,
          delay: Math.min(delay, 0.06),
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          willChange: 'transform, opacity',
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
};

interface ZigZagContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

/**
 * ZigZagContainer
 * Container com whileInView suave e suporte a 'prefers-reduced-motion'.
 */
export const ZigZagContainer: React.FC<ZigZagContainerProps> = ({
  children,
  className = '',
  style,
  ...props
}) => {
  const shouldReduceMotion = usePrefersReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style as React.CSSProperties}>
        {children}
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: false,
          amount: 0.14,
        }}
        transition={{
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          willChange: 'transform, opacity',
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
};
