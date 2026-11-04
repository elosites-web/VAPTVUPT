import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Truck, CheckCircle2, ChevronDown, RotateCcw } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CinematicHeroProps {
  onScrollToForm?: () => void;
}

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

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(6.334);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);

  // Check for prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

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

  // Sync animation state with progress value
  const applyProgressStyles = useCallback((prog: number) => {
    // 1. Initial Content Overlay (Headline, Subtitle, CTAs)
    // Visible from prog 0.0 to 0.42, then smoothly fades out by 0.58
    if (contentOverlayRef.current) {
      if (prog <= 0.05) {
        contentOverlayRef.current.style.opacity = '1';
        contentOverlayRef.current.style.transform = 'translateY(0px)';
        contentOverlayRef.current.style.pointerEvents = 'auto';
      } else if (prog < 0.48) {
        const fadeProg = (prog - 0.05) / 0.43;
        const opacity = Math.max(0, 1 - fadeProg);
        contentOverlayRef.current.style.opacity = opacity.toFixed(3);
        contentOverlayRef.current.style.transform = `translateY(-${(fadeProg * 24).toFixed(1)}px)`;
        contentOverlayRef.current.style.pointerEvents = opacity > 0.2 ? 'auto' : 'none';
      } else {
        contentOverlayRef.current.style.opacity = '0';
        contentOverlayRef.current.style.pointerEvents = 'none';
      }
    }

    // 2. Scroll Prompt Indicator
    if (scrollIndicatorRef.current) {
      if (prog < 0.12) {
        scrollIndicatorRef.current.style.opacity = (1 - prog / 0.12).toFixed(2);
      } else {
        scrollIndicatorRef.current.style.opacity = '0';
      }
    }

    // 3. Dark Vignette Overlay: Fades out as video transitions to white speed-lines
    if (darkVignetteRef.current) {
      if (prog < 0.55) {
        darkVignetteRef.current.style.opacity = '1';
      } else if (prog < 0.78) {
        const vignetteFade = (prog - 0.55) / 0.23;
        darkVignetteRef.current.style.opacity = Math.max(0, 1 - vignetteFade).toFixed(3);
      } else {
        darkVignetteRef.current.style.opacity = '0';
      }
    }

    // 4. Logo Reveal Stage (Active on final white background from prog >= 0.78)
    if (logoStageRef.current) {
      if (prog < 0.76) {
        logoStageRef.current.style.opacity = '0';
        logoStageRef.current.style.pointerEvents = 'none';
        logoStageRef.current.style.visibility = 'hidden';
      } else {
        logoStageRef.current.style.visibility = 'visible';
        // Base container opacity ramps up quickly between 0.76 and 0.82
        const stageOpacity = Math.min(1, Math.max(0, (prog - 0.76) / 0.06));
        logoStageRef.current.style.opacity = stageOpacity.toFixed(3);
        logoStageRef.current.style.pointerEvents = prog >= 0.90 ? 'auto' : 'none';
      }
    }

    // Stage A: Symbol Reveal (Progress 0.79 to 0.89)
    if (symbolRef.current) {
      if (prog < 0.79) {
        symbolRef.current.style.opacity = '0';
        symbolRef.current.style.transform = 'scale(0.82)';
      } else if (prog < 0.89) {
        const sProg = (prog - 0.79) / 0.10;
        symbolRef.current.style.opacity = Math.min(1, Math.max(0, sProg)).toFixed(3);
        symbolRef.current.style.transform = `scale(${(0.82 + 0.18 * sProg).toFixed(3)})`;
      } else {
        symbolRef.current.style.opacity = '1';
        symbolRef.current.style.transform = 'scale(1)';
      }
    }

    // Stage B: Wordmark Reveal (Progress 0.87 to 0.96)
    if (wordmarkRef.current) {
      if (prog < 0.87) {
        wordmarkRef.current.style.opacity = '0';
        wordmarkRef.current.style.transform = 'translateX(18px)';
      } else if (prog < 0.96) {
        const wProg = (prog - 0.87) / 0.09;
        wordmarkRef.current.style.opacity = Math.min(1, Math.max(0, wProg)).toFixed(3);
        wordmarkRef.current.style.transform = `translateX(${((1 - wProg) * 18).toFixed(1)}px)`;
      } else {
        wordmarkRef.current.style.opacity = '1';
        wordmarkRef.current.style.transform = 'translateX(0px)';
      }
    }

    // Stage C: Final Climax Call to Action Card (Progress 0.93 to 1.0)
    if (finalCardRef.current) {
      if (prog < 0.93) {
        finalCardRef.current.style.opacity = '0';
        finalCardRef.current.style.transform = 'translateY(14px)';
        finalCardRef.current.style.pointerEvents = 'none';
      } else {
        const fProg = (prog - 0.93) / 0.07;
        const opacity = Math.min(1, Math.max(0, fProg));
        finalCardRef.current.style.opacity = opacity.toFixed(3);
        finalCardRef.current.style.transform = `translateY(${((1 - fProg) * 14).toFixed(1)}px)`;
        finalCardRef.current.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none';
      }
    }
  }, []);

  // Smooth scrubbing animation frame loop
  const updateScrub = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoDuration) return;

    // Smoothly interpolate current progress towards target progress
    const diff = targetProgressRef.current - currentProgressRef.current;
    if (Math.abs(diff) > 0.0005) {
      // Lerp factor tuned for natural, responsive tactile feel
      currentProgressRef.current += diff * 0.28;
    } else {
      currentProgressRef.current = targetProgressRef.current;
    }

    const prog = currentProgressRef.current;

    // Apply code-driven opacity and transforms
    applyProgressStyles(prog);

    // Seek the MP4 video (Intra-frame encoded video seeks instantly)
    if (video.readyState >= 2 && !isSeekingRef.current) {
      const targetTime = prog * videoDuration;
      const timeDiff = Math.abs(video.currentTime - targetTime);

      if (timeDiff > 0.02) {
        try {
          if ('fastSeek' in video && typeof (video as unknown as { fastSeek: (t: number) => void }).fastSeek === 'function') {
            (video as unknown as { fastSeek: (t: number) => void }).fastSeek(targetTime);
          } else {
            video.currentTime = targetTime;
          }
        } catch {
          // Fallback if browser throws on seeking
        }
      }
    }

    // Continue loop while animating or schedule next check
    if (Math.abs(targetProgressRef.current - currentProgressRef.current) > 0.0005) {
      rafIdRef.current = requestAnimationFrame(updateScrub);
    } else {
      rafIdRef.current = null;
    }
  }, [videoDuration, applyProgressStyles]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (isReducedMotion || videoFailed) return;

    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = trackHeight - viewportHeight;

    if (scrollDistance <= 0) return;

    // rect.top is 0 when the top of the track aligns with top of viewport
    const rawProgress = -rect.top / scrollDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    targetProgressRef.current = clampedProgress;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(updateScrub);
    }
  }, [isReducedMotion, videoFailed, updateScrub]);

  // Setup scroll and resize listeners
  useEffect(() => {
    if (isReducedMotion || videoFailed) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial measurement
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isReducedMotion, videoFailed, handleScroll]);

  // Video loaded metadata handler
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      const dur = video.duration && !isNaN(video.duration) ? video.duration : 6.334;
      setVideoDuration(dur);
      setVideoReady(true);
      // Cue initial frame
      video.currentTime = 0;
    }
  };

  const handleVideoError = () => {
    setVideoFailed(true);
  };

  // Helper to replay from beginning (scrolls page smoothly to top)
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
          <img
            src="/hero-poster.jpg"
            alt="Caminhões de remoção Vapt Vupt"
            className="w-full h-full object-cover object-center brightness-[0.32] contrast-110"
          />
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
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            aria-hidden="true"
          />

          {/* Fallback poster while video is initializing */}
          {!videoReady && (
            <img
              src="/hero-poster.jpg"
              alt="Caminhões Vapt Vupt"
              className="absolute inset-0 w-full h-full object-cover object-center select-none"
            />
          )}
        </div>

        {/* Dynamic Dark Vignette Overlay: Fades smoothly as footage reaches the white scene */}
        <div
          ref={darkVignetteRef}
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-150"
        >
          {/* Top subtle vignette for Header contrast */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/45 to-transparent" />
          {/* Main directional vignette keeping left-side text sharp and cinematic */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/25 sm:to-transparent" />
          {/* Bottom vignette */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* =========================================================================
            STAGE 1: EDITORIAL VALUE PROPOSITION (Fades out smoothly between 0.05 & 0.48)
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

        {/* Scroll Instruction Indicator (Disappears once user starts scrolling) */}
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
            STAGE 2: OFFICIAL LOGO REVEAL (Symbol first, Wordmark second on white scene)
            ========================================================================= */}
        <div
          ref={logoStageRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none"
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
                style={{ opacity: 0, transform: 'scale(0.82)' }}
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
                style={{ opacity: 0, transform: 'translateX(18px)' }}
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
              style={{ opacity: 0, transform: 'translateY(14px)' }}
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
