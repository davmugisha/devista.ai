import { ModeGlyph } from './ModeGlyph';
import type { Mode } from '@/lib/workflows';

const ENTRIES: { time: string; mode: Mode | 'rule'; who: string; what: string }[] = [
  { time: '09:14', mode: 'agent', who: 'Invoice agent', what: 'Matched supplier invoice to purchase order and goods receipt' },
  { time: '09:14', mode: 'rule', who: 'Policy', what: 'Amount above approval limit. Sent to the CFO' },
  { time: '09:20', mode: 'assisted', who: 'Accounts payable clerk', what: 'Confirmed cost center suggested by AI' },
  { time: '10:02', mode: 'person', who: 'CFO', what: 'Approved payment' },
  { time: '10:02', mode: 'agent', who: 'Invoice agent', what: 'Added to the next payment run' },
];

/** An example audit trail, rendered in HTML: every step shows who acted and on whose authority. */
export function ActivityLog() {
  return (
    <figure className="m-0">
      <div
        role="img"
        aria-label="Example audit trail for one supplier invoice: matched by an agent, sent to the CFO by policy, coded by a clerk with AI help, approved by the CFO, then scheduled by the agent."
        className="overflow-hidden rounded-frame border border-rule bg-paper"
      >
        <div aria-hidden="true">
          <div className="flex items-center justify-between border-b border-rule bg-mist px-4 py-3">
            <p className="text-sm font-semibold">Audit trail</p>
            <p className="text-xs text-graphite">Supplier invoice, Finance</p>
          </div>
          <ol className="divide-y divide-rule">
            {ENTRIES.map((e, i) => (
              <li key={i} className="grid grid-cols-[auto_auto_1fr] items-start gap-x-3 px-4 py-3">
                <span className="tabular pt-px text-xs text-slate">{e.time}</span>
                <span className="pt-1">
                  {e.mode === 'rule' ? (
                    <span className="block size-3 rounded-chip border-2 border-signal" />
                  ) : (
                    <ModeGlyph mode={e.mode} />
                  )}
                </span>
                <p className="text-sm text-graphite">
                  <span className="font-medium text-ink">{e.who}: </span>
                  {e.what}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-slate">Illustration with example data.</figcaption>
    </figure>
  );
}
