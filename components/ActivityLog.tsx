import { ModeGlyph } from './ModeGlyph';
import { Window, joinList } from './screens/Window';
import type { Mode } from '@/lib/workflows';

const ENTRIES: { time: string; mode: Mode | 'rule'; who: string; what: string; summary: string }[] = [
  { time: '09:14', mode: 'agent', who: 'Research agent', what: 'Found a prospect that fits the profile and added it to the list', summary: 'found by an agent' },
  { time: '09:15', mode: 'assisted', who: 'Strategist', what: 'Edited the outreach message that AI drafted', summary: 'drafted by AI and edited by a strategist' },
  { time: '09:15', mode: 'rule', who: 'Rule', what: 'Every outreach message needs approval. Sent to the agency owner', summary: 'sent to the agency owner by a rule' },
  { time: '10:02', mode: 'person', who: 'Agency owner', what: 'Approved the message', summary: 'approved by the agency owner' },
  { time: '10:02', mode: 'agent', who: 'Research agent', what: 'Logged it in the CRM and set a follow-up task', summary: 'logged by the agent with a follow-up task' },
];

/** An example activity record: every step shows who acted and on whose authority. Captioned by the page. */
export function ActivityLog({ className = '' }: { className?: string }) {
  return (
    <Window
      title="Activity record"
      meta="Outreach draft, Sales"
      className={className}
      label={`Example activity record for one outreach message: ${joinList(ENTRIES.map((e) => e.summary))}.`}
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
