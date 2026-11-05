import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Truck, ChevronDown, RotateCcw } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';
import { BrandSpinner, useDelayedLoadingState } from './BrandSpinner';
import { BrandLogoHorizontal } from './BrandLogoHorizontal';
import {
  computeDesktopParallaxOffset,
  computeHeroVideoTargetTime,
  HERO_VIDEO_DEFAULT_DURATION_SECONDS,
  isHeroVideoFrameReady,
  MOBILE_PORTRAIT_MEDIA_QUERY,
  resolveHeroPosterSource,
  resolveHeroVideoErrorAction,
  resolveHeroVideoSource,
  shouldExecuteHeroVideoSeek,
  shouldRevealHeroVideoImmediately,
} from '../utils/uxPolish';

interface CinematicHeroProps {
  onScrollToForm?: () => void;
}

const DESKTOP_VIDEO_SRC = resolveHeroVideoSource(false);
const MOBILE_VIDEO_SRC = resolveHeroVideoSource(true);

const INITIAL_LOGO_STAGE_STYLE: React.CSSProperties = {
  opacity: 0,
  visibility: 'hidden',
};
const INITIAL_SYMBOL_STAGE_STYLE: React.CSSProperties = {
  opacity: 0,
  transform: 'scale(0.85)',
};
const INITIAL_WORDMARK_STAGE_STYLE: React.CSSProperties = {
  opacity: 0,
  transform: 'translateX(20px)',
};
const INITIAL_FINAL_CARD_STYLE: React.CSSProperties = {
  opacity: 0,
  transform: 'translateY(12px)',
};

/**
 * Synchronously determine prefers-reduced-motion to avoid any layout flash
 * of animated video for users with reduced motion enabled.
 */
const getInitialReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

/**
 * Synchronously determine mobile portrait mode using (orientation: portrait) and (max-width: 768px)
 */
const getInitialMobilePortrait = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia(MOBILE_PORTRAIT_MEDIA_QUERY).matches;
  } catch {
    return false;
  }
};

