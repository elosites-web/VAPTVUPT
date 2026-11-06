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

export const MOBILE_PORTRAIT_MEDIA_QUERY = '(orientation: portrait) and (max-width: 768px)';

export const MOBILE_LANDSCAPE_MEDIA_QUERY = '(orientation: landscape) and (max-height: 520px)';

/**
 * Determines whether the viewport corresponds to a mobile device in horizontal (landscape) orientation
 * based on width > height and viewport height <= 520px (typical mobile landscape heights: 320px–450px).
 */
export function isMobileLandscapeViewport(params: {
  width: number;
  height: number;
}): boolean {
  const { width, height } = params;
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return false;
  }
  return width > height && height <= 520;
}

/**
 * Resolves the appropriate hero video source based on viewport orientation and width.
 * Mobile portrait (9:16) uses /video/hero-scrub-mobile.mp4, desktop (16:9) uses /video/hero-scrub.mp4.
 */
export function resolveHeroVideoSource(isMobilePortrait: boolean): string {
  return isMobilePortrait ? '/video/hero-scrub-mobile.mp4' : '/video/hero-scrub.mp4';
}

export const HERO_VIDEO_DEFAULT_DURATION_SECONDS = 7.792;

/**
 * Computes the clamped target timestamp (in seconds) within safe keyframe bounds
 * for scroll-controlled hero video scrubbing.
 */
export function computeHeroVideoTargetTime(
  progress: number,
  durationSeconds: number,
  fallbackDurationSeconds = HERO_VIDEO_DEFAULT_DURATION_SECONDS
): number {
  const safeDuration =
    typeof durationSeconds === 'number' && Number.isFinite(durationSeconds) && durationSeconds > 0
      ? durationSeconds
      : fallbackDurationSeconds;

  const safeProgress =
    typeof progress === 'number' && Number.isFinite(progress)
      ? Math.max(0, Math.min(1, progress))
      : 0;

  const maxSafeTime = safeDuration > 0.05 ? safeDuration - 0.04 : safeDuration;

  if (safeProgress <= 0) {
    return 0;
  }
  if (safeProgress >= 1) {
    return maxSafeTime;
  }

  return Math.min(maxSafeTime, Math.max(0, safeProgress * safeDuration));
}

export interface HeroSeekDecisionInput {
  currentTime: number;
  targetTime: number;
  durationSeconds: number;
  lastRequestedSeekTime: number | null;
  isSeeking?: boolean;
  seekElapsedMs?: number;
}

/**
 * Prevents infinite re-seek loops caused by H.264 B/P-frame PTS quantization while
 * ensuring scroll changes and exact boundary seeks (start/end) always execute cleanly.
 */
export function shouldExecuteHeroVideoSeek({
  currentTime,
  targetTime,
  durationSeconds,
  lastRequestedSeekTime,
  isSeeking = false,
  seekElapsedMs = 0,
}: HeroSeekDecisionInput): 'seek' | 'buffer' | 'skip' {
  if (isSeeking && seekElapsedMs < 750) {
    return 'buffer';
  }

  if (lastRequestedSeekTime === null && Math.abs(currentTime - targetTime) <= 0.005) {
    return 'skip';
  }

  const safeDuration =
    typeof durationSeconds === 'number' && Number.isFinite(durationSeconds) && durationSeconds > 0
      ? durationSeconds
      : HERO_VIDEO_DEFAULT_DURATION_SECONDS;
  const maxSafeTime = safeDuration > 0.05 ? safeDuration - 0.04 : safeDuration;
  const isBoundaryTarget = targetTime <= 0.0005 || targetTime >= maxSafeTime - 0.0005;

  if (isBoundaryTarget) {
    if (
      lastRequestedSeekTime !== null &&
      Math.abs(lastRequestedSeekTime - targetTime) <= 0.0005 &&
      Math.abs(currentTime - targetTime) < 0.05
    ) {
      return 'skip';
    }
    return 'seek';
  }

  if (
    lastRequestedSeekTime !== null &&
    Math.abs(lastRequestedSeekTime - targetTime) < 0.008 &&
    Math.abs(currentTime - targetTime) < 0.06
  ) {
    return 'skip';
  }

  return 'seek';
}

