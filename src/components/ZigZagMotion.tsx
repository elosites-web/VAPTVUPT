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
 * Animação de entrada suave focada exclusivamente em 'opacity' e 'transform: translateY' (y):
 * - Dispara uma única vez com viewport: { once: true, amount: 0.2 }.
 * - Sem animações de escala (scale) ou deslocamentos horizontais bruscos.
 * - Respeita integralmente 'prefers-reduced-motion' e a configuração reducedMotion.
 */
export const ZigZagItem: React.FC<ZigZagItemProps> = ({
  index = 0,
  direction: _direction = 'auto',
  distance = 12,
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

  const translateY = Math.min(Math.max(distance, 6), 14);
  const calculatedDelay =
    delay !== undefined ? Math.min(delay, 0.15) : Math.min((index % 3) * 0.04, 0.1);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{
          opacity: 0,
          y: translateY,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.38,
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
 * Animação de cabeçalho focada exclusivamente em 'opacity' e 'transform: translateY' (y),
 * com viewport: { once: true, amount: 0.2 } e suporte a 'prefers-reduced-motion'.
 */
export const ZigZagHeading: React.FC<ZigZagHeadingProps> = ({
  children,
  className = '',
  delay = 0,
  from: _from = 'center',
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
          y: 10,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.38,
          delay: Math.min(delay, 0.12),
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
 * Container com whileInView e viewport: { once: true, amount: 0.2 },
 * animando apenas 'opacity' e 'transform: translateY' (y).
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
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.35,
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
