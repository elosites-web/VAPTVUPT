/**
 * Perguntas Frequentes (FAQ) - Vapt Vupt Remoção de Veículos
 * Dados categorizados, transparentes e alinhados à realidade operacional.
 * 
 * DIRETRIZES ÉTICAS E OPERACIONAIS:
 * - Não prometer atendimento 24h sem confirmação explícita.
 * - Não prometer prazos mágicos ou irreais (ex: "chegamos em 15 minutos").
 * - Transparência sobre raio de atendimento, orçamentos e procedimentos.
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
    description: 'Como funciona o primeiro contato e como solicitar remoção.',
  },
  {
    id: 'veiculos',
    name: 'Tipos de Veículos & Cargas',
    description: 'Veículos leves, caminhões, cavalos mecânicos e frotas.',
  },
  {
    id: 'regiao',
    name: 'Abrangência Operacional',
    description: 'Regiões e rotas onde atuamos com guincho e remoção.',
  },
  {
    id: 'prazos',
    name: 'Prazos & Previsão de Chegada',
    description: 'Critérios técnicos para estimativa de deslocamento.',
  },
  {
    id: 'orcamentos',
    name: 'Condições Comerciais & Pagamento',
    description: 'Como é formulado o orçamento e formas de pagamento aceitas.',
  },
  {
    id: 'seguranca',
    name: 'Segurança & Procedimentos Técnicos',
    description: 'Zelo pelo veículo durante o içamento e transporte.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  // Atendimento & Solicitação
  {
    id: 'como-solicitar',
    category: 'geral',
    question: 'Qual é o canal mais rápido para solicitar atendimento de remoção?',
    answer: 'O canal mais ágil e direto é o nosso WhatsApp oficial: (11) 91372-1849. Ao enviar uma mensagem informando o modelo do veículo, a situação do automóvel e os pontos de origem e destino, nossa equipe operacional analisa a disponibilidade imediata e fornece a orientação completa.',
  },
  {
    id: 'horario-atendimento',
    category: 'geral',
    question: 'Qual é o horário de atendimento da Vapt Vupt?',
    answer: 'Atendemos demandas de remoção e transporte de veículos sob consulta direta da escala operacional via WhatsApp. Consulte nossa equipe pelo número oficial para verificar a disponibilidade de veículos no momento em que você precisar do serviço.',
  },
  {
    id: 'documentos-necessarios',
    category: 'geral',
    question: 'Quais dados ou documentos são necessários para liberar a remoção?',
    answer: 'Por exigência legal e de segurança patrimonial, solicitamos a comprovação de propriedade ou autorização legítima do responsável pelo veículo (documento do veículo CRLV e documento de identificação com foto do solicitante/motorista), além da indicação precisa do local de destino.',
  },

  // Tipos de Veículos & Cargas
  {
    id: 'quais-veiculos-leves',
    category: 'veiculos',
    question: 'Vocês realizam remoção de carros rebaixados ou com câmbio automático?',
    answer: 'Sim. Nossas plataformas contam com sistema hidráulico basculante suave e guincho de arraste controlado por cabo, permitindo ângulo de ataque adequado para embarque seguro de veículos com câmbio automático (utilizando patins quando houver travamento de rodas) e modelos com suspensão baixa, evitando danos a para-choques e assoalho.',
  },
  {
    id: 'veiculos-pesados',
    category: 'veiculos',
    question: 'A empresa tem estrutura para caminhões, cavalos mecânicos e carretas?',
    answer: 'Sim. Contamos com equipamento pesado dedicado, incluindo cavalo mecânico e guinchos de alta capacidade preparados para tração, resgate técnico e transporte de veículos comerciais de grande porte.',
  },
  {
    id: 'motos-e-vans',
    category: 'veiculos',
    question: 'Vocês atendem furgões, vans e veículos utilitários comerciais?',
    answer: 'Sim. Atendemos utilitários, furgões, caminhonetes de cabine dupla e vans de passageiros ou carga, dimensionando a prancha ou caminhão ideal para o comprimento e peso do veículo.',
  },

  // Abrangência Operacional
  {
    id: 'cidades-atendidas',
    category: 'regiao',
    question: 'Quais regiões têm cobertura de atendimento da Vapt Vupt?',
    answer: 'Nossa base operacional tem foco principal no estado de São Paulo, cobrindo trajetos na Região Metropolitana de São Paulo, Campinas, Jundiaí e principais rodovias intermunicipais (como Anhanguera, Bandeirantes e Dutra). Para viagens interestaduais ou rotas específicas, consulte nossa equipe com antecedência.',
  },
  {
    id: 'remocao-rodovia',
    category: 'regiao',
    question: 'Vocês podem fazer a remoção do veículo a partir de rodovias concedidas?',
    answer: 'Sim. Em rodovias com concessionárias, após a sinalização obrigatória e posicionamento seguro no acostamento ou na base de apoio da concessionária, realizamos o transporte até a oficina, concessionária ou destino final indicado pelo cliente.',
  },

  // Prazos & Previsão de Chegada
  {
    id: 'tempo-chegada',
    category: 'prazos',
    question: 'Qual é o tempo estimado para o guincho chegar ao local?',
    answer: 'O tempo de deslocamento varia conforme a distância do veículo mais próximo da frota no momento da chamada, as condições climáticas e o trânsito da região. Nunca prometemos prazos irreais: no momento do contato, calculamos a rota real e informamos uma estimativa transparente.',
  },
  {
    id: 'agendamento-previo',
    category: 'prazos',
    question: 'É possível agendar a remoção ou transferência de veículos com antecedência?',
    answer: 'Sim! Recomendamos o agendamento prévio para transferências entre oficinas, vistorias, entrega em concessionárias ou eventos corporativos, assegurando vaga e horário prioritários na frota.',
  },

  // Condições Comerciais & Pagamento
  {
    id: 'como-calcula-valor',
    category: 'orcamentos',
    question: 'Como é calculado o valor do serviço de remoção?',
    answer: 'O orçamento leva em conta: 1) Porte e peso do veículo (se necessita guincho leve ou pesado); 2) Distância total em quilômetros entre origem e destino; 3) Complexidade da operação (rodas travadas, subsolo, ribanceira, necessidade de patins ou guincho lança); 4) Custos de pedágios quando aplicável.',
  },
  {
    id: 'formas-pagamento',
    category: 'orcamentos',
    question: 'Quais são as formas de pagamento aceitas?',
    answer: 'Aceitamos PIX, transferência bancária e cartões de débito/crédito. Para empresas e frotistas conveniados, consulte condições de faturamento mediante aprovação cadastral prévia.',
  },

  // Segurança & Procedimentos Técnicos
  {
    id: 'seguranca-veiculo',
    category: 'seguranca',
    question: 'Como o veículo é fixado durante o transporte na plataforma?',
    answer: 'Utilizamos cintas de poliéster de alta resistência com catracas travadas nas quatro rodas e calços regulamentares. O veículo nunca é ancorado por partes estruturais vulneráveis ou suspensão, respeitando rigorosamente os padrões de transporte automotivo.',
  },
  {
    id: 'veiculo-sem-chave',
    category: 'seguranca',
    question: 'O veículo está trancado ou sem chaves: ainda assim é possível remover?',
    answer: 'Sim, desde que acompanhado da comprovação legal de propriedade. Para veículos trancados ou sem chaves, nossa equipe utiliza patins rolantes e cabos técnicos para que o veículo seja içado na plataforma sem arrastar os pneus nem forçar a transmissão.',
  },
];
