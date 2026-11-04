import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, X, ChevronRight } from 'lucide-react';
import { COMPANY_CONFIG, FleetItem } from '../data/companyData';
import { FleetViewer3D } from '../components/FleetViewer3D';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

export const FleetPage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<FleetItem | null>(null);

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <>
      <SEOHead
        title="Estrutura e Frota Operacional"
        description="Conheça a frota da Vapt Vupt Remoção de Veículos. Fotografias reais de guincho leve, cavalo mecânico 1635 e demonstração conceitual 3D."
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Infraestrutura e Equipamentos</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight font-heading">
              Estrutura & Frota Operacional
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
              Fotografias reais dos veículos da Vapt Vupt destinados ao atendimento de ocorrências de remoção e transporte de veículos leves e pesados.
            </p>
          </div>
        </div>
      </section>

      {/* Real Photos Fleet Section */}
      <section className="py-16 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase font-heading">
              Veículos da Frota (Fotografias Reais)
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
              Registros autênticos das unidades identificadas da empresa. Clique em qualquer imagem para ampliar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COMPANY_CONFIG.fleet.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden flex flex-col group hover:border-red-400/50 dark:hover:border-neutral-700 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                {/* Photo with hover button */}
                <div
                  className="relative h-64 overflow-hidden bg-slate-100 dark:bg-neutral-950 cursor-pointer flex items-center justify-center"
                  onClick={() => setSelectedPhoto(item)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold border border-slate-700 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-[#B43034]" />
                      <span>Ampliar Fotografia</span>
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 bg-slate-900/90 dark:bg-neutral-900/90 text-[11px] font-bold uppercase tracking-wider text-[#B43034] px-2.5 py-1 rounded border border-slate-700 dark:border-neutral-800">
                    {item.badge}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-neutral-500 uppercase tracking-wider mb-1">
                      {item.category}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">{item.title}</h3>
                    <p className="text-slate-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="space-y-2 border-t border-slate-200 dark:border-neutral-800 pt-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-400">
                        Destaques:
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-neutral-400">
                        {item.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#B43034] mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(item)}
                      className="text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B43034]" />
                      <span>Ver Foto Completa</span>
                    </button>

                    <a
                      href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                        `Olá! Gostaria de consultar atendimento com o veículo ${item.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B43034] hover:text-red-700 dark:hover:text-red-400 uppercase tracking-wider font-heading"
                    >
                      <span>Consultar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Conceptual Simulation Section */}
      <section className="bg-[#141416]">
        <FleetViewer3D />
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografia ampliada: ${selectedPhoto.title}`}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedPhoto.title}</h3>
                <span className="text-xs text-[#B43034] font-semibold">{selectedPhoto.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-neutral-800 transition-colors"
                aria-label="Fechar ampliação"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 bg-neutral-950 flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <p className="text-slate-600 dark:text-neutral-300 max-w-xl">{selectedPhoto.description}</p>
              <a
                href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                  `Olá! Gostaria de consultar atendimento com ${selectedPhoto.title}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#B43034] hover:bg-[#8F2428] text-white font-bold uppercase tracking-wider shrink-0"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Solicitar via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
