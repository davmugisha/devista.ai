import { ModeGlyph } from './ModeGlyph';
import { Window } from './screens/Window';
import type { Mode } from '@/lib/workflows';

const ENTRIES: { time: string; mode: Mode | 'rule'; who: string; what: string }[] = [
  { time: '09:14', mode: 'agent', who: 'Invoice agent', what: 'Matched supplier invoice to purchase order and goods receipt' },
  { time: '09:14', mode: 'rule', who: 'Policy', what: 'Amount above approval limit. Sent to the CFO' },
  { time: '09:20', mode: 'assisted', who: 'Accounts payable clerk', what: 'Confirmed cost center suggested by AI' },
  { time: '10:02', mode: 'person', who: 'CFO', what: 'Approved payment' },
  { time: '10:02', mode: 'agent', who: 'Invoice agent', what: 'Added to the next payment run' },
];

/** An example audit trail: every step shows who acted and on whose authority. Captioned by the page. */
export function ActivityLog({ className = '' }: { className?: string }) {
  return (
    <Window
      title="Audit trail"
      meta="Supplier invoice, Finance"
      className={className}
      label="Example audit trail for one supplier invoice: matched by an agent, sent to the CFO by policy, coded by a clerk with AI help, approved by the CFO, then scheduled by the agent."
    >
      <ol className="divide-y divide-rule">
        {ENTRIES.map((e, i) => (
          <li key={i} className="grid grid-cols-[auto_auto_1fr] items-start gap-x-3 px-4 py-3">
            <span className="tabular pt-px text-xs text-slate">{e.time}</span>
            <span className="pt-1">
              {e.mode === 'rule' ? <span className="block size-3 rounded-chip border-2 border-signal-bright" /> : <ModeGlyph mode={e.mode} className="size-3 text-signal-bright" />}
            </span>
            <p className="text-sm text-graphite">
              <span className="font-medium text-ink">{e.who}: </span>
              {e.what}
            </p>
          </li>
        ))}
      </ol>
    </Window>
  );
}
