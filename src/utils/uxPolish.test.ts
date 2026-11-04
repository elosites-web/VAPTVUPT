/// <reference types="node" />
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeDesktopParallaxOffset,
  shouldUseStaticReveal,
  isElementInOrNearViewport,
  clampLoadingTimings,
  resolveRouteBreadcrumbLabel,
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
