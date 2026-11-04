import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle2, Lock, FileText, HelpCircle, Phone, Building } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Política de Privacidade"
        description="Aviso de Privacidade e Tratamento de Dados da Vapt Vupt Remoção de Veículos, em estrita conformidade com a LGPD (Lei 13.709/2018)."
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3 font-heading">
            <Shield className="w-4 h-4 text-[#B43034]" />
            <span>Transparência e Conformidade LGPD</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight font-heading">
            Política de Privacidade
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
            Este documento esclarece como a <strong>{COMPANY_CONFIG.legalName}</strong> trata as informações fornecidas por você ao navegar no site ou utilizar nossos canais de atendimento.
          </p>

          <div className="mt-4 text-xs text-slate-500 dark:text-neutral-500 font-mono">
            Última atualização: {COMPANY_CONFIG.privacy.lastUpdated}
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
            Este documento integra uma proposta visual demonstrativa e constitui um modelo técnico-institucional estruturado conforme a LGPD. Seu conteúdo final está sujeito à validação administrativa e revisão jurídica pela empresa antes de publicação oficial.
          </div>

          {/* 1. Identificação do Controlador */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              1. Identificação da Empresa Controladora
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              A controladora responsável pelas decisões relativas ao tratamento de dados pessoais no âmbito deste site institucional é a <strong className="text-slate-900 dark:text-white">{COMPANY_CONFIG.legalName}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº <strong className="text-slate-900 dark:text-white">{COMPANY_CONFIG.privacy.cnpjMatriz}</strong>, com sede registrada em {COMPANY_CONFIG.registrosCadastrais[0].address}, CEP {COMPANY_CONFIG.registrosCadastrais[0].cep}.
            </p>
          </div>

          {/* 2. Dados Pessoais Tratados */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              2. Dados Pessoais Coletados e Tratados
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Em estrita observância aos princípios da finalidade, necessidade e minimização de dados previstos no artigo 6º da LGPD, os formulários institucionais deste site solicitam exclusivamente as informações indispensáveis para cada propósito:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2">
                <strong className="text-slate-900 dark:text-white block text-sm font-heading uppercase tracking-wide">
                  A. Formulário de Atendimento e Orçamento (Serviços e Contato):
                </strong>
                <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-neutral-300 pl-1">
                  <li><strong className="text-slate-900 dark:text-white">Nome ou Identificação:</strong> para identificação do solicitante no atendimento;</li>
                  <li><strong className="text-slate-900 dark:text-white">Tipo de Atendimento Solicitado:</strong> se remoção de veículo leve, pesado ou logística;</li>
                  <li><strong className="text-slate-900 dark:text-white">Tipo de Veículo:</strong> modelo, categoria ou porte do veículo para dimensionamento da plataforma correta;</li>
                  <li><strong className="text-slate-900 dark:text-white">Cidade ou Região:</strong> localização aproximada para estimativa preliminar de rota e disponibilidade;</li>
                  <li><strong className="text-slate-900 dark:text-white">Descrição da Necessidade:</strong> situação mecânica ou imprevisto veicular para preparo operacional.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2">
                <strong className="text-slate-900 dark:text-white block text-sm font-heading uppercase tracking-wide">
                  B. Formulário de Recrutamento Operacional (Trabalhe Conosco):
                </strong>
                <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-neutral-300 pl-1">
                  <li><strong className="text-slate-900 dark:text-white">Nome Completo:</strong> identificação civil do candidato;</li>
                  <li><strong className="text-slate-900 dark:text-white">E-mail para Contato:</strong> canal eletrônico para retorno sobre processos seletivos;</li>
                  <li><strong className="text-slate-900 dark:text-white">Telefone / WhatsApp:</strong> contato telefônico direto para agendamento de entrevistas;</li>
                  <li><strong className="text-slate-900 dark:text-white">Cidade e Bairro de Residência:</strong> avaliação de compatibilidade de deslocamento com a base operacional;</li>
                  <li><strong className="text-slate-900 dark:text-white">Categoria da CNH:</strong> verificação preliminar da habilitação exigida para o equipamento (sem coleta de número de registro, CPF ou fotos de documentos nesta fase);</li>
                  <li><strong className="text-slate-900 dark:text-white">Vaga ou Área de Interesse:</strong> função pretendida no banco de talentos operacional.</li>
                </ul>
              </div>
            </div>

            <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm italic bg-slate-50 dark:bg-neutral-900/60 p-3 rounded-lg border border-slate-200 dark:border-neutral-800">
              Não solicitamos nem tratamos dados sensíveis (origem racial, convicção religiosa, saúde etc.) e não exigimos cópias de documentos pessoais (CPF, RG ou fotos de CNH) nos formulários públicos do site.
            </p>
          </div>

          {/* 3. Finalidades e Bases Legais */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              3. Finalidades e Bases Legais Aplicáveis
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              O tratamento de dados pessoais no âmbito da empresa atende a finalidades legítimas e determinadas:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2 text-xs sm:text-sm">
                <div className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B43034]" />
                  <span>Atendimento a Clientes: Execução de Procedimentos Preliminares (Art. 7º, V da LGPD)</span>
                </div>
                <p className="text-slate-700 dark:text-neutral-300">
                  Os dados de atendimento são tratados para viabilizar orçamentos, verificar disponibilidade operacional e realizar atos preparatórios à prestação de serviços de guincho e remoção veicular a pedido do titular.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2 text-xs sm:text-sm">
                <div className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B43034]" />
                  <span>Recrutamento e Seleção: Consentimento e Procedimentos Preliminares (Art. 7º, I e V da LGPD)</span>
                </div>
                <p className="text-slate-700 dark:text-neutral-300">
                  A submissão de dados de candidatura fundamenta-se na manifestação afirmativa do candidato (checkbox de consentimento obrigatório) e nos procedimentos pré-contratuais seletivos para inclusão voluntária no banco de talentos e eventual convocação para oportunidades profissionais.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 italic">
              * A indicação das hipóteses legais reflete o modelo técnico-institucional do projeto e deve ser validada pela assessoria jurídica responsável da empresa.
            </p>
          </div>

          {/* 4. Funcionamento dos Formulários, Consentimento e Redirecionamento ao WhatsApp */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              4. Funcionamento dos Formulários e Redirecionamento para o WhatsApp
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Todos os formulários disponibilizados no site possuem funcionamento 100% cliente (client-side) executado no navegador do visitante:
            </p>
            <ul className="space-y-2.5 list-disc list-inside text-slate-700 dark:text-neutral-300 pl-2 text-xs sm:text-sm">
              <li><strong className="text-slate-900 dark:text-white">Processamento Exclusivo em Memória:</strong> As informações preenchidas permanecem exclusivamente no estado transitório do componente em seu navegador. O website não armazena os dados em banco de dados de backend, cookies, <code>localStorage</code> ou <code>sessionStorage</code>.</li>
              <li><strong className="text-slate-900 dark:text-white">Consentimento Afirmativo Obrigatório:</strong> Em conformidade com a LGPD, todo envio exige a marcação ativa de checkbox de consentimento prévio, não pré-selecionado, sem o qual o formulário bloqueia qualquer redirecionamento.</li>
              <li><strong className="text-slate-900 dark:text-white">Controle Total do Usuário:</strong> O site não transmite a mensagem de forma automática. Ao clicar no botão de envio, é gerado um link oficial do WhatsApp (<code>https://wa.me/5511913721849</code>) contendo o texto pré-formatado. Cabe exclusivamente ao usuário revisar a mensagem e acionar o envio final dentro do aplicativo WhatsApp.</li>
              <li><strong className="text-slate-900 dark:text-white">Compartilhamento e Plataforma Externa:</strong> Ao dar seguimento pelo WhatsApp, os dados trafegam pela infraestrutura da Meta Platforms Inc. (WhatsApp), ficando sujeitos aos Termos de Serviço e à Política de Privacidade da referida plataforma externa.</li>
            </ul>
          </div>

          {/* 5. Serviços de Terceiros e Infraestrutura */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              5. Serviços Externos e Plataformas de Terceiros
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Este site opera de forma institucional no navegador do visitante e disponibiliza links diretos para plataformas externas de comunicação (como WhatsApp e Instagram) apenas quando acionados voluntariamente pelo usuário.
            </p>
            <p className="text-slate-700 dark:text-neutral-300">
              Caso ferramentas adicionais de análise de tráfego venham a ser ativadas futuramente pela administração da empresa, este documento deverá ser atualizado para refletir tais integrações.
            </p>
          </div>

          {/* 6. Prazos de Conservação e Eliminação */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              6. Retenção e Descarte de Dados
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              <strong className="text-slate-900 dark:text-white">No ambiente deste site:</strong> nenhum dado digitado nos formulários é gravado em banco de dados próprio ou persistido no navegador. Ao fechar a aba ou recarregar a página, as informações não submetidas deixam de existir na memória da aplicação.
            </p>
            <p className="text-slate-700 dark:text-neutral-300">
              <strong className="text-slate-900 dark:text-white">No atendimento via WhatsApp e Recrutamento:</strong> após o envio voluntário pelo aplicativo WhatsApp, as informações são recebidas pelos canais operacionais da <em>{COMPANY_CONFIG.legalName}</em>. Os dados de candidatos são utilizados para avaliação no banco de talentos conforme as práticas administrativas e prazos de retenção da empresa, assegurado ao titular o direito de solicitar a eliminação a qualquer momento.
            </p>
          </div>

          {/* 7. Direitos dos Titulares de Dados */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              7. Seus Direitos (Artigo 18 da LGPD)
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Como titular de dados pessoais, a LGPD garante a você o direito de solicitar a qualquer momento:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Confirmação e Acesso</strong>
                <span className="text-slate-600 dark:text-neutral-400">Confirmar a existência de tratamento e acessar os dados fornecidos.</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Correção</strong>
                <span className="text-slate-600 dark:text-neutral-400">Solicitar a retificação de dados incompletos, inexatos ou desatualizados.</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Eliminação</strong>
                <span className="text-slate-600 dark:text-neutral-400">Requerer a exclusão de dados pessoais não mais necessários para a prestação do serviço.</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Informação sobre Compartilhamento</strong>
                <span className="text-slate-600 dark:text-neutral-400">Saber com quais entidades públicas ou privadas foram compartilhados seus dados.</span>
              </div>
            </div>
          </div>

          {/* 8. Canal de Contato para Privacidade */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              8. Canal de Atendimento e Encarregado de Dados
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Para exercer qualquer um dos seus direitos ou esclarecer dúvidas sobre este Aviso de Privacidade, entre em contato diretamente com nossa gestão de conformidade:
            </p>
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2 text-xs sm:text-sm">
              <p><strong className="text-slate-900 dark:text-white">Empresa Controladora:</strong> {COMPANY_CONFIG.legalName}</p>
              <p><strong className="text-slate-900 dark:text-white">CNPJ Matriz:</strong> {COMPANY_CONFIG.privacy.cnpjMatriz}</p>
              <p><strong className="text-slate-900 dark:text-white">Canal WhatsApp Oficial:</strong> {COMPANY_CONFIG.whatsapp.display}</p>
              <p><strong className="text-slate-900 dark:text-white">Endereço de Notificação:</strong> {COMPANY_CONFIG.privacy.dpoChannel.address}</p>
              <p className="text-slate-500 dark:text-neutral-400 text-xs italic pt-1">
                * Para solicitações por escrito, utilize o canal oficial de WhatsApp ou o endereço postal da matriz administrativa.
              </p>
            </div>
          </div>

          {/* 9. Medidas de Segurança */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              9. Medidas Gerais de Segurança da Informação
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Adotamos práticas técnicas e organizacionais adequadas para proteger as comunicações, incluindo tráfego criptografado via protocolo HTTPS/TLS, sanitização de inputs contra scripts maliciosos (XSS) e política restrita de não armazenamento em cache desnecessário no navegador.
            </p>
          </div>

          {/* 10. Atualizações desta Política */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-neutral-800">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              10. Alterações e Revisão deste Documento
            </h2>
            <p className="text-slate-700 dark:text-neutral-300">
              Esta Política de Privacidade constitui um modelo institucional estruturado para o ambiente digital da empresa e poderá ser atualizada periodicamente. Recomenda-se a revisão e validação final deste conteúdo pela administração da empresa e sua assessoria jurídica antes da publicação definitiva em domínio oficial.
            </p>
          </div>

        </div>
      </section>
    </>
  );
};
