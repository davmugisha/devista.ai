import { Ban, Check, UserRound } from 'lucide-react';
import { AgentChip, StateLabel } from './AppWindow';
import { AGENT } from './app-data';
import { Window, joinList, lowerFirst } from './Window';

const GROUPS = [
  {
    title: 'Can do on its own',
    tone: 'text-signal-bright',
    Icon: Check,
    items: ['Search the places you named for prospects', 'Add prospects to the prospect sheet', 'Prepare draft outreach messages'],
  },
  {
    title: 'Needs a person to approve',
    tone: 'text-hold',
    Icon: UserRound,
    items: ['Mark any message ready to send', 'Contact anyone already in the CRM'],
  },
  {
    title: 'Never allowed',
    tone: 'text-alert',
    Icon: Ban,
    items: ['Contact anyone on the do-not-contact list', 'Approve its own work'],
  },
];

const [OWN, ASK, NEVER] = GROUPS.map((g) => joinList(g.items.map(lowerFirst)));

/** One agent's permissions: what it may do alone, what needs approval, what it may never do. Example data. */
export function AgentPermissions({ className = '' }: { className?: string }) {
  return (
    <Window
      title="Permissions"
      meta={AGENT.research.workflow}
      className={className}
      label={`Example permissions for a lead research agent. On its own it may: ${OWN}. A person must approve: ${ASK}. It is never allowed to: ${NEVER}. It escalates to the agency owner.`}
    >
      <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
        <AgentChip agent="research" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{AGENT.research.name}</p>
          <p className="text-xs text-graphite">Escalates to the agency owner</p>
        </div>
        <StateLabel state="Working" />
      </div>
      <div className="divide-y divide-rule">
        {GROUPS.map(({ title, tone, Icon, items }) => (
          <div key={title} className="px-4 py-3">
            <p className={'flex items-center gap-2 text-xs font-semibold ' + tone}>
              <Icon className="size-3.5" strokeWidth={2.4} />
              {title}
            </p>
            <ul className="mt-2 space-y-1">
              {items.map((i) => (
                <li key={i} className="flex items-center justify-between gap-3 rounded-chip bg-panel/50 px-3 py-1.5 text-sm text-ink">
                  {i}
                  <span className={'size-1.5 shrink-0 rounded-dot bg-current ' + tone} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Window>
  );
}
