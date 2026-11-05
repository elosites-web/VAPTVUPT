import React from 'react';

export interface BrandLogoHorizontalProps {
  className?: string;
  symbolClassName?: string;
  wordmarkClassName?: string;
  isDark?: boolean;
}

/**
 * BrandLogoHorizontal
 * Apresentação horizontal oficial da marca Vapt Vupt Remoção de Veículos,
 * composta pelo símbolo de velocidade autêntico (/logo-simbolo-original.png)
 * e o wordmark tipográfico oficial (/logo-wordmark-original.png),
 * preservando suas proporções, alinhamentos e contraste nos modos claro e escuro.
 */
export const BrandLogoHorizontal: React.FC<BrandLogoHorizontalProps> = ({
  className = '',
  symbolClassName = 'h-7 sm:h-8 landscape:h-6.5 lg:h-8.5 xl:h-9 w-auto object-contain shrink-0',
  wordmarkClassName = 'h-5 sm:h-6 landscape:h-4.5 lg:h-6 xl:h-6.5 w-auto object-contain shrink-0',
  isDark = false,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none transition-opacity duration-200 ${className}`}
      role="img"
      aria-label="Vapt Vupt Remoção de Veículos"
    >
      <img
        src="/logo-simbolo-original.png"
        alt="Símbolo Vapt Vupt"
        className={`${symbolClassName} ${isDark ? 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]' : 'drop-shadow-xs'}`}
        draggable={false}
      />
      <img
        src="/logo-wordmark-original.png"
        alt="Vapt Vupt"
        className={`${wordmarkClassName} ${isDark ? 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]' : 'drop-shadow-xs'}`}
        draggable={false}
      />
    </div>
  );
};
