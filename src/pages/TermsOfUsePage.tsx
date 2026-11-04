import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, ShieldCheck, Scale, AlertTriangle, ExternalLink } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';

export const TermsOfUsePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Termos de Uso do Site"
        description="Termos e Condições de Uso do site institucional da Vapt Vupt Remoção de Veículos LTDA."
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3 font-heading">
            <Scale className="w-4 h-4 text-[#B43034]" />
            <span>Condições de Navegação</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight font-heading">
            Termos de Uso do Site
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
            Regras de navegação, direitos de propriedade intelectual e diretrizes de utilização do website institucional da <strong>{COMPANY_CONFIG.legalName}</strong>.
          </p>

          <div className="mt-4 text-xs text-slate-500 dark:text-neutral-500 font-mono">
            Vigência a partir de: {COMPANY_CONFIG.privacy.lastUpdated}
          </div>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="py-16 bg-white dark:bg-[#141416] text-slate-700 dark:text-neutral-300 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 leading-relaxed text-sm sm:text-base">
          {/* Aviso de Minuta Demonstrativa (Protótipo Comercial) */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-800/60 text-xs sm:text-sm text-slate-800 dark:text-neutral-200">
            <strong className="text-[#B43034] dark:text-red-400 uppercase tracking-wider block mb-1 font-heading">
              Nota de Protótipo Visual • Minuta Demonstrativa
            </strong>
            Estes Termos de Uso integram uma proposta visual demonstrativa e constituem uma minuta institucional sujeita à validação administrativa e revisão jurídica pela empresa antes de publicação oficial.
          </div>

          {/* 1. Objeto e Escopo */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              1. Objeto e Escopo do Website
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Estes Termos de Uso regulam o acesso e a navegação no endereço eletrônico disponibilizado pela <strong className="text-slate-900 dark:text-white">{COMPANY_CONFIG.legalName}</strong>. Este ambiente possui finalidade puramente institucional e informativa, apresentando as capacidades operacionais, estrutura e canais oficiais de contato da empresa.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs sm:text-sm text-slate-700 dark:text-neutral-300">
              <strong className="text-slate-900 dark:text-white block mb-1">Distinção Importante:</strong>
              Estes Termos de Uso aplicam-se exclusivamente à navegação neste website. A efetiva contratação dos serviços de guincho, transporte ou remoção de veículos rege-se pelos termos, ordens de serviço e condições operacionais e fiscais pactuadas diretamente entre a empresa e o contratante no momento do acionamento formal.
            </div>
          </div>

          {/* 2. Propriedade Intelectual */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              2. Propriedade Intelectual e Direitos Autorais
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Os elementos de identidade institucional exibidos neste site — incluindo a marca comercial <em>Vapt Vupt</em>, logotipos, identidade gráfica, textos institucionais e fotografias autênticas de veículos operacionais da empresa — são protegidos pela legislação aplicável e utilizados para fins de apresentação institucional.
            </p>
            <p className="text-slate-700 dark:text-neutral-300">
              É vedada a utilização indevida da marca, logotipos ou fotografias dos veículos da empresa por terceiros sem autorização prévia dos respectivos titulares de direito.
            </p>
          </div>

          {/* 3. Regras de Utilização Adequada */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              3. Conduta e Obrigações do Usuário
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Ao utilizar este website e suas ferramentas de contato, o visitante concorda em:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-neutral-300 pl-2">
              <li>Fornecer dados verídicos ao solicitar orçamentos e atendimentos de remoção;</li>
              <li>Não utilizar o formulário para envio de mensagens com conteúdo ilícito, difamatório, ofensivo ou spam;</li>
              <li>Não tentar violar sistemas de segurança, introduzir vírus, worms, malwares ou scripts danosos;</li>
              <li>Não realizar consultas automatizadas não autorizadas (scraping abusivo) que sobrecarreguem a infraestrutura da página.</li>
            </ul>
          </div>

          {/* 4. Links Externos e Plataformas de Terceiros */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              4. Links Externos e Serviços de Terceiros
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Para conveniência de atendimento, este website disponibiliza links que direcionam o visitante para plataformas operadas por terceiros, nomeadamente o <strong className="text-slate-900 dark:text-white">WhatsApp</strong> (Meta Platforms Inc.), perfis em redes sociais (Instagram) e serviços do Google.
            </p>
            <p className="text-slate-700 dark:text-neutral-300">
              A <em>{COMPANY_CONFIG.legalName}</em> não possui ingerência sobre as políticas de privacidade, termos de serviço ou segurança interna dessas plataformas externas. Ao utilizar os links, o visitante estará sujeito às diretrizes e termos vigentes dessas respectivas empresas.
            </p>
          </div>

          {/* 5. Limitação de Responsabilidade */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              5. Limitações de Responsabilidade Relacionadas à Navegação
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Empregamos esforços razoáveis para manter as informações deste site sempre atualizadas e precisas. No entanto, o visitante reconhece que:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-neutral-300 pl-2">
              <li>A disponibilidade do site pode sofrer interrupções temporárias decorrentes de manutenção técnica, problemas de conexão da rede mundial de computadores ou motivos de força maior;</li>
              <li>A simulação 3D é uma demonstração técnica ilustrativa dos movimentos mecânicos de rampa hidráulica, não constituindo garantia técnica de operação idêntica para qualquer modelo específico de automóvel ou caminhão sem avaliação in loco;</li>
              <li>Orçamentos, valores e previsões de chegada são informados pontualmente e de forma transparente pelo canal do WhatsApp conforme a disponibilidade real de veículos na data e hora da solicitação.</li>
            </ul>
          </div>

          {/* 6. Disposições Finais e Foro */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-neutral-800">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              6. Disposições Gerais e Foro Aplicável
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Estes Termos de Uso são regidos integralmente pela legislação da República Federativa do Brasil, em especial o Marco Civil da Internet (Lei nº 12.965/2014) e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
            <p className="text-slate-700 dark:text-neutral-300">
              Fica eleito o Foro da Comarca de São Paulo - Estado de São Paulo, para dirimir eventuais questões decorrentes da interpretação destes Termos de Uso. Este documento constitui uma minuta institucional padrão sujeita à validação final pela administração da empresa e sua assessoria jurídica.
            </p>
          </div>

          {/* Dúvidas sobre estes Termos */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase font-heading">
                Dúvidas sobre os Termos de Uso?
              </h4>
              <p className="text-xs text-slate-600 dark:text-neutral-400">
                Consulte nossa equipe administrativa através do WhatsApp oficial da empresa.
              </p>
            </div>
            <a
              href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                'Olá! Gostaria de esclarecimentos sobre os termos e procedimentos institucionais da Vapt Vupt.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider shrink-0 font-heading transition-colors"
            >
              <span>Falar com a Administração</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>
    </>
  );
};
