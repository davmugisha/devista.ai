import { joinList, lowerFirst } from './Window';
import { AgentChip, StateLabel } from './AppWindow';
import { AGENT, NEEDS, ROSTER, USER, WAITING, WORKING, WORKSPACE } from './app-data';
import { BrainMap } from './BrainMap';
import { SITE } from '@/lib/site';

// The web app's Home, adapted from the WebHome board: a greeting, what needs you, the agents at
// work, and the Brain Map. The app's cash, runway and spend figures are left out: Finance is not sold.

export const HOME_LABEL =
  `Example of the ${SITE.shortName} Work home screen, with example data. ` +
  `${NEEDS.length} items need you: ${joinList(NEEDS.map((n) => lowerFirst(n.title)))}. ` +
  `${ROSTER.length} agents at work, ${WORKING} working and ${WAITING} waiting for you. ` +
  `A Brain Map shows the agent team, with the items waiting on you in amber.`;

export const AGENTS_LABEL =
  `Example of the agents at work in ${SITE.shortName} Work, grouped by workflow, with example data: ` +
  `${joinList(ROSTER.map((r) => `the ${AGENT[r.agent].name.toLowerCase()} on ${AGENT[r.agent].workflow.toLowerCase()}, ${r.state.toLowerCase()}: ${lowerFirst(r.doing)}`))}.`;

export function NeedsYouCard() {
  return (
    <div className="overflow-hidden rounded-frame border border-rule bg-mist">
      <div className="flex items-center gap-2 px-4 py-3">
        <p className="text-md font-semibold text-ink">Needs you</p>
        <span className="tabular inline-flex size-6 items-center justify-center rounded-dot bg-hold-tint text-xs font-semibold text-hold">{NEEDS.length}</span>
        <span className="ml-auto text-xs font-semibold text-signal-bright">Open Inbox</span>
      </div>
      <ul className="divide-y divide-rule border-t border-rule">
        {NEEDS.map((n) => (
          <li key={n.id} className="flex items-center gap-3 px-4 py-3">
            <AgentChip agent={n.agent} wait />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{n.title}</p>
              <p className="truncate text-xs text-graphite">{n.sub}</p>
            </div>
            <span className="hidden shrink-0 rounded-dot bg-signal px-3 py-1.5 text-xs font-semibold text-on-signal @sm:inline">Approve and send</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The agents and what each is doing. `limit` shows the first few, as the app's Home does. */
export function AgentsCard({ limit = ROSTER.length, showWorkflow = false }: { limit?: number; showWorkflow?: boolean }) {
  return (
    <div className="overflow-hidden rounded-frame border border-rule bg-mist">
      <div className="flex items-baseline justify-between gap-3 px-4 py-3">
        <p className="text-md font-semibold text-ink">Agents at work</p>
        <p className="tabular text-xs text-slate">
          {WORKING} working · {WAITING} waiting
        </p>
      </div>
      <ul className="divide-y divide-rule border-t border-rule">
        {ROSTER.slice(0, limit).map((r) => (
          <li key={r.agent} className="flex items-center gap-3 px-4 py-3">
            <AgentChip agent={r.agent} />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-ink">
                {AGENT[r.agent].name}
                {showWorkflow ? <span className="rounded-chip bg-panel px-2 text-xs font-medium text-graphite">{AGENT[r.agent].workflow}</span> : null}
              </p>
              <p className="truncate text-xs text-graphite">{r.doing}</p>
            </div>
            <StateLabel state={r.state} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BrainMapCard({ className = '' }: { className?: string }) {
  const lead = ROSTER.find((r) => r.state === 'Working') ?? ROSTER[0];
  return (
    <div className={'rounded-frame border border-rule bg-mist p-4 ' + className}>
      <p className="text-md font-semibold text-ink">Brain Map</p>
      <p className="mt-1 text-xs text-graphite">Your agent team, live. Amber nodes are waiting on you.</p>
      <BrainMap className="mx-auto mt-3 size-52" />
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-graphite">
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-dot bg-hold" />
          Needs your decision
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-dot bg-ink" />
          Agent or work
        </li>
      </ul>
      <p className="mt-3 flex items-start gap-2 rounded-control bg-panel px-3 py-2 text-xs text-graphite">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-dot bg-signal-bright" />
        <span>
          <span className="font-semibold text-ink">{AGENT[lead.agent].name}</span> is {lowerFirst(lead.doing)}
        </span>
      </p>
    </div>
  );
}

/** The Home page inside an AppWindow. */
export function HomeView() {
  return (
    <div className="p-4 @narrow:p-6">
      <p className="text-2xl font-display tracking-display text-ink">Good morning, {USER}</p>
      <p className="mt-1 text-sm text-graphite">
        {WORKSPACE} · {ROSTER.length} agents at work, <span className="font-semibold text-hold">{NEEDS.length} need you</span>
      </p>
      <div className="mt-5 grid items-start gap-4 @heading:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="grid gap-4">
          <NeedsYouCard />
          <AgentsCard limit={4} />
        </div>
        <BrainMapCard className="hidden @heading:block" />
      </div>
    </div>
  );
}
