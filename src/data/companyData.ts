/**
 * Vapt Vupt Remoção de Veículos
 * Centralized business data and configuration
 *
 * NOTE: Strict compliance with briefing instructions:
 * - Do NOT invent statistics (years, fleet counts, staff count, clients count).
 * - Do NOT promise 24h service, immediate arrival, unverified cities, payment methods, or unconfirmed technical specs.
 * - Registrations marked with TODO-CONFIRMAR-CLIENTE are kept internal/editable.
 */

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: 'Car' | 'Truck' | 'ShieldAlert' | 'Warehouse';
  tag: string;
  image?: string;
  technicalHighlights?: string[];
  safetyProtocols?: string[];
  // Flag for services that must be confirmed by the client before public display
  isPendingConfirmation?: boolean;
}

export interface FleetItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  badge: string;
  features: string[];
}

export interface UnitRegistration {
  type: 'MATRIZ' | 'FILIAL';
  city: string;
  state: string;
  cnpj: string;
  address: string;
  cep: string;
  operationalNotes: string;
  // Flag indicating whether public visits are confirmed (default false to prevent assuming public retail location)
  // TODO-CONFIRMAR-CLIENTE: Validar finalidade operacional antes de expor como visitação pública
  isPublicVisitingAllowed: boolean;
  status: 'ATIVA' | 'BAIXADA';
}

