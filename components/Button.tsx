import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'quiet';
type Size = 'md' | 'sm';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium tracking-snug ' +
  'transition-[background-color,border-color,color,transform] duration-150 ease-out active:translate-y-px ' +
  'disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none';

const variants: Record<Variant, string> = {
  primary: 'bg-signal text-paper hover:bg-signal-strong',
  secondary: 'border border-rule-strong bg-paper text-ink hover:border-ink hover:bg-mist',
  quiet: 'text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink',
};

const sizes: Record<Size, string> = {
  md: 'h-12 px-5 text-base',
  sm: 'h-10 px-3 text-sm',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  const s = variant === 'quiet' ? 'h-12 text-base' : sizes[size];
  return [base, variants[variant], s, extra].filter(Boolean).join(' ');
}

type LinkProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Where the CTA sits, for conversion analytics (header, hero, footer...). */
  track?: string;
  children: ReactNode;
};

export function ButtonLink({ variant = 'primary', size = 'md', className = '', track, children, ...rest }: LinkProps) {
  // Only the primary action prefetches, so booking opens instantly without loading every page up front.
  return (
    <Link prefetch={variant === 'primary' ? undefined : false} {...rest} className={buttonClass(variant, size, className)} data-track={track}>
      {children}
    </Link>
  );
}
