'use client';

// Phone Inbox (Hub.dc.html): search, the filter chips, the decisions that need the owner and the
// conversations. Decided approvals leave "Needs you" straight away, on every screen, because the
// list comes from the shared store. The filter starts from ?filter= and keeps the address in step,
// so a reload or a shared link opens the same view.

import { Label, ScrollShadow, SearchField, ToggleButton, ToggleButtonGroup } from '@heroui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { RoundLink } from '@/components/phone/RoundButton';
import { INBOX_FILTERS, THREADS, type InboxFilter } from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { FOCUS, ThreadTile, threadHref } from './parts';

/** A filter chip: white pill, the accent fill when chosen. Tokens, so hover and press follow. */
const CHIP = [
  'group h-11 min-w-0 shrink-0 gap-1.5 rounded-full px-4 text-[14px] font-bold',
  '[--toggle-button-bg:var(--surface)] [--toggle-button-bg-hover:var(--color-selected)] [--toggle-button-bg-pressed:var(--color-track)]',
  '[--toggle-button-fg:var(--color-ink-2)]',
  '[--toggle-button-bg-selected:var(--accent)] [--toggle-button-bg-selected-hover:var(--accent-hover)] [--toggle-button-bg-selected-pressed:var(--accent-hover)]',
  '[--toggle-button-fg-selected:var(--accent-foreground)]',
].join(' ');

const ROW = `-mx-2 flex h-16 items-center gap-3 rounded-2xl px-2 text-foreground transition-colors hover:bg-surface/60 hover:text-foreground ${FOCUS}`;

const SECTION_HEAD = 'm-0 mb-1 flex items-center gap-2 text-[12px] font-bold tracking-[0.08em] uppercase';

/** The filter in the address, or All for anything else. */
function filterOf(value: string | null): InboxFilter {
  return INBOX_FILTERS.find((f) => f.key === value)?.key ?? 'all';
}

