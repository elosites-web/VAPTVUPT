import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, Truck, ShieldAlert, Car, ArrowLeft } from 'lucide-react';
import { COMPANY_CONFIG } from '../data/companyData';

interface CrumbItem {
  label: string;
  path: string;
  isCurrent: boolean;
  category?: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Do not render breadcrumbs on homepage
  if (pathname === '/') {
    return null;
  }

  // Parse path segments, removing empty strings
  const segments = pathname.split('/').filter(Boolean);

  // Friendly name dictionary for top-level routes
  const routeNameMap: Record<string, string> = {
    empresa: 'A Empresa',
    servicos: 'Serviços Especializados',
    frota: 'Estrutura & Frota',
    'perguntas-frequentes': 'Perguntas Frequentes (FAQ)',
    'trabalhe-conosco': 'Trabalhe Conosco',
    contato: 'Central de Contato',
    'politica-de-privacidade': 'Política de Privacidade',
    'termos-de-uso': 'Termos de Uso',
    '404': 'Página Não Encontrada',
  };

  const crumbs: CrumbItem[] = [
    {
      label: 'Início',
      path: '/',
      isCurrent: segments.length === 0,
    },
  ];

  if (segments.length > 0) {
    const rootSegment = segments[0];

    if (rootSegment === 'servicos') {
      // First level: Serviços
      crumbs.push({
        label: 'Serviços',
        path: '/servicos',
        isCurrent: segments.length === 1,
      });

      // Second level: Service detail (e.g., /servicos/remocao-veiculos-pesados)
      if (segments.length > 1) {
        const serviceSlug = segments[1];
        const matchedService = COMPANY_CONFIG.services.find(
          (s) => s.slug === serviceSlug
        );

        const serviceLabel = matchedService
          ? matchedService.title
          : serviceSlug
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

        crumbs.push({
          label: serviceLabel,
          path: `/servicos/${serviceSlug}`,
          isCurrent: true,
          category: matchedService?.tag || 'Serviço Operacional',
        });
      }
    } else {
      // Other standard routes
      const label = routeNameMap[rootSegment] || rootSegment;
      crumbs.push({
        label,
        path: `/${rootSegment}`,
        isCurrent: true,
      });
    }
  }

  // Build Schema.org BreadcrumbList structured data
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vaptvuptremocao.com.br';
  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${baseUrl}${crumb.path}`,
    })),
  };

  // Determine if this is a deep page (2+ levels) to offer an optional quick back link
  const isDeepPath = segments.length > 1;
  const parentPath = isDeepPath ? `/${segments.slice(0, -1).join('/')}` : '/';

  return (
    <>
      {/* Schema.org Breadcrumbs Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
      />

      {/* Breadcrumb Navigation Bar */}
      <section
        aria-label="Navegação Estrutural"
        className="w-full bg-[#101012] border-b border-neutral-800/80 pt-20 sm:pt-24 pb-3 sm:pb-3.5 relative z-30 select-none shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            
            {/* Breadcrumb Trail */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center overflow-x-auto no-scrollbar py-0.5 text-xs text-neutral-400 min-w-0 flex-1"
            >
              <ol
                itemScope
                itemType="https://schema.org/BreadcrumbList"
                className="flex items-center whitespace-nowrap min-w-0"
              >
                {crumbs.map((crumb, idx) => {
                  const isLast = idx === crumbs.length - 1;
                  return (
                    <li
                      key={crumb.path}
                      itemProp="itemListElement"
                      itemScope
                      itemType="https://schema.org/ListItem"
                      className="inline-flex items-center shrink-0"
                    >
                      {idx > 0 && (
                        <ChevronRight
                          className="w-3.5 h-3.5 text-neutral-600 mx-1.5 sm:mx-2 shrink-0 select-none"
                          aria-hidden="true"
                        />
                      )}

                      <meta itemProp="position" content={String(idx + 1)} />

                      {isLast ? (
                        <span
                          itemProp="name"
                          aria-current="page"
                          className="text-white font-semibold flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-md bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-800"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-[#B43034] shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">{crumb.label}</span>
                        </span>
                      ) : (
                        <Link
                          to={crumb.path}
                          itemProp="item"
                          className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#B43034] rounded px-1 py-0.5"
                        >
                          {idx === 0 && (
                            <Home
                              className="w-3.5 h-3.5 text-neutral-500 hover:text-white transition-colors shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <span itemProp="name">{crumb.label}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* Contextual Shortcut for Deep Paths (desktop/tablet) */}
            {isDeepPath && (
              <div className="hidden sm:flex items-center gap-2 shrink-0 text-xs">
                <Link
                  to={parentPath}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-2.5 py-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#B43034]"
                  title="Voltar ao nível anterior"
                >
                  <ArrowLeft className="w-3 h-3 text-[#B43034]" />
                  <span>Nível anterior</span>
                </Link>

                {crumbs[crumbs.length - 1]?.category && (
                  <span className="hidden md:inline-flex items-center text-[11px] font-semibold text-[#B43034] bg-red-950/40 border border-red-900/30 px-2 py-0.5 rounded">
                    {crumbs[crumbs.length - 1].category}
                  </span>
                )}
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
};
