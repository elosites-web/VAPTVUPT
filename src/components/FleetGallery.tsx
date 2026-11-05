import React, { useState, useEffect } from 'react';
import { ZoomIn, X, Check } from 'lucide-react';
import { COMPANY_CONFIG, FleetItem } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';
import { RevealSection } from './RevealSection';

export const FleetGallery: React.FC = () => {
  const [activeModalItem, setActiveModalItem] = useState<FleetItem | null>(null);

  useEffect(() => {
    if (!activeModalItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem]);

  return (
    <RevealSection
      id="frota"
      className="py-20 lg:py-28 bg-slate-50 dark:bg-[#18181b] relative overflow-hidden border-t border-slate-200 dark:border-neutral-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-6 h-0.5 bg-[#B43034]" />
            <span>Estrutura e Equipamentos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase leading-tight">
            FROTA E CAPACIDADE OPERACIONAL
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-neutral-300">
            Fotografias reais dos veículos que compõem a estrutura da Vapt Vupt Remoção de Veículos.
          </p>
        </div>

        {/* Gallery Grid (Only verified real photos from COMPANY_CONFIG.fleet) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMPANY_CONFIG.fleet.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:border-[#B43034]/70 transition-all duration-300 group flex flex-col justify-between shadow-sm"
            >
              {/* Photo with Overlay */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-neutral-950 flex items-center justify-center">
                <img
                  src={item.image}
                  srcSet={`${item.image} 480w, ${item.image} 800w, ${item.image} 1200w`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt={item.title}
                  className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                    item.id === 'cavalo-1635'
                      ? 'object-cover object-[center_28%]'
                      : 'object-contain p-3 sm:p-4 bg-white'
                  }`}
                  loading="lazy"
                  decoding="async"
                />
                {item.id === 'cavalo-1635' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />
                )}

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-sm border border-neutral-700/80 text-[11px] font-bold text-neutral-100 uppercase tracking-wider px-3 py-1 rounded shadow-sm">
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
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#B43034] uppercase tracking-wider mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 flex flex-wrap gap-2">
                  {item.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-neutral-950 text-slate-700 dark:text-neutral-400 text-[11px] px-2.5 py-1 rounded border border-slate-200 dark:border-neutral-800"
                    >
                      <Check className="w-3 h-3 text-[#B43034]" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografia ampliada: ${activeModalItem.title}`}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
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
            <div className="relative p-2 sm:p-4 bg-neutral-950 flex items-center justify-center min-h-[240px] sm:min-h-[360px] max-h-[70vh]">
              <img
                src={activeModalItem.image}
                srcSet={`${activeModalItem.image} 480w, ${activeModalItem.image} 800w, ${activeModalItem.image} 1200w`}
                sizes="(max-width: 1024px) 95vw, 768px"
                loading="lazy"
                decoding="async"
                alt={activeModalItem.title}
                className={`max-h-[65vh] w-auto max-w-full object-contain rounded-lg ${
                  activeModalItem.id !== 'cavalo-1635' ? 'bg-white p-2.5 sm:p-4 shadow-inner' : ''
                }`}
              />
            </div>

            {/* Modal Info */}
            <div className="p-6 bg-white dark:bg-neutral-900">
              <div className="inline-block bg-red-100 dark:bg-red-950/80 text-[#B43034] dark:text-red-400 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-red-200 dark:border-red-800/60 mb-2">
                {activeModalItem.category}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-2">
                {activeModalItem.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed mb-4">
                {activeModalItem.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-neutral-800">
                <span className="text-xs text-slate-500 dark:text-neutral-400">
                  Fotografia real registrada da frota da Vapt Vupt.
                </span>
                <a
                  href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                    `Olá! Gostaria de consultar atendimento com equipamento semelhante a: ${activeModalItem.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-md transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Consultar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </RevealSection>
  );
};
