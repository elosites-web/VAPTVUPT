import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

/**
 * Skeleton Primitive
 * Componente simples e acessível de Skeleton Loader para reservar espaço
 * de conteúdo durante carregamento dinâmico, prevenindo saltos de layout (CLS).
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  width,
  height,
  animate = true,
}) => {
  const variantClasses = {
    text: 'rounded h-4 my-1',
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  }[variant];

  const style: React.CSSProperties = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      role="status"
      aria-label="Carregando conteúdo..."
      className={`bg-neutral-200/80 dark:bg-neutral-800/80 ${
        animate ? 'animate-pulse' : ''
      } ${variantClasses} ${className}`}
      style={style}
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

/**
 * FleetCardSkeleton
 * Skeleton estrutural correspondente aos cards de frota e veículos da Vapt Vupt.
 */
export const FleetCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-[#1c1c1f]/70 overflow-hidden p-4 shadow-sm space-y-4 ${className}`}
      role="status"
      aria-label="Carregando card de frota..."
    >
      {/* Imagem do veículo */}
      <Skeleton variant="rounded" className="w-full h-48 sm:h-56" />

      {/* Tag de categoria e título */}
      <div className="space-y-2 pt-1">
        <Skeleton variant="rounded" className="w-24 h-5 rounded-full" />
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-5/6 h-4" />
      </div>

      {/* Botões de ação */}
      <div className="pt-2 flex items-center gap-2">
        <Skeleton variant="rounded" className="h-10 flex-1 rounded-lg" />
        <Skeleton variant="rounded" className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
};

/**
 * ContactCardSkeleton
 * Skeleton estrutural correspondente aos blocos de contato e canais de atendimento.
 */
export const ContactCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-[#1a1a1c]/70 flex items-start gap-4 ${className}`}
      role="status"
      aria-label="Carregando canal de contato..."
    >
      <Skeleton variant="rounded" className="w-12 h-12 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="w-32 h-4" />
        <Skeleton variant="text" className="w-48 h-5" />
        <Skeleton variant="text" className="w-40 h-3.5" />
      </div>
    </div>
  );
};
