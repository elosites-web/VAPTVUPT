import React, { useState } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

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
 * Animação de entrada suave, estável e executada no compositor:
 * - Dispara uma única vez por carregamento (viewport.once: true).
 * - Utiliza exclusivamente 'transform' (translate3d via x/y) e 'opacity', sem scale ou propriedades de layout.
 * - Respeita integralmente 'prefers-reduced-motion'.
 */
export const ZigZagItem: React.FC<ZigZagItemProps> = ({
  index = 0,
  direction = 'auto',
  distance = 14,
  delay,
  children,
  className = '',
  style,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  if (prefersReducedMotion) {
    return (
      <div className={className} style={style as React.CSSProperties}>
        {children}
      </div>
    );
  }

  const effectiveDistance = isMobile ? Math.min(distance, 8) : Math.min(distance, 14);
  const isLeft = direction === 'left' ? true : direction === 'right' ? false : index % 2 === 0;
  const initialX = isLeft ? -effectiveDistance : effectiveDistance;
  const calculatedDelay =
    delay !== undefined ? Math.min(delay, 0.15) : Math.min((index % 3) * 0.04, 0.1);

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialX,
        y: 6,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
        margin: '0px 0px -20px 0px',
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
 * Animação discreta para cabeçalhos de seção usando apenas transform (x/y) e opacity,
 * disparada uma única vez (viewport.once: true) e respeitando prefers-reduced-motion.
 */
export const ZigZagHeading: React.FC<ZigZagHeadingProps> = ({
  children,
  className = '',
  delay = 0,
  from = 'center',
  style,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} style={style as React.CSSProperties}>
        {children}
      </div>
    );
  }

  const initialX = from === 'left' ? -10 : from === 'right' ? 10 : 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialX,
        y: 6,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
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
  );
};

interface ZigZagContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

/**
 * ZigZagContainer
 * Container com disparo único (viewport.once: true) e transição restrita a opacity/transform.
 */
export const ZigZagContainer: React.FC<ZigZagContainerProps> = ({
  children,
  className = '',
  style,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} style={style as React.CSSProperties}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
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
  );
};
