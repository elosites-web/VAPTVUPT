import React from 'react';

export const OFFICIAL_LOGO_SYMBOL_SRC = '/logo-simbolo-original.png';
export const OFFICIAL_LOGO_SYMBOL_DARK_SRC = '/vaptvupt-dark.png';
export const OFFICIAL_LOGO_WORDMARK_SRC = '/logo-wordmark-original.png';

export interface BrandLogoHorizontalProps {
  className?: string;
  symbolContainerClassName?: string;
  wordmarkContainerClassName?: string;
  symbolClassName?: string;
  wordmarkClassName?: string;
  symbolContainerRef?: React.Ref<HTMLDivElement>;
  wordmarkContainerRef?: React.Ref<HTMLDivElement>;
  symbolContainerStyle?: React.CSSProperties;
  wordmarkContainerStyle?: React.CSSProperties;
  isDark?: boolean;
}

/**
 * BrandLogoHorizontal
 * Apresentação horizontal oficial da marca Vapt Vupt Remoção de Veículos,
 * composta pelo símbolo de velocidade autêntico (/logo-simbolo-original.png)
 * e o wordmark tipográfico oficial (/logo-wordmark-original.png),
 * preservando suas proporções, alinhamentos e contraste nos modos claro e escuro
 * no Header, Footer e palco final da CinematicHero.
 */
export const BrandLogoHorizontal: React.FC<BrandLogoHorizontalProps> = ({
  className = '',
  symbolContainerClassName = '',
  wordmarkContainerClassName = '',
  symbolClassName = 'h-7 sm:h-8 landscape:h-6.5 lg:h-8.5 xl:h-9 w-auto object-contain shrink-0',
  wordmarkClassName = 'h-5 sm:h-6 landscape:h-4.5 lg:h-6 xl:h-6.5 w-auto object-contain shrink-0',
  symbolContainerRef,
  wordmarkContainerRef,
  symbolContainerStyle,
  wordmarkContainerStyle,
  isDark = false,
}) => {
  const symbolImg = (
    <img
      src={isDark ? OFFICIAL_LOGO_SYMBOL_DARK_SRC : OFFICIAL_LOGO_SYMBOL_SRC}
      alt="Símbolo Vapt Vupt"
      width={1000}
      height={433}
      className={`${symbolClassName} max-w-none ${isDark ? 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]' : 'drop-shadow-xs'}`}
      draggable={false}
    />
  );

  const wordmarkImg = (
    <img
      src={OFFICIAL_LOGO_WORDMARK_SRC}
      alt="Vapt Vupt"
      width={520}
      height={216}
      className={`${wordmarkClassName} max-w-none ${
        isDark
          ? 'brightness-0 invert drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
          : 'drop-shadow-xs'
      }`}
      draggable={false}
    />
  );

  const hasSymbolWrapper = Boolean(symbolContainerRef || symbolContainerClassName || symbolContainerStyle);
  const hasWordmarkWrapper = Boolean(
    wordmarkContainerRef || wordmarkContainerClassName || wordmarkContainerStyle
  );

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none whitespace-nowrap shrink-0 transition-opacity duration-200 ${className}`}
      role="img"
      aria-label="Vapt Vupt Remoção de Veículos"
    >
      {hasSymbolWrapper ? (
        <div
          ref={symbolContainerRef}
          className={`shrink-0 ${symbolContainerClassName}`.trim()}
          style={symbolContainerStyle}
        >
          {symbolImg}
        </div>
      ) : (
        symbolImg
      )}

      {hasWordmarkWrapper ? (
        <div
          ref={wordmarkContainerRef}
          className={`shrink-0 ${wordmarkContainerClassName}`.trim()}
          style={wordmarkContainerStyle}
        >
          {wordmarkImg}
        </div>
      ) : (
        wordmarkImg
      )}
    </div>
  );
};

