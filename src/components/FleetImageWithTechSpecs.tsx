import React, { useState } from 'react';
import { SlidersHorizontal, Scale, Truck, Settings2, ZoomIn, X } from 'lucide-react';
import { FleetItem, COMPANY_CONFIG } from '../data/companyData';
import { WhatsAppIcon } from './WhatsAppIcon';

export const FleetImageWithTechSpecs: React.FC<{
  item: FleetItem;
  onOpenZoom?: (item: FleetItem) => void;
  aspectRatioClass?: string;
}> = ({ item, onOpenZoom, aspectRatioClass = 'aspect-[16/10] sm:aspect-[4/3]' }) => {
  const [touchOpen, setTouchOpen] = useState(false);

  return (
    <div
      className={`relative ${aspectRatioClass} overflow-hidden bg-white dark:bg-neutral-950 flex items-center justify-center group/truck select-none cursor-pointer`}
      onMouseLeave={() => setTouchOpen(false)}
      tabIndex={0}
      role="region"
      aria-label={`Fotografia e especificações técnicas de ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setTouchOpen((prev) => !prev);
        } else if (e.key === 'Escape') {
          setTouchOpen(false);
        }
      }}
    >
      {/* Truck Photo */}
      <img
        src={item.image}
        srcSet={`${item.image} 480w, ${item.image} 800w, ${item.image} 1200w`}
        sizes="(max-width: 768px) 100vw, 33vw"
        loading="lazy"
        decoding="async"
        alt={item.title}
        className={`w-full h-full transition-transform duration-500 group-hover/truck:scale-105 ${
          item.id === 'cavalo-1635'
            ? 'object-cover object-[center_28%]'
            : 'object-contain p-3 sm:p-4 bg-white'
        }`}
      />

      {/* Subtle bottom shadow gradient on cavalo-1635 */}
      {item.id === 'cavalo-1635' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Badge Top Left */}
      <div className="absolute top-3 left-3 bg-slate-900/90 dark:bg-neutral-900/90 text-[11px] font-bold uppercase tracking-wider text-[#B43034] px-2.5 py-1 rounded border border-slate-700 dark:border-neutral-800 shadow-sm z-10 pointer-events-none">
        {item.badge}
      </div>

      {/* Idle Prompt Pill (Bottom Left) - indicates hoverable specs */}
      <div
        className={`absolute bottom-3 left-3 z-10 transition-all duration-300 pointer-events-none ${
          touchOpen ? 'opacity-0' : 'group-hover/truck:opacity-0'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-xs text-white text-[10.5px] font-semibold border border-slate-700/80 shadow-md">
          <SlidersHorizontal className="w-3 h-3 text-[#B43034]" />
          <span>Ficha Técnica (Hover)</span>
        </span>
      </div>

      {/* Quick Mobile Touch Toggle Button (Top Right) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setTouchOpen((prev) => !prev);
        }}
        className="sm:hidden absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-neutral-900/90 text-white border border-neutral-700 shadow"
        aria-label={touchOpen ? 'Ocultar ficha técnica' : 'Ver ficha técnica'}
        title="Ficha Técnica"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#B43034]" />
      </button>

      {/* Zoom Button if supported (Bottom Right) */}
      {onOpenZoom && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenZoom(item);
          }}
          className={`absolute bottom-3 right-3 z-10 bg-neutral-900/90 hover:bg-[#B43034] text-white p-2 rounded-lg border border-neutral-700 transition-colors shadow-lg ${
            touchOpen ? 'opacity-0 pointer-events-none' : 'group-hover/truck:opacity-0 sm:group-hover/truck:opacity-100'
          }`}
          aria-label={`Ampliar fotografia de ${item.title}`}
          title="Ampliar fotografia"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      )}

      {/* Interactive Hover HUD: Technical Specifications Overlay */}
      <div
        className={`absolute inset-0 z-20 bg-neutral-950/95 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ease-out border-b-2 border-[#B43034] ${
          touchOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none translate-y-2 group-hover/truck:opacity-100 group-hover/truck:pointer-events-auto group-hover/truck:translate-y-0 group-focus-within/truck:opacity-100 group-focus-within/truck:pointer-events-auto group-focus-within/truck:translate-y-0'
        }`}
        data-testid="fleet-tech-specs-overlay"
      >
        {/* Header inside overlay */}
        <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-1.5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#B43034] text-[10px] font-extrabold uppercase tracking-widest font-heading">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Ficha Técnica Operacional</span>
            </div>
            <h4
              style={{ color: '#ffffff' }}
              className="text-sm sm:text-base font-extrabold uppercase tracking-tight font-heading leading-tight truncate"
            >
              {item.title}
            </h4>
          </div>

          {/* Close button for touch */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTouchOpen(false);
            }}
            className="sm:hidden text-neutral-400 hover:text-white p-1"
            aria-label="Fechar ficha técnica"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Specs List */}
        <div className="py-1 space-y-1 text-xs">
          {/* Capacity */}
          <div className="flex items-start gap-2 bg-neutral-900/95 p-1.5 rounded border border-neutral-800/80">
            <Scale className="w-3.5 h-3.5 text-[#B43034] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="block text-[9px] uppercase font-bold text-neutral-400">Capacidade de Carga / PBT</span>
              <span style={{ color: '#ffffff' }} className="font-semibold text-[11px] leading-tight block">
                {item.techSpecs.capacity.replace(/^Capacidade[^:]*:\s*/i, '')}
              </span>
            </div>
          </div>

          {/* Mechanism / Crane */}
          <div className="flex items-start gap-2 bg-neutral-900/95 p-1.5 rounded border border-neutral-800/80">
            <Truck className="w-3.5 h-3.5 text-[#B43034] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="block text-[9px] uppercase font-bold text-neutral-400">Tipo de Implemento / Lança</span>
              <span style={{ color: '#ffffff' }} className="font-semibold text-[11px] leading-tight block">
                {item.techSpecs.craneOrMechanism.replace(/^(Mecanismo|Implemento)[^:]*:\s*/i, '')}
              </span>
            </div>
          </div>

          {/* Traction / Reach */}
          <div className="flex items-start gap-2 bg-neutral-900/95 p-1.5 rounded border border-neutral-800/80">
            <Settings2 className="w-3.5 h-3.5 text-[#B43034] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="block text-[9px] uppercase font-bold text-neutral-400">Tração & Configuração</span>
              <span style={{ color: '#ffffff' }} className="font-semibold text-[11px] leading-tight block">
                {item.techSpecs.traction.replace(/^Configuração de Tração:\s*/i, '')}
              </span>
            </div>
          </div>
        </div>

        {/* Actions row inside overlay */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
          {onOpenZoom ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenZoom(item);
              }}
              className="inline-flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white font-medium transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#B43034]" />
              <span>Ampliar Foto</span>
            </button>
          ) : (
            <span className="text-[10px] text-neutral-400">Registro Fotográfico Real</span>
          )}

          <a
            href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
              `Olá! Gostaria de consultar atendimento com o veículo ${item.title}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#B43034] hover:bg-[#8F2428] text-white text-[10.5px] font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            <WhatsAppIcon className="w-3 h-3" />
            <span>Consultar</span>
          </a>
        </div>
      </div>
    </div>
  );
};
