import type { ReactNode } from 'react';
import { BookOpen, ChevronDown, House, Inbox, ListChecks, Network, Plus, Search, Zap } from 'lucide-react';
import { Mark } from '../Logo';
import { SITE } from '@/lib/site';
import { AGENT, NEEDS, ROSTER, USER_INITIALS, WORKSPACE, type AgentKey } from './app-data';

// The web app's frame, adapted from the WebRail and WebTopBar boards in extracted/saydeed-app.
// Only what Saydeed Work does today is shown: no Code switch, Marketplace or Finance.

type Section = 'home' | 'inbox';

const NAV = [
  { key: 'home', label: 'Home', Icon: House },
  { key: 'inbox', label: 'Inbox', Icon: Inbox },
  { key: 'tasks', label: 'Tasks', Icon: ListChecks },
] as const;

const COMPANY = [
  { label: 'Org', Icon: Network },
  { label: 'Knowledge', Icon: BookOpen },
  { label: 'Skills', Icon: Zap },
] as const;

const initials = (s: string) =>
  s
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** The three letter chip the app shows for an agent, amber when its item waits for a person. */
export function AgentChip({ agent, wait = false, className = 'size-9' }: { agent: AgentKey; wait?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={
        'inline-flex shrink-0 items-center justify-center rounded-control font-mono text-xs font-semibold ' +
        (wait ? 'bg-hold-tint text-hold ' : 'bg-signal-tint text-signal-strong ') +
        className
      }
    >
      {AGENT[agent].chip}
    </span>
  );
}

/** "Working" or "Waiting" with the app's status dot. */
export function StateLabel({ state }: { state: 'Working' | 'Waiting' }) {
  return (
    <span className={'inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ' + (state === 'Working' ? 'text-signal-bright' : 'text-hold')}>
      <span className="size-1.5 rounded-dot bg-current" />
      {state}
    </span>
  );
}

/** A count badge in the app's amber, for things that wait for a person. */
export function CountBadge({ n, className = '' }: { n: number; className?: string }) {
  return <span className={'tabular inline-flex size-5 shrink-0 items-center justify-center rounded-dot bg-hold text-xs font-semibold text-on-signal ' + className}>{n}</span>;
}

function Rail({ active, needs }: { active: Section; needs: number }) {
  return (
    <div aria-hidden="true" className="hidden w-56 shrink-0 flex-col gap-4 border-r border-rule bg-mist p-4 @narrow:flex">
      <div className="flex items-center gap-2 px-1">
        <Mark className="size-6" />
        <span className="text-md font-semibold tracking-snug text-ink">{SITE.shortName}</span>
      </div>
      <div className="flex items-center gap-2 rounded-frame border border-rule p-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-dot bg-signal text-xs font-semibold text-on-signal">{initials(WORKSPACE)}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{WORKSPACE}</p>
          <p className="text-xs text-slate">Owner · {ROSTER.length} agents</p>
        </div>
        <ChevronDown className="size-4 shrink-0 text-slate" strokeWidth={1.8} />
      </div>
      <ul className="space-y-1">
        {NAV.map(({ key, label, Icon }) => (
          <li
            key={key}
            className={'flex items-center gap-3 rounded-control px-3 py-2 text-sm ' + (key === active ? 'bg-signal-tint font-semibold text-signal-strong' : 'text-graphite')}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.8} />
            {label}
            {key === 'inbox' && needs ? <CountBadge n={needs} className="ml-auto" /> : null}
          </li>
        ))}
      </ul>
      <div>
        <p className="px-3 text-xs font-medium text-slate">Company</p>
        <ul className="mt-2 space-y-1">
          {COMPANY.map(({ label, Icon }) => (
            <li key={label} className="flex items-center gap-3 rounded-control px-3 py-2 text-sm text-graphite">
              <Icon className="size-4 shrink-0" strokeWidth={1.8} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TopBar({ needs }: { needs: number }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-2 border-b border-rule bg-mist px-4 py-3 @narrow:px-6">
      <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-dot border border-rule bg-paper px-3 text-sm text-slate @heading:max-w-md">
        <Search className="size-4 shrink-0" strokeWidth={1.8} />
        <span className="truncate">Search, or ask an agent</span>
        <span className="ml-auto hidden rounded-chip border border-rule px-1.5 font-mono text-xs @sm:inline">Ctrl K</span>
      </div>
      <span className="relative ml-auto flex size-9 shrink-0 items-center justify-center rounded-dot bg-panel text-signal-strong">
        <Inbox className="size-4" strokeWidth={1.8} />
        {needs ? <CountBadge n={needs} className="absolute -right-1 -top-1" /> : null}
      </span>
      <span className="hidden h-9 shrink-0 items-center gap-1 rounded-dot bg-signal px-4 text-sm font-semibold text-on-signal @sm:inline-flex">
        <Plus className="size-4" strokeWidth={2.2} />
        Create
      </span>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-dot bg-panel text-xs font-semibold text-graphite">{USER_INITIALS}</span>
    </div>
  );
}

type Props = {
  /** A full description of what the picture shows, for screen readers. */
  label: string;
  active?: Section;
  /** The hero window: larger radius and a glow ring. */
  hero?: boolean;
  /** For a working example with real buttons: the frame is decorative and the content stays readable. */
  interactive?: boolean;
  /** The count on the Inbox badges. */
  needs?: number;
  /** The data-app value the page checks use to find product pictures. */
  kind?: string;
  className?: string;
  children: ReactNode;
};

/**
 * The Saydeed Work web app in a window: the rail on the left from a medium width up, the top bar,
 * and the page. A still picture is one labelled image; an interactive one is a labelled region.
 */
export function AppWindow({ label, active = 'home', hero = false, interactive = false, needs = NEEDS.length, kind = 'web', className = '', children }: Props) {
  const frame =
    '@container overflow-hidden border border-rule bg-paper text-left shadow-float ' + (hero ? 'rounded-card ring-1 ring-glow/20 ' : 'rounded-window ') + className;
  const body = (
    <>
      <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-rule bg-panel/60 px-4 py-2">
        <span className="size-2 rounded-dot bg-rule-strong/50" />
        <span className="size-2 rounded-dot bg-rule-strong/50" />
        <span className="size-2 rounded-dot bg-rule-strong/50" />
      </div>
      <div className="flex">
        <Rail active={active} needs={needs} />
        <div className="min-w-0 flex-1">
          <TopBar needs={needs} />
          {children}
        </div>
      </div>
    </>
  );
  if (interactive) {
    return (
      <section aria-label={label} data-app={kind} className={frame}>
        {body}
      </section>
    );
  }
  return (
    <div role="img" aria-label={label} data-app={kind} className={frame}>
      <div aria-hidden="true">{body}</div>
    </div>
  );
}
