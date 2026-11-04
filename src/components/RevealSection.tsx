import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  shouldRevealInitiallyAboveFold,
  shouldRevealSectionOnScroll,
  shouldUseStaticReveal,
} from '../utils/uxPolish';

export function usePrefersReducedMotion(): boolean {
  const framerReducedMotion = useReducedMotion();
  const [mediaReducedMotion, setMediaReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setMediaReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return Boolean(framerReducedMotion || mediaReducedMotion);
}

export interface RevealSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  delayMs?: number;
  distancePx?: number;
}

const SECTION_TRANSITION_MS = 450;

/**
 * RevealSection
 * Main section wrapper providing a subtle, GPU-composited fade-in-up reveal
 * driven by IntersectionObserver with passive scroll fallback, full
 * prefers-reduced-motion support, and zero layout shift between section bands.
 */
export const RevealSection: React.FC<RevealSectionProps> = ({
  children,
  className = '',
  innerClassName = 'w-full',
  delayMs = 0,
  distancePx = 16,
  ...rest
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = usePrefersReducedMotion();

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

  const useStatic = shouldUseStaticReveal({
    isReducedMotion: shouldReduceMotion,
    hasIntersectionObserver: hasIO,
    forceVisible: ioBroken,
  });

  const [isRevealed, setIsRevealed] = useState<boolean>(() => useStatic);
  const [hasSettled, setHasSettled] = useState<boolean>(() => useStatic);
  const initiallyRevealedRef = useRef<boolean>(useStatic);

  useLayoutEffect(() => {
    if (useStatic) {
      initiallyRevealedRef.current = true;
      setIsRevealed(true);
      setHasSettled(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (
      shouldRevealInitiallyAboveFold({
        rectTop: rect.top,
        rectBottom: rect.bottom,
        viewportHeight: window.innerHeight,
      })
    ) {
      initiallyRevealedRef.current = true;
      setIsRevealed(true);
      setHasSettled(true);
    }
  }, [useStatic]);

  useEffect(() => {
    if (useStatic || initiallyRevealedRef.current) {
      setIsRevealed(true);
      setHasSettled(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const checkPosition = (): boolean => {
      const target = sectionRef.current;
      if (!target) return false;
      const rect = target.getBoundingClientRect();
      const docEl = document.documentElement;
      const scrolledToBottom =
        typeof window !== 'undefined' &&
        Boolean(docEl) &&
        window.innerHeight + window.scrollY >= docEl.scrollHeight - 2;

      if (
        shouldRevealSectionOnScroll({
          rectTop: rect.top,
          rectBottom: rect.bottom,
          viewportHeight: window.innerHeight,
          scrolledToBottom,
          entryOffsetPx: 24,
        })
      ) {
        setIsRevealed(true);
        return true;
      }
      return false;
    };

    if (checkPosition()) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0) {
              setIsRevealed(true);
              observer?.disconnect();
              observer = null;
              break;
            }
          }
        },
        { threshold: 0, rootMargin: '0px 0px -24px 0px' }
      );
      observer.observe(el);
    } catch {
      setIoBroken(true);
      setIsRevealed(true);
      setHasSettled(true);
      return;
    }

    window.addEventListener('scroll', checkPosition, { passive: true });
    window.addEventListener('resize', checkPosition, { passive: true });

    const safetyTimer = window.setTimeout(checkPosition, 750);

    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
      window.clearTimeout(safetyTimer);
      observer?.disconnect();
    };
  }, [useStatic]);

  const clampedDelay = Math.min(Math.max(delayMs, 0), 200);
  const clampedDistance = Math.min(Math.max(distancePx, 8), 24);

  useEffect(() => {
    if (useStatic) {
      setHasSettled(true);
      return;
    }
    if (!isRevealed) {
      setHasSettled(false);
      return;
    }

    const settleTimer = window.setTimeout(
      () => {
        setHasSettled(true);
      },
      SECTION_TRANSITION_MS + clampedDelay + 60
    );

    return () => {
      window.clearTimeout(settleTimer);
    };
  }, [useStatic, isRevealed, clampedDelay]);

  const revealStyle: React.CSSProperties = useStatic
    ? {
        opacity: 1,
        transform: 'none',
      }
    : {
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed
          ? hasSettled
            ? 'none'
            : 'translate3d(0, 0, 0)'
          : `translate3d(0, ${clampedDistance}px, 0)`,
        transition: hasSettled
          ? 'none'
          : `opacity ${SECTION_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${clampedDelay}ms, transform ${SECTION_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${clampedDelay}ms`,
        willChange: isRevealed && hasSettled ? 'auto' : 'opacity, transform',
      };

  const revealState = useStatic ? 'static' : isRevealed ? 'visible' : 'hidden';

  return (
    <section
      ref={sectionRef}
      data-section-reveal={revealState}
      className={`overflow-x-clip ${className}`.trim()}
      {...rest}
    >
      <div
        className={innerClassName}
        style={revealStyle}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && isRevealed && !hasSettled) {
            setHasSettled(true);
          }
        }}
      >
        {children}
      </div>
    </section>
  );
};
