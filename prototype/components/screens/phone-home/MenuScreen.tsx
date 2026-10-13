'use client';

// The phone menu (Sidebar.dc.html): a drawer from the left over the Brain Map, which shrinks to
// the right under a dim. Work and Code is the same switch as the web rail (the shared store), the
// Approvals count is live, and sections without a design open their "not designed yet" page.

import {
  Button,
  Chip,
  Description,
  Drawer,
  Dropdown,
  Label,
  ScrollShadow,
  ToggleButton,
  ToggleButtonGroup,
  cn,
} from '@heroui/react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { IconName } from '@/components/icons';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { ButtonLink, NeedsCount, StateDot } from '@/components/ui';
import { ProfileMenu } from '@/components/web/WebRail';
import { COMPANY, NAV_COUNTS, SECTIONS, type Mode, type SectionKey } from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { HomeScreen } from './HomeScreen';
import { FOCUS_RING, Glyph } from './PhoneChrome';
import { useRouteOverlay } from './overlay';

interface MenuItem {
  key: string;
  label: string;
  icon: IconName;
  href: string;
  current?: boolean;
  trailing?: ReactNode;
}

interface MenuGroup {
  key: string;
  /** Small caps label above the group ("Company", "Engineering"); the first group has none. */
  title?: string;
  items: MenuItem[];
}

const note = (text: string) => <span className="text-[13px] font-semibold text-muted">{text}</span>;

function section(key: SectionKey, trailing?: ReactNode, icon?: IconName): MenuItem {
  return { key, label: SECTIONS[key].title, icon: icon ?? SECTIONS[key].icon, href: phone.section(key), trailing };
}

function groupsFor(mode: Mode, pendingCount: number): MenuGroup[] {
  if (mode === 'work') {
    return [
      {
        key: 'work',
        items: [
          { key: 'home', label: 'Brain Map', icon: 'brainMap', href: phone.home, current: true },
          { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: phone.dashboard },
          section('goals', undefined, 'goal'),
          section('tasks', <span className="font-mono text-[13px] text-muted tabular-nums">{NAV_COUNTS.tasks}</span>),
          { key: 'approvals', label: 'Approvals', icon: 'shieldCheck', href: phone.inbox('needs'), trailing: <NeedsCount count={pendingCount} /> },
          {
            key: 'marketplace',
            label: 'Marketplace',
            icon: 'store',
            href: phone.marketplace,
            trailing: (
              <Chip size="sm" color="accent" variant="soft" className="h-[22px] rounded-full px-2 py-0 text-[12px] font-bold text-accent">
                New
              </Chip>
            ),
          },
        ],
      },
      {
        key: 'company',
        title: 'Company',
        items: [section('org', note('agents & people')), section('knowledge'), section('skills'), section('finance')],
      },
    ];
  }
  return [
    {
      key: 'code',
      items: [
        section('projects'),
        section(
          'runs',
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
            <StateDot className="size-[7px]" />
            {NAV_COUNTS.runsLive}
          </span>,
        ),
        section(
          'reviews',
          <span className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-warning px-1.5 text-[12px] font-bold text-warning-foreground">
            {NAV_COUNTS.reviews}
            <span className="sr-only"> waiting</span>
          </span>,
        ),
        section('releases'),
        { key: 'marketplace', label: 'Marketplace', icon: 'store', href: phone.marketplace, trailing: note('tools & pipelines') },
      ],
    },
    {
      key: 'engineering',
      title: 'Engineering',
      items: [section('coding-agents'), section('repositories'), section('environments'), section('skills')],
    },
  ];
}

