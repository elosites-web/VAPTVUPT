/// <reference types="node" />
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  computeDesktopParallaxOffset,
  shouldUseStaticReveal,
  isElementInOrNearViewport,
  clampLoadingTimings,
  resolveRouteBreadcrumbLabel,
  isTabletLandscapeViewport,
  isHeroVideoFrameReady,
  evaluateNetlifyRedirectStatus,
  shouldRevealSectionOnScroll,
  shouldRevealInitiallyAboveFold,
  resolveHeroVideoSource,
  resolveHeroPosterSource,
  MOBILE_PORTRAIT_MEDIA_QUERY,
  MOBILE_LANDSCAPE_MEDIA_QUERY,
  isMobileLandscapeViewport,
  DESKTOP_MIN_WIDTH_PX,
  HERO_VIDEO_DEFAULT_DURATION_SECONDS,
  computeHeroVideoTargetTime,
  shouldExecuteHeroVideoSeek,
  shouldRevealHeroVideoImmediately,
  resolveHeroVideoErrorAction,
  computeScrollProgressPercentage,
  isLogoAspectRatioPreserved,
  resolveEffectiveTheme,
} from './uxPolish';
import {
  OFFICIAL_LOGO_SYMBOL_SRC,
  OFFICIAL_LOGO_SYMBOL_DARK_SRC,
  OFFICIAL_LOGO_WORDMARK_SRC,
} from '../components/BrandLogoHorizontal';
import { COMPANY_CONFIG } from '../data/companyData';

test('computeDesktopParallaxOffset enables subtle upward parallax on desktop with fine pointer', () => {
  const atStart = computeDesktopParallaxOffset({
    progress: 0,
    viewportWidth: 1440,
    isFinePointer: true,
    isReducedMotion: false,
    isMediaFallback: false,
    maxShiftPx: 14,
  });
  assert.deepEqual(atStart, { enabled: true, translateY: 0 });

  const atMid = computeDesktopParallaxOffset({
    progress: 0.5,
    viewportWidth: 1440,
    isFinePointer: true,
    isReducedMotion: false,
    isMediaFallback: false,
    maxShiftPx: 14,
  });
  assert.deepEqual(atMid, { enabled: true, translateY: -7 });

  const atEnd = computeDesktopParallaxOffset({
    progress: 1.4, // clamps above 1
    viewportWidth: DESKTOP_MIN_WIDTH_PX,
    isFinePointer: true,
    isReducedMotion: false,
    isMediaFallback: false,
    maxShiftPx: 14,
  });
  assert.deepEqual(atEnd, { enabled: true, translateY: -14 });
});

test('computeDesktopParallaxOffset disables parallax on mobile, touch devices, reduced motion, and fallback', () => {
  const mobile = computeDesktopParallaxOffset({
    progress: 0.5,
    viewportWidth: 390,
    isFinePointer: true,
    isReducedMotion: false,
    isMediaFallback: false,
  });
  assert.deepEqual(mobile, { enabled: false, translateY: 0 });

  const touch = computeDesktopParallaxOffset({
    progress: 0.5,
    viewportWidth: 1440,
    isFinePointer: false,
    isReducedMotion: false,
    isMediaFallback: false,
  });
  assert.deepEqual(touch, { enabled: false, translateY: 0 });

  const reduced = computeDesktopParallaxOffset({
    progress: 0.5,
    viewportWidth: 1440,
    isFinePointer: true,
    isReducedMotion: true,
    isMediaFallback: false,
  });
  assert.deepEqual(reduced, { enabled: false, translateY: 0 });

  const fallback = computeDesktopParallaxOffset({
    progress: 0.5,
    viewportWidth: 1440,
    isFinePointer: true,
    isReducedMotion: false,
    isMediaFallback: true,
  });
  assert.deepEqual(fallback, { enabled: false, translateY: 0 });
});

test('shouldUseStaticReveal guarantees visibility when IntersectionObserver missing, reduced motion active, or forced', () => {
  assert.equal(
    shouldUseStaticReveal({
      isReducedMotion: false,
      hasIntersectionObserver: true,
      forceVisible: false,
    }),
    false
  );

  assert.equal(
    shouldUseStaticReveal({
      isReducedMotion: true,
      hasIntersectionObserver: true,
      forceVisible: false,
    }),
    true
  );

  assert.equal(
    shouldUseStaticReveal({
      isReducedMotion: false,
      hasIntersectionObserver: false,
      forceVisible: false,
    }),
    true
  );

  assert.equal(
    shouldUseStaticReveal({
      isReducedMotion: false,
      hasIntersectionObserver: true,
      forceVisible: true,
    }),
    true
  );
});

