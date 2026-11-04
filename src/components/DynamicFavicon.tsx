import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    setFaviconPriority?: (priority: boolean) => void;
  }
}

/**
 * DynamicFavicon
 * Controla dinamicamente a troca de favicon entre tema claro/escuro e modo de alta prioridade.
 * O modo de alta prioridade é automaticamente ativado na página de contato / solicitação urgente,
 * ou quando a janela do navegador perde o foco caso haja uma consulta em andamento.
 */
export const DynamicFavicon: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Rotas consideradas de alta prioridade operacional (ex: contato direto e emergência)
    const isPriorityRoute = location.pathname === '/contato';

    if (window.setFaviconPriority) {
      window.setFaviconPriority(isPriorityRoute);
    }

    // Listener para quando o usuário alterna de aba enquanto estiver numa rota de contato/atendimento
    const handleVisibilityChange = () => {
      if (document.hidden && isPriorityRoute && window.setFaviconPriority) {
        window.setFaviconPriority(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname]);

  return null;
};
