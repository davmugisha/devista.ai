'use client';

// The two listing cards on the web Marketplace (WebMarketplace.dc.html): the large suggestion
// card with Chief of Staff's reason, and the grid card. Both open the listing page.

import { cn } from '@heroui/react';
import { Icon } from '@/components/icons';
import { KindTile } from '@/components/ui';
import { KIND_LABEL, type Listing } from '@/lib/data';
import { web } from '@/lib/routes';
import { CardLink, CosTile, InstalledChip, KindChip } from './parts';

/** Star and score as the cards show it: "★ 4.8". */
export function Stars({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-[5px] text-[13px] font-bold text-ink-3', className)}>
      <Icon name="star" size={13} className="text-accent" />
      <span className="font-mono font-semibold text-foreground tabular-nums">{value}</span>
      <span className="sr-only"> out of 5</span>
    </span>
  );
}

export function SuggestedCard({ listing, installed }: { listing: Listing; installed: boolean }) {
  return (
    <CardLink
      href={web.listing(listing.key)}
      className="gap-4 rounded-[26px] bg-selected p-[22px] shadow-[inset_0_0_0_1px_var(--accent-soft)]"
    >
      <div className="flex items-center gap-3.5">
        <KindTile kind={listing.kind} iconSize={28} className={cn('size-14', listing.kind !== 'expert' && 'rounded-[18px]')} />
        <div className="flex min-w-0 grow flex-col gap-[3px]">
          <h3 className="m-0 text-[20px] font-bold">{listing.title}</h3>
          <span className="text-[14px] font-semibold text-ink-3">
            {KIND_LABEL[listing.kind]} · {listing.seller}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="font-mono text-[18px] font-semibold tabular-nums">{listing.price}</span>
          {installed && <InstalledChip />}
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <CosTile />
        <span className="text-[15px] leading-[1.45] font-semibold text-ink-2">{listing.why}</span>
      </div>
    </CardLink>
  );
}

export function ListingCard({ listing, installed }: { listing: Listing; installed: boolean }) {
  return (
    <CardLink
      href={web.listing(listing.key)}
      className="min-h-[220px] gap-3 rounded-[24px] bg-surface p-[18px] shadow-[inset_0_0_0_1px_var(--color-inset)]"
    >
      <div className="flex items-center justify-between gap-2.5">
        <KindTile kind={listing.kind} className={cn('size-12', listing.kind !== 'expert' && 'rounded-[15px]')} />
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
          {installed && <InstalledChip />}
          <KindChip>{KIND_LABEL[listing.kind]}</KindChip>
        </div>
      </div>
      <div className="flex flex-col gap-[3px]">
        <h3 className="m-0 text-[17px] font-bold">{listing.title}</h3>
        <span className="text-[13px] font-semibold text-muted">by {listing.seller}</span>
      </div>
      <p className="m-0 grow text-[14px] leading-[1.45] font-semibold text-ink-3">{listing.short}</p>
      <div className="flex items-center justify-between gap-2.5">
        <Stars value={listing.rating} />
        <span className="font-mono text-[15px] font-semibold tabular-nums">{listing.price}</span>
      </div>
    </CardLink>
  );
}
