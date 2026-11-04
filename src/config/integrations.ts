/**
 * Vapt Vupt Remoção de Veículos
 * Configurações Centrais de Integrações Externas
 * 
 * Este arquivo centraliza todas as integrações com ferramentas externas:
 * - Google Forms (Trabalhe Conosco / Banco de Talentos)
 * - Google Analytics 4 (GA4)
 * - Google Search Console (GSC)
 * - Meta Pixel / Google Tag Manager (opcionais)
 */

export interface IntegrationsConfig {
  googleForms: {
    // Flag de configuração ativa: se true e url válida, exibe iframe incorporado.
    // Se false ou se contiver TODO-CONFIGURAR-GOOGLE-FORMS, o componente exibe modo de instrução e contingência via WhatsApp.
    isConfigured: boolean;
    // URL direta do formulário para abertura em nova aba
    formUrl: string;
    // URL no formato /viewform?embedded=true para renderização segura dentro do iframe
    embedUrl: string;
    instructions: string;
  };
  googleAnalytics: {
    measurementId: string;
    isEnabled: boolean;
  };
  googleSearchConsole: {
    verificationMeta: string;
  };
}

/**
 * CONFIGURAÇÃO DO GOOGLE FORMS:
 * Substitua os valores abaixo pela URL real gerada no Google Forms institucional.
 * Exemplo de URL direta: https://forms.gle/XYZ123 ou https://docs.google.com/forms/d/e/.../viewform
 * Exemplo de Embed: https://docs.google.com/forms/d/e/.../viewform?embedded=true
 */
const GOOGLE_FORMS_CAREERS_URL = 
  import.meta.env.VITE_GOOGLE_FORMS_CAREERS_URL || 
  'TODO-CONFIGURAR-GOOGLE-FORMS';

const GOOGLE_FORMS_CAREERS_EMBED_URL = 
  import.meta.env.VITE_GOOGLE_FORMS_CAREERS_EMBED_URL || 
  (GOOGLE_FORMS_CAREERS_URL.includes('TODO-CONFIGURAR') 
    ? 'TODO-CONFIGURAR-GOOGLE-FORMS' 
    : GOOGLE_FORMS_CAREERS_URL.includes('viewform') 
      ? (GOOGLE_FORMS_CAREERS_URL.includes('embedded=true') ? GOOGLE_FORMS_CAREERS_URL : `${GOOGLE_FORMS_CAREERS_URL}?embedded=true`)
      : GOOGLE_FORMS_CAREERS_URL);

export const INTEGRATIONS: IntegrationsConfig = {
  googleForms: {
    // Detecta se a URL real foi configurada (se não contém placeholder TODO)
    isConfigured: 
      !GOOGLE_FORMS_CAREERS_URL.includes('TODO-CONFIGURAR') && 
      GOOGLE_FORMS_CAREERS_URL.startsWith('http'),
    formUrl: GOOGLE_FORMS_CAREERS_URL,
    embedUrl: GOOGLE_FORMS_CAREERS_EMBED_URL,
    instructions: 
      'Para ativar o formulário de candidatura oficial, crie um formulário no Google Forms (perguntando nome, telefone, CNH categoria D/E, experiência com guincho/prancha/cavalo mecânico e cidade de residência), clique em "Enviar > Incorporar HTML" e cole o link no arquivo .env (VITE_GOOGLE_FORMS_CAREERS_URL).',
  },
  googleAnalytics: {
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || '',
    isEnabled: Boolean(import.meta.env.VITE_GA4_MEASUREMENT_ID),
  },
  googleSearchConsole: {
    verificationMeta: import.meta.env.VITE_GSC_VERIFICATION_CODE || '',
  },
};