export const CinematicHero: React.FC<CinematicHeroProps> = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const parallaxBackdropRef = useRef<HTMLDivElement>(null);
  const contentOverlayRef = useRef<HTMLDivElement>(null);
  const darkVignetteRef = useRef<HTMLDivElement>(null);
  const logoStageRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const finalCardRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Viewport orientation & video source state
  const [isMobilePortrait, setIsMobilePortrait] = useState<boolean>(getInitialMobilePortrait);
  const [videoSrc, setVideoSrc] = useState<string>(() =>
    resolveHeroVideoSource(getInitialMobilePortrait())
  );
  const posterSrc = resolveHeroPosterSource(isMobilePortrait);

  // Motion and fallback states
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(getInitialReducedMotion);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  // Synchronization refs (avoiding React re-renders during high-frequency scroll)
  const metadataLoadedRef = useRef<boolean>(false);
  const videoDurationRef = useRef<number>(HERO_VIDEO_DEFAULT_DURATION_SECONDS);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const lastRequestedSeekTimeRef = useRef<number | null>(null);
  const seekStartedAtRef = useRef<number>(0);
  const revealTimerRef = useRef<number | null>(null);
  const prevVideoSrcRef = useRef<string>(videoSrc);
  const prevPosterSrcRef = useRef<string>(posterSrc);
  const failedVideoSourcesRef = useRef<Set<string>>(new Set());

  // Delayed bounded loading indicator while Hero media initializes on slow connections
  const isHeroMediaLoading = !isReducedMotion && !videoFailed && !videoReady;
  const { visible: showHeroSpinner } = useDelayedLoadingState(isHeroMediaLoading, {
    delayMs: 240,
    maxWaitMs: 10000,
    resetKey: videoSrc,
    onTimeout: () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      if (isHeroVideoFrameReady(videoRef.current?.readyState)) {
        setVideoReady(true);
        return;
      }
      failedVideoSourcesRef.current.add(videoSrc);
      setVideoFailed(true);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingSeekRef.current = null;
    },
  });

  // Media query listener for prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  // Media query listener for dual video switching: (orientation: portrait) and (max-width: 768px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(MOBILE_PORTRAIT_MEDIA_QUERY);

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const isPortrait = e.matches;
      const nextPoster = resolveHeroPosterSource(isPortrait);
      if (prevPosterSrcRef.current !== nextPoster) {
        prevPosterSrcRef.current = nextPoster;
        setPosterLoaded(false);
      }
      setIsMobilePortrait(isPortrait);
      setPosterFailed(false);
      setVideoSrc(resolveHeroVideoSource(isPortrait));
    };

    // Initial check
    handler(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  /**
   * Apply code-driven opacities and transforms aligned with the genuine footage:
   * - 0.00 to 0.45: Editorial proposition fades as user scrolls into the video
   * - 0.00 to 0.80: Dark cinematic vignette stays fully active over road footage
   * - 0.80 to 0.90: Vignette fades out as truck accelerates and begins flash to white
   * - 0.89 to 0.92: White backdrop smoothly washes in to match the white scene
   * - 0.90 to 0.95: Official Vapt Vupt Symbol appears on genuine white background
   * - 0.94 to 0.98: Official Wordmark reveals beside the symbol
   * - 0.97 to 1.00: Climax conversion card and CTAs settle into place
   */
  const applyProgressStyles = useCallback((prog: number) => {
    // 1. Initial Editorial Content Overlay (Headline, Subtitle, CTAs)
    if (contentOverlayRef.current) {
      if (prog <= 0.10) {
        contentOverlayRef.current.style.opacity = '1';
        contentOverlayRef.current.style.transform = 'translateY(0px)';
        contentOverlayRef.current.style.pointerEvents = 'auto';
      } else if (prog < 0.45) {
        const fadeProg = (prog - 0.10) / 0.35;
        const opacity = Math.max(0, 1 - fadeProg);
        contentOverlayRef.current.style.opacity = opacity.toFixed(3);
        contentOverlayRef.current.style.transform = `translateY(-${(fadeProg * 22).toFixed(1)}px)`;
        contentOverlayRef.current.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none';
      } else {
        contentOverlayRef.current.style.opacity = '0';
        contentOverlayRef.current.style.pointerEvents = 'none';
      }
    }

    // 2. Scroll Prompt Indicator (fades out immediately when user starts scrolling)
    if (scrollIndicatorRef.current) {
      if (prog < 0.08) {
        scrollIndicatorRef.current.style.opacity = (1 - prog / 0.08).toFixed(2);
      } else {
        scrollIndicatorRef.current.style.opacity = '0';
      }
    }

    // 3. Dark Vignette Overlay: Fades only when the footage actually transitions toward white
    if (darkVignetteRef.current) {
      if (prog < 0.80) {
        darkVignetteRef.current.style.opacity = '1';
      } else if (prog < 0.90) {
        const vignetteFade = (prog - 0.80) / 0.10;
        darkVignetteRef.current.style.opacity = Math.max(0, 1 - vignetteFade).toFixed(3);
      } else {
        darkVignetteRef.current.style.opacity = '0';
      }
    }

    // 3b. Subtle Desktop-Only Decorative Background Parallax (independent of <video>)
    if (parallaxBackdropRef.current) {
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
      const isFinePointer =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(pointer: coarse)').matches &&
        (typeof navigator === 'undefined' || navigator.maxTouchPoints === 0);

      const parallax = computeDesktopParallaxOffset({
        progress: prog,
        viewportWidth,
        isFinePointer,
        isReducedMotion,
        isMediaFallback: videoFailed,
        maxShiftPx: 14,
      });

      parallaxBackdropRef.current.style.transform = parallax.enabled
        ? `translate3d(0, ${parallax.translateY}px, 0)`
        : 'none';
    }

    // 4. Logo Reveal Stage (Active exclusively on the clean white finale from prog >= 0.86)
    if (logoStageRef.current) {
      if (prog < 0.86) {
        logoStageRef.current.style.opacity = '0';
        logoStageRef.current.style.pointerEvents = 'none';
        logoStageRef.current.style.visibility = 'hidden';
      } else {
        logoStageRef.current.style.visibility = 'visible';
        // Backdrop wash transitions from 0 to 1 between 0.86 and 0.90
        const stageOpacity = Math.min(1, Math.max(0, (prog - 0.86) / 0.04));
        logoStageRef.current.style.opacity = stageOpacity.toFixed(3);
        logoStageRef.current.style.pointerEvents = prog >= 0.94 ? 'auto' : 'none';
      }
    }

    // Stage A: Official Symbol Reveal (Progress 0.88 to 0.93)
    if (symbolRef.current) {
      if (prog < 0.88) {
        symbolRef.current.style.opacity = '0';
        symbolRef.current.style.transform = 'scale(0.85)';
      } else if (prog < 0.93) {
        const sProg = (prog - 0.88) / 0.05;
        symbolRef.current.style.opacity = Math.min(1, Math.max(0, sProg)).toFixed(3);
        symbolRef.current.style.transform = `scale(${(0.85 + 0.15 * sProg).toFixed(3)})`;
      } else {
        symbolRef.current.style.opacity = '1';
        symbolRef.current.style.transform = 'scale(1)';
      }
    }

    // Stage B: Official Wordmark Reveal (Progress 0.92 to 0.96, appears after symbol)
    if (wordmarkRef.current) {
      if (prog < 0.92) {
        wordmarkRef.current.style.opacity = '0';
        wordmarkRef.current.style.transform = 'translateX(20px)';
      } else if (prog < 0.96) {
        const wProg = (prog - 0.92) / 0.04;
        wordmarkRef.current.style.opacity = Math.min(1, Math.max(0, wProg)).toFixed(3);
        wordmarkRef.current.style.transform = `translateX(${((1 - wProg) * 20).toFixed(1)}px)`;
      } else {
        wordmarkRef.current.style.opacity = '1';
        wordmarkRef.current.style.transform = 'translateX(0px)';
      }
    }

    // Stage C: Final Conversion Card on White Finale (Progress 0.95 to 1.00)
    if (finalCardRef.current) {
      if (prog < 0.95) {
        finalCardRef.current.style.opacity = '0';
        finalCardRef.current.style.transform = 'translateY(12px)';
        finalCardRef.current.style.pointerEvents = 'none';
      } else {
        const fProg = (prog - 0.95) / 0.05;
        const opacity = Math.min(1, Math.max(0, fProg));
        finalCardRef.current.style.opacity = opacity.toFixed(3);
        finalCardRef.current.style.transform = `translateY(${((1 - fProg) * 12).toFixed(1)}px)`;
        finalCardRef.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      }
    }
  }, [isReducedMotion, videoFailed]);

  /**
   * Computes normalized scroll progress (0..1) from track geometry.
   */
  const readCurrentTrackProgress = useCallback((): number => {
    const track = trackRef.current;
    if (!track || typeof window === 'undefined') {
      return targetProgressRef.current;
    }

    const rect = track.getBoundingClientRect();
    const scrollDistance = track.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) {
      return targetProgressRef.current;
    }

    return Math.max(0, Math.min(1, -rect.top / scrollDistance));
  }, []);

  /**
   * Scroll-synchronized seek execution with B/P-frame PTS quantization protection:
   * Buffers latest requested timestamp while decoding or seeking, and avoids redundant
   * currentTime rewrites caused by frame PTS snapping on 24fps H.264 streams.
   */
  const performSeek = useCallback((targetTime: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (!metadataLoadedRef.current || video.readyState < 2) {
      pendingSeekRef.current = targetTime;
      return;
    }

    const seekElapsedMs =
      seekStartedAtRef.current > 0 ? performance.now() - seekStartedAtRef.current : 0;
    const decision = shouldExecuteHeroVideoSeek({
      currentTime: video.currentTime,
      targetTime,
      durationSeconds: videoDurationRef.current,
      lastRequestedSeekTime: lastRequestedSeekTimeRef.current,
      isSeeking: video.seeking,
      seekElapsedMs,
    });

    if (decision === 'buffer') {
      pendingSeekRef.current = targetTime;
      return;
    }

    if (!video.paused) {
      video.pause();
    }

    if (decision === 'skip') {
      pendingSeekRef.current = null;
      return;
    }

    try {
      pendingSeekRef.current = null;
      lastRequestedSeekTimeRef.current = targetTime;
      seekStartedAtRef.current = performance.now();
      video.currentTime = targetTime;
    } catch {
      // Graceful fallback if browser throws on seeking
    }
  }, []);

  // Event handler when video completes seeking to requested frame
  const handleSeeked = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      video.pause();
    }

    seekStartedAtRef.current = 0;

    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    if (!videoFailed && isHeroVideoFrameReady(video.readyState)) {
      setVideoReady(true);
    }

    // Catch up immediately if user scrolled while the previous seek was still decoding
    if (pendingSeekRef.current !== null) {
      pendingSeekRef.current = null;
      const latestTargetTime = computeHeroVideoTargetTime(
        targetProgressRef.current,
        videoDurationRef.current
      );
      performSeek(latestTargetTime);
    }
  }, [videoFailed, performSeek]);

  /**
   * Direct progress synchronization batched via requestAnimationFrame:
   * Uses the latest scroll-derived progress directly as the source of truth,
   * completely eliminating smoothing lag, easing latency, or visual drift.
   */
  const syncToScrollProgress = useCallback(() => {
    rafIdRef.current = null;

    const prog = targetProgressRef.current;
    currentProgressRef.current = prog;

    // 1. Immediately apply DOM transforms & opacities
    applyProgressStyles(prog);

    // 2. Scroll-synchronized video seek
    const video = videoRef.current;
    const dur = videoDurationRef.current;
    if (video && dur > 0) {
      const targetTime = computeHeroVideoTargetTime(prog, dur);
      performSeek(targetTime);
    }

    // 3. If a new scroll event updated targetProgressRef during execution, schedule one follow-up frame
    if (targetProgressRef.current !== currentProgressRef.current) {
      rafIdRef.current = requestAnimationFrame(syncToScrollProgress);
    }
  }, [applyProgressStyles, performSeek]);

  // Handle scroll events with zero React re-renders
  const handleScroll = useCallback(() => {
    if (isReducedMotion || videoFailed) return;

    const track = trackRef.current;
    if (!track) return;

    const scrollDistance = track.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) return;

    const clampedProgress = readCurrentTrackProgress();
    targetProgressRef.current = clampedProgress;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(syncToScrollProgress);
    }
  }, [isReducedMotion, videoFailed, readCurrentTrackProgress, syncToScrollProgress]);

  // Setup scroll, resize and orientationchange listeners with passive flags
  useEffect(() => {
    if (isReducedMotion || videoFailed) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('orientationchange', handleScroll, { passive: true });

    // Initial positioning check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('orientationchange', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      pendingSeekRef.current = null;
    };
  }, [isReducedMotion, videoFailed, handleScroll]);

  // Keep imperative progress styles synced if layout state updates while scrolled
  useEffect(() => {
    if (isReducedMotion || videoFailed) return;
    const prog = readCurrentTrackProgress();
    targetProgressRef.current = prog;
    currentProgressRef.current = prog;
    applyProgressStyles(prog);
  }, [isMobilePortrait, videoReady, isReducedMotion, videoFailed, readCurrentTrackProgress, applyProgressStyles]);

  // Video loaded metadata handler: reads exact duration and prepares initial layout
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    failedVideoSourcesRef.current.delete(videoSrc);
    metadataLoadedRef.current = true;

    const dur =
      video.duration && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0
        ? video.duration
        : HERO_VIDEO_DEFAULT_DURATION_SECONDS;
    videoDurationRef.current = dur;

    if (!video.paused) {
      video.pause();
    }

    const initialProg = readCurrentTrackProgress();
    targetProgressRef.current = initialProg;
    currentProgressRef.current = initialProg;
    applyProgressStyles(initialProg);

    const initialTime = computeHeroVideoTargetTime(initialProg, dur);

    if (isHeroVideoFrameReady(video.readyState)) {
      if (
        shouldRevealHeroVideoImmediately({
          readyState: video.readyState,
          isSeeking: video.seeking,
          currentTime: video.currentTime,
          targetTime: initialTime,
        })
      ) {
        setVideoReady(true);
      } else if (revealTimerRef.current === null) {
        revealTimerRef.current = window.setTimeout(() => {
          revealTimerRef.current = null;
          if (isHeroVideoFrameReady(videoRef.current?.readyState)) {
            setVideoReady(true);
          }
        }, 400);
      }
      performSeek(initialTime);
    } else {
      pendingSeekRef.current = initialTime;
    }
  }, [videoSrc, videoFailed, readCurrentTrackProgress, applyProgressStyles, performSeek]);

  // Synchronize video duration if the browser resolves duration asynchronously after loadedmetadata
  const handleDurationChange = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    const nextDuration = video.duration;
    if (!nextDuration || isNaN(nextDuration) || !isFinite(nextDuration) || nextDuration <= 0) {
      return;
    }

    if (Math.abs(videoDurationRef.current - nextDuration) > 0.001) {
      videoDurationRef.current = nextDuration;
      const prog = readCurrentTrackProgress();
      const correctedTime = computeHeroVideoTargetTime(prog, nextDuration);
      if (metadataLoadedRef.current && isHeroVideoFrameReady(video.readyState)) {
        performSeek(correctedTime);
      } else {
        pendingSeekRef.current = correctedTime;
      }
    }
  }, [videoFailed, readCurrentTrackProgress, performSeek]);

  // Video media readiness handler: runs on loadeddata / canplay when first frame is guaranteed available
  const handleMediaReady = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoFailed || !isHeroVideoFrameReady(video.readyState)) return;

    failedVideoSourcesRef.current.delete(videoSrc);
    if (!metadataLoadedRef.current) {
      metadataLoadedRef.current = true;
    }

    if (!video.paused) {
      video.pause();
    }

    const dur =
      video.duration && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0
        ? video.duration
        : videoDurationRef.current;
    videoDurationRef.current = dur;

    const prog = readCurrentTrackProgress();
    targetProgressRef.current = prog;
    currentProgressRef.current = prog;
    applyProgressStyles(prog);

    const targetTime = computeHeroVideoTargetTime(prog, dur);
    pendingSeekRef.current = null;

    if (
      shouldRevealHeroVideoImmediately({
        readyState: video.readyState,
        isSeeking: video.seeking,
        currentTime: video.currentTime,
        targetTime,
      })
    ) {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
      setVideoReady(true);
      performSeek(targetTime);
    } else {
      performSeek(targetTime);
      if (revealTimerRef.current === null) {
        revealTimerRef.current = window.setTimeout(() => {
          revealTimerRef.current = null;
          if (isHeroVideoFrameReady(videoRef.current?.readyState)) {
            setVideoReady(true);
          }
        }, 400);
      }
    }
  }, [videoSrc, videoFailed, readCurrentTrackProgress, applyProgressStyles, performSeek]);

  const handleVideoError = useCallback(() => {
    failedVideoSourcesRef.current.add(videoSrc);
    const decision = resolveHeroVideoErrorAction({
      currentSrc: videoSrc,
      failedSources: failedVideoSourcesRef.current,
    });

    if (decision.nextSrc) {
      console.warn('[CinematicHero] hero-scrub-mobile.mp4 unavailable, falling back to desktop video');
      setVideoSrc(decision.nextSrc);
      return;
    }

    setVideoFailed(true);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pendingSeekRef.current = null;
  }, [videoSrc]);

  // Reset seek state and recover cached or freshly mounted video whenever videoSrc changes
  useEffect(() => {
    if (prevVideoSrcRef.current !== videoSrc) {
      prevVideoSrcRef.current = videoSrc;
      if (!failedVideoSourcesRef.current.has(videoSrc)) {
        setVideoFailed(false);
      }
    }

    metadataLoadedRef.current = false;
    pendingSeekRef.current = null;
    lastRequestedSeekTimeRef.current = null;
    seekStartedAtRef.current = 0;
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    if (isReducedMotion) return;

    const video = videoRef.current;
    if (!video) {
      setVideoReady(false);
      return;
    }

    if (video.error) {
      handleVideoError();
      return;
    }

    if (video.readyState >= 1) {
      handleLoadedMetadata();
      if (isHeroVideoFrameReady(video.readyState)) {
        handleMediaReady();
      }
    } else {
      setVideoReady(false);
    }

    return () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [videoSrc, isReducedMotion, handleMediaReady, handleLoadedMetadata, handleVideoError]);

  // Replay helper: smoothly scrolls back to the beginning of the track
  const handleReplay = () => {
    const track = trackRef.current;
    if (track) {
      const rect = track.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top,
        behavior: 'smooth',
      });
    }
  };

  // ---------------------------------------------------------------------------
  // STATIC FALLBACK: Used when prefers-reduced-motion is active or video fails
  // ---------------------------------------------------------------------------
  if (isReducedMotion || videoFailed) {
    return (
      <section
        id="inicio"
        className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center pt-28 sm:pt-36 pb-12 sm:pb-16 bg-[#141416] overflow-hidden keep-dark hero-landscape-stage"
        data-keep-dark="true"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          {!posterFailed ? (
            <img
              key={posterSrc}
              src={posterSrc}
              alt="Caminhões de remoção Vapt Vupt"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('caminhao-cavalo-1635.jpg')) {
                  target.src = '/assets/vaptvupt/caminhao-cavalo-1635.jpg';
                } else {
                  setPosterFailed(true);
                }
              }}
              className={`w-full h-full object-cover ${isMobilePortrait ? 'object-center' : 'object-[30%_center] sm:object-center'} brightness-[0.32] contrast-110 select-none`}
            />
          ) : (
            <div className="w-full h-full bg-[#141416] industrial-grid" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/70 to-[#141416]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141416] via-[#141416]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`max-w-3xl space-y-5 sm:space-y-6 hero-landscape-flow ${isMobilePortrait ? 'text-center mx-auto pt-2 sm:pt-0' : ''}`}>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/85 border border-red-800/80 text-red-200 text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-md hero-landscape-badge ${isMobilePortrait ? 'mx-auto mb-1' : ''}`}>
              <span className="w-2 h-2 rounded-full bg-[#B43034]" />
              <span>{COMPANY_CONFIG.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.08] font-heading hero-landscape-heading">
              <span className={isMobilePortrait ? "bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent" : "text-white"}>
                Estrutura e Soluções em{' '}
              </span>
              <span className="text-[#B43034]">Remoção de Veículos</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl hero-landscape-subtitle">
              Atuação dedicada ao transporte, guincho e remoção de <strong className="text-white">veículos leves e pesados</strong>. Fale diretamente com nossa equipe pelo WhatsApp oficial para consultar disponibilidade.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 hero-landscape-actions">
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.defaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-cta-button button-3d inline-flex items-center justify-center gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg shadow-xl font-heading hero-landscape-btn-whatsapp"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>CHAMAR NO WHATSAPP</span>
              </a>

              <a
                href="#solicitar-atendimento"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-3.5 rounded-lg border border-white/25 transition-all backdrop-blur-md shadow-lg hero-landscape-btn-secondary"
              >
                <span>Preencher Solicitação</span>
                <ArrowRight className="w-4 h-4 text-[#B43034] shrink-0" />
              </a>
            </div>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-neutral-800/90 hero-landscape-cards">
              <Link
                to="/servicos/remocao-veiculos-leves"
                className="p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-[#B43034]/60 transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-red-950/70 border border-red-900/60 text-[#B43034] shrink-0 mt-0.5">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-white">Atendimento Leve</div>
                  <p className="text-[11px] text-neutral-300 mt-0.5">Automóveis e utilitários em caminhão plataforma sob consulta.</p>
                </div>
              </Link>

              <Link
                to="/servicos/remocao-veiculos-pesados"
                className="p-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-[#B43034]/60 transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-red-950/70 border border-red-900/60 text-[#B43034] shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-white">Atendimento Pesado</div>
                  <p className="text-[11px] text-neutral-300 mt-0.5">Cavalo mecânico e estrutura para caminhões sob consulta.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // CINEMATIC SCROLL-CONTROLLED EXPERIENCE
  // ---------------------------------------------------------------------------
  return (
    <div
      ref={trackRef}
      id="inicio"
      className="relative w-full bg-[#141416]"
      style={{ height: '240vh' }}
    >
      {/* Sticky Fullscreen Stage pinned to viewport while user scrolls down the track */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        {/* Cinematic Scrubbed Video Element & Persistent Static Poster Fallback */}
        <div className="absolute inset-0 w-full h-full bg-[#141416]">
          {/* 1. Underlying Persistent Static Poster Fallback
              Always rendered so that during video initialization, buffering or in case of playback errors,
              the visitor immediately sees the authentic hero frame and never an empty or blank space. */}
          {!posterFailed ? (
            <img
              key={posterSrc}
              src={posterSrc}
              alt="Caminhões de remoção Vapt Vupt"
              onLoad={() => setPosterLoaded(true)}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('caminhao-cavalo-1635.jpg')) {
                  target.src = '/assets/vaptvupt/caminhao-cavalo-1635.jpg';
                } else {
                  setPosterFailed(true);
                }
              }}
              style={{ objectPosition: 'center' }}
              className="absolute inset-0 w-full h-full object-cover [object-position:center] select-none pointer-events-none"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#141416] industrial-grid" />
          )}

          {/* 2. Interactive Scrubbed Video Layer
              Renders over the static poster. Kept at opacity 0 while decoding first frames,
              fading in with a smooth transition once ready. Disappears gracefully on error so
              the static poster remains visible. */}
          {!videoFailed && (
            <video
              key={videoSrc}
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              playsInline
              muted
              disablePictureInPicture
              preload="auto"
              onLoadedMetadata={handleLoadedMetadata}
              onDurationChange={handleDurationChange}
              onLoadedData={handleMediaReady}
              onCanPlay={handleMediaReady}
              onError={handleVideoError}
              onSeeked={handleSeeked}
              onPlay={(e) => {
                // Enforce strictly scroll-driven playback without autonomous autoplay
                e.currentTarget.pause();
              }}
              style={{
                objectPosition: 'center',
                opacity: videoReady ? 1 : 0,
              }}
              className="absolute inset-0 w-full h-full object-cover [object-position:center] select-none pointer-events-none transition-opacity duration-300 ease-out"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Centered Area Loading Feedback when Hero media takes noticeable time */}
        {showHeroSpinner && !posterLoaded && !posterFailed && (
          <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none px-4">
            <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 shadow-2xl">
              <BrandSpinner
                label="Carregando apresentação visual da Vapt Vupt..."
                caption="Carregando apresentação..."
                size="lg"
                tone="dark"
              />
            </div>
          </div>
        )}

        {showHeroSpinner && (posterLoaded || posterFailed) && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="bg-black/70 backdrop-blur-md border border-white/15 rounded-full px-3.5 py-1.5 shadow-lg flex items-center justify-center">
              <BrandSpinner
                label="Preparando vídeo interativo..."
                size="sm"
                tone="dark"
              />
            </div>
          </div>
        )}

        {/* Dynamic Dark Vignette Overlay: Fades smoothly as footage reaches the white scene */}
        <div
          ref={darkVignetteRef}
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-150"
        >
          {/* Subtle Desktop-Only Decorative Ambient Depth Layer (independent of <video>) */}
          <div
            ref={parallaxBackdropRef}
            aria-hidden="true"
            className="hidden lg:block absolute -inset-6 pointer-events-none will-change-transform"
            style={{
              backgroundImage:
                'radial-gradient(circle at 76% 30%, rgba(180, 48, 52, 0.16) 0%, rgba(180, 48, 52, 0.04) 38%, transparent 66%), radial-gradient(circle at 22% 78%, rgba(226, 232, 240, 0.07) 0%, transparent 52%), linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
            }}
          />
          {/* Top subtle vignette ensuring Header contrast */}
          <div className="absolute top-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-b from-black/85 via-black/45 to-transparent" />
          
          {/* Main directional vignette: on mobile portrait provides contrast in the lower third for text */}
          {isMobilePortrait ? (
            <div className="absolute inset-x-0 bottom-0 h-[70vh] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/25 sm:to-transparent" />
          )}

          {/* Bottom vignette for desktop */}
          {!isMobilePortrait && (
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
          )}
        </div>

        {/* =========================================================================
            STAGE 1: EDITORIAL VALUE PROPOSITION (Fades out smoothly between 0.10 & 0.45)
            ========================================================================= */}
        {/* =========================================================================
            STAGE 1: EDITORIAL VALUE PROPOSITION (Fades out smoothly between 0.10 & 0.45)
            ========================================================================= */}
        <div
          ref={contentOverlayRef}
          className={`absolute inset-0 z-20 flex ${
            isMobilePortrait
              ? 'flex-col justify-between h-full pt-[88px] sm:pt-[94px] pb-14 px-4 sm:px-6'
              : 'items-center pt-24 sm:pt-28 pb-12 hero-landscape-stage'
          } transition-transform duration-100 ease-out`}
        >
          {isMobilePortrait ? (
            /* Layout Mobile Vertical: Topo próximo ao cabeçalho (selo + frase), centro livre para o caminhão, base com frase e botões */
            <div className="flex flex-col justify-between h-full w-full max-w-md mx-auto text-center pointer-events-auto">
              {/* Topo: Selo + Frase Principal subiram próximos ao cabeçalho com espaçamento proporcional */}
              <div className="space-y-2 pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/85 border border-red-800/80 text-red-200 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md shadow-lg mx-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B43034] animate-pulse" />
                  <span>{COMPANY_CONFIG.badge}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase leading-[1.08] font-heading drop-shadow-lg mx-auto">
                  <span className="bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    Estrutura e Soluções em{' '}
                  </span>
                  <span className="text-[#B43034]">Remoção de Veículos</span>
                </h1>
              </div>

              {/* Centro: Espaço aberto liberando a visão do vídeo e arte da Hero */}
              <div className="flex-1 min-h-[60px]" aria-hidden="true" />

              {/* Base: Frase explicativa, botão CHAMAR NO WHATSAPP e PREENCHER SOLICITAÇÃO acima do 'role para explorar' */}
              <div className="space-y-2.5 pb-2 max-w-xs mx-auto w-full">
                <p className="text-xs text-neutral-200 leading-snug drop-shadow font-medium">
                  Atuação dedicada ao transporte, guincho e remoção de <strong className="text-white">veículos leves e pesados</strong>. Fale diretamente com nossa equipe pelo Whatsapp oficial para consultar disponibilidade.
                </p>

                <div className="flex flex-col gap-2 w-full">
                  <a
                    href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                      COMPANY_CONFIG.whatsapp.defaultMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-cta-button button-3d inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-lg shadow-xl font-heading"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>CHAMAR NO WHATSAPP</span>
                  </a>

                  <a
                    href="#solicitar-atendimento"
                    className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg border border-white/30 transition-all backdrop-blur-md shadow-md text-center"
                  >
                    <span>Preencher Solicitação</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B43034] shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Layout Desktop & Landscape */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl space-y-4 sm:space-y-6 hero-landscape-flow">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/85 border border-red-800/80 text-red-200 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg hero-landscape-badge">
                  <span className="w-2 h-2 rounded-full bg-[#B43034] animate-pulse" />
                  <span>{COMPANY_CONFIG.badge}</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight uppercase leading-[1.06] font-heading drop-shadow-md hero-landscape-heading">
                  Estrutura e Soluções em <span className="text-[#B43034]">Remoção de Veículos</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed max-w-2xl drop-shadow hero-landscape-subtitle">
                  Atuação dedicada ao transporte, guincho e remoção de <strong className="text-white">veículos leves e pesados</strong>. Fale diretamente com nossa equipe pelo WhatsApp oficial para consultar disponibilidade.
                </p>

                {/* Primary Call to Action Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 hero-landscape-actions">
                  <a
                    href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                      COMPANY_CONFIG.whatsapp.defaultMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-cta-button button-3d inline-flex items-center justify-center gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg shadow-2xl font-heading hero-landscape-btn-whatsapp"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    <span>CHAMAR NO WHATSAPP</span>
                  </a>

                  <a
                    href="#solicitar-atendimento"
                    className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-3.5 rounded-lg border border-white/30 transition-all backdrop-blur-md shadow-lg text-center hero-landscape-btn-secondary"
                  >
                    <span>Preencher Solicitação</span>
                    <ArrowRight className="w-4 h-4 text-[#B43034] shrink-0" />
                  </a>
                </div>

                {/* Quick Differentiation Cards: Leves e Pesados (Desktop) */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl border-t border-white/15 hero-landscape-cards">
                  <Link
                    to="/servicos/remocao-veiculos-leves"
                    className="group p-3 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 hover:border-[#B43034]/70 transition-all flex items-start gap-3 backdrop-blur-md shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-red-950/80 border border-red-900/60 text-[#B43034] shrink-0 mt-0.5">
                      <Car className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                        <span>Atendimento Leve</span>
                        <ArrowRight className="w-3 h-3 text-[#B43034] transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="text-[11px] text-neutral-300 mt-0.5 leading-tight">
                        Automóveis e utilitários em caminhão plataforma sob consulta.
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/servicos/remocao-veiculos-pesados"
                    className="group p-3 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 hover:border-[#B43034]/70 transition-all flex items-start gap-3 backdrop-blur-md shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-red-950/80 border border-red-900/60 text-[#B43034] shrink-0 mt-0.5">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                        <span>Atendimento Pesado</span>
                        <ArrowRight className="w-3 h-3 text-[#B43034] transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="text-[11px] text-neutral-300 mt-0.5 leading-tight">
                        Cavalo mecânico e estrutura para caminhões sob consulta.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Instruction Indicator (Disappears when user starts scrolling) */}
        <div
          ref={scrollIndicatorRef}
          className={`absolute ${
            isMobilePortrait ? 'bottom-2' : 'bottom-6'
          } left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 transition-opacity duration-200 hero-landscape-scroll-indicator`}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/15">
            Role para explorar
          </span>
          <ChevronDown className="w-4 h-4 text-white animate-bounce" />
        </div>

        {/* =========================================================================
            STAGE 2: OFFICIAL LOGO REVEAL (Selo acima, Logotipo centralizado, botões abaixo)
            ========================================================================= */}
        <div
          ref={logoStageRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pt-[88px] sm:pt-[94px] pb-6 sm:pb-8 px-4 sm:px-6 pointer-events-none hero-landscape-logo-stage"
          style={INITIAL_LOGO_STAGE_STYLE}
        >
          {/* Clean white backdrop wash ensuring 100% pure contrast on the final reveal stage */}
          <div className="absolute inset-0 bg-white pointer-events-none" />

          {/* Logo Assembly Container */}
          <div className="relative z-10 grid grid-rows-[1fr_auto_1fr] items-center justify-items-center max-w-4xl w-full h-full text-center">
            {/* 1. O LOGOTIPO CENTRALIZADO e posicionado ao centro da animação da hero no último frame */}
            <BrandLogoHorizontal
              isDark={false}
              className="row-start-2 !flex-col sm:!flex-row landscape:!flex-row !gap-3 sm:!gap-4 md:!gap-5 mx-auto"
              symbolContainerRef={symbolRef}
              symbolContainerClassName="transition-transform duration-100 ease-out will-change-transform hero-landscape-logo-symbol"
              symbolContainerStyle={INITIAL_SYMBOL_STAGE_STYLE}
              symbolClassName="h-14 sm:h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-sm select-none"
              wordmarkContainerRef={wordmarkRef}
              wordmarkContainerClassName="transition-transform duration-100 ease-out will-change-transform hero-landscape-logo-wordmark"
              wordmarkContainerStyle={INITIAL_WORDMARK_STAGE_STYLE}
              wordmarkClassName="h-10 sm:h-14 md:h-16 lg:h-20 w-auto object-contain drop-shadow-sm select-none"
            />

            {/* 3. Abaixo do logotipo: os botões 'CHAMAR NO WHATSAPP', 'VER SERVIÇOS' e 'REVER INÍCIO' */}
            <div
              ref={finalCardRef}
              className="row-start-3 self-end w-full max-w-xl flex flex-col items-center transition-transform duration-150 ease-out hero-landscape-logo-actions"
              style={INITIAL_FINAL_CARD_STYLE}
            >
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pb-4 sm:pb-8 md:pb-10 landscape:pb-1">
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    COMPANY_CONFIG.whatsapp.defaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-cta-button button-3d inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 sm:px-7 py-3 sm:py-3.5 rounded-lg shadow-xl font-heading"
                >
                  <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>CHAMAR NO WHATSAPP</span>
                </a>

                {/* Botão VER SERVIÇOS ancorando para a página SERVIÇOS */}
                <Link
                  to="/servicos"
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow-xs transition-colors"
                >
                  <span>Ver Serviços</span>
                  <ArrowRight className="w-4 h-4 text-[#B43034]" />
                </Link>

                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-950 font-bold uppercase tracking-wider px-3 py-2 transition-colors cursor-pointer"
                  title="Voltar ao início da animação"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#B43034]" />
                  <span>Rever Início</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