test('isElementInOrNearViewport detects visible, near-viewport, and already-scrolled-past cards', () => {
  assert.equal(isElementInOrNearViewport(300, 600, 900), true);
  assert.equal(isElementInOrNearViewport(1020, 1300, 900, 140), true);
  assert.equal(isElementInOrNearViewport(-200, -20, 900), true);
  assert.equal(isElementInOrNearViewport(1200, 1500, 900, 140), false);
});

test('clampLoadingTimings enforces positive anti-flicker delay and finite maximum timeout', () => {
  const defaults = clampLoadingTimings();
  assert.equal(defaults.delayMs, 200);
  assert.equal(defaults.maxWaitMs, 10000);

  const bounded = clampLoadingTimings({ delayMs: 500, maxWaitMs: 100 });
  assert.equal(bounded.delayMs, 500);
  assert.ok(bounded.maxWaitMs >= 1000);
});

test('resolveRouteBreadcrumbLabel maps known routes and labels unknown routes as Página Não Encontrada', () => {
  const map = { servicos: 'Serviços Especializados', '404': 'Página Não Encontrada' };
  assert.equal(resolveRouteBreadcrumbLabel('servicos', map), 'Serviços Especializados');
  assert.equal(
    resolveRouteBreadcrumbLabel('rota-inexistente-123', map),
    'Página Não Encontrada'
  );
});

test('isTabletLandscapeViewport matches tablet horizontal viewports only and excludes portrait, mobile, and desktop', () => {
  // Tablet landscape (iPad, iPad Air, Android Tablet, iPad Pro)
  assert.equal(isTabletLandscapeViewport({ width: 1024, height: 768 }), true);
  assert.equal(isTabletLandscapeViewport({ width: 1180, height: 820 }), true);
  assert.equal(isTabletLandscapeViewport({ width: 1280, height: 800 }), true);
  assert.equal(isTabletLandscapeViewport({ width: 1366, height: 1024 }), true);

  // Tablet portrait (must NOT match)
  assert.equal(isTabletLandscapeViewport({ width: 768, height: 1024 }), false);
  assert.equal(isTabletLandscapeViewport({ width: 820, height: 1180 }), false);
  assert.equal(isTabletLandscapeViewport({ width: 1024, height: 1366 }), false);

  // Mobile portrait & landscape (must NOT match)
  assert.equal(isTabletLandscapeViewport({ width: 390, height: 844 }), false);
  assert.equal(isTabletLandscapeViewport({ width: 844, height: 390, isCoarsePointer: true }), false);

  // Desktop & 16:9 widescreen laptops (must NOT match)
  assert.equal(isTabletLandscapeViewport({ width: 1280, height: 720 }), false);
  assert.equal(isTabletLandscapeViewport({ width: 1366, height: 768 }), false);
  assert.equal(isTabletLandscapeViewport({ width: 1440, height: 900 }), false);
  assert.equal(isTabletLandscapeViewport({ width: 1920, height: 1080 }), false);
});

test('isHeroVideoFrameReady requires readyState >= 2 and rejects metadata-only readyState === 1', () => {
  assert.equal(isHeroVideoFrameReady(0), false);
  assert.equal(isHeroVideoFrameReady(1), false);
  assert.equal(isHeroVideoFrameReady(2), true);
  assert.equal(isHeroVideoFrameReady(3), true);
  assert.equal(isHeroVideoFrameReady(4), true);
  assert.equal(isHeroVideoFrameReady(null), false);
  assert.equal(isHeroVideoFrameReady(undefined), false);
  assert.equal(isHeroVideoFrameReady(Number.NaN), false);
});

