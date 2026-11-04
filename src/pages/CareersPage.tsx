import React from 'react';
import { Briefcase, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { INTEGRATIONS } from '../config/integrations';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

export const CareersPage: React.FC = () => {
  const isFormsConfigured = INTEGRATIONS.googleForms.isConfigured;
  const mailtoHref = `mailto:${COMPANY_CONFIG.careers.email}?subject=${encodeURIComponent(
    COMPANY_CONFIG.careers.subject
  )}`;

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
                <span>Habilitação compatível com a categoria do veículo operacional</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                <span>Experiência com operação de guincho ou transporte de veículos</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                <span>Compromisso com procedimentos seguros de embarque e movimentação</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
                <span>Postura profissional, pontualidade e atenção no atendimento</span>
              </div>
            </div>
          </div>

          {/* Recruitment Channels Section */}
          <div className="bg-slate-50 dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight font-heading">
                  Canais Oficiais de Recrutamento e Seleção
                </h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1">
                  Envie seu currículo ou apresentação profissional pelos canais confirmados da empresa.
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

            {/* Confirmed Recruitment Email Card */}
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-wider font-heading">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>E-mail Oficial de Contratação</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono break-all">
                  {COMPANY_CONFIG.careers.email}
                </h4>
                <p className="text-xs text-slate-600 dark:text-neutral-400">
                  Canal exclusivo para envio de currículo profissional (motoristas de guincho leve, pesado e equipe operacional).
                </p>
              </div>

              <a
                href={mailtoHref}
                className="btn-3d inline-flex items-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow-lg transition-colors shrink-0 font-heading"
              >
                <Mail className="w-4 h-4" />
                <span>Enviar Currículo por E-mail</span>
              </a>
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
              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-slate-100/80 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-[#B43034] shrink-0" />
                    <span>Orientação para Envio de Candidatura</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
                    Você pode encaminhar seu currículo diretamente para o e-mail <strong>{COMPANY_CONFIG.careers.email}</strong> ou entrar em contato pelo WhatsApp oficial informando seu nome, cidade, categoria de CNH e área de experiência profissional.
                  </p>
                </div>

                {/* Alternative Direct Channel via WhatsApp */}
                <div className="p-6 rounded-xl bg-white dark:bg-gradient-to-r dark:from-neutral-900 dark:to-neutral-950 border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      Contato Profissional via WhatsApp Oficial
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-400">
                      Envie apenas sua apresentação profissional inicial. Não envie fotos ou números de documentos pessoais (CPF, RG ou CNH) nesta etapa.
                    </p>
                  </div>

                  <a
                    href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                      COMPANY_CONFIG.whatsapp.careersMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow transition-colors shrink-0 font-heading"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    <span>Falar pelo WhatsApp</span>
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