export const COMPANY_CONFIG = {
  brandName: 'Vapt Vupt Remoção de Veículos',
  legalName: 'Vapt Vupt Remoção de Veículos LTDA.',
  slogan: 'Estrutura e soluções em remoção de veículos',
  badge: 'Referência em remoção de veículos',
  segment: 'Transporte, guincho e remoção de veículos leves e pesados',

  // Official identified contacts
  whatsapp: {
    raw: '5511913721849',
    display: '(11) 91372-1849',
    link: 'https://wa.me/5511913721849',
    defaultMessage: 'Olá! Gostaria de obter informações sobre os serviços de remoção de veículos da Vapt Vupt.',
    lightVehicleMessage: 'Olá! Gostaria de consultar atendimento para remoção de veículo leve com a Vapt Vupt.',
    heavyVehicleMessage: 'Olá! Gostaria de consultar atendimento para remoção de veículo pesado/caminhão com a Vapt Vupt.',
    quoteMessage: (vehicleType: string, need: string, location?: string) =>
      `Olá! Gostaria de consultar atendimento com a Vapt Vupt.%0A- Tipo de veículo: ${vehicleType}%0A- Necessidade: ${need}${location ? `%0A- Local/Região: ${location}` : ''}`,
    careersMessage: 'Olá! Tenho interesse em oportunidades profissionais na Vapt Vupt e gostaria de conversar com a equipe.',
  },

  instagram: {
    handle: '@vaptvuptremocao',
    url: 'https://instagram.com/vaptvuptremocao',
  },

  // Logos from provided official assets package
  logos: {
    horizontalWhite: '/assets/aistudio/logo-horizontal-texto-branco-para-fundo-escuro_e2ba3663.png',
    horizontalOriginal: '/assets/aistudio/logo-horizontal-original_7d8e0be3.png',
    verticalWhite: '/assets/aistudio/logo-vertical-texto-branco-para-fundo-escuro_fb8b8f34.png',
    verticalOriginal: '/assets/aistudio/logo-vertical-original_878e1737.png',
    symbolOriginal: '/assets/aistudio/logo-simbolo-original_894a5d86.png',
    symbolWhite: '/assets/aistudio/logo-simbolo-texto-branco-para-fundo-escuro_46c4d6d1.png',
    favicon: '/assets/aistudio/favicon-32_b115d75d.png',
  },

  // Key primary real photos provided in the official package
  heroImage: '/fotos/caminhao-cavalo-1635.jpg',

  // Services documented in materials with specific subpage slugs
  services: [
    {
      id: 'leves',
      slug: 'remocao-veiculos-leves',
      title: 'Remoção de Veículos Leves',
      shortDesc: 'Transporte e remoção de automóveis de passeio e utilitários leves mediante consulta operacional.',
      fullDesc: 'Atendimento voltado à movimentação e transporte de automóveis de passeio e utilitários leves em caminhão plataforma, com foco no cuidado com o veículo durante o embarque e o deslocamento.',
      iconName: 'Car',
      tag: 'Veículos Leves & Utilitários',
      image: '/fotos/guincho-leve-delivery-carregando-veiculo.png',
      isPendingConfirmation: false,
      technicalHighlights: [
        'Transporte em caminhão equipado com plataforma para veículos leves',
        'Atendimento a automóveis de passeio e utilitários sob consulta da equipe',
        'Alinhamento prévio das condições do veículo antes do deslocamento',
        'Orientação direta pelo WhatsApp oficial para verificar disponibilidade',
      ],
      safetyProtocols: [
        'Verificação preliminar das informações de origem, destino e condição do veículo',
        'Cuidado operacional durante o posicionamento e embarque na plataforma',
        'Comunicação direta com o solicitante pelo canal oficial de atendimento',
      ],
    },
    {
      id: 'pesados',
      slug: 'remocao-veiculos-pesados',
      title: 'Remoção de Veículos Pesados',
      shortDesc: 'Estrutura para atendimento a caminhões, cavalos mecânicos e veículos pesados sob consulta.',
      fullDesc: 'Operação voltada ao suporte, deslocamento e remoção de caminhões, cavalos mecânicos e veículos comerciais pesados, mediante avaliação prévia da demanda pela equipe.',
      iconName: 'Truck',
      tag: 'Caminhões & Veículos Pesados',
      image: '/fotos/caminhao-cavalo-1635.jpg',
      isPendingConfirmation: false,
      technicalHighlights: [
        'Presença de cavalo mecânico e caminhão pesado na frota operacional',
        'Avaliação prévia do porte do veículo e das características da demanda',
        'Dimensionamento do equipamento conforme consulta direta com a equipe',
        'Atendimento para deslocamentos e suporte pesado mediante disponibilidade',
      ],
      safetyProtocols: [
        'Análise preliminar das informações do veículo pesado e do local',
        'Alinhamento das condições operacionais antes do envio do equipamento',
        'Acompanhamento do chamado pelo canal oficial da empresa',
      ],
    },
    {
      id: 'solucoes',
      slug: 'solucoes-em-remocao',
      title: 'Soluções em Remoção',
      shortDesc: 'Atendimento sob consulta para demandas específicas de transporte e movimentação veicular.',
      fullDesc: 'Soluções direcionadas a necessidades específicas de remoção e transporte de veículos leves ou pesados, avaliadas individualmente pela equipe conforme origem, destino e tipo de veículo.',
      iconName: 'ShieldAlert',
      tag: 'Atendimento Sob Consulta',
      image: '/fotos/cavalo-mecanico-atron-com-bau.png',
      isPendingConfirmation: false,
      technicalHighlights: [
        'Análise individualizada para demandas particulares ou empresariais',
        'Possibilidade de consulta para deslocamentos programados',
        'Integração de atendimento para veículos leves e pesados em um único canal',
        'Condições operacionais informadas diretamente pela equipe via WhatsApp',
      ],
      safetyProtocols: [
        'Levantamento prévio dos requisitos da operação junto ao solicitante',
        'Definição transparente de disponibilidade e condições antes do atendimento',
        'Suporte direto pelo WhatsApp oficial durante a tratativa',
      ],
    },
    // TODO-CONFIRMAR-CLIENTE: Guarda e Hospedagem de veículos identificada em material antigo,
    // mantida oculta/condicional até validação oficial do responsável antes da divulgação pública.
    {
      id: 'hospedagem',
      slug: 'guarda-e-hospedagem',
      title: 'Guarda e Hospedagem de Veículos',
      shortDesc: 'Espaço para custódia temporária de veículos (pendente de confirmação operacional).',
      fullDesc: 'Serviço sujeito a confirmação de disponibilidade pela empresa.',
      iconName: 'Warehouse',
      tag: 'Sob Consulta',
      isPendingConfirmation: true, // Will not show in public cards unless validated
    },
  ] as (ServiceItem & { slug: string; technicalHighlights?: string[]; safetyProtocols?: string[] })[],

  // Verified fleet assets from real photographs in /fotos/
  fleet: [
    {
      id: 'cavalo-1635',
      title: 'Cavalo Mecânico 1635',
      category: 'Veículos Pesados',
      badge: 'Unidade Pesada',
      description: 'Caminhão cavalo mecânico 1635 com identificação visual da Vapt Vupt Remoção de Veículos, destinado a operações com veículos pesados.',
      image: '/fotos/caminhao-cavalo-1635.jpg',
      features: [
        'Identificação visual oficial Vapt Vupt',
        'Configuração para operações pesadas',
        'Disponibilidade sob consulta com a equipe',
      ],
    },
    {
      id: 'guincho-leve',
      title: 'Guincho Leve Plataforma (Delivery)',
      category: 'Veículos Leves',
      badge: 'Unidade Leve',
      description: 'Caminhão guincho leve equipado com plataforma em operação de carregamento de automóvel.',
      image: '/fotos/guincho-leve-delivery-carregando-veiculo.png',
      features: [
        'Plataforma para embarque de veículos leves',
        'Identificação visual oficial Vapt Vupt',
        'Atendimento mediante consulta pelo WhatsApp',
      ],
    },
    {
      id: 'conjunto-pesado',
      title: 'Cavalo Mecânico Atron com Baú',
      category: 'Transporte & Apoio Pesado',
      badge: 'Unidade Pesada',
      description: 'Caminhão Mercedes-Benz Atron integrante dos registros fotográficos reais da frota da Vapt Vupt.',
      image: '/fotos/cavalo-mecanico-atron-com-bau.png',
      features: [
        'Veículo pesado integrante da estrutura',
        'Identificação visual oficial Vapt Vupt',
        'Condições de operação sob consulta',
      ],
    },
  ] as FleetItem[],

  // Three-step service request process
  steps: [
    {
      number: '01',
      title: 'Entre em contato pelo WhatsApp',
      desc: 'Inicie a conversa pelo nosso canal oficial e fale diretamente com a equipe da Vapt Vupt.',
    },
    {
      number: '02',
      title: 'Informe veículo e necessidade',
      desc: 'Informe o tipo de veículo (leve ou pesado), a situação e a localização de origem e destino.',
    },
    {
      number: '03',
      title: 'Consulte disponibilidade e condições',
      desc: 'A equipe analisa a solicitação e informa a disponibilidade, estimativa e condições para o atendimento.',
    },
  ],

  // TODO-CONFIRMAR-CLIENTE: Registros empresariais mantidos exclusivamente para referência cadastral/fiscal.
  // Endereços cadastrais não devem ser apresentados como locais de visitação pública ou atendimento presencial.
  registrosCadastrais: [
    {
      type: 'MATRIZ',
      city: 'São Paulo',
      state: 'SP',
      cnpj: '03.235.721/0001-79',
      address: 'Rua Padre Adelino, 2074 - Andar 12, Sala 12 A, Conjunto 121 - Quarta Parada',
      cep: '03303-000',
      operationalNotes: 'Registro cadastral e administrativo. Não constitui posto de atendimento presencial ao público.',
      isPublicVisitingAllowed: false,
      status: 'ATIVA',
    },
    {
      type: 'FILIAL',
      city: 'Campinas',
      state: 'SP',
      cnpj: '03.235.721/0003-30',
      address: 'Rua Francisco Ceará Barbosa, 420 - Chácaras Campos dos Amarais',
      cep: '13082-030',
      operationalNotes: 'Registro cadastral de filial. Finalidade de atendimento presencial não confirmada.',
      isPublicVisitingAllowed: false,
      status: 'ATIVA',
    },
    {
      type: 'FILIAL',
      city: 'Jundiaí',
      state: 'SP',
      cnpj: '03.235.721/0004-11',
      address: 'Travessa Egydio Matheo, 105 - Jardim Colônia',
      cep: '13219-810',
      operationalNotes: 'Registro cadastral de filial. Finalidade de atendimento presencial não confirmada.',
      isPublicVisitingAllowed: false,
      status: 'ATIVA',
    },
  ] as UnitRegistration[],

  // Centralized legal & privacy governance data
  privacy: {
    controller: 'Vapt Vupt Remoção de Veículos LTDA.',
    cnpjMatriz: '03.235.721/0001-79',
    dpoChannel: {
      // TODO-CONFIRMAR-EMAIL-PRIVACIDADE: E-mail específico de privacidade pendente de confirmação com a empresa
      email: 'TODO-CONFIRMAR-EMAIL-PRIVACIDADE',
      whatsapp: '(11) 91372-1849',
      address: 'Rua Padre Adelino, 2074 - Andar 12, Conjunto 121, São Paulo - SP, CEP 03303-000 (registro administrativo)',
    },
    lastUpdated: '04 de Novembro de 2026',
  },
};
