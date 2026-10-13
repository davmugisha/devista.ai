import { Check, FileText, GraduationCap, UsersRound, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { delay, Section } from '../Section';
import { OFFERS } from '@/lib/content';

const SETUP = OFFERS[0];

const sheet = 'mt-6 rounded-control border border-rule bg-paper/80 p-4 text-sm';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 py-1">
      <span className="text-graphite">{label}</span>
      <span aria-hidden="true" className="mb-1 flex-1 border-b border-dotted border-rule-strong/60" />
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

const ITEMS: { Icon: LucideIcon; when: string; title: string; detail: string; preview: ReactNode }[] = [
  {
    Icon: FileText,
    when: 'Before you pay',
    title: 'A written scope and one fixed price',
    detail: 'The workflow, the agents, what waits for your approval and the price, in writing.',
    preview: (
      <div className={sheet}>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">Scope</p>
        <p className="mt-1 font-semibold text-ink">Lead research and outreach drafts</p>
        <div className="mt-3">
          <Row label="Agents" value="4" />
          <Row label="Needs your approval" value="Every message" />
          <Row label="Install" value="7 days" />
          <Row label="Price" value={`${SETUP.price}, fixed`} />
        </div>
      </div>
    ),
  },
  {
    Icon: UsersRound,
    when: 'In 7 days',
    title: 'Your agent team, installed',
    detail: '3 to 5 agents on your workflow, tested on examples from your own work.',
    preview: (
      <ul className={sheet + ' space-y-2'}>
        {[
          ['Lead research', 'Works alone'],
          ['Outreach drafts', 'Waits for you'],
          ['Follow-up reminders', 'Works alone'],
          ['CRM updates', 'Works alone'],
        ].map(([name, rule]) => (
          <li key={name} className="flex items-center justify-between gap-3">
            <span className="text-ink">{name}</span>
            <span
              className={
                'rounded-chip px-2 py-px text-xs font-medium ' + (rule === 'Waits for you' ? 'bg-hold-tint text-hold' : 'bg-signal-tint text-signal-strong')
              }
            >
              {rule}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    Icon: GraduationCap,
    when: 'At the end',
    title: 'A training call for your team',
    detail: 'One call so the people who use the agents can run, review and correct them.',
    preview: (
      <ul className={sheet + ' space-y-2'}>
        {['Run the agents', 'Review and approve drafts', 'Correct an agent’s work', 'Change what needs approval'].map((t) => (
          <li key={t} className="flex items-center gap-2 text-ink">
            <Check aria-hidden="true" className="size-4 shrink-0 text-signal-bright" strokeWidth={2.2} />
            {t}
          </li>
        ))}
      </ul>
    ),
  },
];

/** What the Agent Team Setup hands over, each shown as the document or list the buyer receives. */
export function Deliverables() {
  return (
    <Section
      id="what-you-get"
      chip="What you get"
      title={`Three things you get from the ${SETUP.name}.`}
      lede="The scope comes before you pay. The agents and the training call follow in the 7 days after."
    >
      <ul className="mt-14 grid gap-4 lg:grid-cols-3">
        {ITEMS.map(({ Icon, when, title, detail, preview }, i) => (
          <li key={title} data-reveal style={delay(i * 90)} className="card flex flex-col p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-control border border-rule bg-panel">
                <Icon aria-hidden="true" className="size-5 text-signal-bright" strokeWidth={1.8} />
              </span>
              <span className="rounded-chip border border-rule bg-mist px-2 py-px text-xs font-medium text-graphite">{when}</span>
            </div>
            <h3 className="mt-5 text-lg font-display tracking-snug text-ink">{title}</h3>
            <p className="mt-2 text-sm text-graphite">{detail}</p>
            <div aria-hidden="true" className="mt-auto">
              {preview}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs text-slate">Example scope and agents. Yours are agreed on the free call.</p>
    </Section>
  );
}
