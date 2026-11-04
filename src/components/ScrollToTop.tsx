import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const HEADER_OFFSET = 108;
const scrollPositions = new Map<string, number>();

/**
 * ScrollToTop
 * - Preserva e restaura a posição de rolagem ao navegar pelo histórico (Voltar/Avançar -> POP).
 * - Em links de âncora (#hash), rola até o elemento descontando a altura do Header fixo.
 * - Força o scroll para o topo apenas em navegações (PUSH / REPLACE) entre rotas distintas (mudança de pathname).
 */
export const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathnameRef = useRef<string>(location.pathname);
  const activeKeyRef = useRef<string>(location.key || location.pathname);

  // Registra a posição de scroll da entrada atual do histórico de forma passiva
  useEffect(() => {
    activeKeyRef.current = location.key || location.pathname;

    const handleScroll = () => {
      scrollPositions.set(activeKeyRef.current, window.scrollY);
      scrollPositions.set(location.pathname, window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.key, location.pathname]);

  useEffect(() => {
    const key = location.key || location.pathname;
    const isDistinctRoute = prevPathnameRef.current !== location.pathname;
    prevPathnameRef.current = location.pathname;

    // 1. Se houver hash na URL, rola até o elemento correspondente descontando o Header fixo
    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.replace(/^#/, ''));
      const scrollToHash = () => {
        const element = document.getElementById(targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const top = Math.max(0, rect.top + window.scrollY - HEADER_OFFSET);
          window.scrollTo({ top, left: 0, behavior: 'smooth' });
          return true;
        }
        return false;
      };

      if (!scrollToHash()) {
        const timer = window.setTimeout(scrollToHash, 80);
        return () => window.clearTimeout(timer);
      }
      return;
    }

    // 2. Navegação pelo histórico (Voltar / Avançar -> POP): preserva/restaura a posição anterior
    if (navigationType === 'POP') {
      const savedY = scrollPositions.get(key) ?? scrollPositions.get(location.pathname);
      if (typeof savedY === 'number') {
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
        });
      }
      return;
    }

    // 3. Apenas navegações entre rotas distintas (mudança de pathname) forçam o scroll para o topo
    if (isDistinctRoute) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
  }, [location.pathname, location.hash, location.key, navigationType]);

  return null;
};
