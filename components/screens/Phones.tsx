import type { ReactNode } from 'react';
import { BookPlus, Bot, Check, ChevronLeft, Inbox, LayoutGrid, ListTodo, Menu, MessageCircle, Mic, Plus, UsersRound, X } from 'lucide-react';
import { joinList, lowerFirst } from './Window';
import { AgentChip, CountBadge } from './AppWindow';
import { AGENT, NEEDS, ROSTER, WORKING, WORKSPACE } from './app-data';
import { SITE } from '@/lib/site';

// The phone view, adapted from the 390 by 844 boards in extracted/saydeed-app: Approval, Dashboard,
// Chat (Let's Chat) and Create. Example data from ./app-data. Chief of Staff, Marketplace and the
// cash figures in those boards are left out: they are not part of what Goal 1 sells.

const APP = `${SITE.shortName} Work`;
const FIRST = NEEDS[0];

/** A phone, the size of the app's boards, holding one screen. The label describes the screen. */
export function Phone({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} data-app="phone" className={'w-60 shrink-0 rounded-card border-4 border-ink bg-ink shadow-float ' + className}>
      <div aria-hidden="true" className="relative flex aspect-phone flex-col overflow-hidden rounded-frame bg-panel px-3 pb-3 pt-7 text-left">
        <span className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-dot bg-ink" />
        {children}
      </div>
    </div>
  );
}

const Round = ({ children, className = 'bg-mist', size = 'size-8' }: { children: ReactNode; className?: string; size?: string }) => (
  <span className={'relative flex shrink-0 items-center justify-center rounded-dot text-signal-strong ' + size + ' ' + className}>{children}</span>
);

/** The app's bottom bar: the board switcher and the chat pill. */
function DockBar() {
  return (
    <div className="mt-auto flex items-center gap-2 pt-3">
      <Round className="bg-signal-tint">
        <LayoutGrid className="size-4" strokeWidth={1.8} />
      </Round>
      <span className="flex h-8 flex-1 items-center justify-center gap-2 rounded-dot bg-signal-tint text-sm font-semibold text-signal-strong">
        <MessageCircle className="size-4" strokeWidth={1.8} />
        Ask an agent
      </span>
    </div>
  );
}

export const APPROVAL_LABEL =
  `Example of the ${APP} phone view asking for a decision, with example data: the ${AGENT[FIRST.agent].name.toLowerCase()} asks to ${lowerFirst(FIRST.title)}. ` +
  `It traces to the task to ${lowerFirst(FIRST.traces[0][1])} and the ${FIRST.traces[1][1].toLowerCase()} workflow, shows the first email, ` +
  `says ${FIRST.sends} will send with no undo once sent, and offers approve and send or reject.`;

