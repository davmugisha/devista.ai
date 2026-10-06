import { ModeGlyph } from './ModeGlyph';
import { Window } from './screens/Window';
import { AUDIT } from '@/lib/content';
import type { Mode } from '@/lib/workflows';

const MAP = [
  { step: 'Invoice received', tool: 'Email' },
  { step: 'Matched to order', tool: 'ERP', handoff: 'Re-keyed by hand' },
  { step: 'Approved', tool: 'Chat', handoff: 'Chased for two days' },
  { step: 'Paid', tool: 'Accounting' },
];

const TOOLS = [
  { tool: 'ERP', verdict: 'Connects', tone: 'text-signal-bright' },
  { tool: 'Accounting system', verdict: 'Connects', tone: 'text-signal-bright' },
  { tool: 'Approval spreadsheet', verdict: 'Duplicates the ERP', tone: 'text-hold' },
  { tool: 'Expense tool', verdict: 'Cannot do the job', tone: 'text-alert' },
];

const ALLOCATION: { step: string; mode: Mode }[] = [
  { step: 'Capture and match invoices', mode: 'agent' },
  { step: 'Code to cost centers', mode: 'assisted' },
  { step: 'Approve above the limit', mode: 'person' },
  { step: 'Schedule approved payments', mode: 'agent' },
];

const LABEL = { person: 'Person', assisted: 'AI-assisted', agent: 'Agent' } as const;

const DETAIL: Record<string, string> = Object.fromEntries(AUDIT.deliverables.map((d) => [d.title, d.detail]));

/** The deliverables drawn here. `AuditOffer` lists only the others when it sits beside these. */
export const RENDERED = ['Workflow map', 'Tool review', 'Work allocation'];

/** What the audit hands over, shown as documents with example data rather than described. */
export function AuditDeliverables() {
  return (
    <div className="grid gap-8 md:grid-cols-3 md:gap-6">
      <div className="flex flex-col">
        <Window
          title="Workflow map"
          meta="Example"
          className="md:flex-1"
          label="Example workflow map: an invoice moves from email to the ERP to chat to the accounting system, with two handoffs marked where work is re-keyed or chased."
        >
          <ol className="p-4">
            {MAP.map((m, i) => (
              <li key={m.step}>
                {m.handoff ? (
                  <p className="my-1 ml-3 border-l-2 border-dashed border-hold py-1 pl-3 text-xs text-hold">{m.handoff}</p>
                ) : i > 0 ? (
                  <span className="my-1 ml-3 block h-3 border-l-2 border-rule" />
                ) : null}
                <div className="flex items-center justify-between rounded-control border border-rule bg-panel/60 px-3 py-2">
                  <span className="text-sm font-medium text-ink">{m.step}</span>
                  <span className="text-xs text-graphite">{m.tool}</span>
                </div>
              </li>
            ))}
          </ol>
        </Window>
        <h3 className="mt-5 text-lg font-display tracking-display text-ink">Workflow map</h3>
        <p className="mt-1 max-w-measure text-sm text-graphite">{DETAIL['Workflow map']}</p>
      </div>

      <div className="flex flex-col">
        <Window
          title="Tool review"
          meta="Example"
          className="md:flex-1"
          label="Example tool review: the ERP and accounting system connect, an approval spreadsheet duplicates the ERP, and an expense tool cannot do the job."
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-rule">
                <th className="px-4 py-2 text-xs font-semibold text-graphite">Tool</th>
                <th className="px-4 py-2 text-xs font-semibold text-graphite">Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {TOOLS.map((t) => (
                <tr key={t.tool}>
                  <td className="px-4 py-3 text-sm font-medium text-ink">{t.tool}</td>
                  <td className={'px-4 py-3 text-sm font-medium ' + t.tone}>{t.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Window>
        <h3 className="mt-5 text-lg font-display tracking-display text-ink">Tool review</h3>
        <p className="mt-1 max-w-measure text-sm text-graphite">{DETAIL['Tool review']}</p>
      </div>

      <div className="flex flex-col">
        <Window
          title="Work allocation"
          meta="Example"
          className="md:flex-1"
          label="Example work allocation: agents capture and match invoices and schedule approved payments, AI assists with coding to cost centers, and a person approves anything above the limit."
        >
          <ul className="divide-y divide-rule">
            {ALLOCATION.map((a) => (
              <li key={a.step} className="flex items-center gap-3 px-4 py-3">
                <ModeGlyph mode={a.mode} className={"size-3 " + (a.mode === "person" ? "text-hold" : "text-signal-bright")} />
                <span className="flex-1 text-sm text-ink">{a.step}</span>
                <span className="text-xs text-graphite">{LABEL[a.mode]}</span>
              </li>
            ))}
          </ul>
        </Window>
        <h3 className="mt-5 text-lg font-display tracking-display text-ink">Work allocation</h3>
        <p className="mt-1 max-w-measure text-sm text-graphite">{DETAIL['Work allocation']}</p>
      </div>
    </div>
  );
}