/**
 * Resolves the poster image path corresponding to the active viewport orientation.
 */
export function resolveHeroPosterSource(isMobilePortrait: boolean): string {
  return isMobilePortrait ? '/hero-poster-mobile.jpg' : '/hero-poster.jpg';
}

/**
 * Determines whether the Hero <video> layer can safely fade in immediately on
 * metadata/data readiness without flashing an unseeked frame during an active seek.
 */
export function shouldRevealHeroVideoImmediately(params: {
  readyState: number | null | undefined;
  isSeeking: boolean;
  currentTime: number;
  targetTime: number;
  toleranceSeconds?: number;
}): boolean {
  if (!isHeroVideoFrameReady(params.readyState) || params.isSeeking) {
    return false;
  }

  const tolerance =
    typeof params.toleranceSeconds === 'number' &&
    Number.isFinite(params.toleranceSeconds) &&
    params.toleranceSeconds >= 0
      ? params.toleranceSeconds
      : 0.05;

  return Math.abs(params.currentTime - params.targetTime) <= tolerance;
}

/**
 * Determines the next fallback action when a Hero video source emits an error,
 * falling back from mobile to desktop video once without retrying already-failed sources.
 */
export function resolveHeroVideoErrorAction(params: {
  currentSrc: string;
  failedSources: ReadonlySet<string>;
}): { nextSrc: string | null; markAllFailed: boolean } {
  const desktopSrc = resolveHeroVideoSource(false);
  const mobileSrc = resolveHeroVideoSource(true);

  if (
    params.currentSrc === mobileSrc &&
    !params.failedSources.has(desktopSrc)
  ) {
    return { nextSrc: desktopSrc, markAllFailed: false };
  }

  return { nextSrc: null, markAllFailed: true };
}

/**
 * Computes normalized page scroll progress percentage clamped strictly to [0, 100].
 */
export function computeScrollProgressPercentage(
  scrollTop: number,
  scrollHeight: number,
  innerHeight: number
): number {
  if (
    !Number.isFinite(scrollTop) ||
    !Number.isFinite(scrollHeight) ||
    !Number.isFinite(innerHeight)
  ) {
    return 0;
  }

  const scrollableDistance = scrollHeight - innerHeight;
  if (scrollableDistance <= 0) {
    return 0;
  }

  const rawPercent = (scrollTop / scrollableDistance) * 100;
  return Math.min(100, Math.max(0, rawPercent));
}

/**
 * Verifies that a rendered logo image preserves its natural aspect ratio within a small rounding tolerance.
 */
export function isLogoAspectRatioPreserved(params: {
  naturalWidth: number;
  naturalHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  maxRelativeError?: number;
}): boolean {
  const {
    naturalWidth,
    naturalHeight,
    renderedWidth,
    renderedHeight,
    maxRelativeError = 0.04,
  } = params;

  if (
    !Number.isFinite(naturalWidth) ||
    !Number.isFinite(naturalHeight) ||
    !Number.isFinite(renderedWidth) ||
    !Number.isFinite(renderedHeight) ||
    naturalWidth <= 0 ||
    naturalHeight <= 0 ||
    renderedWidth <= 0 ||
    renderedHeight <= 0
  ) {
    return false;
  }

  const naturalRatio = naturalWidth / naturalHeight;
  const renderedRatio = renderedWidth / renderedHeight;
  const relativeDiff = Math.abs(renderedRatio - naturalRatio) / naturalRatio;

  return relativeDiff <= maxRelativeError;
}

/**
 * Resolves the effective dark mode boolean according to user preference,
 * system OS preference, and hour fallback.
 */
export function resolveEffectiveTheme(params: {
  mode: 'light' | 'dark' | 'auto';
  systemDark?: boolean;
  hour?: number;
}): boolean {
  if (params.mode === 'dark') return true;
  if (params.mode === 'light') return false;
  if (typeof params.systemDark === 'boolean') {
    return params.systemDark;
  }
  const h = typeof params.hour === 'number' ? params.hour : new Date().getHours();
  return h >= 18 || h < 6;
}