/** The mobile Approval board: one decision, what it traces to, the draft, and the buttons. */
export function PhoneApproval({ className = '' }: { className?: string }) {
  return (
    <Phone label={APPROVAL_LABEL} className={className}>
      <div className="flex items-center justify-between">
        <Round>
          <ChevronLeft className="size-4" strokeWidth={2} />
        </Round>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-hold">
          <span className="size-1.5 rounded-dot bg-hold" />
          Needs you · 1 of {NEEDS.length}
        </span>
        <Round>
          <MessageCircle className="size-4" strokeWidth={1.8} />
        </Round>
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-graphite">
        <AgentChip agent={FIRST.agent} wait className="size-6" />
        {AGENT[FIRST.agent].name} asks · {FIRST.time}
      </p>
      <p className="mt-2 text-md font-display leading-snug tracking-snug text-ink">{FIRST.title}</p>
      <p className="mt-2 font-mono text-xs font-semibold uppercase tracking-wide text-slate">Traces to</p>
      <ol className="mt-1 space-y-1">
        {FIRST.traces.map(([kind, title, who], i) => (
          <li key={title} className="flex gap-2">
            <span className={'mt-1.5 size-2 shrink-0 rounded-dot ' + (i === 0 ? 'bg-signal' : 'border border-signal')} />
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-ink">{title}</span>
              <span className="block text-xs text-slate">
                {kind} · {who}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-2 rounded-frame bg-mist p-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-slate">{FIRST.draft.count}</p>
        <p className="mt-1 truncate text-xs text-ink">
          <span className="text-slate">To </span>
          {FIRST.draft.to}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-graphite">{FIRST.draft.body}</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <p className="rounded-control bg-mist px-2 py-1 text-xs text-slate">
          <span className="block font-semibold text-ink">{FIRST.sends}</span>
          Will send
        </p>
        <p className="rounded-control bg-hold-tint px-2 py-1 text-xs text-hold">
          <span className="block font-semibold">No undo</span>
          Once sent
        </p>
      </div>
      <div className="mt-auto flex items-center gap-2 pt-3">
        <Round>
          <X className="size-4" strokeWidth={2} />
        </Round>
        <span className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-dot bg-signal text-sm font-semibold text-on-signal">
          <Check className="size-4" strokeWidth={2.4} />
          Approve and send
        </span>
      </div>
    </Phone>
  );
}

export const DASHBOARD_LABEL =
  `Example of the ${APP} phone dashboard, with example data: ${NEEDS.length} items need you, led by ${lowerFirst(FIRST.title)} with review and ask why buttons; ` +
  `and the agents at work, ${WORKING} working, led by ${joinList(ROSTER.slice(0, 2).map((r) => `the ${AGENT[r.agent].name.toLowerCase()} ${lowerFirst(r.doing)}`))}.`;

/** The mobile Dashboard board, without the app's cash, runway and revenue tiles. */
export function PhoneDashboard({ className = '' }: { className?: string }) {
  return (
    <Phone label={DASHBOARD_LABEL} className={className}>
      <div className="flex items-center justify-between">
        <Round>
          <Menu className="size-4" strokeWidth={1.8} />
        </Round>
        <span className="text-center">
          <span className="block text-sm font-semibold text-ink">Dashboard</span>
          <span className="block text-xs text-slate">{WORKSPACE}</span>
        </span>
        <Round>
          <Inbox className="size-4" strokeWidth={1.8} />
          <CountBadge n={NEEDS.length} className="absolute -right-1 -top-1" />
        </Round>
      </div>
      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink">
        Needs you <CountBadge n={NEEDS.length} />
        <span className="ml-auto text-xs font-semibold text-signal-bright">See all</span>
      </p>
      <div className="mt-2 rounded-frame border border-hold/30 bg-hold-tint p-3">
        <p className="flex items-center gap-2 text-xs text-graphite">
          <AgentChip agent={FIRST.agent} className="size-6" />
          {AGENT[FIRST.agent].name} · {FIRST.time}
        </p>
        <p className="mt-2 text-sm font-semibold leading-snug text-ink">{FIRST.title}</p>
        <p className="mt-1 text-xs text-hold">Checked against your do-not-contact list</p>
        <p className="mt-2 flex items-center gap-3">
          <span className="rounded-dot bg-hold px-3 py-1.5 text-xs font-semibold text-on-signal">Review</span>
          <span className="text-xs font-semibold text-ink">Ask why</span>
        </p>
      </div>
      <p className="mt-3 flex items-baseline justify-between text-sm font-semibold text-ink">
        Agents at work
        <span className="tabular text-xs font-normal text-slate">{WORKING} working</span>
      </p>
      <ul className="mt-1 divide-y divide-rule rounded-frame bg-mist px-2">
        {ROSTER.slice(0, 2).map((r) => (
          <li key={r.agent} className="flex items-center gap-2 py-2">
            <AgentChip agent={r.agent} className="size-7" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-ink">{AGENT[r.agent].name}</span>
              <span className="block truncate text-xs text-slate">{r.doing}</span>
            </span>
          </li>
        ))}
      </ul>
      <DockBar />
    </Phone>
  );
}

const SECOND = NEEDS[1];

export const CHAT_LABEL =
  `Example of a chat with the agents in the ${APP} phone view, with example data. Asked what needs attention today, the agents answer that ${NEEDS.length} things are waiting, led by ` +
  `${joinList([FIRST, SECOND].map((n) => lowerFirst(n.title)))}, with a button to approve and send, and a box to ask anything or mention an agent.`;

/** The Let's Chat board, answering from the agents rather than the app's Chief of Staff. */
export function PhoneChat({ className = '' }: { className?: string }) {
  return (
    <Phone label={CHAT_LABEL} className={className}>
      <div className="flex items-center gap-2">
        <Round>
          <ChevronLeft className="size-4" strokeWidth={2} />
        </Round>
        <span className="flex size-8 items-center justify-center rounded-control bg-signal-tint text-signal-strong">
          <Bot className="size-4" strokeWidth={1.8} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-ink">Your agents</span>
          <span className="flex items-center gap-1 text-xs text-slate">
            <span className="size-1.5 rounded-dot bg-signal-bright" />
            {NEEDS.length} need you
          </span>
        </span>
      </div>
      <p className="mt-3 text-center font-mono text-xs text-slate">Today · 8:10</p>
      <p className="ml-8 mt-2 self-end rounded-frame bg-signal-tint px-3 py-2 text-xs text-ink">What needs my attention today?</p>
      <p className="mt-2 text-xs text-ink">
        {NEEDS.length} things. The biggest is outreach: {FIRST.sends} are drafted and ready.
      </p>
      <div className="mt-2 rounded-frame bg-mist p-3">
        <p className="text-xs font-semibold text-ink">Waiting for your yes</p>
        <ul className="mt-1 divide-y divide-rule">
          {[FIRST, SECOND].map((n) => (
            <li key={n.id} className="flex items-center gap-2 py-1.5">
              <AgentChip agent={n.agent} wait className="size-6" />
              <span className="min-w-0 flex-1 truncate text-xs text-ink">{n.title}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-xs text-slate">Nothing is sent until you approve.</p>
        <p className="mt-2 rounded-dot bg-signal py-1.5 text-center text-xs font-semibold text-on-signal">Approve and send</p>
      </div>
      <div className="mt-auto flex items-center gap-2 rounded-dot bg-mist p-1 pl-2">
        <Plus className="size-4 shrink-0 text-slate" strokeWidth={2} />
        <span className="min-w-0 flex-1 truncate text-xs text-slate">Ask anything, or @ an agent</span>
        <Round size="size-7" className="bg-signal-tint">
          <Mic className="size-3.5" strokeWidth={2} />
        </Round>
      </div>
    </Phone>
  );
}

const TILES = [
  { Icon: ListTodo, title: 'New task', detail: 'For an agent or a person' },
  { Icon: Bot, title: 'New agent', detail: 'From a role or a skill' },
  { Icon: UsersRound, title: 'Group chat', detail: 'Agents and people' },
  { Icon: BookPlus, title: 'Add knowledge', detail: 'Docs, links, files' },
];

const ASK = 'Find 20 agencies like Northwind Studio and draft a first message for each';

export const CREATE_LABEL =
  `Example of the Create sheet in the ${APP} phone view, with example data. The request reads: ${ASK}. ` +
  `The agents set it up and ask before anything runs. Other options: ${joinList(TILES.map((t) => lowerFirst(t.title)))}.`;

/** The Create sheet: hand work over in plain words, or start a task, agent, chat or knowledge. */
export function PhoneCreate({ className = '' }: { className?: string }) {
  return (
    <Phone label={CREATE_LABEL} className={className}>
      <div className="opacity-40">
        <p className="text-center text-lg font-display tracking-snug text-ink">Good morning</p>
      </div>
      <div className="-mx-3 -mb-3 mt-3 flex flex-1 flex-col rounded-t-card bg-mist px-3 pb-3 pt-2 shadow-float">
        <span className="mx-auto h-1 w-10 rounded-dot bg-rule-strong/40" />
        <p className="mt-2 flex items-center justify-between text-lg font-display tracking-snug text-ink">
          Create
          <Round className="bg-panel">
            <X className="size-4" strokeWidth={2} />
          </Round>
        </p>
        <p className="mt-2 flex items-start gap-2 rounded-frame border border-rule bg-paper p-2 text-xs text-ink">
          <span className="flex-1">{ASK}</span>
          <Mic className="size-4 shrink-0 text-signal-strong" strokeWidth={2} />
        </p>
        <p className="mt-2 text-xs text-slate">The agents set it up and ask you before anything runs.</p>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {TILES.map(({ Icon, title, detail }) => (
            <li key={title} className="rounded-frame bg-panel p-2">
              <Icon className="size-4 text-signal-strong" strokeWidth={1.8} />
              <span className="mt-1 block text-xs font-semibold text-ink">{title}</span>
              <span className="block text-xs leading-snug text-slate">{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </Phone>
  );
}
