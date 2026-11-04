import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, CheckCircle2, Mail, ArrowUpRight } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppRecruitmentForm } from '../components/WhatsAppRecruitmentForm';

export const CareersPage: React.FC = () => {
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
              Faça parte da nossa equipe operacional. Cadastre suas informações para oportunidades de motorista operador de guincho, plataforma e remoção pesada.
            </p>
          </div>
        </div>
      </section>

      {/* Main Careers Content */}
      <section className="py-16 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Profile Requirements Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
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

          {/* Primary Action: Native WhatsApp Recruitment Form */}
          <WhatsAppRecruitmentForm />

          {/* Secondary Alternative: Confirmed Recruitment Email Card */}
          <div className="p-5 sm:p-7 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-1.5 text-center md:text-left min-w-0">
              <div className="inline-flex items-center gap-2 text-slate-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-wider font-heading">
                <Mail className="w-4 h-4 text-[#B43034] shrink-0" />
                <span>Canal Alternativo: Envio por E-mail</span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white font-mono break-all sm:break-normal tracking-tight">
                {COMPANY_CONFIG.careers.email}
              </h3>
              <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-xl">
                Se preferir, você também pode encaminhar seu currículo atualizado em formato PDF diretamente ao nosso e-mail oficial de contratação.
              </p>
            </div>

            <a
              href={mailtoHref}
              className="button-3d w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg shadow transition-colors shrink-0 font-heading text-center leading-tight"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span className="whitespace-normal sm:whitespace-nowrap">Enviar por E-mail</span>
            </a>
          </div>

          {/* LGPD Privacy Disclaimer */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800/80 flex items-start gap-3.5 text-xs text-slate-600 dark:text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-[#B43034] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p>
                <strong className="text-slate-800 dark:text-neutral-300">Tratamento de Dados de Candidatura (LGPD):</strong> As informações submetidas para avaliação de perfil são de responsabilidade da <em>{COMPANY_CONFIG.legalName}</em> como controladora e destinam-se exclusivamente à análise de oportunidades em nosso quadro operacional.
              </p>
              <p>
                Ao clicar no botão de envio, seus dados são transmitidos voluntariamente para o aplicativo WhatsApp, plataforma externa regida por suas próprias regras e termos de privacidade. Para mais esclarecimentos, acesse nossa{' '}
                <Link
                  to="/politica-de-privacidade"
                  className="text-[#B43034] hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  <span>Política de Privacidade</span>
                  <ArrowUpRight className="w-3 h-3 inline" />
                </Link>
                .
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
