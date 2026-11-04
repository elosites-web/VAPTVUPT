import React from 'react';
import { Briefcase, MessageCircle, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { INTEGRATIONS } from '../config/integrations';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';

export const CareersPage: React.FC = () => {
  const isFormsConfigured = INTEGRATIONS.googleForms.isConfigured;

  return (
    <>
      <SEOHead
        title="Trabalhe Conosco"
        description="Oportunidades profissionais na Vapt Vupt Remoção de Veículos. Cadastro de motoristas de guincho, operadores de plataforma e cavalo mecânico."
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Oportunidades & Recrutamento</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight font-heading">
              Trabalhe Conosco
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
              Faça parte da nossa equipe operacional. Cadastre seu currículo para vagas de motorista operador de guincho, plataforma e remoção pesada.
            </p>
          </div>
        </div>
      </section>

      {/* Main Careers Content */}
      <section className="py-16 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Requirements Box */}
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#B43034]" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider font-heading">
                Perfil Operacional Desejável
              </h2>
            </div>
            <p className="text-slate-700 dark:text-neutral-300 text-sm leading-relaxed">
              Buscamos profissionais comprometidos com pontualidade, direção defensiva e zelo patrimonial com os veículos dos clientes:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700 dark:text-neutral-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                <span>CNH Categoria D ou E com observação EAR (Exerce Atividade Remunerada)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                <span>Experiência comprovada com guincho plataforma hidráulica ou cavalo mecânico</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                <span>Conhecimento dos procedimentos de amarração com cintas regulamentares</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                <span>Residência no estado de São Paulo (Campinas, Jundiaí, SP e regiões adjacentes)</span>
              </div>
            </div>
          </div>

          {/* Google Forms Integration Section */}
          <div className="bg-slate-50 dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
                  Formulário Oficial de Cadastro de Talentos
                </h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1">
                  Preenchimento seguro e confidencial processado via Google Forms.
                </p>
              </div>

              {isFormsConfigured && (
                <a
                  href={INTEGRATIONS.googleForms.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B43034] hover:text-red-700 dark:hover:text-red-400 uppercase tracking-wider shrink-0 font-heading"
                >
                  <span>Abrir em tela cheia</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* If Google Forms is Configured: Render real responsive iframe */}
            {isFormsConfigured ? (
              <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-700/80 bg-white">
                <iframe
                  src={INTEGRATIONS.googleForms.embedUrl}
                  width="100%"
                  height="720"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Formulário de Candidatura - Vapt Vupt Remoção de Veículos"
                  className="w-full block"
                >
                  Carregando formulário de recrutamento...
                </iframe>
              </div>
            ) : (
              /* If Google Forms is Pending Setup (TODO-CONFIGURAR-GOOGLE-FORMS) */
              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-amber-50/80 dark:bg-neutral-950/80 border border-amber-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Integração Oficial com Google Forms (Pronta para Ativação)</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
                    O formulário de candidatura está preparado para integração direta com a conta Google do cliente. Assim que o link oficial do Google Forms for inserido no ambiente, o formulário será renderizado automaticamente nesta área sem necessidade de retrabalho de código.
                  </p>
                  
                  <div className="p-3 rounded bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] text-slate-600 dark:text-neutral-400 space-y-1 font-mono">
                    <div>Variável de ambiente: <strong className="text-slate-900 dark:text-neutral-200">VITE_GOOGLE_FORMS_CAREERS_URL</strong></div>
                    <div>Arquivo central: <strong className="text-slate-900 dark:text-neutral-200">src/config/integrations.ts</strong></div>
                    <div>Status atual: <span className="text-amber-700 dark:text-amber-400 font-semibold">TODO-CONFIGURAR-GOOGLE-FORMS</span></div>
                  </div>
                </div>

                {/* Alternative Direct Channel via WhatsApp */}
                <div className="p-6 rounded-xl bg-white dark:bg-gradient-to-r dark:from-neutral-900 dark:to-neutral-950 border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      Envio Imediato via WhatsApp Operacional
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-400">
                      Você pode enviar suas informações básicas e dados de CNH diretamente para o nosso canal de contato.
                    </p>
                  </div>

                  <a
                    href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                      COMPANY_CONFIG.whatsapp.careersMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded shadow-lg transition-colors shrink-0 font-heading"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Informações no WhatsApp</span>
                  </a>
                </div>
              </div>
            )}

            {/* LGPD Privacy Disclaimer */}
            <div className="pt-4 border-t border-slate-200 dark:border-neutral-800 flex items-start gap-3 text-xs text-slate-600 dark:text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
              <p>
                <strong className="text-slate-800 dark:text-neutral-300">Tratamento de Dados (LGPD):</strong> As informações submetidas para avaliação de perfil são de responsabilidade da <em>{COMPANY_CONFIG.legalName}</em> como controladora dos dados e serão utilizadas exclusivamente para análise de oportunidades profissionais na empresa, não sendo compartilhadas com terceiros.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
};
