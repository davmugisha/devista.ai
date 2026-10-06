import { Ban, Check, UserRound } from 'lucide-react';
import { ModeGlyph } from '../ModeGlyph';
import { Window } from './Window';

const GROUPS = [
  {
    title: 'Can do on its own',
    tone: 'text-signal-bright',
    Icon: Check,
    items: ['Read invoices from the accounts inbox', 'Match invoices to orders and receipts', 'Prepare draft ledger entries'],
  },
  {
    title: 'Needs a person to approve',
    tone: 'text-hold',
    Icon: UserRound,
    items: ['Schedule a payment', 'Anything above the approval limit'],
  },
  {
    title: 'Never allowed',
    tone: 'text-alert',
    Icon: Ban,
    items: ['Change supplier bank details', 'Approve its own work'],
  },
];

/** One agent's permissions: what it may do alone, what needs approval, what it may never do. Example data. */
export function AgentPermissions({ className = '' }: { className?: string }) {
  return (
    <Window
      title="Invoice agent"
      meta="Finance"
      className={className}
      label="Example permissions for a finance agent: it may read invoices, match them to orders and prepare draft entries on its own; scheduling a payment needs a person's approval; changing supplier bank details is never allowed."
    >
      <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
        <ModeGlyph mode="agent" className="size-3 text-signal-bright" />
        <p className="text-sm text-graphite">
          <span className="font-medium text-ink">Escalates to </span>the accounts payable lead
        </p>
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