export function MenuScreen() {
  const { state, pendingCount, setMode } = usePrototype();
  const { open, onOpenChange, onCloseClick } = useRouteOverlay(phone.home);
  const groups = groupsFor(state.mode, pendingCount);

  return (
    <PhoneScreen className="overflow-hidden leading-[normal]">
      {/* The Brain Map, pushed to the right and shrunk while the menu is open. */}
      <div
        className={cn(
          'absolute inset-0 origin-top-left overflow-hidden transition-[translate,scale,border-radius,box-shadow] duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
          open && 'translate-x-[322px] translate-y-[5%] scale-90 rounded-[44px] shadow-ring-soft',
        )}
      >
        <HomeScreen background />
      </div>

      <Drawer.Backdrop isOpen={open} onOpenChange={onOpenChange} variant="transparent" className="h-full">
        <Drawer.Content placement="left" className="h-full">
          <Drawer.Dialog
            aria-label="Menu"
            className="h-full w-[310px] max-w-[calc(100%-48px)] overflow-visible bg-background p-0 leading-[normal] shadow-none"
          >
            <nav aria-label="Main menu" className="flex h-full flex-col pt-14 pr-3 pb-7 pl-4">
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
                className="segmented-accent mt-3.5 h-[52px] shrink-0 gap-1 p-1"
              >
                <ToggleButton id="work" className="h-11 text-[15px]">
                  <Glyph name="briefcase" size={18} />
                  Work
                </ToggleButton>
                <ToggleButton id="code" className="h-11 text-[15px]">
                  <Glyph name="code" size={18} />
                  Code
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Scrolls on short phones; the fade shows there is more. */}
              <ScrollShadow hideScrollBar size={32} className="mt-4 flex min-h-0 grow flex-col gap-0.5">
                {groups.map((group) => (
                  <div key={group.key} className="flex shrink-0 flex-col gap-0.5">
                    {group.title && (
                      <h2 id={`menu-${group.key}`} className="m-0 px-3.5 pt-4 pb-1.5 text-[12px] font-bold tracking-[0.08em] text-muted uppercase">
                        {group.title}
                      </h2>
                    )}
                    <ul aria-labelledby={group.title ? `menu-${group.key}` : undefined} className="m-0 flex list-none flex-col gap-0.5 p-0">
                      {group.items.map((item) => (
                        <li key={item.key}>
                          <Link
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={cn(
                              'flex h-12 items-center gap-3.5 rounded-2xl px-3.5 text-[16px] transition-colors',
                              item.current
                                ? 'bg-accent-soft font-bold text-accent hover:text-accent'
                                : 'font-semibold text-ink-2 hover:bg-surface hover:text-ink-2',
                              FOCUS_RING,
                            )}
                          >
                            <Glyph name={item.icon} size={22} />
                            <span className="min-w-0 grow truncate">{item.label}</span>
                            {item.trailing}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ScrollShadow>

              <div className="mt-3 flex shrink-0 items-center justify-between">
                <ButtonLink href={phone.create} className="h-14 gap-2 rounded-full pr-6 pl-[18px] text-[16px]">
                  <Glyph name="plus" size={20} style={{ strokeWidth: 2.5 }} />
                  Create
                </ButtonLink>
                {/* The shared profile menu, at the 56px size the phone menu draws it. */}
                <div className="[&_.avatar]:size-14 [&_[data-slot=avatar-fallback]]:text-[16px] [&>.button]:size-14 [&>.button]:min-w-14">
                  <ProfileMenu />
                </div>
              </div>
            </nav>

            {/* The dimmed Brain Map at the right: tapping it closes the menu. */}
            <Link
              href={phone.home}
              aria-label="Close menu"
              onClick={onCloseClick}
              className={cn(
                'absolute top-[5%] bottom-[5%] left-[322px] w-[351px] rounded-[40px] bg-foreground/28 transition-opacity duration-200',
                open ? 'opacity-100' : 'opacity-0',
                FOCUS_RING,
              )}
            />
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </PhoneScreen>
  );
}

function CompanySwitcher() {
  return (
    <Dropdown>
      <Button
        variant="ghost"
        aria-label={`Switch company, current ${COMPANY.name}`}
        className="h-16 w-full shrink-0 justify-start gap-3 rounded-full bg-surface pr-[18px] pl-2.5 text-left hover:bg-surface"
      >
        <CompanyMark />
        <span className="flex min-w-0 grow flex-col gap-0.5 leading-[normal]">
          <span className="truncate text-[17px] font-bold text-foreground">{COMPANY.name}</span>
          <span className="text-[12px] font-semibold text-muted">
            {COMPANY.role} · {COMPANY.agents} agents
          </span>
        </span>
        <Glyph name="chevronDown" size={20} className="text-ink-3" />
      </Button>
      <Dropdown.Popover placement="bottom start" className="min-w-[282px]">
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
    <span aria-hidden className={cn('flex shrink-0 items-center justify-center rounded-full bg-company', small ? 'size-7' : 'size-11')}>
      <span className={cn('rounded-full bg-company-light', small ? 'size-4' : 'size-[26px]')} />
    </span>
  );
}
