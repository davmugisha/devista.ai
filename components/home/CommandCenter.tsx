import { ModeGlyph } from '../ModeGlyph';
import { Mark } from '../Logo';
import type { Mode } from '@/lib/workflows';

type Approval = { title: string; dept: string; mode: Mode; prep: string; approver: string; action: 'Approve' | 'Review' };

const APPROVALS: Approval[] = [
  { title: 'Supplier invoice above approval limit', dept: 'Finance', mode: 'agent', prep: 'Matched to order and receipt', approver: 'CFO', action: 'Approve' },
  { title: 'Welcome pack for a new customer', dept: 'Sales', mode: 'assisted', prep: 'Drafted, edited by account manager', approver: 'Account manager', action: 'Review' },
  { title: 'Purchase request above threshold', dept: 'Operations', mode: 'agent', prep: 'Budget and policy checked', approver: 'COO', action: 'Review' },
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

const DELAYS = ['[animation-delay:120ms]', '[animation-delay:360ms]', '[animation-delay:600ms]'];

/**
 * A faithful HTML rendering of the command center with example data, used as the hero visual
 * until real product screens are supplied. Decorative controls are not interactive; the figure
 * carries one accessible description instead.
 */
export function CommandCenter() {
  return (
    <figure className="m-0">
      <div
        role="img"
        aria-label="Example of the Devista command center: three items waiting for approval by the CFO, an account manager and the COO, three agents at work, and one escalation assigned to the procurement lead."
        className="overflow-hidden rounded-frame border border-rule bg-paper text-left shadow-float"
      >
        <div aria-hidden="true">
          <div className="flex items-center gap-2 border-b border-rule bg-mist px-4 py-3">
            <Mark className="size-5" />
            <span className="text-sm font-semibold">Command center</span>
            <span className="ml-auto rounded-chip border border-rule bg-paper px-2 py-px text-xs text-graphite">Example company</span>
          </div>
          <div className="flex">
            <ul className="hidden w-40 shrink-0 space-y-1 border-r border-rule p-3 text-sm sm:block">
              {RAIL.map((r) => (
                <li
                  key={r.label}
                  className={
                    'flex items-center justify-between rounded-control px-2 py-1 ' +
                    (r.active ? 'bg-mist font-medium text-ink' : 'text-graphite')
                  }
                >
                  {r.label}
                  {r.count ? <span className="tabular text-xs font-semibold text-ink">{r.count}</span> : null}
                </li>
              ))}
            </ul>
            <div className="min-w-0 flex-1 p-4 sm:p-5">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold">Waiting for your approval</p>
                <p className="tabular text-xs text-graphite">3 items</p>
              </div>
              <ul className="mt-3 space-y-2">
                {APPROVALS.map((a, i) => (
                  <li
                    key={a.title}
                    className={
                      'flex items-center gap-3 rounded-control border border-rule px-3 py-2 animate-arrive motion-reduce:animate-none ' +
                      DELAYS[i]
                    }
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink sm:truncate">{a.title}</p>
                      <p className="mt-px flex flex-wrap items-center gap-x-2 text-xs text-graphite sm:flex-nowrap sm:truncate">
                        <span className="font-medium text-ink">{a.dept}</span>
                        <span className="sm:truncate">{a.prep}</span>
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right md:block">
                      <p className="text-xs text-graphite">Approver</p>
                      <p className="text-xs font-medium text-ink">{a.approver}</p>
                    </div>
                    <span
                      className={
                        'shrink-0 rounded-control px-3 py-1 text-xs font-medium ' +
                        (a.action === 'Approve' ? 'bg-signal text-paper' : 'border border-rule-strong text-ink')
                      }
                    >
                      {a.action}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-start gap-2 rounded-control bg-hold-tint px-3 py-2 text-xs text-hold">
                <span className="mt-1 size-2 shrink-0 rounded-dot bg-hold" />
                <p>
                  <span className="font-semibold">Escalated:</span> supplier not on the approved list. Assigned to the
                  procurement lead.
                </p>
              </div>

              <p className="mt-5 text-sm font-semibold">Agents at work</p>
              <ul className="mt-2 divide-y divide-rule">
                {RUNNING.map((r) => (
                  <li key={r.title} className="flex items-center gap-3 py-2">
                    <ModeGlyph mode="agent" className="size-2" />
                    <span className="shrink-0 text-xs font-medium text-ink">{r.title}</span>
                    <span className="truncate text-xs text-graphite">{r.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-slate">Illustration of the command center with example data.</figcaption>
    </figure>
  );
}
