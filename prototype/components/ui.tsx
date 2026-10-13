// Small pieces every screen shares: links that look like HeroUI buttons, initials tiles,
// listing-kind tiles, ratings and status dots.

import { buttonVariants, cn } from '@heroui/react';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { KIND_ICON, type ListingKind } from '@/lib/data';
import { Icon } from './icons';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';

/** A Next link styled as a HeroUI Button. Use it for navigation; use <Button> for actions. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  isIconOnly,
  fullWidth,
  className,
  children,
  ...rest
}: Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isIconOnly?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size, isIconOnly, fullWidth }), className)} {...rest}>
      {children}
    </Link>
  );
}

export type TileTone = 'agent' | 'person' | 'warning' | 'selected' | 'neutral';

const TILE_TONE: Record<TileTone, string> = {
  agent: 'bg-accent-soft text-accent-deep',
  person: 'bg-person text-person-foreground',
  warning: 'bg-warning-soft text-warning-soft-foreground',
  selected: 'bg-selected text-accent',
  neutral: 'bg-inset text-ink-2',
};

/**
 * The mono initials tile the design uses for agents (CFO, BIL), people (AM) and decisions.
 * Size it with a className such as `size-10`; agents are rounded squares, people are round.
 */
export function InitialsTile({
  initials,
  tone = 'agent',
  round = tone === 'person',
  className,
}: {
  initials: string;
  tone?: TileTone;
  round?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center font-mono text-[11px] font-semibold',
        round ? 'rounded-full' : 'rounded-xl',
        TILE_TONE[tone],
        className,
      )}
    >
      {initials}
    </span>
  );
}

/**
 * The icon tile for a Marketplace listing or something to sell. Experts are people, so their
 * tile is round and blue-grey; everything built is a cyan rounded square.
 */
export function KindTile({
  kind,
  iconSize = 22,
  className,
}: {
  kind: ListingKind;
  iconSize?: number;
  className?: string;
}) {
  const expert = kind === 'expert';
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center',
        expert ? 'rounded-full bg-person text-person-foreground' : 'rounded-2xl bg-accent-soft text-accent',
        className,
      )}
    >
      <Icon name={KIND_ICON[kind]} size={iconSize} />
    </span>
  );
}

/** Star and score, as on listing cards: "★ 4.8". */
export function Rating({ value, reviews, className }: { value: string; reviews?: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-2', className)}>
      <Icon name="star" size={13} className="text-accent" />
      <span className="font-mono tabular-nums">{value}</span>
      <span className="sr-only">out of 5</span>
      {reviews ? <span className="text-muted">· {reviews} reviews</span> : null}
    </span>
  );
}

/** The small status dot beside "Working" (accent) and "Waiting" (amber). */
export function StateDot({ tone = 'accent', pulse, className }: { tone?: 'accent' | 'warning'; pulse?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-2 shrink-0 rounded-full',
        tone === 'warning' ? 'bg-warning' : 'bg-accent',
        pulse && 'animate-pulse-dot',
        className,
      )}
    />
  );
}

/** Mono, tabular figures for money, times and counts. */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('font-mono tabular-nums', className)}>{children}</span>;
}

/** The amber count pill beside Inbox and Approvals ("3"), with the words for screen readers. */
export function NeedsCount({ count, className }: { count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        'inline-flex h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-full bg-warning px-[7px] text-xs font-bold text-warning-foreground',
        className,
      )}
    >
      {count}
      <span className="sr-only"> need you</span>
    </span>
  );
}