test('public/_redirects preserves HTTP 200 for all valid SPA routes and returns HTTP 404 for unknown URLs', () => {
  const redirectsPath = path.resolve(process.cwd(), 'public/_redirects');
  const content = fs.readFileSync(redirectsPath, 'utf8');

  const validSpaRoutes = [
    '/',
    '/empresa',
    '/empresa/',
    '/servicos',
    '/servicos/',
    '/servicos/remocao-veiculos-leves',
    '/servicos/remocao-veiculos-pesados',
    '/servicos/solucoes-em-remocao',
    '/frota',
    '/perguntas-frequentes',
    '/trabalhe-conosco',
    '/contato',
    '/politica-de-privacidade',
    '/termos-de-uso',
  ];

  for (const route of validSpaRoutes) {
    assert.equal(
      evaluateNetlifyRedirectStatus(route, content),
      200,
      `Expected HTTP 200 rewrite for valid SPA route ${route}`
    );
  }

  const notFoundPaths = [
    '/404',
    '/404/',
    '/pagina-inexistente',
    '/rota/desconhecida/123',
    '/servicos/servico-inexistente',
  ];

  for (const path404 of notFoundPaths) {
    assert.equal(
      evaluateNetlifyRedirectStatus(path404, content),
      404,
      `Expected HTTP 404 status for unknown/404 path ${path404}`
    );
  }
});

test('shouldRevealSectionOnScroll triggers when section enters viewport, handles tall/scrolled-past sections, and fails open', () => {
  // Below viewport fold -> stays unrevealed
  assert.equal(
    shouldRevealSectionOnScroll({
      rectTop: 920,
      rectBottom: 1500,
      viewportHeight: 900,
    }),
    false
  );

  // Just touching 10px inside viewport (< 24px entryOffsetPx) -> waits slightly
  assert.equal(
    shouldRevealSectionOnScroll({
      rectTop: 890,
      rectBottom: 1500,
      viewportHeight: 900,
    }),
    false
  );

  // Crossed 24px into viewport -> reveals
  assert.equal(
    shouldRevealSectionOnScroll({
      rectTop: 876,
      rectBottom: 1500,
      viewportHeight: 900,
    }),
    true
  );

  // Very tall section (3000px tall on 844px mobile) whose top entered viewport -> reveals
  assert.equal(
    shouldRevealSectionOnScroll({
      rectTop: 800,
      rectBottom: 3800,
      viewportHeight: 844,
    }),
    true
  );

  // Already scrolled past above viewport -> reveals immediately
  assert.equal(
    shouldRevealSectionOnScroll({
      rectTop: -900,
      rectBottom: -120,
      viewportHeight: 900,
    }),
    true
  );

  // Scrolled to bottom of document -> reveals short bottom-most section even if < 24px tall
  assert.equal(
    shouldRevealSectionOnScroll({
      rectTop: 888,
      rectBottom: 900,
      viewportHeight: 900,
      scrolledToBottom: true,
    }),
    true
  );

  // Tiny viewport height clamps entry offset safely to 15% (15px of 100px -> threshold 85)
  assert.equal(
    shouldRevealSectionOnScroll({
      rectTop: 90,
      rectBottom: 400,
      viewportHeight: 100,
    }),
    false
  );
  assert.equal(
    shouldRevealSectionOnScroll({
      rectTop: 85,
      rectBottom: 400,
      viewportHeight: 100,
    }),
    true
  );

  // Invalid / non-finite geometry fails open
  assert.equal(
    shouldRevealSectionOnScroll({
      rectTop: Number.NaN,
      rectBottom: 500,
      viewportHeight: 900,
    }),
    true
  );
});

test('shouldRevealInitiallyAboveFold reveals sections prominently above the fold on mount while deferring lower sections to scroll', () => {
  // Top page banner on subpage (rectTop: 175 on 900px viewport -> < 495px) -> immediate
  assert.equal(
    shouldRevealInitiallyAboveFold({
      rectTop: 175,
      rectBottom: 380,
      viewportHeight: 900,
    }),
    true
  );

  // Upper-fold primary grid (rectTop: 380 on 900px viewport -> < 495px) -> immediate
  assert.equal(
    shouldRevealInitiallyAboveFold({
      rectTop: 380,
      rectBottom: 940,
      viewportHeight: 900,
    }),
    true
  );

  // Lower section on same page (#modelo-3d at rectTop: 680 >= 495px) -> defers to IntersectionObserver fade-in-up
  assert.equal(
    shouldRevealInitiallyAboveFold({
      rectTop: 680,
      rectBottom: 1300,
      viewportHeight: 900,
    }),
    false
  );

  // Home sections below 240vh Hero (rectTop: 2160) -> defers to IntersectionObserver fade-in-up
  assert.equal(
    shouldRevealInitiallyAboveFold({
      rectTop: 2160,
      rectBottom: 2760,
      viewportHeight: 900,
    }),
    false
  );

  // Already above viewport (deep-link / restored scroll) -> immediate
  assert.equal(
    shouldRevealInitiallyAboveFold({
      rectTop: -900,
      rectBottom: -120,
      viewportHeight: 900,
    }),
    true
  );
});

