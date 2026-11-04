import React, { useEffect, useRef, useState } from 'react';
import { clampLoadingTimings, type LoadingTimingConfig } from '../utils/uxPolish';

export interface UseDelayedLoadingOptions extends Partial<LoadingTimingConfig> {
  onTimeout?: () => void;
}

/**
 * Manages delayed spinner visibility and a bounded safety timeout:
 * - Prevents flicker on fast operations (< delayMs)
 * - Guarantees loading states cannot leave the user stuck indefinitely (> maxWaitMs)
 */
export function useDelayedLoadingState(
  isLoading: boolean,
  options?: UseDelayedLoadingOptions
): { visible: boolean; timedOut: boolean } {
  const [visible, setVisible] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const onTimeoutRef = useRef(options?.onTimeout);
  onTimeoutRef.current = options?.onTimeout;

  const { delayMs, maxWaitMs } = clampLoadingTimings(options);

  useEffect(() => {
    if (!isLoading) {
      setVisible(false);
      setTimedOut(false);
      return;
    }

    setTimedOut(false);

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, delayMs);

    const safetyTimer = window.setTimeout(() => {
      setVisible(false);
      setTimedOut(true);
      onTimeoutRef.current?.();
    }, maxWaitMs);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(safetyTimer);
    };
  }, [isLoading, delayMs, maxWaitMs]);

  return { visible, timedOut };
}

interface BrandSpinnerProps {
  label?: string;
  caption?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'dark' | 'light' | 'auto';
  className?: string;
}

const SIZE_MAP: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
};

/**
 * BrandSpinner
 * Subtle, smooth, accessible loading indicator styled in official Vapt Vupt brand red (#B43034).
 * Always centers within its container and provides an accessible status label for screen readers.
 */
export const BrandSpinner: React.FC<BrandSpinnerProps> = ({
  label = 'Carregando conteúdo, aguarde...',
  caption,
  size = 'md',
  tone = 'auto',
  className = '',
}) => {
  const captionToneClass =
    tone === 'dark'
      ? 'text-neutral-200'
      : tone === 'light'
      ? 'text-slate-700'
      : 'text-slate-700 dark:text-neutral-200';

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="brand-spinner"
      className={`flex flex-col items-center justify-center text-center gap-2.5 select-none ${className}`}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center rounded-full p-1"
      >
        <svg
          className={`${SIZE_MAP[size]} animate-spin text-[#B43034]`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="#B43034"
            strokeOpacity="0.22"
            strokeWidth="2.75"
          />
          <path
            d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12"
            stroke="#B43034"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {caption && (
        <span
          aria-hidden="true"
          className={`text-xs font-semibold tracking-wide ${captionToneClass}`}
        >
          {caption}
        </span>
      )}
    </div>
  );
};
