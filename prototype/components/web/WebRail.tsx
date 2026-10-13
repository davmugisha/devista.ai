'use client';

// The web app's left rail (WebRail.dc.html). Work and Code show different sections; Home, Inbox
// and Marketplace have designs, the rest open the "not designed yet" page. Below 768px the rail
// becomes a row above the page: the logo with quick actions, then only the core items, the
// current item and a More button.

import {
  Avatar,
  Button,
  Description,
  Dropdown,
  Label,
  Meter,
  ToggleButton,
  ToggleButtonGroup,
  cn,
} from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { COMPANY, NAV_COUNTS, NUMBERS, SECTIONS, USER, type Mode, type SectionKey } from '@/lib/data';
import { isActive, web } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { Icon, SaydeedMark, type IconName } from '../icons';
import { NeedsCount, StateDot } from '../ui';

type NavItem =
  | { kind: 'link'; key: string; label: string; icon: IconName; href: string; core?: boolean; trailing?: ReactNode }
  | { kind: 'head'; key: string; label: string };

function section(key: SectionKey, trailing?: ReactNode): NavItem {
  return { kind: 'link', key, label: SECTIONS[key].title, icon: SECTIONS[key].icon, href: web.section(key), trailing };
}

function navFor(mode: Mode, pendingCount: number): NavItem[] {
  const marketplace: NavItem = { kind: 'link', key: 'marketplace', label: 'Marketplace', icon: 'store', href: web.marketplace };
  if (mode === 'work') {
    return [
      { kind: 'link', key: 'home', label: 'Home', icon: 'home', href: web.home, core: true },
      { kind: 'link', key: 'inbox', label: 'Inbox', icon: 'inbox', href: web.inbox(), core: true, trailing: <NeedsCount count={pendingCount} /> },
      section('goals'),
      section('tasks', <span className="font-mono text-xs tabular-nums text-muted">{NAV_COUNTS.tasks}</span>),
      marketplace,
      { kind: 'head', key: 'company', label: 'Company' },
      section('org'),
      section('knowledge'),
      section('skills'),
      section('finance'),
    ];
  }
  return [
    section('projects'),
    section(
      'runs',
      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
        <StateDot className="size-[7px]" />
        {NAV_COUNTS.runsLive}
      </span>,
    ),
    section('reviews', <NeedsCount count={Number(NAV_COUNTS.reviews)} />),
    section('releases'),
    marketplace,
    { kind: 'head', key: 'engineering', label: 'Engineering' },
    section('coding-agents'),
    section('repositories'),
    section('environments'),
    section('skills'),
  ];
}

const CREATE_ITEMS = [
  { id: 'ask', label: 'Ask Chief of Staff', href: web.inbox('cos') },
  { id: 'hire', label: 'Hire an agent or find a tool', href: web.marketplace },
  { id: 'sell', label: 'Sell what you built', href: web.sell },
];