test('resolveHeroVideoSource selects 9:16 mobile video or 16:9 desktop video', () => {
  assert.equal(MOBILE_PORTRAIT_MEDIA_QUERY, '(orientation: portrait) and (max-width: 768px)');
  assert.equal(resolveHeroVideoSource(true), '/video/hero-scrub-mobile.mp4');
  assert.equal(resolveHeroVideoSource(false), '/video/hero-scrub.mp4');
});

test('isMobileLandscapeViewport accurately detects mobile devices in horizontal landscape orientation', () => {
  assert.equal(MOBILE_LANDSCAPE_MEDIA_QUERY, '(orientation: landscape) and (max-height: 520px)');

  // iPhone 12/13/14 landscape (844 x 390)
  assert.equal(isMobileLandscapeViewport({ width: 844, height: 390 }), true);

  // iPhone SE landscape (667 x 375)
  assert.equal(isMobileLandscapeViewport({ width: 667, height: 375 }), true);

  // Pixel 7 landscape (915 x 412)
  assert.equal(isMobileLandscapeViewport({ width: 915, height: 412 }), true);

  // iPhone 14 Pro Max landscape (932 x 430)
  assert.equal(isMobileLandscapeViewport({ width: 932, height: 430 }), true);

  // Mobile portrait (390 x 844) -> not landscape
  assert.equal(isMobileLandscapeViewport({ width: 390, height: 844 }), false);

  // Desktop landscape (1920 x 1080) -> height > 520, not mobile landscape
  assert.equal(isMobileLandscapeViewport({ width: 1920, height: 1080 }), false);

  // Tablet landscape (1024 x 768) -> height > 520, not mobile landscape
  assert.equal(isMobileLandscapeViewport({ width: 1024, height: 768 }), false);
});

test('computeHeroVideoTargetTime clamps progress within safe start and keyframe end bounds', () => {
  assert.equal(HERO_VIDEO_DEFAULT_DURATION_SECONDS, 7.792);
  assert.equal(computeHeroVideoTargetTime(0, 7.792), 0);
  assert.equal(computeHeroVideoTargetTime(-0.2, 7.792), 0);
  assert.equal(computeHeroVideoTargetTime(1, 7.792), 7.752);
  assert.equal(computeHeroVideoTargetTime(1.25, 7.792), 7.752);

  const midpoint = computeHeroVideoTargetTime(0.5, 7.792);
  assert.ok(Math.abs(midpoint - 3.896) < 0.0001);

  // Fallback when duration is NaN or 0
  assert.equal(computeHeroVideoTargetTime(1, Number.NaN), 7.752);
  assert.equal(computeHeroVideoTargetTime(1, 0), 7.752);
});