export function PhoneInbox() {
  const { pending, pendingCount, unreadOf } = usePrototype();
  // The address holds the filter, so reloads, the back button and links such as the menu's
  // Approvals (?filter=needs) all open the same view. Picking a chip rewrites it in place.
  const filter = filterOf(useSearchParams().get('filter'));
  const [query, setQuery] = useState('');

  const pickFilter = (next: InboxFilter) => {
    if (next !== filter) window.history.replaceState(null, '', phone.inbox(next));
  };

  // Keep the chosen chip in view: on a deep link to a chip past the edge (?filter=alert), and
  // after Tab leaves the row (React Aria steps through the last chip on the way out).
  const chipsRef = useRef<HTMLDivElement>(null);
  const showChosen = useCallback(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>('[data-selected="true"]');
    if (!row || !chip) return;
    const left = chip.offsetLeft - 16;
    const right = chip.offsetLeft + chip.offsetWidth + 16 - row.clientWidth;
    if (row.scrollLeft > left) row.scrollLeft = left;
    else if (row.scrollLeft < right) row.scrollLeft = right;
  }, []);
  useEffect(showChosen, [filter, showChosen]);

  const q = query.trim().toLowerCase();
  const hit = (title: string, sub: string) => !q || `${title} ${sub}`.toLowerCase().includes(q);

  const showNeeds = filter === 'all' || filter === 'needs';
  const needs = showNeeds ? pending.filter((a) => hit(a.title, a.short)) : [];
  const conv = filter === 'needs' ? [] : THREADS.filter((t) => (filter === 'all' || t.kind === filter) && hit(t.title, t.sub));
  const heading = INBOX_FILTERS.find((f) => f.key === filter)?.heading ?? 'Conversations';
  const empty = needs.length === 0 && conv.length === 0;

  return (
    <PhoneScreen label="Inbox" className="leading-[normal]">
      <header className="mx-4 mt-[52px] flex h-[52px] shrink-0 items-center gap-3">
        <RoundLink href={phone.home} label="Back to Brain Map">
          <Icon name="back" size={22} className="size-[22px]" />
        </RoundLink>
        <h1 className="m-0 grow text-[26px] font-bold">Inbox</h1>
        <RoundLink href={phone.chat} label="New conversation" tone="soft">
          <Icon name="pencil" size={22} className="size-[22px]" />
        </RoundLink>
      </header>

      <SearchField value={query} onChange={setQuery} className="mx-4 mt-4 shrink-0">
        <Label className="sr-only">Search inbox</Label>
        <SearchField.Group className="h-12 w-full gap-2.5 rounded-full border-0 bg-surface px-4 text-muted shadow-none">
          <SearchField.SearchIcon className="ms-0 size-5 text-muted">
            <Icon name="search" size={20} />
          </SearchField.SearchIcon>
          <SearchField.Input
            placeholder="Search people, agents, calls"
            className="h-11 min-w-0 grow px-0 ps-0 pe-0 text-[15px] font-semibold text-foreground placeholder:text-muted"
          />
          <SearchField.ClearButton aria-label="Clear search" className="me-0" />
        </SearchField.Group>
      </SearchField>

      <ScrollShadow
        ref={chipsRef}
        orientation="horizontal"
        hideScrollBar
        size={24}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) showChosen();
        }}
        className="mt-[14px] shrink-0 pr-4 pl-4"
      >
        <ToggleButtonGroup
          aria-label="Filter inbox"
          selectionMode="single"
          disallowEmptySelection
          isDetached
          selectedKeys={[filter]}
          onSelectionChange={(keys) => {
            const next = [...keys][0] as InboxFilter | undefined;
            if (next) pickFilter(next);
          }}
          className="gap-2"
        >
          {INBOX_FILTERS.map((f) => (
            <ToggleButton key={f.key} id={f.key} className={CHIP}>
              <span>{f.label}</span>
              {f.key === 'needs' && pendingCount > 0 && (
                <span className="font-mono text-[12px] font-semibold text-warning group-data-[selected=true]:text-accent-foreground">{pendingCount}</span>
              )}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </ScrollShadow>

      <ScrollShadow hideScrollBar size={24} className="flex min-h-0 grow flex-col gap-[14px] px-4 pt-[18px] pb-10">
        {needs.length > 0 && (
          <section aria-label="Needs you" className="flex flex-col">
            <h2 className={`${SECTION_HEAD} text-warning`}>
              <span aria-hidden className="size-2 rounded-full bg-warning" />
              Needs you
            </h2>
            <ul className="m-0 flex list-none flex-col p-0">
              {needs.map((a) => (
                <li key={a.key}>
                  <Link href={phone.approval(a.key)} className={ROW}>
                    <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-warning-soft text-warning">
                      <Icon name="shieldCheck" size={22} />
                    </span>
                    <span className="flex min-w-0 grow flex-col gap-[3px]">
                      <span className="truncate text-[15px] font-bold">{a.title}</span>
                      <span className="truncate text-[13px] font-semibold text-ink-3">{a.short}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[12px] text-muted">{a.time}</span>
                    <Icon name="chevronRight" size={18} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {conv.length > 0 && (
          <section aria-label={heading} className="flex flex-col">
            <h2 className={`${SECTION_HEAD} text-muted`}>{heading}</h2>
            <ul className="m-0 flex list-none flex-col p-0">
              {conv.map((t) => {
                const unread = unreadOf(t.key);
                return (
                  <li key={t.key}>
                    <Link href={threadHref(t.key)} className={ROW}>
                      <ThreadTile thread={t} />
                      <span className="flex min-w-0 grow flex-col gap-[3px]">
                        <span className="truncate text-[15px] font-bold">{t.title}</span>
                        <span className="truncate text-[13px] font-semibold text-ink-3">{t.sub}</span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className="font-mono text-[12px] text-muted">{t.time}</span>
                        {unread > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[12px] font-bold text-accent-foreground">
                            {unread}
                            <span className="sr-only"> unread</span>
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {empty && (
          <div role="status" className="flex flex-col items-start gap-3 rounded-3xl bg-surface p-5">
            <span aria-hidden className="flex size-11 items-center justify-center rounded-[14px] bg-accent-soft text-accent">
              <Icon name={q ? 'search' : 'shieldCheck'} size={22} />
            </span>
            <p className="m-0 text-[15px] leading-snug font-semibold text-ink-2">
              {q ? (
                <>
                  Nothing here matches. Try another filter or{' '}
                  <Link href={phone.chat} className={`font-bold text-accent hover:text-accent-hover ${FOCUS} rounded-sm`}>
                    ask Chief of Staff
                  </Link>
                  .
                </>
              ) : (
                'Nothing needs you right now.'
              )}
            </p>
          </div>
        )}
      </ScrollShadow>
    </PhoneScreen>
  );
}
