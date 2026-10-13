'use client';

// The information architecture board (IA.dc.html) as a page. At the board's size it keeps the
// board's layout: two columns of numbered cards around the phone home screen, whose numbered
// markers point at the parts the cards explain. Below 1100px it is one column with the phone on
// top. Each card opens the screen it describes.

import { Card, Chip, cn } from '@heroui/react';
import Link from 'next/link';
import { BrainOrb } from '@/components/BrainOrb';
import { Icon, type IconName } from '@/components/icons';
import { COMPANY, USER } from '@/lib/data';
import { phone, web } from '@/lib/routes';
import { ClientOnly } from './ClientOnly';

type ChipTone = 'plain' | 'needs' | 'create';

interface Area {
  key: string;
  /** The number on the card and on the phone marker. New areas show an icon instead. */
  n?: number;
  icon?: IconName;
  title: string;
  body: string;
  chips: (string | { label: string; tone: ChipTone })[];
  href: string;
  /** Marked "New" on the board. */
  fresh?: boolean;
}

const needs = { label: 'Needs you', tone: 'needs' } as const;

const LEFT: Area[] = [
  {
    key: 'menu',
    n: 1,
    title: 'Menu → Sidebar',
    body: 'Switch company, flip between Work and Code, and reach every part of the business, the Marketplace included. Create lives at the bottom, next to you.',
    chips: [
      'Company switcher',
      'Work | Code',
      'Goals',
      'Tasks',
      'Approvals',
      'Marketplace',
      'Org',
      'Knowledge',
      'Skills',
      'Finance',
      { label: '+ Create', tone: 'create' },
    ],
    href: phone.menu,
  },
  {
    key: 'brain',
    n: 3,
    title: 'Brain Map · home',
    body: 'The company as a living map. Nodes are agents and work; orange nodes are waiting on your decision. Tap a node to peek, pinch to open a department.',
    chips: ['Greeting + status line', 'Needs-you nodes', 'Live activity'],
    href: phone.home,
  },
  {
    key: 'dashboard',
    n: 4,
    title: 'Brain ⇄ Dashboard',
    body: 'One button flips home between the map and the numbers, like a map/list toggle. The dock never changes, so chat and call are always one tap away.',
    chips: [needs, 'Cash', 'Runway', 'Revenue', 'Agent spend', 'Agents at work'],
    href: phone.dashboard,
  },
  {
    key: 'marketplace',
    icon: 'store',
    title: 'Menu → Marketplace',
    body: 'Buy and sell what companies build on Saydeed. Chief of Staff suggests listings from the work you still do by hand, checks budget and permissions, and everything runs under your approvals.',
    chips: ['Workflows', 'Agents + skills', 'Pipelines', 'Tools', 'Experts', 'Buy | Sell', 'Sell what you built'],
    href: phone.marketplace,
    fresh: true,
  },
];

const RIGHT: Area[] = [
  {
    key: 'inbox',
    n: 2,
    title: 'Inbox',
    body: 'Every conversation and every decision in one list, filtered by who it is with. Approvals always sit on top.',
    chips: [needs, 'Agents', 'People', 'Groups · agents + people', 'Call recaps', 'Alerts'],
    href: phone.inbox(),
  },
  {
    key: 'chat',
    n: 5,
    title: 'Let’s Chat → Chief of Staff',
    body: 'Text the top agent. It asks the department agents for you, shows who it asked, and brings decisions back as cards you approve in place.',
    chips: ['Rich cards', 'Inline approvals', '@ an agent', 'Voice notes'],
    href: phone.chat,
  },
  {
    key: 'call',
    n: 6,
    title: 'Call → Interactive Call',
    body: 'Talk to the Chief of Staff (voice by Fish Audio). While it speaks, the stage shows the chart, invoice or doc it is talking about. The recap lands in Inbox.',
    chips: ['Visual stage', 'Live captions', 'Pin to dashboard', 'Approve by voice', 'Call recap'],
    href: phone.call,
  },
  {
    key: 'web',
    icon: 'monitor',
    title: 'Web app',
    body: 'The same company on a big screen: a left rail that is always open, a top bar with search, Chief of Staff, Inbox and Create, and Home, Inbox and Marketplace pages that work side by side.',
    chips: ['Left rail', 'Top bar + search', 'Home', 'Inbox', 'Marketplace', 'Sell'],
    href: web.home,
    fresh: true,
  },
];

