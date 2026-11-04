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
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-[#111113] border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3 font-heading">
            <Shield className="w-4 h-4 text-[#B43034]" />
            <span>Transparência e Conformidade LGPD</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight font-heading">
            Política de Privacidade
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
            Este documento esclarece como a <strong>{COMPANY_CONFIG.legalName}</strong> trata as informações fornecidas por você ao navegar no site ou utilizar nossos canais de atendimento.
          </p>

          <div className="mt-4 text-xs text-neutral-500 font-mono">
            Última atualização: {COMPANY_CONFIG.privacy.lastUpdated}
          </div>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="py-16 bg-[#141416] text-neutral-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 leading-relaxed text-sm sm:text-base">
          
          {/* 1. Identificação do Controlador */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              1. Identificação da Empresa Controladora
            </h2>
            <p>
              A controladora responsável pelas decisões relativas ao tratamento de dados pessoais no âmbito deste site institucional é a <strong>{COMPANY_CONFIG.legalName}</strong>, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº <strong>{COMPANY_CONFIG.privacy.cnpjMatriz}</strong>, com sede registrada em {COMPANY_CONFIG.registrosCadastrais[0].address}, CEP {COMPANY_CONFIG.registrosCadastrais[0].cep}.
            </p>
          </div>

          {/* 2. Dados Pessoais Tratados */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              2. Dados Pessoais Coletados e Tratados
            </h2>
            <p>
              Em estrita observância ao princípio da necessidade e minimização de dados previsto no artigo 6º, III da LGPD, nosso site solicita apenas as informações estritamente indispensáveis para o dimensionamento do atendimento:
            </p>
            <ul className="space-y-2 list-disc list-inside text-neutral-300 pl-2">
              <li><strong>Nome ou Identificação:</strong> para identificar o solicitante no atendimento;</li>
              <li><strong>Tipo de Atendimento Solicitado:</strong> se guincho para veículo leve, pesado ou logística;</li>
              <li><strong>Tipo de Veículo:</strong> modelo, categoria ou porte do automóvel/caminhão para envio da plataforma correta;</li>
              <li><strong>Cidade ou Região:</strong> localização aproximada para cálculo preliminar de rota e disponibilidade;</li>
              <li><strong>Descrição da Necessidade:</strong> situação mecânica ou imprevisto veicular para preparar os equipamentos de resgate.</li>
            </ul>
            <p className="text-neutral-400 text-xs sm:text-sm italic bg-neutral-900/60 p-3 rounded-lg border border-neutral-800">
              Não solicitamos nem tratamos dados sensíveis (origem racial, convicção religiosa, saúde etc.) e não exigimos documentos pessoais (CPF, CNH ou RG) no formulário público inicial.
            </p>
          </div>

          {/* 3. Finalidades e Bases Legais */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              3. Finalidades e Bases Legais Aplicáveis
            </h2>
            <p>
              A coleta e utilização dos dados descritos possuem finalidade exclusiva de prestar atendimento operacional pré-contratual e viabilizar o orçamento técnico de guincho e remoção.
            </p>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs sm:text-sm">
              <div className="text-white font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B43034]" />
                <span>Base Legal Aplicada: Art. 7º, inciso V da LGPD (Lei nº 13.709/2018)</span>
              </div>
              <p className="text-neutral-300">
                O tratamento é realizado para a <em>execução de contrato ou de procedimentos preliminares relacionados a contrato do qual seja parte o titular, a pedido do titular dos dados</em>. Não realizamos disparos de marketing nem compartilhamento com agências de publicidade.
              </p>
            </div>
          </div>

          {/* 4. Funcionamento do Formulário e Redirecionamento ao WhatsApp */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              4. Funcionamento do Formulário e Redirecionamento para o WhatsApp
            </h2>
            <p>
              O formulário de contato disponibilizado no site possui funcionamento 100% cliente (client-side):
            </p>
            <ul className="space-y-2 list-disc list-inside text-neutral-300 pl-2">
              <li><strong>Ausência de Banco de Dados Próprio:</strong> As informações digitadas não são gravadas em servidores de backend, banco de dados ou arquivos de armazenamento do site.</li>
              <li><strong>Processamento em Memória:</strong> O código executado no navegador do visitante apenas formata o texto da mensagem e monta o link de redirecionamento oficial do WhatsApp (<code>https://wa.me/...</code>).</li>
              <li><strong>Controle do Envio:</strong> O site não envia a mensagem automaticamente. Ao clicar no botão, o aplicativo do WhatsApp é aberto no dispositivo do usuário com o texto pré-digitado. Cabe exclusivamente ao visitante decidir acionar o botão de envio dentro do aplicativo.</li>
              <li><strong>Compartilhamento com Plataforma Externa:</strong> Ao dar seguimento no WhatsApp, o conteúdo passa a ser processado pela infraestrutura da Meta Platforms Inc., conforme os Termos e Políticas de Privacidade do próprio WhatsApp.</li>
            </ul>
          </div>

          {/* 5. Serviços de Terceiros e Infraestrutura */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              5. Provedores de Infraestrutura e Serviços Externos
            </h2>
            <p>
              Para disponibilizar o site com estabilidade e segurança técnica na internet, utilizamos provedores de nuvem certificados (Google Cloud / CDN) sujeitos a rígidos padrões de segurança lógica.
            </p>
            <p>
              O site não contém plugins de terceiros para rastreamento invasivo ou coleta silenciosa. Eventuais métricas de acesso (Google Analytics 4), quando ativadas pelo administrador, operam em nível agregado e anônimo para aferição estatística de tráfego, sem identificação individual dos visitantes.
            </p>
          </div>

          {/* 6. Prazos de Conservação e Eliminação */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              6. Retenção e Descarte de Dados
            </h2>
            <p>
              <strong>No ambiente deste site:</strong> o tempo de retenção é nulo (zero), pois nenhuma informação do formulário é gravada em cookies, sessões ou bancos de dados. Ao fechar ou recarregar a página, qualquer dado digitado e não enviado é imediatamente apagado da memória volátil.
            </p>
            <p>
              <strong>Nas conversas do WhatsApp:</strong> caso você inicie o atendimento, as mensagens ficam registradas nos canais oficiais da empresa estritamente pelo tempo necessário para a execução do serviço e cumprimento de obrigações fiscais e regulatórias do transporte rodoviário, sendo descartadas periodicamente.
            </p>
          </div>

          {/* 7. Direitos dos Titulares de Dados */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              7. Seus Direitos (Artigo 18 da LGPD)
            </h2>
            <p>
              Como titular de dados pessoais, a LGPD garante a você o direito de solicitar a qualquer momento:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                <strong className="text-white block mb-1">Confirmação e Acesso</strong>
                <span>Confirmar a existência de tratamento e acessar os dados fornecidos.</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                <strong className="text-white block mb-1">Correção</strong>
                <span>Solicitar a retificação de dados incompletos, inexatos ou desatualizados.</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                <strong className="text-white block mb-1">Eliminação</strong>
                <span>Requerer a exclusão de dados pessoais não mais necessários para a prestação do serviço.</span>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                <strong className="text-white block mb-1">Informação sobre Compartilhamento</strong>
                <span>Saber com quais entidades públicas ou privadas foram compartilhados seus dados.</span>
              </div>
            </div>
          </div>

          {/* 8. Canal de Contato para Privacidade */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              8. Canal de Atendimento e Encarregado de Dados
            </h2>
            <p>
              Para exercer qualquer um dos seus direitos ou esclarecer dúvidas sobre este Aviso de Privacidade, entre em contato diretamente com nossa gestão de conformidade:
            </p>
            <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs sm:text-sm">
              <p><strong className="text-white">Empresa Controladora:</strong> {COMPANY_CONFIG.legalName}</p>
              <p><strong className="text-white">CNPJ Matriz:</strong> {COMPANY_CONFIG.privacy.cnpjMatriz}</p>
              <p><strong className="text-white">Canal WhatsApp Oficial:</strong> {COMPANY_CONFIG.whatsapp.display}</p>
              <p><strong className="text-white">Endereço de Notificação:</strong> {COMPANY_CONFIG.privacy.dpoChannel.address}</p>
              <p className="text-neutral-400 text-xs italic pt-1">
                * Para solicitações por escrito, utilize o canal oficial de WhatsApp ou o endereço postal da matriz administrativa.
              </p>
            </div>
          </div>

          {/* 9. Medidas de Segurança */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              9. Medidas Gerais de Segurança da Informação
            </h2>
            <p>
              Adotamos práticas técnicas e organizacionais adequadas para proteger as comunicações, incluindo tráfego criptografado via protocolo HTTPS/TLS, sanitização de inputs contra scripts maliciosos (XSS) e política restrita de não armazenamento em cache desnecessário no navegador.
            </p>
          </div>

          {/* 10. Atualizações desta Política */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2 font-heading">
              <span className="w-2 h-5 bg-[#B43034] inline-block rounded-sm" />
              10. Alterações deste Documento
            </h2>
            <p>
              Esta Política de Privacidade poderá ser atualizada periodicamente para refletir melhorias técnicas ou adequações legais. Recomendamos consultas periódicas a esta página.
            </p>
          </div>

        </div>
      </section>
    </>
  );
};
