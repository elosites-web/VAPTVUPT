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

export interface SectionRevealCheckInput {
  rectTop: number;
  rectBottom: number;
  viewportHeight: number;
  scrolledToBottom?: boolean;
  entryOffsetPx?: number;
}

/**
 * Determines whether a main section wrapper should reveal based on its bounding rect
 * relative to the viewport, ensuring tall sections, scrolled-past sections, and
 * bottom-of-page sections never remain stuck invisible.
 */
export function shouldRevealSectionOnScroll({
  rectTop,
  rectBottom,
  viewportHeight,
  scrolledToBottom = false,
  entryOffsetPx = 24,
}: SectionRevealCheckInput): boolean {
  if (
    !Number.isFinite(rectTop) ||
    !Number.isFinite(rectBottom) ||
    !Number.isFinite(viewportHeight) ||
    viewportHeight <= 0
  ) {
    return true;
  }

  if (rectBottom <= 0) {
    return true;
  }

  const safeOffset = Math.max(
    0,
    Math.min(
      Math.floor(viewportHeight * 0.15),
      Number.isFinite(entryOffsetPx) ? entryOffsetPx : 24
    )
  );

  if (rectTop <= viewportHeight - safeOffset) {
    return true;
  }

  if (scrolledToBottom && rectTop < viewportHeight) {
    return true;
  }

  return false;
}

/**
 * Determines whether a section is already prominently positioned above the fold
 * at initial mount (or scrolled past via hash/restored scroll) so it can render
 * visible before first paint without being stalled by heavy sibling mounts (e.g., WebGL).
 */
export function shouldRevealInitiallyAboveFold({
  rectTop,
  rectBottom,
  viewportHeight,
}: {
  rectTop: number;
  rectBottom: number;
  viewportHeight: number;
}): boolean {
  if (
    !Number.isFinite(rectTop) ||
    !Number.isFinite(rectBottom) ||
    !Number.isFinite(viewportHeight) ||
    viewportHeight <= 0
  ) {
    return true;
  }

  if (rectBottom <= 0) {
    return true;
  }

  return rectTop < viewportHeight * 0.55;
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

/**
 * Determines whether the viewport corresponds to a tablet in horizontal (landscape)
 * orientation rather than portrait tablet, mobile, or standard widescreen desktop.
 */
export function isTabletLandscapeViewport(params: {
  width: number;
  height: number;
  isCoarsePointer?: boolean;
}): boolean {
  const { width, height, isCoarsePointer = false } = params;
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return false;
  }

  const isLandscape = width > height;
  if (!isLandscape || height < 550 || width < 768 || width > 1368) {
    return false;
  }

  if (width <= 1279) {
    return true;
  }

  if (isCoarsePointer) {
    return true;
  }

  return width / height <= 16 / 10;
}

/**
 * HTMLMediaElement.readyState >= 2 (HAVE_CURRENT_DATA) guarantees at least one
 * decoded video frame is available rather than metadata-only (readyState === 1).
 */
export function isHeroVideoFrameReady(readyState: number | null | undefined): boolean {
  return typeof readyState === 'number' && Number.isFinite(readyState) && readyState >= 2;
}

/**
 * Evaluates Netlify _redirects rules top-to-bottom for a request path
 * to verify valid SPA routes return 200 and unknown paths return 404.
 */
export function evaluateNetlifyRedirectStatus(
  requestPath: string,
  redirectsFileContent: string
): number | null {
  const normalizedPath = requestPath.startsWith('/') ? requestPath : `/${requestPath}`;
  const lines = redirectsFileContent.split(/\r?\n/);

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const parts = trimmed.split(/\s+/);
    if (parts.length < 3) continue;

    const [fromPattern, , statusToken] = parts;
    const status = Number.parseInt(statusToken.replace(/!$/, ''), 10);
    if (!Number.isFinite(status)) continue;

    if (fromPattern === '/*') {
      return status;
    }

    if (fromPattern.endsWith('/*')) {
      const prefix = fromPattern.slice(0, -1);
      if (normalizedPath.startsWith(prefix)) {
        return status;
      }
      continue;
    }

    if (normalizedPath === fromPattern) {
      return status;
    }
  }

  return null;
}
