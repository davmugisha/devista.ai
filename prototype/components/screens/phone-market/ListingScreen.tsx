'use client';

// Phone Marketplace listing (MarketItem.dc.html): what it does, what it will ask for, the plans
// and a sticky buy bar. The buy button opens Chief of Staff's checks in a bottom sheet; approving
// installs it through the shared store. A listing the company already has says so and points to
// where it now works.

import { Button, Radio, RadioGroup, cn } from '@heroui/react';
import { useCallback, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { RoundLink } from '@/components/phone/RoundButton';
import { ButtonLink, InitialsTile, Mono, Rating } from '@/components/ui';
import { KIND_LABEL, PERMISSION_LEVEL, buyWords, getListing, type ListingKey, type PermissionLevel, type PlanKey } from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { BuySheet, doneAction, doneHref } from './BuySheet';
import { RADIO_CARD_HIT, SCROLL_Y, SectionLabel, Tile, ownedLabel } from './shared';

const LEVEL_TILE: Record<PermissionLevel, string> = {
  read: 'bg-inset text-ink-2',
  draft: 'bg-accent-soft text-accent',
  act: 'bg-warning-soft text-warning',
};

const LEVEL_TEXT: Record<PermissionLevel, string> = {
  read: 'text-muted',
  draft: 'text-accent',
  act: 'text-warning',
};

export function ListingScreen({ listingKey }: { listingKey: ListingKey }) {
  const listing = getListing(listingKey);
  const { state } = usePrototype();
  const [planKey, setPlanKey] = useState<PlanKey | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const buyButton = useRef<HTMLButtonElement>(null);
  const ownedLink = useRef<HTMLAnchorElement>(null);
  // Closing the sheet after buying removes the button it opened from; land on the new action instead.
  const refocus = useCallback(() => {
    if (!document.activeElement || document.activeElement === document.body) (ownedLink.current ?? buyButton.current)?.focus();
  }, []);
  if (!listing) return null;

  const owned = state.installs[listing.key];
  // A listing the company has shows the plan it was bought on; otherwise the pick, or the first plan.
  const plan = listing.plans.find((p) => p.key === (owned?.plan ?? planKey)) ?? listing.plans[0];
  const words = buyWords(listing, plan);
  const kind = KIND_LABEL[listing.kind];

  return (
    <PhoneScreen label={listing.title} className="overflow-hidden pt-[52px] leading-[normal]">
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 px-4">
        <RoundLink href={phone.marketplace} label="Back to Marketplace">
          <Icon name="back" size={22} className="size-[22px]" />
        </RoundLink>
        <span className="truncate text-[13px] font-bold tracking-[0.08em] text-muted uppercase">Marketplace · {kind}</span>
        <RoundLink href={phone.chat} label={`Ask Chief of Staff about ${listing.title}`} tone="soft">
          <Icon name="chat" size={22} className="size-[22px]" />
        </RoundLink>
      </header>

      <div className={cn('mt-4 flex min-h-0 grow flex-col gap-[22px] px-6 pb-6', SCROLL_Y)}>
        <div className="flex shrink-0 items-center gap-4">
          <Tile kind={listing.kind} size="size-[68px]" radius="rounded-[22px]" iconSize={32} />
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="m-0 text-[26px] leading-[1.15] font-bold">{listing.title}</h1>
            <div className="text-[14px] font-semibold text-ink-3">by {listing.seller}</div>
            <Rating value={listing.rating} reviews={listing.reviews} className="[&_svg]:size-3.5" />
          </div>
        </div>

        {owned ? (
          <div className="flex shrink-0 items-start gap-3 rounded-[20px] bg-selected px-4 py-3.5 shadow-[inset_0_0_0_1px_var(--accent-soft)]">
            <span aria-hidden className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent">
              <Icon name="check" size={18} strokeWidth={2.5} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-accent">{listing.done.title}</span>
              <span className="text-[14px] leading-[1.4] font-semibold text-ink-2">{listing.done.text}</span>
            </span>
          </div>
        ) : (
          listing.whyShort && (
            <div className="flex shrink-0 items-start gap-3 rounded-[20px] bg-selected px-4 py-3.5 shadow-[inset_0_0_0_1px_var(--accent-soft)]">
              <InitialsTile initials="CoS" className="size-[30px] rounded-[10px] bg-accent-soft text-[10px] text-accent" />
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-accent">Chief of Staff suggests it</span>
                <span className="text-[14px] leading-[1.4] font-semibold text-ink-2">{listing.whyShort}</span>
              </span>
            </div>
          )
        )}

        <p className="m-0 shrink-0 text-[16px] leading-normal font-medium text-ink-2">{listing.blurb}</p>

        <section aria-label="What it does" className="flex shrink-0 flex-col gap-2.5">
          <SectionLabel>What it does</SectionLabel>
          <ol className="m-0 flex list-none flex-col p-0">
            {listing.steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span aria-hidden className="flex w-3 shrink-0 flex-col items-center">
                  <span className="mt-[5px] size-2.5 shrink-0 rounded-full bg-accent" />
                  <span className={cn('w-0.5 grow', i < listing.steps.length - 1 && 'bg-hairline')} />
                </span>
                <span className="pb-3 text-[15px] leading-[1.4] font-semibold">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-label="Permissions" className="flex shrink-0 flex-col gap-2.5">
          <SectionLabel>It will ask for</SectionLabel>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {listing.asks.map((a) => (
              <li key={a.text} className="flex items-center gap-3">
                <span aria-hidden className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl', LEVEL_TILE[a.level])}>
                  <Icon name={PERMISSION_LEVEL[a.level].icon} size={18} />
                </span>
                <span className="flex flex-col gap-px">
                  <span className="text-[15px] font-bold">{a.text}</span>
                  <span className={cn('text-[12px] font-semibold', LEVEL_TEXT[a.level])}>{PERMISSION_LEVEL[a.level].label}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Plans" className="flex shrink-0 flex-col gap-2.5">
          <SectionLabel>Choose a plan</SectionLabel>
          <RadioGroup
            aria-label="Plans"
            value={plan.key}
            onChange={(v) => setPlanKey(v as PlanKey)}
            isReadOnly={Boolean(owned)}
            orientation="horizontal"
            className="block"
          >
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${listing.plans.length}, minmax(0, 1fr))` }}>
              {listing.plans.map((p) => (
                <Radio key={p.key} value={p.key} className="m-0 min-w-0">
                  <Radio.Content
                    className={cn(
                      'group flex h-[84px] w-full flex-col items-stretch justify-between gap-0 rounded-[20px] leading-[normal] bg-surface p-3 text-foreground shadow-[inset_0_0_0_2px_var(--surface)] transition-[background-color,box-shadow]',
                      'data-[selected=true]:bg-selected data-[selected=true]:shadow-[inset_0_0_0_2px_var(--accent)]',
                      'data-[hovered=true]:bg-row-hover data-[selected=true]:data-[hovered=true]:bg-selected',
                      'data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-focus data-[focus-visible=true]:ring-offset-2 data-[focus-visible=true]:ring-offset-background',
                      RADIO_CARD_HIT,
                    )}
                  >
                    <span className="text-[13px] font-bold text-ink-3 group-data-[selected=true]:text-accent">{p.label}</span>
                    <span className="flex flex-col gap-px">
                      <Mono className="text-[17px] font-semibold">{p.price}</Mono>
                      <span className="text-[11px] font-semibold text-muted">{p.note}</span>
                    </span>
                  </Radio.Content>
                </Radio>
              ))}
            </div>
          </RadioGroup>
        </section>
      </div>

      <div className="relative h-[108px] shrink-0 bg-background shadow-[0_-1px_0_var(--surface)]">
        <div className="absolute right-5 bottom-7 left-5 flex h-[60px] items-center gap-3.5">
          <span className="flex shrink-0 flex-col gap-0.5 pl-1">
            <Mono className="text-[20px] font-semibold">{plan.price}</Mono>
            <span className="text-[12px] font-semibold text-muted">{owned ? ownedLabel(listing) : plan.note}</span>
          </span>
          {owned ? (
            <ButtonLink ref={ownedLink} href={doneHref(listing)} className="h-[60px] grow rounded-full text-[17px]">
              {doneAction(listing)}
            </ButtonLink>
          ) : (
            <Button ref={buyButton} onPress={() => setSheetOpen(true)} className="h-[60px] grow rounded-full text-[17px]">
              {words.cta}
            </Button>
          )}
        </div>
      </div>

      <BuySheet listing={listing} plan={plan} isOpen={sheetOpen} onOpenChange={setSheetOpen} onClosed={refocus} />
    </PhoneScreen>
  );
}
