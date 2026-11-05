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
  MOBILE_PORTRAIT_MEDIA_QUERY,
  DESKTOP_MIN_WIDTH_PX,
} from './uxPolish';

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
