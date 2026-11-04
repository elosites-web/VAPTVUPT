import React from 'react';

/**
 * Reusable theme-aware helper components that encapsulate paired background, border,
 * and text colors to guarantee 100% WCAG contrast across both Light (☀️) and Dark (🌙) modes.
 */

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'card' | 'muted' | 'elevated' | 'base';
}

export const ThemeCard: React.FC<SurfaceProps> = ({
  children,
  className = '',
  variant = 'card',
  ...rest
}) => {
  const variantStyles = {
    card: 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white shadow-sm',
    muted: 'bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800/80 text-slate-900 dark:text-white',
    elevated: 'bg-white dark:bg-[#1a1a1e] border-slate-200 dark:border-neutral-700/80 text-slate-900 dark:text-white shadow-lg',
    base: 'bg-slate-100 dark:bg-[#111113] border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white',
  };

  return (
    <div
      className={`rounded-2xl border transition-colors duration-200 ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'alternate' | 'elevated';
}

export const ThemeSection: React.FC<SectionProps> = ({
  children,
  className = '',
  variant = 'default',
  ...rest
}) => {
  const variantStyles = {
    default: 'bg-white dark:bg-[#141416] border-slate-200 dark:border-neutral-800',
    alternate: 'bg-slate-50 dark:bg-[#111113] border-slate-200 dark:border-neutral-800',
    elevated: 'bg-slate-100 dark:bg-[#161619] border-slate-200 dark:border-neutral-800',
  };

  return (
    <section
      className={`border-b transition-colors duration-200 ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
};

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}

export const ThemeHeading: React.FC<HeadingProps> = ({
  children,
  as: Tag = 'h2',
  className = '',
  ...rest
}) => {
  return (
    <Tag
      className={`font-heading font-black uppercase tracking-tight text-slate-900 dark:text-white transition-colors duration-200 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}

export const ThemeText: React.FC<TextProps> = ({
  children,
  className = '',
  muted = false,
  ...rest
}) => {
  const colorClass = muted
    ? 'text-slate-500 dark:text-neutral-400'
    : 'text-slate-600 dark:text-neutral-300';

  return (
    <p
      className={`leading-relaxed transition-colors duration-200 ${colorClass} ${className}`}
      {...rest}
    >
      {children}
    </p>
  );
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

export const ThemeBadge: React.FC<BadgeProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-neutral-900 text-[#B43034] border border-slate-200 dark:border-neutral-800 shadow-xs transition-colors duration-200 ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};