test('shouldExecuteHeroVideoSeek prevents B-frame PTS quantization seek loops while allowing real scroll and boundary seeks', () => {
  // Initial seek at prog = 0 when video starts at currentTime = 0 -> skip redundant seek
  assert.equal(
    shouldExecuteHeroVideoSeek({
      currentTime: 0,
      targetTime: 0,
      durationSeconds: 7.792,
      lastRequestedSeekTime: null,
    }),
    'skip'
  );

  // Scroll advances to 1.948s -> seek
  assert.equal(
    shouldExecuteHeroVideoSeek({
      currentTime: 0,
      targetTime: 1.948,
      durationSeconds: 7.792,
      lastRequestedSeekTime: null,
    }),
    'seek'
  );

  // In-flight seek -> buffer
  assert.equal(
    shouldExecuteHeroVideoSeek({
      currentTime: 0.4,
      targetTime: 2.5,
      durationSeconds: 7.792,
      lastRequestedSeekTime: 1.948,
      isSeeking: true,
      seekElapsedMs: 50,
    }),
    'buffer'
  );

  // Wedged seeking flag after >= 750ms -> break out with seek
  assert.equal(
    shouldExecuteHeroVideoSeek({
      currentTime: 0.4,
      targetTime: 2.5,
      durationSeconds: 7.792,
      lastRequestedSeekTime: 1.948,
      isSeeking: true,
      seekElapsedMs: 800,
    }),
    'seek'
  );

  // After seeked fires, 24fps H.264 PTS snapped to 1.9583s (~0.0103s from 1.948s) -> skip re-seek loop!
  assert.equal(
    shouldExecuteHeroVideoSeek({
      currentTime: 1.9583,
      targetTime: 1.948,
      durationSeconds: 7.792,
      lastRequestedSeekTime: 1.948,
      isSeeking: false,
    }),
    'skip'
  );

  // User scrolls further to 2.15s -> seek
  assert.equal(
    shouldExecuteHeroVideoSeek({
      currentTime: 1.9583,
      targetTime: 2.15,
      durationSeconds: 7.792,
      lastRequestedSeekTime: 1.948,
      isSeeking: false,
    }),
    'seek'
  );

  // Exact boundary seek to start (0) from tiny positive offset -> seek
  assert.equal(
    shouldExecuteHeroVideoSeek({
      currentTime: 0.02,
      targetTime: 0,
      durationSeconds: 7.792,
      lastRequestedSeekTime: 0.015,
      isSeeking: false,
    }),
    'seek'
  );

  // Exact boundary seek to end (7.752) -> seek once, then skip if already settled
  assert.equal(
    shouldExecuteHeroVideoSeek({
      currentTime: 7.74,
      targetTime: 7.752,
      durationSeconds: 7.792,
      lastRequestedSeekTime: 7.74,
      isSeeking: false,
    }),
    'seek'
  );
  assert.equal(
    shouldExecuteHeroVideoSeek({
      currentTime: 7.75,
      targetTime: 7.752,
      durationSeconds: 7.792,
      lastRequestedSeekTime: 7.752,
      isSeeking: false,
    }),
    'skip'
  );
});

test('Hero video and poster asset references resolve to existing non-empty files in public/', () => {
  const publicDir = path.resolve(process.cwd(), 'public');
  const assetPaths = [
    resolveHeroVideoSource(false),
    resolveHeroVideoSource(true),
    resolveHeroPosterSource(false),
    resolveHeroPosterSource(true),
    '/assets/vaptvupt/caminhao-cavalo-1635.jpg',
  ];

  for (const relativeAssetUrl of assetPaths) {
    const cleanRel = relativeAssetUrl.replace(/^\/+/, '');
    const fullPath = path.join(publicDir, cleanRel);
    assert.equal(
      fs.existsSync(fullPath),
      true,
      `Expected Hero asset ${relativeAssetUrl} to exist at ${fullPath}`
    );
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `Expected Hero asset ${relativeAssetUrl} to be non-empty`);
  }
});

test('shouldRevealHeroVideoImmediately reveals only when frame is decoded, not actively seeking, and within tolerance', () => {
  // Decoded first frame at start, not seeking -> reveal immediately
  assert.equal(
    shouldRevealHeroVideoImmediately({
      readyState: 2,
      isSeeking: false,
      currentTime: 0,
      targetTime: 0,
    }),
    true
  );

  // Actively seeking while browser already updated currentTime JS property -> wait for seeked event
  assert.equal(
    shouldRevealHeroVideoImmediately({
      readyState: 3,
      isSeeking: true,
      currentTime: 3.1,
      targetTime: 3.1,
    }),
    false
  );

  // Metadata-only readyState === 1 -> do not reveal yet
  assert.equal(
    shouldRevealHeroVideoImmediately({
      readyState: 1,
      isSeeking: false,
      currentTime: 0,
      targetTime: 0,
    }),
    false
  );

  // Restored scroll target time differs from unseeked frame 0 -> do not flash frame 0 before seek
  assert.equal(
    shouldRevealHeroVideoImmediately({
      readyState: 4,
      isSeeking: false,
      currentTime: 0,
      targetTime: 2.5,
    }),
    false
  );
});

