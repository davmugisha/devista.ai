'use client';

// Phone Marketplace (Marketplace.dc.html). Buy: search, categories with live counts, Chief of
// Staff's suggestion and every listing, each a link to its own page. Sell: what Branshs LLC earns
// and sells, with anything submitted from the Sell flow shown as "In review".

import { Chip, Label, ScrollShadow, SearchField, ToggleButton, ToggleButtonGroup, cn, type Key } from '@heroui/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { RoundLink } from '@/components/phone/RoundButton';
import { ButtonLink, Mono, Rating } from '@/components/ui';
import {
  CATEGORIES,
  COMPANY,
  KIND_LABEL,
  LISTINGS,
  MY_LISTINGS,
  SELLABLES,
  inCategory,
  listingMatches,
  priceLabel,
  type CategoryKey,
  type Listing,
} from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype, type Submission } from '@/lib/store';
import { SCROLL_Y, Tile, kindAndSeller, ownedLabel } from './shared';

type Mode = 'buy' | 'sell';

/** One key out of a single-selection group's key set. */
function only<T extends string>(keys: Set<Key>, fallback: T): T {
  const [first] = keys;
  return (first as T | undefined) ?? fallback;
}

export function MarketplaceScreen() {
  const [mode, setMode] = useState<Mode>('buy');

  return (
    <PhoneScreen label="Marketplace" className="overflow-hidden pt-[52px] leading-[normal]">
      <header className="flex h-[52px] shrink-0 items-center gap-3 px-4">
        <RoundLink href={phone.home} label="Back to Brain Map">
          <Icon name="back" size={22} className="size-[22px]" />
        </RoundLink>
        <h1 className="m-0 grow text-[26px] font-bold">Marketplace</h1>
        <RoundLink href={phone.chat} label="Ask Chief of Staff to find something" tone="soft">
          <Icon name="chat" size={22} className="size-[22px]" />
        </RoundLink>
      </header>

      <div className="mt-3 shrink-0 px-4">
        <ToggleButtonGroup
          aria-label="Buy or sell"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[mode]}
          onSelectionChange={(keys) => setMode(only(keys, 'buy'))}
          isDetached
          fullWidth
          className="segmented-accent h-[52px] gap-1 p-1"
        >
          <ToggleButton id="buy" className="h-11 gap-2 text-[15px]">
            <Icon name="bag" size={18} className="mx-0 size-[18px]" />
            Buy
          </ToggleButton>
          <ToggleButton id="sell" className="h-11 gap-2 text-[15px]">
            <Icon name="tag" size={18} className="mx-0 size-[18px]" />
            Sell
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {mode === 'buy' ? <BuyView /> : <SellView />}
    </PhoneScreen>
  );
}

// ---------------------------------------------------------------------------------------------
// Buy

const CHIP_CLASS = cn(
  'group h-11 shrink-0 gap-1.5 rounded-full px-4 text-[14px]',
  '[--toggle-button-bg:var(--surface)] [--toggle-button-fg:var(--color-ink-2)]',
  '[--toggle-button-bg-hover:var(--color-selected)] [--toggle-button-bg-pressed:var(--color-selected)]',
  '[--toggle-button-bg-selected:var(--accent)] [--toggle-button-fg-selected:var(--accent-foreground)]',
  '[--toggle-button-bg-selected-hover:var(--accent-hover)] [--toggle-button-bg-selected-pressed:var(--accent-hover)]',
);

/** "Invoice chaser, workflow by Ledgerline, $49. Suggested because you chased 3 overdue invoices by hand this week." */
function suggestionLabel(l: Listing): string {
  const why = l.whyShort.replace(/^You /, 'you ');
  return `${l.title}, ${KIND_LABEL[l.kind].toLowerCase()} by ${l.seller}, ${l.price}. Suggested because ${why}`;
}

