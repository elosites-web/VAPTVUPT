/**
 * Vapt Vupt Remoção de Veículos
 * Centralized business data and configuration
 * 
 * NOTE: Strict compliance with briefing instructions:
 * - Do NOT invent statistics (years, fleet counts, staff count, clients count).
 * - Do NOT promise 24h service, immediate arrival, or unverified cities.
 * - Registrations marked with TODO-CONFIRMAR-CLIENTE are kept internal/editable.
 */

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: 'Car' | 'Truck' | 'ShieldAlert' | 'Warehouse';
  tag: string;
  image?: string;
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
    careersMessage: 'Olá! Tenho interesse em oportunidades profissionais na Vapt Vupt e gostaria de enviar minhas informações.',
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
  heroImage: '/assets/aistudio/AIRetouch_20261103_160523027_bc27114e.jpg', // Real photo of 1635 mechanical tractor
  templateHeroImage: '/assets/aistudio/template-hero_805a6919.jpg',
  
  // Services documented in materials
  services: [
    {
      id: 'leves',
      title: 'Remoção de Veículos Leves',
      shortDesc: 'Transporte e remoção técnica de automóveis, utilitários e veículos leves com segurança e zelo.',
      fullDesc: 'Equipamentos apropriados para a movimentação e transporte de automóveis de passeio, veículos comerciais leves e utilitários, garantindo preservação integral do veículo durante o procedimento de içamento e transporte em plataforma.',
      iconName: 'Car',
      tag: 'Veículos Leves & Utilitários',
      image: '/assets/aistudio/img_1_1793732293699_2308579c.jpg',
      isPendingConfirmation: false,
    },
    {
      id: 'pesados',
      title: 'Remoção de Veículos Pesados',
      shortDesc: 'Capacidade técnica e estrutura dedicada para caminhões, cavalos mecânicos e transporte pesado.',
      fullDesc: 'Operação especializada com cavalos mecânicos e guinchos de alta capacidade para remoção, destombamento ou transferência de veículos comerciais pesados, caminhões e conjuntos com rigor operacional.',
      iconName: 'Truck',
      tag: 'Caminhões & Veículos Pesados',
      image: '/assets/aistudio/AIRetouch_20261103_160523027_bc27114e.jpg',
      isPendingConfirmation: false,
    },
    {
      id: 'solucoes',
      title: 'Soluções em Remoção',
      shortDesc: 'Atendimento técnico sob medida para demandas logísticas, imprevistos mecânicos e frotas.',
      fullDesc: 'Abordagem estruturada para atender ocorrências operacionais, transferência veicular programada e demandas corporativas com suporte dedicado e equipamentos compatíveis com a complexidade da carga.',
      iconName: 'ShieldAlert',
      tag: 'Operação Especializada',
      image: '/assets/aistudio/img_2_1793732339465_917a2240.jpg',
      isPendingConfirmation: false,
    },
    // TODO-CONFIRMAR-CLIENTE: Guarda e Hospedagem de veículos identificada em material antigo,
    // mantida oculta/condicional até validação oficial do responsável antes da divulgação pública.
    {
      id: 'hospedagem',
      title: 'Guarda e Hospedagem de Veículos',
      shortDesc: 'Espaço operacional seguro para custódia temporária de veículos removidos.',
      fullDesc: 'Estrutura destinada à acomodação e guarda segura de veículos sob remoção.',
      iconName: 'Warehouse',
      tag: 'Sob Consulta',
      image: '/assets/aistudio/Screenshot_20261103-100626_WhatsAppBusiness_1477b8ed.jpg',
      isPendingConfirmation: true, // Will not show in public cards unless validated
    },
  ] as ServiceItem[],

  // Verified fleet assets from photographs
  fleet: [
    {
      id: 'cavalo-1635',
      title: 'Cavalo Mecânico 1635',
      category: 'Remoção Pesada',
      badge: 'Estrutura Operacional',
      description: 'Equipamento robusto preparado para operações de tração, resgate técnico e transporte de veículos pesados.',
      image: '/assets/aistudio/AIRetouch_20261103_160523027_bc27114e.jpg',
      features: ['Identificação visual padrão', 'Chassi reforçado', 'Capacidade para veículos de grande porte'],
    },
    {
      id: 'guincho-leve',
      title: 'Plataforma para Veículos Leves',
      category: 'Remoção Leve',
      badge: 'Transporte Seguro',
      description: 'Caminhão com plataforma hidráulica basculante e guincho de arraste para movimentação suave de automóveis.',
      image: '/assets/aistudio/img_1_1793732293699_2308579c.jpg',
      features: ['Plataforma hidráulica basculante', 'Cintas de amarração específicas', 'Carregamento sem danos ao veículo'],
    },
    {
      id: 'conjunto-pesado',
      title: 'Caminhão Pesado de Operações',
      category: 'Logística de Transporte',
      badge: 'Alta Capacidade',
      description: 'Unidade desenvolvida para o transporte seguro e remoção de cargas pesadas com equipe treinada.',
      image: '/assets/aistudio/img_2_1793732339465_917a2240.jpg',
      features: ['Suporte a trajetos rodoviários', 'Estrutura reforçada', 'Operação técnica'],
    },
  ] as FleetItem[],

  // Three-step service request process
  steps: [
    {
      number: '01',
      title: 'Entre em contato pelo WhatsApp',
      desc: 'Inicie a conversa com nosso canal oficial e fale diretamente com nossa equipe.',
    },
    {
      number: '02',
      title: 'Informe veículo e necessidade',
      desc: 'Compartilhe o modelo do automóvel ou caminhão, a situação e o ponto de origem/destino.',
    },
    {
      number: '03',
      title: 'Consulte disponibilidade e condições',
      desc: 'Nossa equipe informa as condições operacionais, prazos estimados e detalhes para o atendimento.',
    },
  ],

  // TODO-CONFIRMAR-CLIENTE: Registros empresariais mantidos para governança institucional.
  // Regra do briefing: "Não coloque automaticamente todos esses endereços no rodapé.
  // Não crie um mapa com os endereços sem confirmação. Não prometa atendimento presencial."
  registrosCadastrais: [
    {
      type: 'MATRIZ',
      city: 'São Paulo',
      state: 'SP',
      cnpj: '03.235.721/0001-79',
      address: 'Rua Padre Adelino, 2074 - Andar 12, Sala 12 A, Conjunto 121 - Quarta Parada',
      cep: '03303-000',
      operationalNotes: 'Sede administrativa registrada.',
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
      operationalNotes: 'Estrutura com identificação visual "Referência em remoção de veículos" na fachada. Finalidade de atendimento pendente de confirmação com cliente.',
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
      operationalNotes: 'Registro cadastral de filial.',
      isPublicVisitingAllowed: false,
      status: 'ATIVA',
    },
  ] as UnitRegistration[],
};
