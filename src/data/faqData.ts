/**
 * Perguntas Frequentes (FAQ) - Vapt Vupt Remoção de Veículos
 * Dados categorizados, transparentes e alinhados exclusivamente às informações confirmadas.
 *
 * DIRETRIZES DE CONTEÚDO:
 * - Não prometer atendimento 24h, chegada imediata ou prazos garantidos.
 * - Não afirmar cobertura em cidades/rodovias específicas nem formas de pagamento sem confirmação.
 * - Não inventar procedimentos técnicos ou equipamentos não validados.
 * - Orientar sempre a consulta direta à equipe pelo WhatsApp oficial: (11) 91372-1849.
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'geral',
    name: 'Atendimento & Solicitação',
    description: 'Como funciona o contato e a solicitação de atendimento.',
  },
  {
    id: 'veiculos',
    name: 'Tipos de Veículos',
    description: 'Atendimento para veículos leves e pesados.',
  },
  {
    id: 'regiao',
    name: 'Localização & Abrangência',
    description: 'Consulta de disponibilidade por rota e região.',
  },
  {
    id: 'prazos',
    name: 'Disponibilidade & Agendamento',
    description: 'Consulta de previsão e solicitações programadas.',
  },
  {
    id: 'orcamentos',
    name: 'Orçamentos & Condições',
    description: 'Como consultar valores e condições comerciais.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  // Atendimento & Solicitação
  {
    id: 'como-solicitar',
    category: 'geral',
    question: 'Como solicitar atendimento de remoção de veículos com a Vapt Vupt?',
    answer: 'O atendimento pode ser solicitado pelos números da Central de Atendimento ((11) 4934-1997, (11) 94149-4402, (11) 4402-3115 e (19) 2042-2350) ou diretamente pelo nosso WhatsApp (Vagas/Contato): (11) 91372-1849, bem como preenchendo o formulário desta página para preparar a mensagem com os dados do seu veículo e necessidade.',
  },
  {
    id: 'horario-atendimento',
    category: 'geral',
    question: 'Qual é a estrutura de serviços e atendimento da Vapt Vupt?',
    answer: 'A Vapt Vupt Remoção de Veículos Ltda é especializada em serviços de guincho e reboque 24 horas para veículos leves e pesados, atuando em parceria com grandes seguradoras. Os canais da Central de Atendimento e do WhatsApp (Vagas/Contato) (11) 91372-1849 estão à disposição para consultas e chamados.',
  },
  {
    id: 'informacoes-necessarias',
    category: 'geral',
    question: 'Quais informações devo enviar ao entrar em contato?',
    answer: 'Para agilizar a análise da equipe, informe seu nome, o tipo de veículo (leve ou pesado), a região ou local da ocorrência e um breve resumo da necessidade de remoção ou transporte.',
  },

  // Tipos de Veículos
  {
    id: 'quais-veiculos-atendidos',
    category: 'veiculos',
    question: 'Quais tipos de veículos a Vapt Vupt atende?',
    answer: 'A Vapt Vupt atua com soluções em remoção e transporte de veículos leves (como automóveis de passeio e utilitários) e veículos pesados (como caminhões e cavalos mecânicos), conforme disponibilidade operacional.',
  },
  {
    id: 'situacoes-especificas-veiculo',
    category: 'veiculos',
    question: 'Meu veículo possui uma condição específica. Como saber se pode ser atendido?',
    answer: 'Cada solicitação é avaliada de acordo com as características do veículo e do local. Descreva a situação detalhadamente pelo WhatsApp para que nossa equipe verifique o equipamento adequado e confirme a viabilidade do atendimento.',
  },

  // Localização & Abrangência
  {
    id: 'regioes-atendidas',
    category: 'regiao',
    question: 'Quais cidades ou regiões são atendidas pela empresa?',
    answer: 'A disponibilidade de atendimento varia conforme o ponto de origem, o destino e a operação em andamento. Entre em contato pelos nossos telefones ou pelo WhatsApp oficial informando a localização para consultar a cobertura para o seu trajeto.',
  },
  {
    id: 'unidade-jundiai',
    category: 'regiao',
    question: 'Qual é o registro da Unidade em Jundiaí (Filial)?',
    answer: 'A Unidade em Jundiaí (Filial) possui registro sob o CNPJ 03.235.721/0004-11, localizada na Travessa Egydio Matheo, 105 - Bairro da Colônia, Jundiaí - SP, CEP 13219-810.',
  },
  {
    id: 'atendimento-presencial',
    category: 'regiao',
    question: 'Os endereços cadastrais da empresa realizam atendimento presencial ao público?',
    answer: 'Não. Os endereços cadastrais possuem finalidade estritamente cadastral e fiscal. Todas as solicitações de remoção, cotações e informações devem ser feitas pelos nossos canais oficiais (Central de Atendimento e WhatsApp).',
  },

  // Disponibilidade & Agendamento
  {
    id: 'tempo-chegada',
    category: 'prazos',
    question: 'Como funciona a previsão de atendimento e deslocamento?',
    answer: 'Não trabalhamos com prazos padronizados sem antes avaliar a solicitação. Ao receber seu chamado pelo WhatsApp, a equipe verifica a disponibilidade da frota e a distância do trajeto para informar a previsão correspondente.',
  },
  {
    id: 'transporte-programado',
    category: 'prazos',
    question: 'É possível consultar remoção ou transporte programado com antecedência?',
    answer: 'Sim. Caso precise planejar uma movimentação ou transferência veicular com antecedência, entre em contato com a equipe pelo WhatsApp para verificar disponibilidade de agenda e condições.',
  },

  // Orçamentos & Condições
  {
    id: 'como-solicitar-orcamento',
    category: 'orcamentos',
    question: 'Como é feito o orçamento e quais são as formas de pagamento?',
    answer: 'Os valores, condições comerciais e formas de pagamento aceitas são informados diretamente pela nossa equipe durante o atendimento no WhatsApp, após a análise do tipo de veículo, local de origem e destino.',
  },
];
