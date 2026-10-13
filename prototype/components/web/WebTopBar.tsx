'use client';

// The web app's top bar (WebTopBar.dc.html): search that can also hand a question to Chief of
// Staff, then Chief of Staff, Inbox, Create and the profile menu. On narrow screens the actions
// move into the rail row and only the search stays here.

import { Button, ComboBox, Description, Dropdown, Input, Kbd, Label, ListBox } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type Key } from 'react';
import { CREATE_MENU, SEARCH_INDEX } from '@/lib/data';
import { web, webHref } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { Icon } from '../icons';
import { InitialsTile } from '../ui';
import { ProfileMenu } from './WebRail';

interface SearchItem {
  id: string;
  title: string;
  where?: string;
  href?: string;
  kind: 'ask' | 'result' | 'none';
}

function TopSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl K (or ⌘ K) jumps to search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items = useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results = SEARCH_INDEX.filter((r) => `${r.title} ${r.where}`.toLowerCase().includes(q))
      .slice(0, 5)
      .map<SearchItem>((r, i) => ({ id: `r${i}`, title: r.title, where: r.where, href: webHref(r.target, r.item), kind: 'result' }));
    return [
      { id: 'ask', title: `Ask Chief of Staff: “${query.trim()}”`, href: web.inbox('cos'), kind: 'ask' },
      ...(results.length ? results : [{ id: 'none', title: 'Nothing in your company matches. Chief of Staff can still look.', kind: 'none' as const }]),
    ];
  }, [query]);

  const go = (key: Key | null) => {
    const item = items.find((i) => i.id === key);
    if (!item?.href) return;
    setQuery('');
    inputRef.current?.blur();
    router.push(item.href);
  };

  return (
    <div role="search" className="relative min-w-0 max-w-[560px] grow basis-[280px]">
      <ComboBox
        inputValue={query}
        onInputChange={setQuery}
        items={items}
        allowsCustomValue
        allowsEmptyCollection={false}
        menuTrigger="input"
        defaultFilter={() => true}
        disabledKeys={['none']}
        selectedKey={null}
        onSelectionChange={go}
        className="w-full"
      >
        <Label className="sr-only">Search Saydeed, or ask Chief of Staff</Label>
        {/* HeroUI renders the group from its last child, the trigger; the Ctrl K hint sits in it. */}
        <ComboBox.InputGroup className="h-[46px] gap-2.5 rounded-full border-0 bg-background pr-2 pl-4 text-muted shadow-[inset_0_0_0_1px_var(--color-track)] focus-within:shadow-[inset_0_0_0_2px_var(--focus)]">
          <Icon name="search" size={19} />
          {/* The pill shows focus; the bare input inside it does not draw a second box. */}
          <Input
            ref={inputRef}
            placeholder="Search, or ask Chief of Staff"
            className="h-10 min-w-0 grow border-0 bg-transparent px-0 text-[15px] font-semibold text-foreground shadow-none ring-0 outline-none placeholder:text-muted focus:bg-transparent focus:shadow-none focus:ring-0 data-[focused=true]:bg-transparent data-[focused=true]:shadow-none data-[focused=true]:ring-0"
          />
          <ComboBox.Trigger className="size-auto min-w-0 bg-transparent p-0 max-md:hidden">
            <Kbd className="h-[26px] shrink-0 rounded-lg bg-surface px-2 font-mono text-[11px] text-muted shadow-[inset_0_0_0_1px_var(--border)]">
              <Kbd.Content>Ctrl K</Kbd.Content>
            </Kbd>
          </ComboBox.Trigger>
        </ComboBox.InputGroup>
        <ComboBox.Popover className="rounded-[18px] p-2">
          <ListBox aria-label="Search results" items={items} className="flex flex-col gap-0.5">
            {(item: SearchItem) => (
              <ListBox.Item
                id={item.id}
                textValue={item.title}
                className={
                  item.kind === 'ask'
                    ? 'min-h-12 gap-3 rounded-xl bg-selected px-3 py-2 text-accent-deep'
                    : item.kind === 'none'
                      ? 'min-h-10 px-3 py-2 opacity-100'
                      : 'min-h-12 gap-3 rounded-xl px-3 py-2'
                }
              >
                {item.kind === 'ask' && <InitialsTile initials="CoS" className="size-8 rounded-[10px] bg-accent-soft text-accent" />}
                {item.kind === 'none' ? (
                  <span className="text-sm font-semibold text-muted">{item.title}</span>
                ) : (
                  <div className="flex min-w-0 grow flex-col gap-px">
                    <Label className="truncate text-[15px] font-bold">{item.title}</Label>
                    {item.where && <Description className="text-[13px] font-semibold text-muted">{item.where}</Description>}
                  </div>
                )}
                {item.kind === 'result' && <Icon name="chevronRight" size={16} className="text-muted" />}
              </ListBox.Item>
            )}
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>
    </div>
  );
}

export function WebTopBar() {
  const { pendingCount } = usePrototype();
  return (
    <header className="relative z-[5] flex min-h-[72px] w-full flex-wrap items-center gap-3 border-b border-border bg-surface px-[clamp(16px,3vw,40px)] py-3 text-foreground">
      <TopSearch />
      <div className="ml-auto flex items-center gap-2 max-md:hidden">
        <Link
          href={web.inbox('cos')}
          className="flex h-[46px] items-center gap-2 rounded-full bg-accent-soft pr-3.5 pl-3 text-[15px] font-bold whitespace-nowrap text-accent-deep transition-colors hover:bg-accent-soft-hover"
        >
          <Icon name="chat" size={20} />
          Chief of Staff
        </Link>
        <Link
          href={web.inbox()}
          aria-label={pendingCount ? `Inbox, ${pendingCount} things need you` : 'Inbox'}
          className="relative flex size-[46px] items-center justify-center rounded-full bg-background text-foreground transition-colors hover:bg-inset"
        >
          <Icon name="inbox" size={21} />
          {pendingCount > 0 && (
            <span aria-hidden className="absolute -top-[3px] -right-[3px] flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-surface bg-warning px-1.5 text-[11px] font-bold text-warning-foreground">
              {pendingCount}
            </span>
          )}
        </Link>
        <Dropdown>
          <Button aria-label="Create" className="h-[46px] gap-2 rounded-full pr-[18px] pl-3.5 text-[15px]">
            <Icon name="plus" size={18} strokeWidth={2.5} />
            Create
          </Button>
          <Dropdown.Popover placement="bottom end" className="w-[280px] rounded-[18px]">
            <Dropdown.Menu aria-label="Create">
              {CREATE_MENU.map((c) => (
                <Dropdown.Item key={c.label} id={c.label} href={webHref(c.target)} textValue={c.label} className="min-h-[52px]">
                  <div className="flex flex-col gap-px">
                    <Label className="text-[15px] font-bold">{c.label}</Label>
                    <Description className="text-xs font-semibold">{c.sub}</Description>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
        <ProfileMenu />
      </div>
    </header>
  );
}
