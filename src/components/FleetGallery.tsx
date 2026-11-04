import React, { useState } from 'react';
import { Shield, ZoomIn, X, Check, Truck, Eye } from 'lucide-react';
import { COMPANY_CONFIG, FleetItem } from '../data/companyData';

export const FleetGallery: React.FC = () => {
  const [activeModalItem, setActiveModalItem] = useState<FleetItem | null>(null);

  // Real gallery items derived from verified company assets
  const galleryItems = [
    {
      id: 'cavalo-1635',
      title: 'Cavalo Mecânico 1635',
      category: 'Remoção de Veículos Pesados',
      badge: 'Unidade Pesada',
      description: 'Equipamento robusto para operações rodoviárias e resgate técnico de veículos pesados, com identificação visual oficial.',
      image: '/assets/aistudio/AIRetouch_20261103_160523027_bc27114e.jpg',
      aspect: 'aspect-[4/3]',
      features: ['Tração mecânica pesada', 'Identificação visual padrão', 'Operação especializada'],
    },
    {
      id: 'guincho-leve',
      title: 'Guincho Plataforma Leve',
      category: 'Remoção de Veículos Leves',
      badge: 'Unidade Leve',
      description: 'Caminhão com plataforma basculante de arraste para transporte seguro de automóveis, utilitários e vans sem atrito no solo.',
      image: '/assets/aistudio/img_1_1793732293699_2308579c.jpg',
      aspect: 'aspect-[4/3]',
      features: ['Plataforma basculante', 'Cintas de amarração específicas', 'Içamento suave'],
    },
    {
      id: 'caminhao-pesado-bau',
      title: 'Conjunto Pesado de Transporte',
      category: 'Logística & Transporte',
      badge: 'Alta Capacidade',
      description: 'Estrutura técnica preparada para apoiar transferências de carga e transporte de veículos e composições de grande porte.',
      image: '/assets/aistudio/img_2_1793732339465_917a2240.jpg',
      aspect: 'aspect-[4/3]',
      features: ['Capacidade de grande porte', 'Rigor de segurança rodoviária', 'Estrutura reforçada'],
    },
    {
      id: 'base-operacional',
      title: 'Estrutura & Central de Atendimento',
      category: 'Coordenação Operacional',
      badge: 'Suporte & Despacho',
      description: 'Comunicação direta para alinhamento rápido do chamado e envio do guincho ou equipamento adequado à ocorrência.',
      image: '/assets/aistudio/template-hero_805a6919.jpg',
      aspect: 'aspect-[16/9]',
      features: ['Atendimento centralizado', 'Direcionamento técnico', 'Monitoramento da operação'],
    },
  ];

  return (
    <section id="frota" className="py-20 lg:py-28 bg-[#18181b] relative overflow-hidden border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-6 h-0.5 bg-[#B43034]" />
            <span>Estrutura e Equipamentos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
            FROTA E CAPACIDADE OPERACIONAL
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-300">
            Fotografias reais das unidades e veículos que compõem a operação da Vapt Vupt Remoção de Veículos, garantindo solidez e transparência aos nossos clientes.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => {
            const isWide = item.id === 'base-operacional';
            return (
              <div
                key={item.id}
                className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-[#B43034]/70 transition-all duration-300 group flex flex-col justify-between ${
                  isWide ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                {/* Photo with Overlay */}
                <div className={`relative ${isWide ? 'aspect-[21/9]' : 'aspect-[4/3]'} overflow-hidden bg-neutral-950`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-700/80 text-[11px] font-bold text-neutral-200 uppercase tracking-wider px-3 py-1 rounded">
                    {item.badge}
                  </div>

                  {/* Zoom Action Trigger */}
                  <button
                    type="button"
                    onClick={() => setActiveModalItem(item)}
                    className="absolute bottom-3 right-3 bg-neutral-900/90 hover:bg-[#B43034] text-white p-2.5 rounded-lg border border-neutral-700 transition-colors shadow-lg"
                    aria-label={`Ver detalhes de ${item.title}`}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="text-xs font-semibold text-[#B43034] uppercase tracking-wider mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-neutral-800 flex flex-wrap gap-2">
                    {item.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="inline-flex items-center gap-1.5 bg-neutral-950 text-neutral-400 text-[11px] px-2.5 py-1 rounded border border-neutral-800"
                      >
                        <Check className="w-3 h-3 text-[#B43034]" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Zoom Modal */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalItem(null)}
              className="absolute top-3 right-3 z-10 bg-neutral-950/80 hover:bg-[#B43034] text-white p-2 rounded-full border border-neutral-700 transition-colors"
              aria-label="Fechar ampliação"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[16/10] bg-neutral-950">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Info */}
            <div className="p-6 bg-neutral-900">
              <div className="inline-block bg-red-950/80 text-red-400 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-red-800/60 mb-2">
                {activeModalItem.category}
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
                {activeModalItem.title}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                {activeModalItem.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                <span className="text-xs text-neutral-400">
                  Fotografia real registrada dos equipamentos operacionais da Vapt Vupt.
                </span>
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    `Olá! Gostaria de consultar atendimento com equipamento semelhante a: ${activeModalItem.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-md transition-colors"
                >
                  <span>Consultar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