function BuyView() {
  const { isInstalled } = usePrototype();
  const [category, setCategory] = useState<CategoryKey>('all');
  const [query, setQuery] = useState('');

  const current = CATEGORIES.find((c) => c.key === category) ?? CATEGORIES[0];
  const matching = useMemo(() => LISTINGS.filter((l) => listingMatches(l, query)), [query]);
  const rows = matching.filter((l) => inCategory(category, l));
  // Chief of Staff suggests the first listing it has a reason for that the company does not have yet.
  const suggested = category === 'all' && !query.trim() ? LISTINGS.find((l) => l.why && !isInstalled(l.key)) : undefined;

  return (
    <>
      <div className="mt-3.5 shrink-0 px-4">
        <SearchField value={query} onChange={setQuery} fullWidth>
          <Label className="sr-only">Search the marketplace</Label>
          <SearchField.Group className="h-12 gap-2.5 rounded-full border-0 bg-surface px-4 text-muted shadow-none">
            <SearchField.SearchIcon className="m-0 size-5 text-muted">
              <Icon name="search" size={20} />
            </SearchField.SearchIcon>
            <SearchField.Input
              placeholder="Search workflows, agents, tools"
              className="h-11 min-w-0 px-0.5 py-0 text-[15px] font-semibold text-foreground placeholder:text-muted"
            />
            <SearchField.ClearButton className="m-0 size-8 rounded-full text-muted" />
          </SearchField.Group>
        </SearchField>
      </div>

      {/* A mouse wheel scrolls the chips sideways too, for the phone shown in a desktop window. */}
      <ScrollShadow
        orientation="horizontal"
        hideScrollBar
        size={24}
        className="mt-3.5 shrink-0"
        onWheel={(e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.currentTarget.scrollLeft += e.deltaY;
        }}
      >
        <ToggleButtonGroup
          aria-label="Categories"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[category]}
          onSelectionChange={(keys) => setCategory(only(keys, 'all'))}
          isDetached
          className="w-max gap-2 px-4"
        >
          {CATEGORIES.map((c) => (
            <ToggleButton key={c.key} id={c.key} className={CHIP_CLASS}>
              <span>{c.label}</span>
              <Mono className="text-[12px] font-semibold text-muted group-data-[selected=true]:text-accent-foreground">
                {matching.filter((l) => inCategory(c.key, l)).length}
              </Mono>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </ScrollShadow>

      <div className={cn('mt-3.5 flex min-h-0 grow flex-col gap-4 px-4 pb-7', SCROLL_Y)}>
        {suggested && (
          <>
            <h2 className="m-0 -mb-1.5 text-[16px] font-bold">Suggested for {COMPANY.name}</h2>
            <Link
              href={phone.listing(suggested.key)}
              aria-label={suggestionLabel(suggested)}
              className="flex shrink-0 flex-col gap-3 rounded-3xl bg-selected p-4 text-foreground shadow-[inset_0_0_0_1px_var(--accent-soft)] outline-none transition-colors hover:bg-accent-soft/60 focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span className="flex items-center gap-3">
                <Tile kind={suggested.kind} size="size-[52px]" radius="rounded-2xl" iconSize={26} />
                <span className="flex min-w-0 grow flex-col gap-0.5">
                  <span className="text-[18px] font-bold">{suggested.title}</span>
                  <span className="text-[13px] font-semibold text-ink-3">{kindAndSeller(suggested)}</span>
                </span>
                <Mono className="shrink-0 text-[16px] font-semibold">{suggested.price}</Mono>
              </span>
              <span className="text-[14px] leading-[1.4] font-semibold text-ink-2">{suggested.why}</span>
            </Link>
          </>
        )}

        <section aria-label={current.title} className="flex flex-col">
          <h2 className="m-0 mb-1 text-[16px] font-bold">
            {current.title} · <Mono>{rows.length}</Mono>
          </h2>
          {rows.map((l) => (
            <ListingRow key={l.key} listing={l} owned={isInstalled(l.key)} />
          ))}
          {rows.length === 0 && (
            <div className="flex flex-col gap-2.5 rounded-[22px] bg-surface p-5">
              <span className="text-[16px] font-bold">Nothing matches yet</span>
              <span className="text-[14px] leading-[1.4] font-semibold text-ink-3">
                Chief of Staff can look further, or build it for you in Code.
              </span>
              <ButtonLink
                href={phone.chat}
                variant="secondary"
                className="h-11 self-start rounded-full bg-accent-soft px-[18px] text-[15px] text-accent hover:bg-accent-soft-hover"
              >
                Ask Chief of Staff
              </ButtonLink>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function ListingRow({ listing: l, owned }: { listing: Listing; owned: boolean }) {
  return (
    <Link
      href={phone.listing(l.key)}
      className="flex h-[72px] shrink-0 items-center gap-3 rounded-2xl text-foreground outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-focus"
    >
      <Tile kind={l.kind} size="size-12" radius="rounded-[15px]" iconSize={22} />
      <span className="flex min-w-0 grow flex-col gap-[3px]">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[15px] font-bold">{l.title}</span>
          {owned && (
            <Chip size="sm" className="h-5 shrink-0 gap-1 rounded-full bg-accent-soft px-2 text-[11px] font-bold text-accent-deep">
              <Icon name="check" size={11} strokeWidth={3} />
              <Chip.Label className="p-0">{ownedLabel(l)}</Chip.Label>
            </Chip>
          )}
        </span>
        <span className="truncate text-[13px] font-semibold text-ink-3">{kindAndSeller(l)}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <Mono className="text-[14px] font-semibold">{l.price}</Mono>
        <Rating value={l.rating} className="gap-1 text-[12px] text-ink-3 [&_svg]:size-3" />
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------------------------
// Sell

type Status = (typeof MY_LISTINGS)[number]['status'];

const STATUS_TONE: Record<Status, string> = {
  Live: 'bg-selected text-accent',
  'In review': 'bg-accent-soft text-accent',
  Draft: 'bg-inset text-ink-3',
};

interface MineRow {
  key: string;
  title: string;
  sub: string;
  status: Status;
}

function submittedRow(s: Submission): MineRow {
  const thing = SELLABLES.find((t) => t.key === s.thing);
  const kind = thing ? KIND_LABEL[thing.kind] : 'Listing';
  return { key: s.id, title: s.name, sub: `${kind} · sent today · ${priceLabel(s.model, s.price)}`, status: 'In review' };
}

function SellView() {
  const { state } = usePrototype();

  // Newest submissions first. A draft that has since been submitted shows only as "In review".
  const mine = useMemo<MineRow[]>(() => {
    const submittedTitles = new Set(state.submissions.map((s) => SELLABLES.find((t) => t.key === s.thing)?.title));
    const submitted = [...state.submissions].reverse().map(submittedRow);
    const existing = MY_LISTINGS.filter((m) => !(m.status === 'Draft' && submittedTitles.has(m.title))).map((m) => ({ key: m.title, ...m }));
    return [...submitted, ...existing];
  }, [state.submissions]);

  const live = MY_LISTINGS.filter((m) => m.status === 'Live').length;

  return (
    <>
      <div className={cn('mt-3.5 flex min-h-0 grow flex-col gap-[18px] px-4 pb-4', SCROLL_Y)}>
        <div className="flex shrink-0 flex-col gap-3.5 rounded-3xl bg-surface p-[18px]">
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-bold text-ink-3">Earned this month</span>
            <Mono className="text-[34px] font-semibold">$412</Mono>
            <span className="text-[13px] font-semibold text-muted">After the marketplace fee · paid out on the 1st</span>
          </div>
          <dl className="m-0 grid grid-cols-3 gap-2">
            {[
              { value: String(live), label: 'Live listings' },
              { value: '38', label: 'Buyers' },
              { value: '4.8', label: 'Rating' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-0.5 rounded-2xl bg-inset px-3 py-2.5">
                <dt className="text-[12px] font-semibold text-muted">{s.label}</dt>
                <dd className="m-0">
                  <Mono className="text-[16px] font-semibold">{s.value}</Mono>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <section aria-label="Needs you" className="flex shrink-0 flex-col">
          <h2 className="m-0 mb-1 flex items-center gap-2 text-[16px] font-bold text-warning-soft-foreground">
            <span aria-hidden className="size-2 rounded-full bg-warning" />
            Needs you
          </h2>
          <Link
            href={phone.inbox()}
            className="flex h-16 items-center gap-3 rounded-2xl text-foreground outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-focus"
          >
            <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-warning-soft text-warning">
              <Icon name="bubble" size={22} />
            </span>
            <span className="flex min-w-0 grow flex-col gap-[3px]">
              <span className="text-[15px] font-bold">Answer a buyer question</span>
              <span className="truncate text-[13px] font-semibold text-ink-3">Amani Foods · Client portal checklist</span>
            </span>
            <Mono className="shrink-0 text-[12px] text-muted">9:12</Mono>
            <Icon name="chevronRight" size={18} className="shrink-0 text-muted" />
          </Link>
        </section>

        <section aria-label="Your listings" className="flex shrink-0 flex-col">
          <h2 className="m-0 mb-1 text-[16px] font-bold">Your listings</h2>
          <ul className="m-0 flex list-none flex-col p-0">
            {mine.map((m) => (
              <li key={m.key} className="flex h-16 items-center gap-3">
                <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-accent-soft text-accent">
                  <Icon name="tag" size={20} />
                </span>
                <span className="flex min-w-0 grow flex-col gap-[3px]">
                  <span className="truncate text-[15px] font-bold">{m.title}</span>
                  <span className="truncate text-[13px] font-semibold text-ink-3">{m.sub}</span>
                </span>
                <Chip className={cn('h-[26px] shrink-0 gap-1.5 rounded-[13px] px-2.5 text-[12px] font-bold', STATUS_TONE[m.status])}>
                  <span aria-hidden className="size-1.5 rounded-full bg-current" />
                  <Chip.Label className="p-0">{m.status}</Chip.Label>
                </Chip>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="h-[108px] shrink-0" aria-hidden />
      <ButtonLink
        href={phone.sell}
        className="absolute right-5 bottom-7 left-5 h-[60px] w-auto gap-2 rounded-full text-[17px]"
      >
        <Icon name="plus" size={20} strokeWidth={2.5} className="mx-0 size-5" />
        Sell something you built
      </ButtonLink>
    </>
  );
}
