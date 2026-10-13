// Pieces the three phone Marketplace screens share: the uppercase section label, the check rows
// (Chief of Staff's checks, the seller promises), tiles sized for these boards and the screen-only
// helpers for listing names and tiles.

import { cn } from '@heroui/react';
import type { ReactNode } from 'react';
import { Icon } from '@/components/icons';
import { KindTile } from '@/components/ui';
import { KIND_LABEL, type Listing, type ListingKind } from '@/lib/data';

/** Scroll areas on the phone boards scroll without a visible bar. */
export const SCROLL_Y = 'overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

/**
 * For a HeroUI Radio.Content drawn as a card: React Aria keeps the real radio input in a clipped
 * 1px wrapper. Spread the wrapper and the input, transparent, over the whole card, so a tap
 * anywhere on the card lands on the input itself. Focus and selection styles stay on the card.
 */
export const RADIO_CARD_HIT = [
  '[&>span:has(>input)]:inset-0! [&>span:has(>input)]:z-[1] [&>span:has(>input)]:m-0! [&>span:has(>input)]:size-full!',
  '[&>span:has(>input)]:[clip:auto]! [&>span:has(>input)]:[clip-path:none]!',
  '[&>span>input]:m-0 [&>span>input]:size-full [&>span>input]:cursor-pointer [&>span>input]:opacity-0',
].join(' ');

/** "WHAT IT DOES", "IT WILL ASK FOR", "CHOOSE A PLAN". */
export function SectionLabel({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="m-0 text-[12px] font-bold tracking-[0.08em] text-muted uppercase">
      {children}
    </h2>
  );
}

/** A listing or sellable tile at any size. Built things are cyan rounded squares; experts are round. */
export function Tile({
  kind,
  size,
  radius,
  iconSize,
  icon,
}: {
  kind: ListingKind;
  /** Tailwind size class, e.g. `size-12`. */
  size: string;
  /** Tailwind radius class for built things, e.g. `rounded-[15px]`. Experts stay round. */
  radius: string;
  iconSize: number;
  /** Show the tag icon instead of the kind icon (the Sell preview). */
  icon?: 'tag';
}) {
  const expert = kind === 'expert';
  if (icon) {
    return (
      <span
        aria-hidden
        className={cn(
          'inline-flex shrink-0 items-center justify-center',
          size,
          expert ? 'rounded-full bg-person text-person-foreground' : cn(radius, 'bg-accent-soft text-accent'),
        )}
      >
        <Icon name="tag" size={iconSize} />
      </span>
    );
  }
  return <KindTile kind={kind} iconSize={iconSize} className={cn(size, !expert && radius)} />;
}

/** A round check, then a bold line and a muted line under it. */
export function CheckRow({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full bg-selected text-accent">
        <Icon name="check" size={16} strokeWidth={2.5} />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[15px] font-bold">{title}</span>
        <span className="text-[13px] leading-[1.4] font-semibold text-ink-3">{sub}</span>
      </span>
    </div>
  );
}

/** "Workflow · Ledgerline". */
export function kindAndSeller(l: Listing): string {
  return `${KIND_LABEL[l.kind]} · ${l.seller}`;
}

/** The words for a listing the company already has: a person's setup is requested, the rest installed. */
export function ownedLabel(l: Listing): string {
  return l.kind === 'expert' ? 'Requested' : 'Installed';
}
