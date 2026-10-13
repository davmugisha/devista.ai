'use client';

// The Buy view of the web Marketplace (WebMarketplace.dc.html): search, category chips with live
// counts, Chief of Staff's suggestions, every listing as a card, the empty state and the three
// promises at the bottom.

import { Card, Label, SearchField, ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { Icon, type IconName } from '@/components/icons';
import { ButtonLink } from '@/components/ui';
import { CATEGORIES, COMPANY, LISTINGS, inCategory, listingMatches, type CategoryKey } from '@/lib/data';
import { web } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { ListingCard, SuggestedCard } from './ListingCards';

const HOW_BUYING_WORKS: { icon: IconName; title: string; sub: string }[] = [
  { icon: 'shieldCheck', title: 'Runs under your approvals', sub: 'Anything a listing sends, pays or posts waits in Approvals first.' },
  { icon: 'eye', title: 'Permissions in plain words', sub: 'Every listing says what it reads, drafts and does before you add it.' },
  { icon: 'check', title: 'Reviewed before listing', sub: 'Saydeed checks each listing, and sellers never see your data.' },
];

/** Category chips: white pills with a hairline, the chosen one filled with the accent. */
const CHIP =
  'group h-11 gap-1.5 rounded-full px-4 text-[14px] font-bold shadow-[inset_0_0_0_1px_var(--border)] data-[selected=true]:shadow-none ' +
  '[--toggle-button-bg:var(--surface)] [--toggle-button-bg-hover:var(--accent-soft)] [--toggle-button-bg-pressed:var(--accent-soft-hover)] [--toggle-button-fg:var(--color-ink-2)] ' +
  '[--toggle-button-bg-selected:var(--accent)] [--toggle-button-bg-selected-hover:var(--accent-hover)] [--toggle-button-bg-selected-pressed:var(--accent-hover)] [--toggle-button-fg-selected:var(--accent-foreground)]';

export function BuyView({
  category,
  onCategory,
  query,
  onQuery,
}: {
  category: CategoryKey;
  onCategory: (key: CategoryKey) => void;
  query: string;
  onQuery: (value: string) => void;
}) {
  const { isInstalled } = usePrototype();
  const matches = LISTINGS.filter((l) => listingMatches(l, query, true));
  const current = CATEGORIES.find((c) => c.key === category) ?? CATEGORIES[0];
  const rows = matches.filter((l) => inCategory(current.key, l));
  const showSuggested = current.key === 'all' && !query.trim();
  const suggested = LISTINGS.filter((l) => l.why);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <SearchField value={query} onChange={onQuery} className="max-w-[460px] min-w-0 flex-[1_1_300px]">
          <Label className="sr-only">Search the marketplace</Label>
          <SearchField.Group className="h-[52px] w-full gap-2.5 rounded-full border-0 bg-surface pr-3 pl-[18px] shadow-[inset_0_0_0_1px_var(--border)]">
            <SearchField.SearchIcon className="m-0 size-5 text-muted">
              <Icon name="search" size={20} />
            </SearchField.SearchIcon>
            <SearchField.Input
              placeholder="Search the marketplace"
              className="h-11 min-w-0 px-0 text-[15px] font-semibold text-foreground placeholder:text-muted"
            />
            <SearchField.ClearButton aria-label="Clear search" className="m-0 size-7 text-muted" />
          </SearchField.Group>
        </SearchField>

        <ToggleButtonGroup
          aria-label="Categories"
          selectionMode="single"
          disallowEmptySelection
          isDetached
          selectedKeys={[current.key]}
          onSelectionChange={(keys) => {
            const next = CATEGORIES.find((c) => c.key === [...keys][0]);
            if (next) onCategory(next.key);
          }}
          className="flex-wrap justify-start gap-2"
        >
          {CATEGORIES.map((c) => (
            <ToggleButton key={c.key} id={c.key} className={CHIP}>
              <span>{c.label}</span>
              <span className="font-mono text-[12px] font-semibold text-muted tabular-nums group-data-[selected=true]:text-accent-foreground">
                {matches.filter((l) => inCategory(c.key, l)).length}
              </span>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      {showSuggested && (
        <section aria-label={`Suggested for ${COMPANY.name}`} className="flex flex-col gap-3.5">
          <h2 className="m-0 text-[19px] font-bold">Suggested for {COMPANY.name}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-3.5">
            {suggested.map((l) => (
              <SuggestedCard key={l.key} listing={l} installed={isInstalled(l.key)} />
            ))}
          </div>
        </section>
      )}

      <section aria-label={current.title} className="flex flex-col gap-3.5">
        <h2 className="m-0 text-[19px] font-bold" aria-live="polite">
          {current.title} · <span className="font-mono tabular-nums">{rows.length}</span>
        </h2>
        {rows.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] gap-3.5">
            {rows.map((l) => (
              <ListingCard key={l.key} listing={l} installed={isInstalled(l.key)} />
            ))}
          </div>
        ) : (
          <Card className="flex-row flex-wrap items-center justify-between gap-4 rounded-[24px] bg-surface p-7 shadow-[inset_0_0_0_1px_var(--color-inset)]">
            <div className="flex flex-col gap-1">
              <h3 className="m-0 text-[18px] font-bold">Nothing matches yet</h3>
              <p className="m-0 text-[15px] font-semibold text-ink-3">Chief of Staff can look further, or build it for you in Code.</p>
            </div>
            <ButtonLink
              href={web.inbox('cos')}
              variant="secondary"
              className="h-12 rounded-full px-5 text-[15px] font-bold [--button-bg-hover:var(--accent-soft-hover)] [--button-bg:var(--accent-soft)] [--button-fg:var(--accent)]"
            >
              Ask Chief of Staff
            </ButtonLink>
          </Card>
        )}
      </section>

      <section
        aria-label="How buying works"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-7 gap-y-5 border-t border-border pt-6"
      >
        {HOW_BUYING_WORKS.map((p) => (
          <div key={p.title} className="flex items-start gap-3.5">
            <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-accent-soft text-accent">
              <Icon name={p.icon} size={20} />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="m-0 text-[16px] font-bold">{p.title}</h3>
              <p className="m-0 text-[14px] leading-[1.45] font-semibold text-ink-3">{p.sub}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
