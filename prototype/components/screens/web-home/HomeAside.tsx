'use client';

// The right column of web Home: the Brain Map, lit with one amber node per decision waiting on
// the owner, and Chief of Staff's Marketplace suggestion (the Invoice chaser listing).

import { Card, cn } from '@heroui/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useId } from 'react';
import { KindTile, StateDot } from '@/components/ui';
import { LIVE_ACTIVITY, getListing } from '@/lib/data';
import { web } from '@/lib/routes';
import { usePrototype } from '@/lib/store';

// The orb is decoration (aria-hidden) whose node positions are computed with floating point, and
// the server and the browser round them differently, which React reports as a hydration mismatch.
// It draws in the browser only; a same-size box holds its place until then.
const BrainOrb = dynamic(() => import('@/components/BrainOrb').then((m) => m.BrainOrb), {
  ssr: false,
  loading: () => <div aria-hidden className="size-[280px] shrink-0 self-center" />,
});

export function BrainMapCard() {
  const { pendingCount } = usePrototype();
  const headingId = useId();
  return (
    <Card<'section'> aria-labelledby={headingId} render={(props) => <section {...props} />} className="gap-3.5 rounded-[22px] p-5">
      <div className="flex flex-col gap-1">
        <h2 id={headingId} className="text-[19px] font-bold">
          Brain Map
        </h2>
        <p className="text-[14px] leading-[1.45] font-semibold text-ink-3">Your company, live. Amber nodes are waiting on you.</p>
      </div>
      <BrainOrb size={280} highlights={pendingCount} className="self-center" />
      <div className="flex flex-wrap gap-3.5 text-[13px] font-bold text-ink-2">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full bg-warning" />
          Needs your decision
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2.5 rounded-full bg-foreground" />
          Agent or work
        </span>
      </div>
      <p className="flex items-center gap-2.5 rounded-[14px] bg-background px-3.5 py-3 text-[14px] font-semibold text-ink-2">
        <StateDot />
        <span>
          <span className="font-bold text-foreground">{LIVE_ACTIVITY.agent}</span> {LIVE_ACTIVITY.doing}
        </span>
      </p>
    </Card>
  );
}

const SUGGESTED = getListing('invoice-chaser');

export function MarketplaceSuggestion() {
  const titleId = useId();
  const actionId = useId();
  if (!SUGGESTED) return null;
  return (
    <Link
      href={web.listing(SUGGESTED.key)}
      aria-labelledby={`${titleId} ${actionId}`}
      className={cn(
        'flex flex-col gap-2.5 rounded-[22px] bg-selected px-5 py-[18px] text-foreground shadow-[0_0_0_1px_var(--color-selected-ring)] transition-colors hover:bg-accent-soft-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus focus-visible:outline-solid',
      )}
    >
      <span className="flex items-center gap-3">
        <KindTile kind={SUGGESTED.kind} className="rounded-[14px]" />
        <span className="flex flex-col gap-px">
          <span id={titleId} className="text-[16px] font-bold">
            Stop chasing invoices by hand
          </span>
          <span className="text-[13px] font-semibold text-ink-3">
            {SUGGESTED.title} · Marketplace · {SUGGESTED.price}
          </span>
        </span>
      </span>
      <span className="text-[14px] leading-[1.45] font-semibold text-ink-2">
        You chased 3 overdue invoices this week. Chief of Staff found a workflow that drafts them and waits for your yes.
      </span>
      <span id={actionId} className="text-[14px] font-bold text-accent">
        See it in the Marketplace
      </span>
    </Link>
  );
}
