import React, { useEffect, useRef, useState } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import {
  isElementInOrNearViewport,
  shouldUseStaticReveal,
} from '../utils/uxPolish';
import { usePrefersReducedMotion } from './RevealSection';

/**
 * Reliable viewport reveal hook backed by IntersectionObserver + passive scroll geometry check:
 * - Returns { isRevealed, useStatic }
 * - Guarantees immediate static visibility if prefers-reduced-motion is enabled or IntersectionObserver fails/is absent.
 * - Ensures fast scrolls, scrollIntoView jumps, or silent IntersectionObserver failures never leave cards invisible.
 */
function useReliableReveal(
  elementRef: React.RefObject<HTMLDivElement | null>,
  shouldReduceMotion: boolean,
  once = true
): { isRevealed: boolean; useStatic: boolean } {
  const hasIO =
    typeof window !== 'undefined' && typeof IntersectionObserver === 'function';

  const [ioBroken, setIoBroken] = useState<boolean>(() => {
    if (typeof window === 'undefined' || shouldReduceMotion) return true;
    if (!hasIO) return true;
    try {
      const probe = new IntersectionObserver(() => {});
      probe.disconnect();
      return false;
    } catch {
      return true;
    }
  });

  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    return shouldReduceMotion || !hasIO;
  });

  useEffect(() => {
    if (shouldReduceMotion || !hasIO || ioBroken) {
      setIsRevealed(true);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    const checkViewportPosition = () => {
      const target = elementRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      if (isElementInOrNearViewport(rect.top, rect.bottom, window.innerHeight, 48)) {
        setIsRevealed(true);
      }
    };

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (
              entry.isIntersecting ||
              entry.boundingClientRect.top <= window.innerHeight + 48
            ) {
              setIsRevealed(true);
              if (once) {
                observer?.disconnect();
                observer = null;
              }
            } else if (!once && entry.boundingClientRect.top > window.innerHeight + 80) {
              setIsRevealed(false);
            }
          }
        },
        { threshold: 0.05, rootMargin: '0px 0px 48px 0px' }
      );
      observer.observe(el);
    } catch {
      setIoBroken(true);
      setIsRevealed(true);
      return;
    }

    // Immediate mount check & passive scroll listener (handles scrollIntoView jumps or silent IO stubs)
    checkViewportPosition();
    window.addEventListener('scroll', checkViewportPosition, { passive: true });
    window.addEventListener('resize', checkViewportPosition, { passive: true });

    // Safety timer in case layout settles into viewport without a scroll event
    const safetyTimer = window.setTimeout(checkViewportPosition, 800);

    return () => {
      window.removeEventListener('scroll', checkViewportPosition);
      window.removeEventListener('resize', checkViewportPosition);
      window.clearTimeout(safetyTimer);
      observer?.disconnect();
    };
  }, [elementRef, shouldReduceMotion, hasIO, ioBroken, once]);

  const useStatic = shouldUseStaticReveal({
    isReducedMotion: shouldReduceMotion,
    hasIntersectionObserver: hasIO,
    forceVisible: ioBroken,
  });

  return { isRevealed: useStatic ? true : isRevealed, useStatic };
}

interface ZigZagItemProps extends HTMLMotionProps<'div'> {
  index?: number;
  direction?: 'left' | 'right' | 'up' | 'auto';
  distance?: number;
  delay?: number;
  once?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * ZigZagItem
 * Animação de entrada suave e contida (fade-in com leve deslocamento vertical e/ou lateral):
 * - Propriedades leves compostas em GPU (opacity e transform), sem layout shift.
 * - Reutilizada nos cards de serviços da Home com entrada vertical sutil (direction="up").
 * - Mantém os cards 100% visíveis se IntersectionObserver ou inicialização da animação falhar.
 * - Respeita integralmente 'prefers-reduced-motion: reduce'.
 */
export const ZigZagItem: React.FC<ZigZagItemProps> = ({
  index = 0,
  direction = 'auto',
  distance = 14,
  delay,
  once = true,
  children,
  className = '',
  style,
  ...props
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = usePrefersReducedMotion();
  const { isRevealed, useStatic } = useReliableReveal(
    itemRef,
    shouldReduceMotion,
    once
  );

  if (useStatic) {
    return (
      <div
        ref={itemRef}
        className={className}
        style={{ opacity: 1, ...(style as React.CSSProperties) }}
      >
        {children}
      </div>
    );
  }

  const isPureUp = direction === 'up';
  const resolvedDirection =
    direction === 'auto' ? (index % 2 === 0 ? 'left' : 'right') : direction;
  const clampedDistance = Math.min(Math.max(distance, 8), 18);
  const translateX = isPureUp
    ? 0
    : resolvedDirection === 'left'
      ? -clampedDistance
      : clampedDistance;
  const translateY = isPureUp ? 14 : 10;
  const calculatedDelay =
    delay !== undefined
      ? Math.min(delay, 0.12)
      : Math.min((index % 3) * 0.045, 0.09);

  return (
    <motion.div
      ref={itemRef}
      initial={false}
      animate={
        isRevealed
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: translateX, y: translateY }
      }
      transition={{
        duration: 0.36,
        delay: isRevealed ? calculatedDelay : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        willChange: isRevealed ? 'auto' : 'transform, opacity',
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
 * Animação de cabeçalho com leve deslocamento direcional e fallback garantido de visibilidade,
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
  const headingRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = usePrefersReducedMotion();
  const { isRevealed, useStatic } = useReliableReveal(
    headingRef,
    shouldReduceMotion,
    true
  );

  if (useStatic) {
    return (
      <div
        ref={headingRef}
        className={className}
        style={{ opacity: 1, ...(style as React.CSSProperties) }}
      >
        {children}
      </div>
    );
  }

  const translateX = from === 'left' ? -12 : from === 'right' ? 12 : 0;

  return (
    <motion.div
      ref={headingRef}
      initial={false}
      animate={
        isRevealed
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: translateX, y: 8 }
      }
      transition={{
        duration: 0.32,
        delay: isRevealed ? Math.min(delay, 0.06) : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        willChange: isRevealed ? 'auto' : 'transform, opacity',
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
 * Container com entrada suave, fallback de visibilidade e suporte a 'prefers-reduced-motion'.
 */
export const ZigZagContainer: React.FC<ZigZagContainerProps> = ({
  children,
  className = '',
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = usePrefersReducedMotion();
  const { isRevealed, useStatic } = useReliableReveal(
    containerRef,
    shouldReduceMotion,
    true
  );

  if (useStatic) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{ opacity: 1, ...(style as React.CSSProperties) }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={false}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        willChange: isRevealed ? 'auto' : 'transform, opacity',
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
