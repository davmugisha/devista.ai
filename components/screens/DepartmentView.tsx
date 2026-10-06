import { ModeGlyph } from '../ModeGlyph';
import { Status, Window } from './Window';

const WORKFLOWS = [
  { name: 'Supplier invoice approval', owner: 'Accounts payable lead', status: 'wait' as const, text: '1 waiting for approval' },
  { name: 'Month-end reconciliation', owner: 'Finance lead', status: 'run' as const, text: 'Running' },
  { name: 'Expense claims', owner: 'Finance lead', status: 'done' as const, text: 'Up to date' },
  { name: 'Weekly cash report', owner: 'CFO', status: 'done' as const, text: 'Sent Monday' },
];

const TEAM = [
  { mode: 'person' as const, label: 'People', text: 'CFO, finance lead, accounts payable' },
  { mode: 'agent' as const, label: 'Agents', text: 'Invoice, reconciliation, reporting' },
];

/** A department in the command center: its workflows, their owners and state, and who works in it. Example data. */
export function DepartmentView({ className = '' }: { className?: string }) {
  return (
    <Window
      title="Finance"
      meta="Department"
      className={className}
      label="Example finance department view: four workflows with their owners and status, one waiting for approval, and the people and agents who work in the department."
    >
      <div className="p-4 sm:p-5">
        <p className="text-sm font-semibold text-ink">Workflows</p>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {WORKFLOWS.map((w) => (
            <li key={w.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{w.name}</p>
                <p className="text-xs text-graphite">Owner: {w.owner}</p>
              </div>
              <Status tone={w.status}>{w.text}</Status>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TEAM.map((t) => (
            <div key={t.label} className="flex gap-3 rounded-control bg-panel px-3 py-2">
              <ModeGlyph mode={t.mode} className="mt-1 size-3 text-signal-bright" />
              <div>
                <p className="text-xs font-semibold text-ink">{t.label}</p>
                <p className="text-xs text-graphite">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}