export function WebRail({
  className,
  active,
  responsive = true,
}: {
  className?: string;
  /** Highlight this item instead of the one matching the URL (the rail shown on its own). */
  active?: 'home' | 'inbox' | 'marketplace';
  /** Turn into a row on narrow screens (default). False keeps the full rail at any width. */
  responsive?: boolean;
}) {
  // Classes that apply only when the rail adapts to a narrow screen.
  const narrow = (cls: string) => (responsive ? cls : '');
  const pathname = usePathname();
  const { state, pendingCount, setMode } = usePrototype();
  const [moreOpen, setMoreOpen] = useState(false);
  const items = navFor(state.mode, pendingCount);

  return (
    <nav
      aria-label="Main menu"
      className={cn('relative flex w-full flex-col gap-4 bg-surface px-3.5 pt-[22px] pb-7 text-foreground', narrow('max-md:pb-4'), className)}
    >
      <Link href={web.home} aria-label="Saydeed home" className="flex h-10 items-center gap-2.5 self-start px-2.5 text-foreground">
        <SaydeedMark size={28} className="text-accent" />
        <span className="text-[21px] font-bold tracking-[-0.01em]">Saydeed</span>
      </Link>

      {/* Narrow screens: the top bar's actions move up here. */}
      <div className={cn('absolute top-[22px] right-3.5 hidden items-center gap-1.5', narrow('max-md:flex'))}>
        <Link
          href={web.inbox('cos')}
          aria-label="Chief of Staff"
          className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent-deep transition-colors hover:bg-accent-soft-hover"
        >
          <Icon name="chat" size={19} />
        </Link>
        <Link
          href={web.inbox()}
          aria-label={pendingCount ? `Inbox, ${pendingCount} things need you` : 'Inbox'}
          className="relative flex size-10 items-center justify-center rounded-full bg-background text-foreground transition-colors hover:bg-inset"
        >
          <Icon name="inbox" size={19} />
          {pendingCount > 0 && (
            <span aria-hidden className="absolute -top-[3px] -right-[3px] flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-surface bg-warning px-[5px] text-[11px] font-bold text-warning-foreground">
              {pendingCount}
            </span>
          )}
        </Link>
        <Dropdown>
          <Button isIconOnly aria-label="Create" className="size-10 min-w-10 rounded-full">
            <Icon name="plus" size={18} />
          </Button>
          <Dropdown.Popover placement="bottom end" className="min-w-64">
            <Dropdown.Menu aria-label="Create">
              {CREATE_ITEMS.map((c) => (
                <Dropdown.Item key={c.id} id={c.id} href={c.href} textValue={c.label}>
                  <Label className="font-bold">{c.label}</Label>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
        <ProfileMenu size="sm" />
      </div>

      <div className={cn('flex flex-col gap-2.5', narrow('max-md:hidden'))}>
        <CompanySwitcher />
        <ToggleButtonGroup
          aria-label="Work or Code"
          isDetached
          fullWidth
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={[state.mode]}
          onSelectionChange={(keys) => {
            const next = [...keys][0];
            if (next === 'work' || next === 'code') setMode(next);
          }}
          className="segmented-raised h-11"
        >
          <ToggleButton id="work" className="h-[38px]">
            <Icon name="briefcase" size={16} />
            Work
          </ToggleButton>
          <ToggleButton id="code" className="h-[38px]">
            <Icon name="code" size={16} />
            Code
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <ul className="m-0 flex list-none flex-wrap gap-0.5 p-0">
        {items.map((item) => {
          if (item.kind === 'head') {
            return (
              <li key={item.key} className={cn('basis-full px-3 pt-4 pb-1.5 text-xs font-bold text-muted', narrow('max-md:hidden'))} role="presentation">
                {item.label}
              </li>
            );
          }
          const current = active ? item.key === active : isActive(pathname, item.href);
          const hideNarrow = !moreOpen && !item.core && !current;
          return (
            <li key={item.key} className={cn('flex min-w-0 grow basis-40', narrow('max-md:basis-auto'), hideNarrow && narrow('max-md:hidden'))}>
              <Link
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'flex h-11 w-full items-center gap-3 rounded-xl px-3 text-[15px] transition-colors',
                  current ? 'bg-accent-soft font-bold text-accent-deep' : 'font-semibold text-ink-2 hover:bg-background',
                )}
              >
                <Icon name={item.icon} size={20} />
                <span className="grow truncate">{item.label}</span>
                {item.trailing}
              </Link>
            </li>
          );
        })}
        <li className={cn('hidden grow', narrow('max-md:flex'))}>
          <Button
            variant="tertiary"
            aria-expanded={moreOpen}
            onPress={() => setMoreOpen((v) => !v)}
            className="h-11 w-full rounded-xl text-[15px]"
          >
            <Icon name="more" size={18} />
            {moreOpen ? 'Less' : 'More'}
          </Button>
        </li>
      </ul>

      <Meter
        aria-label="Agent spend today"
        value={NUMBERS.spend.amount}
        minValue={0}
        maxValue={NUMBERS.spend.cap}
        className={cn('mt-2 flex flex-col gap-2 rounded-2xl bg-background p-3.5', narrow('max-md:hidden'))}
      >
        <div className="flex items-baseline justify-between gap-2">
          <Label className="text-[13px] font-bold text-ink-2">Agent spend today</Label>
          <span className="font-mono text-[13px] whitespace-nowrap tabular-nums text-foreground">
            {NUMBERS.spend.value} <span className="text-muted">/ {NUMBERS.spend.capLabel}</span>
          </span>
        </div>
        <Meter.Track className="h-1.5 rounded-full bg-track">
          <Meter.Fill className="rounded-full bg-accent" />
        </Meter.Track>
        <span className="text-xs font-semibold text-muted">{NUMBERS.spend.railNote}</span>
      </Meter>
    </nav>
  );
}

function CompanySwitcher() {
  return (
    <Dropdown>
      <Button
        variant="outline"
        aria-label={`Switch company, current ${COMPANY.name}`}
        className="h-14 w-full justify-start gap-3 rounded-full border-border bg-surface pr-3.5 pl-2 text-left"
      >
        <CompanyMark />
        <span className="flex min-w-0 grow flex-col gap-0.5">
          <span className="truncate text-[15px] font-bold text-foreground">{COMPANY.name}</span>
          <span className="text-xs font-semibold text-muted">
            {COMPANY.role} · {COMPANY.agents} agents
          </span>
        </span>
        <Icon name="chevronDown" size={18} className="text-ink-3" />
      </Button>
      <Dropdown.Popover placement="bottom start" className="min-w-60">
        <Dropdown.Menu aria-label="Companies" selectionMode="single" selectedKeys={['branshs']} disabledKeys={['add']}>
          <Dropdown.Item id="branshs" textValue={COMPANY.name}>
            <CompanyMark small />
            <div className="flex flex-col">
              <Label>{COMPANY.name}</Label>
              <Description>
                {COMPANY.role} · {COMPANY.agents} agents
              </Description>
            </div>
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
          <Dropdown.Item id="add" textValue="Add a company">
            <div className="flex flex-col">
              <Label>Add a company</Label>
              <Description>Not designed yet</Description>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function CompanyMark({ small }: { small?: boolean }) {
  return (
    <span aria-hidden className={cn('flex shrink-0 items-center justify-center rounded-full bg-company', small ? 'size-7' : 'size-[38px]')}>
      <span className={cn('rounded-full bg-company-light', small ? 'size-4' : 'size-[22px]')} />
    </span>
  );
}

/** The "SS" avatar: who is signed in, the map of every screen, and a reset for the example data. */
export function ProfileMenu({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { reset } = usePrototype();
  return (
    <Dropdown>
      <Button
        isIconOnly
        variant="ghost"
        aria-label={`Profile and settings, ${USER.fullName}`}
        className={cn('rounded-full p-0', size === 'sm' ? 'size-10 min-w-10' : 'size-[46px] min-w-[46px]')}
      >
        <Avatar className={cn(size === 'sm' ? 'size-10' : 'size-[46px]')}>
          <Avatar.Fallback className="bg-person text-[15px] font-bold text-person-foreground">{USER.initials}</Avatar.Fallback>
        </Avatar>
      </Button>
      <Dropdown.Popover placement="bottom end" className="min-w-64">
        <Dropdown.Menu
          aria-label="Profile"
          onAction={(key) => {
            if (key === 'reset') reset();
          }}
        >
          <Dropdown.Section>
            <Dropdown.Item id="me" textValue={USER.fullName} isDisabled>
              <div className="flex flex-col">
                <Label>{USER.fullName}</Label>
                <Description>
                  {COMPANY.role}, {COMPANY.name}
                </Description>
              </div>
            </Dropdown.Item>
          </Dropdown.Section>
          <Dropdown.Item id="map" href="/preview" textValue="Every screen">
            <div className="flex flex-col">
              <Label>Every screen</Label>
              <Description>The design canvas, live</Description>
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="phone" href="/m" textValue="Phone app">
            <div className="flex flex-col">
              <Label>Phone app</Label>
              <Description>The same company on a phone</Description>
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="reset" textValue="Reset example data">
            <div className="flex flex-col">
              <Label>Reset example data</Label>
              <Description>Undo every approval, purchase and message</Description>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
