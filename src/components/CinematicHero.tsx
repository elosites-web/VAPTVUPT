import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Truck, CheckCircle2, ChevronDown, RotateCcw } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CinematicHeroProps {
  onScrollToForm?: () => void;
}

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

export const CinematicHero: React.FC<CinematicHeroProps> = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentOverlayRef = useRef<HTMLDivElement>(null);
  const darkVignetteRef = useRef<HTMLDivElement>(null);
  const logoStageRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const finalCardRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Motion and fallback states
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(getInitialReducedMotion);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(6.334);

  // Synchronization refs (avoiding React re-renders during high-frequency scroll)
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const pendingSeekRef = useRef<number | null>(null);

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

    // 4. Logo Reveal Stage (Active exclusively on the genuine white ending from prog >= 0.89)
    if (logoStageRef.current) {
      if (prog < 0.89) {
        logoStageRef.current.style.opacity = '0';
        logoStageRef.current.style.pointerEvents = 'none';
        logoStageRef.current.style.visibility = 'hidden';
      } else {
        logoStageRef.current.style.visibility = 'visible';
        // Backdrop wash transitions from 0 to 1 between 0.89 and 0.92
        const stageOpacity = Math.min(1, Math.max(0, (prog - 0.89) / 0.03));
        logoStageRef.current.style.opacity = stageOpacity.toFixed(3);
        logoStageRef.current.style.pointerEvents = prog >= 0.96 ? 'auto' : 'none';
      }
    }

    // Stage A: Official Symbol Reveal (Progress 0.90 to 0.95)
    if (symbolRef.current) {
      if (prog < 0.90) {
        symbolRef.current.style.opacity = '0';
        symbolRef.current.style.transform = 'scale(0.85)';
      } else if (prog < 0.95) {
        const sProg = (prog - 0.90) / 0.05;
        symbolRef.current.style.opacity = Math.min(1, Math.max(0, sProg)).toFixed(3);
        symbolRef.current.style.transform = `scale(${(0.85 + 0.15 * sProg).toFixed(3)})`;
      } else {
        symbolRef.current.style.opacity = '1';
        symbolRef.current.style.transform = 'scale(1)';
      }
    }

    // Stage B: Official Wordmark Reveal (Progress 0.94 to 0.98, appears after symbol)
    if (wordmarkRef.current) {
      if (prog < 0.94) {
        wordmarkRef.current.style.opacity = '0';
        wordmarkRef.current.style.transform = 'translateX(20px)';
      } else if (prog < 0.98) {
        const wProg = (prog - 0.94) / 0.04;
        wordmarkRef.current.style.opacity = Math.min(1, Math.max(0, wProg)).toFixed(3);
        wordmarkRef.current.style.transform = `translateX(${((1 - wProg) * 20).toFixed(1)}px)`;
      } else {
        wordmarkRef.current.style.opacity = '1';
        wordmarkRef.current.style.transform = 'translateX(0px)';
      }
    }

    // Stage C: Final Conversion Card on White Finale (Progress 0.97 to 1.00)
    if (finalCardRef.current) {
      if (prog < 0.97) {
        finalCardRef.current.style.opacity = '0';
        finalCardRef.current.style.transform = 'translateY(12px)';
        finalCardRef.current.style.pointerEvents = 'none';
      } else {
        const fProg = (prog - 0.97) / 0.03;
        const opacity = Math.min(1, Math.max(0, fProg));
        finalCardRef.current.style.opacity = opacity.toFixed(3);
        finalCardRef.current.style.transform = `translateY(${((1 - fProg) * 12).toFixed(1)}px)`;
        finalCardRef.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      }
    }
  }, []);

  /**
   * Hardware-accurate seek execution:
   * Since hero-scrub.mp4 is 100% intra-frame encoded (all 152 frames are keyframes),
   * standard currentTime assignment seeks instantly without inter-frame decoding overhead.
   * If a seek is currently in-flight, the latest requested timestamp is buffered and
   * executed as soon as the seeked event fires.
   */
  const performSeek = useCallback((targetTime: number) => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    if (video.seeking) {
      pendingSeekRef.current = targetTime;
      return;
    }

    try {
      video.currentTime = targetTime;
    } catch {
      // Graceful fallback if browser throws on seeking
    }
  }, []);

  // Event handler when video completes seeking to requested frame
  const handleSeeked = useCallback(() => {
    if (pendingSeekRef.current !== null) {
      const nextTime = pendingSeekRef.current;
      pendingSeekRef.current = null;
      performSeek(nextTime);
    }
  }, [performSeek]);

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

    // 2. Hardware-accurate video seek
    const video = videoRef.current;
    if (video && videoDuration) {
      const maxSafeTime = videoDuration > 0.05 ? videoDuration - 0.04 : videoDuration;
      const targetTime =
        prog === 0
          ? 0
          : prog === 1
            ? maxSafeTime
            : Math.min(maxSafeTime, Math.max(0, prog * videoDuration));

      performSeek(targetTime);
    }

    // 3. If a new scroll event updated targetProgressRef during execution, schedule one follow-up frame
    if (targetProgressRef.current !== currentProgressRef.current) {
      rafIdRef.current = requestAnimationFrame(syncToScrollProgress);
    }
  }, [videoDuration, applyProgressStyles, performSeek]);

  // Handle scroll events with zero React re-renders
  const handleScroll = useCallback(() => {
    if (isReducedMotion || videoFailed) return;

    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = trackHeight - viewportHeight;

    if (scrollDistance <= 0) return;

    // Normalized progress calculation: 0 at top, 1 at bottom
    const rawProgress = -rect.top / scrollDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    targetProgressRef.current = clampedProgress;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(syncToScrollProgress);
    }
  }, [isReducedMotion, videoFailed, syncToScrollProgress]);

  // Setup scroll and resize listeners with passive flags
  useEffect(() => {
    if (isReducedMotion || videoFailed) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial positioning check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isReducedMotion, videoFailed, handleScroll]);

  // Video loaded metadata handler: reads exact duration and synchronizes immediately to current scroll position
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    const dur = video.duration && !isNaN(video.duration) ? video.duration : 6.334;
    setVideoDuration(dur);
    setVideoReady(true);

    // Enforce pause so video never autoplays independently
    video.pause();

    // Check if user is already scrolled into the Hero when metadata finishes loading
    const track = trackRef.current;
    let initialProg = 0;
    if (track) {
      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollDistance = trackHeight - viewportHeight;
      if (scrollDistance > 0) {
        initialProg = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      }
    }

    targetProgressRef.current = initialProg;
    currentProgressRef.current = initialProg;
    applyProgressStyles(initialProg);

    const maxSafeTime = dur > 0.05 ? dur - 0.04 : dur;
    const initialTime =
      initialProg === 0
        ? 0
        : initialProg === 1
          ? maxSafeTime
          : Math.min(maxSafeTime, Math.max(0, initialProg * dur));

    try {
      video.currentTime = initialTime;
    } catch {
      // Graceful fallback
    }
  };

  const handleVideoError = () => {
    setVideoFailed(true);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pendingSeekRef.current = null;
  };

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
        className="relative min-h-[92vh] flex items-center pt-28 sm:pt-32 pb-16 bg-[#141416] overflow-hidden keep-dark"
        data-keep-dark="true"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          {!posterFailed ? (
            <img
              src="/hero-poster.jpg"
              alt="Caminhões de remoção Vapt Vupt"
              onError={() => setPosterFailed(true)}
              className="w-full h-full object-cover object-center brightness-[0.32] contrast-110 select-none"
            />
          ) : (
            <div className="w-full h-full bg-[#141416] industrial-grid" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/70 to-[#141416]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141416] via-[#141416]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/85 border border-red-800/80 text-red-200 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#B43034]" />
              <span>{COMPANY_CONFIG.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.08] font-heading">
              Estrutura e Soluções em <span className="text-[#B43034]">Remoção de Veículos</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl">
              Atuação dedicada ao transporte, guincho e remoção de <strong className="text-white">veículos leves e pesados</strong>. Fale diretamente com nossa equipe pelo WhatsApp oficial para consultar disponibilidade.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  COMPANY_CONFIG.whatsapp.defaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-cta-button button-3d inline-flex items-center justify-center gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg shadow-xl font-heading"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>CHAMAR NO WHATSAPP</span>
              </a>

              <a
                href="#solicitar-atendimento"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-3.5 rounded-lg border border-white/25 transition-all backdrop-blur-md shadow-lg"
              >
                <span>Preencher Solicitação</span>
                <ArrowRight className="w-4 h-4 text-[#B43034] shrink-0" />
              </a>
            </div>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-neutral-800/90">
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
        {/* Cinematic Scrubbed Video Element */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            src="/hero-scrub.mp4"
            poster="/hero-poster.jpg"
            playsInline
            muted
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleVideoError}
            onSeeked={handleSeeked}
            onPlay={(e) => {
              // Enforce strictly scroll-driven playback without autonomous autoplay
              e.currentTarget.pause();
            }}
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            aria-hidden="true"
          />

          {/* Fallback poster while video initializes metadata */}
          {!videoReady && !posterFailed && (
            <img
              src="/hero-poster.jpg"
              alt="Caminhões Vapt Vupt"
              onError={() => setPosterFailed(true)}
              className="absolute inset-0 w-full h-full object-cover object-center select-none"
            />
          )}
          {!videoReady && posterFailed && (
            <div className="absolute inset-0 w-full h-full bg-[#141416] industrial-grid" />
          )}
        </div>

        {/* Dynamic Dark Vignette Overlay: Fades smoothly as footage reaches the white scene */}
        <div
          ref={darkVignetteRef}
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-150"
        >
          {/* Top subtle vignette ensuring Header contrast */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/45 to-transparent" />
          {/* Main directional vignette keeping left-side text sharp and cinematic */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/25 sm:to-transparent" />
          {/* Bottom vignette */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* =========================================================================
            STAGE 1: EDITORIAL VALUE PROPOSITION (Fades out smoothly between 0.10 & 0.45)
            ========================================================================= */}
        <div
          ref={contentOverlayRef}
          className="absolute inset-0 z-20 flex items-center pt-24 sm:pt-28 pb-12 transition-transform duration-100 ease-out"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl space-y-5 sm:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/85 border border-red-800/80 text-red-200 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#B43034] animate-pulse" />
                <span>{COMPANY_CONFIG.badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight uppercase leading-[1.06] font-heading drop-shadow-md">
                Estrutura e Soluções em <span className="text-[#B43034]">Remoção de Veículos</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed max-w-2xl drop-shadow">
                Atuação dedicada ao transporte, guincho e remoção de <strong className="text-white">veículos leves e pesados</strong>. Fale diretamente com nossa equipe pelo WhatsApp oficial para consultar disponibilidade.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    COMPANY_CONFIG.whatsapp.defaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-cta-button button-3d inline-flex items-center justify-center gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg shadow-2xl font-heading"
                >
                  <WhatsAppIcon className="w-5 h-5 shrink-0" />
                  <span>CHAMAR NO WHATSAPP</span>
                </a>

                <a
                  href="#solicitar-atendimento"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-3.5 rounded-lg border border-white/30 transition-all backdrop-blur-md shadow-lg text-center"
                >
                  <span>Preencher Solicitação</span>
                  <ArrowRight className="w-4 h-4 text-[#B43034] shrink-0" />
                </a>
              </div>

              {/* Quick Differentiation Cards: Leves e Pesados */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl border-t border-white/15">
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
        </div>

        {/* Scroll Instruction Indicator (Disappears when user starts scrolling) */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 transition-opacity duration-200"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/15">
            Role para explorar
          </span>
          <ChevronDown className="w-4 h-4 text-white animate-bounce" />
        </div>

        {/* =========================================================================
            STAGE 2: OFFICIAL LOGO REVEAL (Symbol first, Wordmark second on genuine white scene)
            ========================================================================= */}
        <div
          ref={logoStageRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pt-20 sm:pt-24 pb-8 px-4 sm:px-6 pointer-events-none"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          {/* Subtle white-to-light-slate background wash ensuring 100% pure contrast */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] pointer-events-none" />

          {/* Logo Assembly Container (Symbol on Left, Wordmark on Right in horizontal lockup) */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl w-full text-center">
            {/* The Horizontal Logo Lockup */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 mb-5 sm:mb-6">
              {/* Stage A: Official Vapt Vupt Speed Symbol */}
              <div
                ref={symbolRef}
                className="transition-transform duration-100 ease-out will-change-transform"
                style={{ opacity: 0, transform: 'scale(0.85)' }}
              >
                <img
                  src="/logo-simbolo-original.png"
                  alt="Símbolo Vapt Vupt"
                  className="h-14 sm:h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-sm select-none"
                  draggable={false}
                />
              </div>

              {/* Stage B: Official Vapt Vupt Wordmark (Original Typography & Proportions) */}
              <div
                ref={wordmarkRef}
                className="transition-transform duration-100 ease-out will-change-transform"
                style={{ opacity: 0, transform: 'translateX(20px)' }}
              >
                <img
                  src="/logo-wordmark-original.png"
                  alt="Vapt Vupt"
                  className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto object-contain drop-shadow-sm select-none"
                  draggable={false}
                />
              </div>
            </div>

            {/* Stage C: Conversion Climax Card on White Finale */}
            <div
              ref={finalCardRef}
              className="space-y-4 max-w-xl transition-transform duration-150 ease-out"
              style={{ opacity: 0, transform: 'translateY(12px)' }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B43034]" />
                <span>Atendimento e Remoção de Veículos</span>
              </div>

              <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                Prontidão operacional e estrutura especializada para automóveis, utilitários e caminhões pesados.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    COMPANY_CONFIG.whatsapp.defaultMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-cta-button button-3d inline-flex items-center justify-center gap-2.5 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg shadow-xl font-heading"
                >
                  <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>CHAMAR NO WHATSAPP</span>
                </a>

                <a
                  href="#servicos"
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-3.5 rounded-lg shadow-xs transition-colors"
                >
                  <span>Ver Serviços</span>
                  <ArrowRight className="w-4 h-4 text-[#B43034]" />
                </a>

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