test('resolveHeroVideoErrorAction falls back from mobile to desktop once without retrying already-failed sources', () => {
  const desktopSrc = resolveHeroVideoSource(false);
  const mobileSrc = resolveHeroVideoSource(true);

  // Mobile fails first -> fallback to desktop video
  assert.deepEqual(
    resolveHeroVideoErrorAction({
      currentSrc: mobileSrc,
      failedSources: new Set([mobileSrc]),
    }),
    { nextSrc: desktopSrc, markAllFailed: false }
  );

  // Desktop also fails after mobile -> enter static poster fallback
  assert.deepEqual(
    resolveHeroVideoErrorAction({
      currentSrc: desktopSrc,
      failedSources: new Set([mobileSrc, desktopSrc]),
    }),
    { nextSrc: null, markAllFailed: true }
  );

  // Mobile fails when desktop previously failed -> do not loop back to desktop
  assert.deepEqual(
    resolveHeroVideoErrorAction({
      currentSrc: mobileSrc,
      failedSources: new Set([desktopSrc, mobileSrc]),
    }),
    { nextSrc: null, markAllFailed: true }
  );
});

test('computeScrollProgressPercentage clamps scroll progress to [0, 100] and handles non-scrollable documents', () => {
  assert.equal(computeScrollProgressPercentage(0, 3000, 900), 0);
  assert.equal(computeScrollProgressPercentage(-50, 3000, 900), 0);
  assert.equal(computeScrollProgressPercentage(1050, 3000, 900), 50);
  assert.equal(computeScrollProgressPercentage(2100, 3000, 900), 100);
  assert.equal(computeScrollProgressPercentage(2500, 3000, 900), 100);
  assert.equal(computeScrollProgressPercentage(100, 900, 900), 0);
  assert.equal(computeScrollProgressPercentage(Number.NaN, 3000, 900), 0);
});

test('all Vapt Vupt logo assets exist in public/ as non-empty transparent RGBA PNGs with expected dimensions', () => {
  const publicDir = path.resolve(process.cwd(), 'public');
  const logoPaths = new Set<string>([
    OFFICIAL_LOGO_SYMBOL_SRC,
    OFFICIAL_LOGO_SYMBOL_DARK_SRC,
    OFFICIAL_LOGO_WORDMARK_SRC,
    ...Object.values(COMPANY_CONFIG.logos),
    '/logo-vaptvupt-share.png',
    '/assets/brand/favicons/favicon-32x32.png',
    '/assets/brand/favicons/favicon-192x192.png',
    '/assets/brand/favicons/favicon-512x512.png',
    '/assets/brand/favicons/apple-touch-icon.png',
    '/assets/brand/favicons/vaptvupt-dark.png',
    '/assets/brand/favicons/vaptvupt-light.png',
    '/assets/brand/favicons/vaptvupt-priority.png',
  ]);

  for (const urlPath of logoPaths) {
    const cleanRel = urlPath.replace(/^\/+/, '');
    const fullPath = path.join(publicDir, cleanRel);
    assert.equal(fs.existsSync(fullPath), true, `Missing logo asset: ${urlPath}`);
    const buf = fs.readFileSync(fullPath);
    assert.ok(buf.length > 0, `Empty logo asset: ${urlPath}`);

    if (cleanRel.toLowerCase().endsWith('.png')) {
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      const colorType = buf[25];
      assert.ok(width > 0 && height > 0, `Invalid PNG dimensions for ${urlPath}`);
      assert.equal(
        colorType === 6 || colorType === 4,
        true,
        `Expected RGBA/alpha channel on PNG logo ${urlPath}, got colorType=${colorType}`
      );
    }
  }
});

test('isLogoAspectRatioPreserved validates proportional scaling and rejects squished boxes', () => {
  // Desktop symbol (1000x433 rendered at 259x112) and tablet portrait symbol (222x96)
  assert.equal(
    isLogoAspectRatioPreserved({
      naturalWidth: 1000,
      naturalHeight: 433,
      renderedWidth: 259,
      renderedHeight: 112,
    }),
    true
  );
  assert.equal(
    isLogoAspectRatioPreserved({
      naturalWidth: 1000,
      naturalHeight: 433,
      renderedWidth: 222,
      renderedHeight: 96,
    }),
    true
  );

  // Squished tablet portrait symbol (148x96 -> 33% distortion) must fail
  assert.equal(
    isLogoAspectRatioPreserved({
      naturalWidth: 1000,
      naturalHeight: 433,
      renderedWidth: 148,
      renderedHeight: 96,
    }),
    false
  );

  // Desktop wordmark (520x216 rendered at 193x80) and tablet portrait wordmark (154x64)
  assert.equal(
    isLogoAspectRatioPreserved({
      naturalWidth: 520,
      naturalHeight: 216,
      renderedWidth: 193,
      renderedHeight: 80,
    }),
    true
  );
  assert.equal(
    isLogoAspectRatioPreserved({
      naturalWidth: 520,
      naturalHeight: 216,
      renderedWidth: 154,
      renderedHeight: 64,
    }),
    true
  );
});

