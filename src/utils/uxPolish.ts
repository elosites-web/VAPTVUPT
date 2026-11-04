export interface ParallaxInput {
  progress: number;
  viewportWidth: number;
  isFinePointer: boolean;
  isReducedMotion: boolean;
  isMediaFallback: boolean;
  maxShiftPx?: number;
}

export interface ParallaxResult {
  enabled: boolean;
  translateY: number;
}

export interface LoadingTimingConfig {
  delayMs: number;
  maxWaitMs: number;
}

export const DESKTOP_MIN_WIDTH_PX = 1024;

export const DEFAULT_LOADING_TIMINGS: LoadingTimingConfig = {
  delayMs: 200,
  maxWaitMs: 10000,
};

/**
 * Computes a subtle vertical parallax offset for decorative Hero layers on desktop only.
 * Disabled completely on viewports < 1024px, touch/coarse-pointer devices,
 * prefers-reduced-motion, or when the static Hero fallback is active.
 */
export function computeDesktopParallaxOffset({
  progress,
  viewportWidth,
  isFinePointer,
  isReducedMotion,
  isMediaFallback,
  maxShiftPx = 14,
}: ParallaxInput): ParallaxResult {
  if (
    isReducedMotion ||
    isMediaFallback ||
    !isFinePointer ||
    !Number.isFinite(viewportWidth) ||
    viewportWidth < DESKTOP_MIN_WIDTH_PX
  ) {
    return { enabled: false, translateY: 0 };
  }

  const safeProgress = Number.isFinite(progress)
    ? Math.max(0, Math.min(1, progress))
    : 0;
  const safeMaxShift = Number.isFinite(maxShiftPx)
    ? Math.max(0, Math.min(32, maxShiftPx))
    : 14;

  // Starts at 0px at top of Hero (progress = 0) and glides subtly upward as user scrolls
  const rawShift = -safeProgress * safeMaxShift;
  const translateY = Object.is(rawShift, -0) ? 0 : Number(rawShift.toFixed(2));

  return {
    enabled: true,
    translateY,
  };
}

/**
 * Determines whether animated reveal elements should render immediately in their
 * settled visible state (reduced motion, missing IntersectionObserver, or timeout recovery).
 */
export function shouldUseStaticReveal(params: {
  isReducedMotion: boolean;
  hasIntersectionObserver: boolean;
  forceVisible: boolean;
}): boolean {
  return Boolean(
    params.isReducedMotion || !params.hasIntersectionObserver || params.forceVisible
  );
}

/**
 * Checks whether an element's vertical bounding box has entered or already passed
 * the viewport within an optional lookahead margin.
 */
export function isElementInOrNearViewport(
  rectTop: number,
  rectBottom: number,
  viewportHeight: number,
  thresholdMarginPx = 140
): boolean {
  if (
    !Number.isFinite(rectTop) ||
    !Number.isFinite(rectBottom) ||
    !Number.isFinite(viewportHeight) ||
    viewportHeight <= 0
  ) {
    return true;
  }

  return rectTop <= viewportHeight + thresholdMarginPx;
}

/**
 * Normalizes loading delay (to prevent flicker on fast loads) and safety timeout bounds
 * (to ensure loading indicators cannot leave a user stuck indefinitely).
 */
export function clampLoadingTimings(
  partial?: Partial<LoadingTimingConfig>
): LoadingTimingConfig {
  const delayMs =
    typeof partial?.delayMs === 'number' && Number.isFinite(partial.delayMs)
      ? Math.max(0, Math.min(2000, partial.delayMs))
      : DEFAULT_LOADING_TIMINGS.delayMs;

  const rawMax =
    typeof partial?.maxWaitMs === 'number' && Number.isFinite(partial.maxWaitMs)
      ? partial.maxWaitMs
      : DEFAULT_LOADING_TIMINGS.maxWaitMs;

  const maxWaitMs = Math.max(delayMs + 500, Math.min(30000, rawMax));

  return { delayMs, maxWaitMs };
}

/**
 * Resolves a human-readable breadcrumb label for a top-level route segment,
 * returning 'Página Não Encontrada' for unrecognized paths instead of raw URL slugs.
 */
export function resolveRouteBreadcrumbLabel(
  rootSegment: string,
  routeMap: Record<string, string>,
  fallbackUnknownLabel = 'Página Não Encontrada'
): string {
  const clean = rootSegment.trim();
  if (!clean) return 'Início';
  return Object.prototype.hasOwnProperty.call(routeMap, clean)
    ? routeMap[clean]
    : fallbackUnknownLabel;
}