const CHIP_TONE: Record<ChipTone, string> = {
  plain: 'bg-inset text-ink-2',
  needs: 'bg-warning-wash text-warning',
  create: 'bg-accent-soft text-accent',
};

/**
 * Quicksand has no arrows, so the board draws "→" and "⇄" from the system font; the page does the
 * same rather than take them from the metric-matched fallback font.
 */
function Title({ text }: { text: string }) {
  return (
    <>
      {text.split(/([→⇄])/).map((part, i) =>
        i % 2 ? (
          <span key={i} className="font-[family-name:system-ui]">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

function AreaCard({ area }: { area: Area }) {
  return (
    <Card
      className={cn(
        'group relative gap-3 rounded-[28px] px-7 py-6 transition-shadow max-sm:px-5 max-sm:py-5',
        area.fresh
          ? 'bg-surface-tertiary shadow-[inset_0_0_0_1px_var(--accent-soft)] hover:shadow-[inset_0_0_0_1px_var(--color-selected-ring)]'
          : 'bg-surface shadow-[inset_0_0_0_1px_var(--color-inset)] hover:shadow-[inset_0_0_0_1px_var(--border)]',
      )}
    >
      <div className="flex items-center gap-3">
        {area.n ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold text-accent-foreground">
            {area.n}
          </span>
        ) : (
          <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Icon name={area.icon ?? 'store'} size={18} />
          </span>
        )}
        <h2 className="m-0 min-w-0 text-[22px] font-bold">
          {/* The title is the card's link; its box covers the whole card. */}
          <Link
            href={area.href}
            className="text-foreground outline-none after:absolute after:inset-0 after:rounded-[28px] group-hover:text-accent-deep focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus"
          >
            <Title text={area.title} />
          </Link>
        </h2>
        {area.fresh && (
          <Chip className="rounded-xl bg-accent-soft px-2.5 py-1 text-xs leading-[normal] font-bold text-accent">
            <Chip.Label className="px-0">New</Chip.Label>
          </Chip>
        )}
        <Icon
          name="chevronRight"
          size={18}
          className="mt-[7px] ml-auto self-start text-muted opacity-60 transition group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
        />
      </div>
      <p className="m-0 text-base leading-normal font-semibold text-ink-3">{area.body}</p>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {area.chips.map((c) => {
          const chip = typeof c === 'string' ? { label: c, tone: 'plain' as const } : c;
          return (
            <li key={chip.label} className="flex">
              <Chip className={cn('rounded-[14px] px-3 py-1.5 text-[13px] leading-[normal] font-bold', CHIP_TONE[chip.tone])}>
                <Chip.Label className="px-0">{chip.label}</Chip.Label>
              </Chip>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Marker({ n, left, top }: { n: number; left: number; top: number }) {
  return (
    <span
      className="absolute flex size-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground ring-[3px] ring-background"
      style={{ left, top }}
    >
      {n}
    </span>
  );
}

const ROUND = 'flex size-[50px] shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent';

/** The phone home screen in miniature, with the numbered markers the cards refer to. */
function MiniPhone({ className }: { className?: string }) {
  return (
    <figure
      role="img"
      aria-label="The phone home screen, numbered: 1 Menu, 2 Inbox, 3 Brain Map, 4 Dashboard, 5 Let’s Chat, 6 Call"
      className={cn(
        'relative m-0 h-[690px] w-[320px] shrink-0 overflow-hidden rounded-[48px] bg-background ring-2 ring-separator',
        'shadow-[0_30px_80px_color-mix(in_srgb,var(--foreground)_18%,transparent)]',
        className,
      )}
    >
      <span className={cn(ROUND, 'absolute top-10 left-[18px]')}>
        <Icon name="menu" size={24} />
      </span>
      <span className={cn(ROUND, 'absolute top-10 left-[252px]')}>
        <Icon name="bubble" size={24} />
      </span>
      <div className="absolute inset-x-0 top-[116px] flex flex-col items-center gap-1.5">
        <div className="text-xl font-bold">Good morning, {USER.firstName}</div>
        <div className="text-[13px] font-semibold text-ink-3">
          {COMPANY.working} agents at work · <span className="font-bold text-warning">3 need you</span>
        </div>
      </div>
      <ClientOnly>
        <BrainOrb size={220} highlights={3} still className="absolute top-[190px] left-[50px]" />
      </ClientOnly>
      <div className="absolute inset-x-0 top-[432px] flex justify-center">
        <div className="flex h-[34px] items-center gap-2 rounded-[17px] bg-surface px-3.5 text-xs font-semibold text-ink-3">
          <span className="size-[7px] rounded-full bg-accent" />
          CFO agent is reconciling invoices
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-[22px] flex items-center gap-1.5">
        <span className={ROUND}>
          <Icon name="grid" size={22} />
        </span>
        <span className="flex h-[50px] grow items-center gap-2.5 rounded-[25px] bg-accent-soft px-4 text-[15px] font-bold text-accent">
          <Icon name="chat" size={22} />
          Let’s Chat
        </span>
        <span className={ROUND}>
          <Icon name="phone" size={22} />
        </span>
      </div>
      <Marker n={1} left={54} top={30} />
      <Marker n={2} left={286} top={30} />
      <Marker n={3} left={250} top={196} />
      <Marker n={4} left={50} top={604} />
      <Marker n={5} left={180} top={604} />
      <Marker n={6} left={284} top={604} />
    </figure>
  );
}

const LEGEND: { label: string; mark: string }[] = [
  { label: 'Needs your decision', mark: 'size-3 rounded-full bg-warning' },
  { label: 'Working · action', mark: 'size-3 rounded-full bg-accent' },
  { label: 'Agent', mark: 'size-5 rounded-[7px] bg-accent-soft' },
  { label: 'Person', mark: 'size-5 rounded-full bg-person' },
];

export function InformationArchitecture() {
  return (
    <main className="min-h-dvh overflow-x-clip bg-background leading-[normal] text-foreground">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-7 px-[clamp(16px,3.56vw,64px)] pt-[clamp(32px,3.2vw,56px)] pb-16">
        <div className="flex w-full flex-wrap items-start justify-between gap-x-12 gap-y-5 self-center max-[1099px]:max-w-[600px]">
          <header className="flex max-w-[1000px] min-w-0 flex-col gap-2.5">
            <h1 className="m-0 text-[clamp(34px,6vw,44px)] leading-[1.1] font-bold">Information architecture</h1>
            <p className="m-0 text-[19px] leading-[1.45] font-semibold text-ink-3">
              One home. Two ways to talk to the company. One place for everything that needs you.
            </p>
          </header>
          <ul aria-label="Legend" className="m-0 flex list-none flex-wrap items-center gap-x-[22px] gap-y-2 p-0 text-[15px] font-bold text-ink-2 min-[1500px]:mt-2.5">
            {LEGEND.map((l) => (
              <li key={l.label} className="flex items-center gap-2">
                <span aria-hidden className={cn('shrink-0', l.mark)} />
                {l.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid w-full grid-cols-1 justify-items-center gap-5 self-center max-[1099px]:max-w-[600px] min-[1100px]:grid-cols-[minmax(0,600px)_320px_minmax(0,600px)] min-[1100px]:items-start min-[1100px]:justify-between min-[1100px]:gap-x-6">
          <MiniPhone className="mb-5 min-[1100px]:col-start-2 min-[1100px]:row-start-1 min-[1100px]:mt-[30px] min-[1100px]:mb-0" />
          {[LEFT, RIGHT].map((column, i) => (
            <div
              key={i}
              className={cn(
                'flex w-full max-w-[600px] flex-col gap-5 min-[1100px]:row-start-1',
                i === 0 ? 'min-[1100px]:col-start-1' : 'min-[1100px]:col-start-3',
              )}
            >
              {column.map((area) => (
                <AreaCard key={area.key} area={area} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
