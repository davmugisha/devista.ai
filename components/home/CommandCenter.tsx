import { ModeGlyph } from '../ModeGlyph';
import { WindowBar } from '../screens/Window';
import { SITE } from '@/lib/site';

type Approval = { title: string; dept: string; prep: string; approver: string; action: 'Approve' | 'Review' };

const APPROVALS: Approval[] = [
  { title: 'Supplier invoice above approval limit', dept: 'Finance', prep: 'Matched to order and receipt', approver: 'CFO', action: 'Approve' },
  { title: 'Welcome pack for a new customer', dept: 'Sales', prep: 'Drafted, edited by account manager', approver: 'Account manager', action: 'Review' },
  { title: 'Purchase request above threshold', dept: 'Operations', prep: 'Budget and policy checked', approver: 'COO', action: 'Review' },
];

const RUNNING: { title: string; status: string }[] = [
  { title: 'Support ticket triage', status: 'Sorting new tickets, complaints routed to the support lead' },
  { title: 'Weekly operations report', status: 'Draft ready for review' },
  { title: 'Payment run', status: 'Approved invoices only' },
];

const RAIL = [
  { label: 'Overview', active: true },
  { label: 'Approvals', count: '3' },
  { label: 'Tasks' },
  { label: 'Alerts', count: '1' },
  { label: 'Reports' },
  { label: 'Departments' },
];

const TILES = [
  { label: 'Waiting for approval', value: '3' },
  { label: 'Agents at work', value: '7' },
  { label: 'Escalated today', value: '1' },
];

/**
 * An HTML rendering of the command center with example data, used as the hero visual until
 * real product screens are supplied. Decorative controls are not interactive; the figure
 * carries one accessible description instead.
 */
export function CommandCenter() {
  return (
    <div
      role="img"
      aria-label={`Example of the ${SITE.shortName} command center: three items waiting for approval by the CFO, an account manager and the COO, three agents at work, and one escalation assigned to the procurement lead.`}
      className="overflow-hidden rounded-card border border-rule bg-mist text-left shadow-float ring-1 ring-glow/20"
    >
      <div aria-hidden="true">
        <WindowBar title="Command center" meta="Example company" />
        <div className="flex">
          <ul className="hidden w-44 shrink-0 space-y-1 border-r border-rule p-3 text-sm sm:block">
            {RAIL.map((r) => (
              <li
                key={r.label}
                className={
                  'flex items-center justify-between rounded-control px-3 py-2 ' +
                  (r.active ? 'bg-panel font-medium text-ink' : 'text-graphite')
                }
              >
                {r.label}
                {r.count ? (
                  <span className="tabular rounded-chip bg-signal-tint px-2 text-xs font-semibold text-signal-bright">{r.count}</span>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <ul className="grid grid-cols-3 gap-2 sm:gap-3">
              {TILES.map((t) => (
                <li key={t.label} className="rounded-control border border-rule bg-panel/60 px-3 py-2">
                  <p className="tabular text-xl font-semibold text-ink">{t.value}</p>
                  <p className="text-xs text-graphite">{t.label}</p>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-baseline justify-between">
              <p className="text-sm font-semibold text-ink">Waiting for your approval</p>
              <p className="tabular text-xs text-graphite">3 items</p>
            </div>
            <ul className="mt-3 space-y-2">
              {APPROVALS.map((a) => (
                <li key={a.title} className="flex items-center gap-3 rounded-control border border-rule bg-paper/40 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink sm:truncate">{a.title}</p>
                    <p className="mt-px flex flex-wrap items-center gap-x-2 text-xs text-graphite sm:flex-nowrap sm:truncate">
                      <span className="font-medium text-signal-bright">{a.dept}</span>
                      <span className="sm:truncate">{a.prep}</span>
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right md:block">
                    <p className="text-xs text-slate">Approver</p>
                    <p className="text-xs font-medium text-ink">{a.approver}</p>
                  </div>
                  <span
                    className={
                      'shrink-0 rounded-control px-3 py-1 text-xs font-medium ' +
                      (a.action === 'Approve' ? 'bg-signal text-on-signal' : 'border border-rule text-ink')
                    }
                  >
                    {a.action}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-start gap-2 rounded-control border border-hold/30 bg-hold-tint px-3 py-2 text-xs text-hold">
              <span className="mt-1 size-2 shrink-0 rounded-dot bg-hold" />
              <p>
                <span className="font-semibold">Escalated:</span> supplier not on the approved list. Assigned to the
                procurement lead.
              </p>
            </div>

            <p className="mt-5 text-sm font-semibold text-ink">Agents at work</p>
            <ul className="mt-2 divide-y divide-rule">
              {RUNNING.map((r) => (
                <li key={r.title} className="flex flex-wrap items-center gap-x-3 py-2 sm:flex-nowrap">
                  <ModeGlyph mode="agent" className="size-2 text-signal-bright" />
                  <span className="shrink-0 text-xs font-medium text-ink">{r.title}</span>
                  <span className="basis-full pl-5 text-xs text-graphite sm:basis-auto sm:truncate sm:pl-0">{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