test('resolveEffectiveTheme handles manual dark, manual light, OS preference, and hour fallback', () => {
  // Manual dark always resolves true regardless of system
  assert.equal(resolveEffectiveTheme({ mode: 'dark', systemDark: false, hour: 12 }), true);
  assert.equal(resolveEffectiveTheme({ mode: 'dark', systemDark: true, hour: 12 }), true);

  // Manual light always resolves false regardless of system
  assert.equal(resolveEffectiveTheme({ mode: 'light', systemDark: true, hour: 22 }), false);
  assert.equal(resolveEffectiveTheme({ mode: 'light', systemDark: false, hour: 2 }), false);

  // Auto with systemDark=true resolves true even at noon
  assert.equal(resolveEffectiveTheme({ mode: 'auto', systemDark: true, hour: 12 }), true);

  // Auto with systemDark=false resolves false even at midnight
  assert.equal(resolveEffectiveTheme({ mode: 'auto', systemDark: false, hour: 23 }), false);

  // Auto without systemDark falls back to hour (06:00-17:59 light / 18:00-05:59 dark)
  assert.equal(resolveEffectiveTheme({ mode: 'auto', hour: 10 }), false);
  assert.equal(resolveEffectiveTheme({ mode: 'auto', hour: 17 }), false);
  assert.equal(resolveEffectiveTheme({ mode: 'auto', hour: 18 }), true);
  assert.equal(resolveEffectiveTheme({ mode: 'auto', hour: 23 }), true);
  assert.equal(resolveEffectiveTheme({ mode: 'auto', hour: 4 }), true);
  assert.equal(resolveEffectiveTheme({ mode: 'auto', hour: 6 }), false);
});

test('global CSS defines font-display: swap for Inter, Montserrat, and Plus Jakarta Sans', () => {
  const cssPath = path.resolve(process.cwd(), 'src/index.css');
  assert.equal(fs.existsSync(cssPath), true, 'src/index.css must exist');

  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  // Verify @font-face declarations exist
  assert.equal(cssContent.includes("@font-face"), true, 'src/index.css must declare @font-face');

  // Verify font-display: swap is present
  const fontDisplayMatches = cssContent.match(/font-display:\s*swap;/g);
  assert.ok(fontDisplayMatches && fontDisplayMatches.length >= 3, 'Must declare font-display: swap for all key web fonts');

  // Verify specific font-family declarations
  assert.equal(cssContent.includes("font-family: 'Inter';"), true, 'Must declare font-family: Inter in @font-face');
  assert.equal(cssContent.includes("font-family: 'Montserrat';"), true, 'Must declare font-family: Montserrat in @font-face');
  assert.equal(cssContent.includes("font-family: 'Plus Jakarta Sans';"), true, 'Must declare font-family: Plus Jakarta Sans in @font-face');
});

test('HeaderSearch correctly indexes official services and resolves keywords', () => {
  const headerSearchPath = path.resolve(process.cwd(), 'src/components/HeaderSearch.tsx');
  assert.equal(fs.existsSync(headerSearchPath), true, 'src/components/HeaderSearch.tsx must exist');

  const content = fs.readFileSync(headerSearchPath, 'utf-8');
  assert.equal(content.includes('remocao-veiculos-leves'), true, 'Must index light vehicle service route');
  assert.equal(content.includes('remocao-veiculos-pesados'), true, 'Must index heavy vehicle service route');
  assert.equal(content.includes('solucoes-em-remocao'), true, 'Must index towing solutions service route');
  assert.equal(content.includes('COMPANY_CONFIG.services'), true, 'Must draw from centralized COMPANY_CONFIG.services');
  assert.equal(content.includes('role="combobox"'), true, 'Must provide accessible combobox semantics');
});



