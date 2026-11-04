import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, HelpCircle, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { FAQ_CATEGORIES, FAQ_ITEMS, FAQItem } from '../data/faqData';
import { COMPANY_CONFIG } from '../data/companyData';
import { SEOHead } from '../components/SEOHead';
import { WhatsAppIcon } from '../components/WhatsAppIcon';

export const FAQPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openItemId, setOpenItemId] = useState<string | null>('como-solicitar');

  const toggleItem = (id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'todas' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Inject FAQPage Schema.org JSON-LD
  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    let scriptTag = document.getElementById('faq-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'faq-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(faqSchema);

    return () => {
      const tag = document.getElementById('faq-jsonld');
      if (tag) tag.remove();
    };
  }, []);

  return (
    <>
      <SEOHead
        title="Perguntas Frequentes (FAQ)"
        description="Tire suas dúvidas sobre guincho, remoção de veículos leves e pesados, prazos, formas de pagamento e segurança na Vapt Vupt."
      />

      {/* Header Banner */}
      <section className="pt-8 sm:pt-10 pb-12 sm:pb-14 bg-slate-100 dark:bg-[#111113] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-[#B43034]" />
              <span>Central de Dúvidas</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight font-heading">
              Perguntas Frequentes (FAQ)
            </h1>
            <p className="mt-3 text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
              Esclarecimentos transparentes sobre nossos procedimentos operacionais, tipos de veículos atendidos, formas de pagamento e prazos.
            </p>
          </div>
        </div>
      </section>

      {/* Main FAQ Section */}
      <section className="py-16 bg-white dark:bg-[#141416] border-b border-slate-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite sua dúvida (ex: atendimento, veículos leves, pesados, orçamento)..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#B43034] focus:border-transparent transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategory('todas')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 transition-colors font-heading ${
                selectedCategory === 'todas'
                  ? 'bg-[#B43034] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-neutral-800'
              }`}
            >
              Todas ({FAQ_ITEMS.length})
            </button>
            {FAQ_CATEGORIES.map((cat) => {
              const count = FAQ_ITEMS.filter((i) => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0 transition-colors font-heading ${
                    selectedCategory === cat.id
                      ? 'bg-[#B43034] text-white shadow-md'
                      : 'bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-neutral-800'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Accordion Items List */}
          {filteredItems.length > 0 ? (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const isOpen = openItemId === item.id;
                const categoryObj = FAQ_CATEGORIES.find((c) => c.id === item.category);

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border overflow-hidden transition-all duration-200 shadow-sm ${
                      isOpen
                        ? 'bg-white dark:bg-neutral-900 border-[#B43034]/40 dark:border-red-900/40 ring-1 ring-[#B43034]/15 dark:ring-red-900/20 shadow-md'
                        : 'bg-slate-50 dark:bg-neutral-900/80 border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <button
                      id={`faq-question-${item.id}`}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-5 text-left flex items-start justify-between gap-4 transition-colors hover:bg-slate-100/60 dark:hover:bg-neutral-800/50 active:bg-slate-200/50 dark:active:bg-neutral-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B43034] focus-visible:ring-inset"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                    >
                      <div className="space-y-1">
                        {categoryObj && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#B43034] font-semibold">
                            {categoryObj.name}
                          </span>
                        )}
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug font-heading transition-colors">
                          {item.question}
                        </h3>
                      </div>
                      <div
                        className={`p-1.5 rounded-full transition-transform duration-200 shrink-0 mt-1 ${
                          isOpen 
                            ? 'rotate-180 bg-[#B43034] text-white shadow-sm' 
                            : 'bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${item.id}`}
                      className={`faq-accordion-grid ${isOpen ? 'open' : ''}`}
                    >
                      <div className="faq-accordion-inner">
                        <div className="faq-answer-panel px-5 pb-5 pt-3.5 text-sm text-slate-700 dark:text-neutral-200 leading-relaxed border-t border-slate-200/80 dark:border-neutral-800/80 bg-slate-50/60 dark:bg-neutral-950/40">
                          <p className="max-w-3xl">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-3 shadow-sm">
              <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto" />
              <h4 className="text-slate-900 dark:text-white font-bold text-base font-heading">Nenhuma pergunta encontrada para sua busca</h4>
              <p className="text-xs text-slate-600 dark:text-neutral-400">
                Tente buscar com outros termos ou fale diretamente com nossa equipe no WhatsApp para tirar dúvidas específicas.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('todas');
                }}
                className="text-xs font-semibold text-[#B43034] hover:underline"
              >
                Limpar filtros de busca
              </button>
            </div>
          )}

          {/* Direct Support WhatsApp Box */}
          <div className="mt-12 p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-[#B43034] text-xs font-bold uppercase tracking-wider font-heading">
                <Phone className="w-3.5 h-3.5" />
                <span>Dúvida específica não listada?</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                Fale Diretamente com Nosso Suporte Operacional
              </h3>
              <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-md">
                Nossa equipe esclarece condições de rotas, cotações para frotistas e dúvidas técnicas em tempo real via WhatsApp.
              </p>
            </div>

            <a
              href={`${COMPANY_CONFIG.whatsapp.link}?text=${encodeURIComponent(
                'Olá! Tenho uma dúvida sobre os serviços de remoção de veículos e gostaria de conversar com a equipe.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-cta-button button-3d inline-flex items-center gap-2 bg-[#B43034] hover:bg-[#8F2428] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded shadow-lg transition-colors shrink-0 font-heading"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>CHAMAR NO WHATSAPP</span>
            </a>
          </div>

        </div>
      </section>
    </>
  );
};
