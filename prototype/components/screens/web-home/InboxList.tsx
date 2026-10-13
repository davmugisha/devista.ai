'use client';

// The list half of the web Inbox (WebInbox.dc.html): search, the filter chips and the rows, with
// the decisions that need the owner first and the conversations after. Each row is a link to its
// own URL (/inbox?item=...), so it can be opened in a new tab; a plain click selects it in place.

import { Card, Chip, Label, SearchField, ToggleButton, ToggleButtonGroup, cn } from '@heroui/react';
import Link from 'next/link';
import { useState, type MouseEvent, type ReactNode, type Ref } from 'react';
import { Icon } from '@/components/icons';
import { InitialsTile, Mono } from '@/components/ui';
import { APPROVALS, INBOX_FILTERS, THREADS, type InboxFilter } from '@/lib/data';
import { web } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { ThreadTile, insetFocus, type InboxKey } from './inbox-items';

export function InboxList({
  selected,
  onSelect,
  headingId,
  hiddenOnNarrow,
  sectionRef,
}: {
  selected: InboxKey;
  onSelect: (key: InboxKey) => void;
  headingId: string;
  /** Below 768px the list and the detail take turns; this hides the list while the detail shows. */
  hiddenOnNarrow: boolean;
  sectionRef: Ref<HTMLElement>;
}) {
  const { pendingCount, decisionOf, unreadOf } = usePrototype();
  const [filter, setFilter] = useState<InboxFilter>('all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const hit = (title: string, sub: string) => !q || `${title} ${sub}`.toLowerCase().includes(q);
  const needs = filter === 'all' || filter === 'needs' ? APPROVALS.filter((a) => hit(a.title, a.short)) : [];
  const convs = filter === 'needs' ? [] : THREADS.filter((t) => (filter === 'all' || t.kind === filter) && hit(t.title, t.sub));
  const empty = needs.length === 0 && convs.length === 0;

  return (
    <section
      ref={sectionRef}
      aria-labelledby={headingId}
      className={cn('flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 md:max-w-[440px]', hiddenOnNarrow && 'max-md:hidden')}
    >
      <h1 id={headingId} tabIndex={-1} className="text-[30px] leading-[1.15] font-bold outline-none">
        Inbox
      </h1>

      <SearchField value={query} onChange={setQuery} className="w-full">
        <Label className="sr-only">Search the inbox</Label>
        <SearchField.Group className="h-[46px] w-full gap-2.5 rounded-full border-0 bg-surface px-4 text-muted shadow-[inset_0_0_0_1px_var(--border)] hover:bg-surface">
          <SearchField.SearchIcon className="m-0 size-[19px] text-muted">
            <Icon name="search" size={19} />
          </SearchField.SearchIcon>
          <SearchField.Input
            placeholder="Search people, agents, calls"
            className="h-10 min-w-0 grow p-0 text-[15px] font-semibold text-foreground placeholder:text-muted"
          />
        </SearchField.Group>
      </SearchField>

      <ToggleButtonGroup
        aria-label="Filter"
        selectionMode="single"
        disallowEmptySelection
        isDetached
        selectedKeys={[filter]}
        onSelectionChange={(keys) => {
          const next = [...keys][0];
          if (next) setFilter(next as InboxFilter);
        }}
        className="flex w-full flex-wrap justify-start gap-1.5"
      >
        {INBOX_FILTERS.map((f) => (
          <ToggleButton
            key={f.key}
            id={f.key}
            className={cn(
              'h-9 gap-1.5 rounded-full px-3.5 text-[14px]',
              '[--toggle-button-bg-hover:var(--color-row-hover)] [--toggle-button-bg-pressed:var(--default)] [--toggle-button-bg:var(--surface)] [--toggle-button-fg:var(--color-ink-2)]',
              '[--toggle-button-bg-selected-hover:var(--accent-hover)] [--toggle-button-bg-selected-pressed:var(--accent-hover)] [--toggle-button-bg-selected:var(--accent)] [--toggle-button-fg-selected:var(--accent-foreground)]',
              'shadow-[inset_0_0_0_1px_var(--border)] data-[selected=true]:shadow-[inset_0_0_0_1px_var(--accent)]',
            )}
          >
            {f.label}
            {f.key === 'needs' && <span className="font-mono text-xs font-semibold tabular-nums">{pendingCount}</span>}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Card className="gap-0 overflow-hidden rounded-[20px] p-0">
        {needs.length > 0 && (
          <RowGroup heading="Needs you" tone="text-warning-soft-foreground">
            {needs.map((a) => {
              const decided = Boolean(decisionOf(a.key));
              return (
                <Row
                  key={a.key}
                  id={a.key}
                  on={a.key === selected}
                  onSelect={onSelect}
                  tile={<InitialsTile initials={a.who} tone={decided ? 'selected' : 'warning'} />}
                  title={a.title}
                  sub={a.short}
                  time={a.time}
                  badge={
                    decided ? null : (
                      <Chip color="warning" variant="primary" className="size-5 min-w-5 justify-center rounded-full p-0">
                        <Icon name="alertCircle" size={14} strokeWidth={2.5} />
                        <span className="sr-only">Needs you</span>
                      </Chip>
                    )
                  }
                />
              );
            })}
          </RowGroup>
        )}
        {convs.length > 0 && (
          <RowGroup heading="Conversations" tone="text-ink-3">
            {convs.map((t) => {
              const unread = unreadOf(t.key);
              return (
                <Row
                  key={t.key}
                  id={t.key}
                  on={t.key === selected}
                  onSelect={onSelect}
                  tile={<ThreadTile thread={t} />}
                  title={t.title}
                  sub={t.sub}
                  time={t.time}
                  badge={
                    unread > 0 ? (
                      <Chip color="accent" variant="primary" className="h-5 min-w-5 justify-center rounded-full px-1.5 py-0 text-[11px] font-bold">
                        {unread}
                        <span className="sr-only"> unread</span>
                      </Chip>
                    ) : null
                  }
                />
              );
            })}
          </RowGroup>
        )}
        {empty && (
          <p className="px-4 py-5 text-[14px] font-semibold text-ink-3">Nothing here matches. Try another filter or ask Chief of Staff.</p>
        )}
      </Card>
    </section>
  );
}

function RowGroup({ heading, tone, children }: { heading: string; tone: string; children: ReactNode }) {
  return (
    <>
      <h2 className={cn('px-4 pt-3.5 pb-1.5 text-[13px] font-bold', tone)}>{heading}</h2>
      <ul className="m-0 list-none p-0">{children}</ul>
    </>
  );
}

/** A click with a modifier or another button keeps the browser's own link behaviour. */
function isPlainClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

function Row({
  id,
  on,
  onSelect,
  tile,
  title,
  sub,
  time,
  badge,
}: {
  id: InboxKey;
  on: boolean;
  onSelect: (key: InboxKey) => void;
  tile: ReactNode;
  title: string;
  sub: string;
  time: string;
  badge: ReactNode;
}) {
  return (
    <li>
      <Link
        href={web.inbox(id)}
        replace
        scroll={false}
        data-inbox-row={id}
        aria-current={on ? 'true' : undefined}
        onClick={(e) => {
          if (!isPlainClick(e)) return;
          e.preventDefault();
          onSelect(id);
        }}
        className={cn(
          'flex min-h-[68px] w-full items-center gap-3 px-4 py-2.5 text-left text-foreground transition-colors',
          insetFocus,
          on ? 'bg-selected shadow-[inset_0_0_0_1px_var(--accent)]' : 'hover:bg-row-hover',
        )}
      >
        {tile}
        <span className="flex min-w-0 grow flex-col gap-0.5">
          <span className={cn('truncate text-[15px] font-bold', on && 'text-accent')}>{title}</span>
          <span className="truncate text-[13px] font-semibold text-ink-3">{sub}</span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <Mono className="text-xs text-muted">{time}</Mono>
          {badge}
        </span>
      </Link>
    </li>
  );
}
