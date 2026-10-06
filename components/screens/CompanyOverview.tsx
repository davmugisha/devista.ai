import { Status, Window } from './Window';

const DEPARTMENTS = [
  { name: 'Finance', workflows: 4, tone: 'wait' as const, text: '1 waiting for approval', load: 'w-4/5' },
  { name: 'Operations', workflows: 3, tone: 'run' as const, text: 'Running', load: 'w-3/5' },
  { name: 'Sales', workflows: 2, tone: 'done' as const, text: 'Up to date', load: 'w-2/5' },
  { name: 'Support', workflows: 3, tone: 'run' as const, text: 'Running', load: 'w-3/4' },
];

/** The whole company at a glance: each department's workflows, their state and how busy they are. Example data. */
export function CompanyOverview({ className = '' }: { className?: string }) {
  return (
    <Window
      title="Company overview"
      meta="This week"
      className={className}
      label="Example company overview: four departments, finance, operations, sales and support, with their workflows and status. Finance has one item waiting for approval."
    >
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            ['4', 'Departments'],
            ['12', 'Workflows'],
            ['1', 'Needs you'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-control border border-rule bg-panel/60 px-3 py-2">
              <p className="tabular text-lg font-semibold text-ink">{v}</p>
              <p className="text-xs text-graphite">{l}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 divide-y divide-rule">
          {DEPARTMENTS.map((d, i) => (
            <li key={d.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{d.name}</p>
                <p className="text-xs text-slate">{d.workflows} workflows</p>
              </div>
              <Status tone={d.tone}>{d.text}</Status>
              <div className="col-span-2 h-1 overflow-hidden rounded-dot bg-panel">
                <div className={'h-full origin-left rounded-dot bg-signal-bright/80 animate-grow ' + d.load} style={{ animationDelay: `${i * 300}ms` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}
