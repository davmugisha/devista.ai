import type { Metadata } from 'next';
import { CircleCheck, KeyRound, Plug, ScrollText, Scale, Siren } from 'lucide-react';
import { ActivityLog } from '@/components/ActivityLog';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { ModeGlyph } from '@/components/ModeGlyph';
import { PageIntro } from '@/components/PageIntro';
import { AgentPermissions } from '@/components/screens/AgentPermissions';
import { delay, Section } from '@/components/Section';
import { CONTROLS, FAQ } from '@/lib/content';
import { MODES, type Mode } from '@/lib/workflows';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Security and control',
  description:
    `How ${SITE.shortName} keeps people in control: approvals, permissions, policies, escalation and a complete audit trail, plus the questions we answer in writing for your IT lead.`,
  alternates: { canonical: '/security' },
  openGraph: { ...OPEN_GRAPH, title: `Security and control | ${SITE.name}` },
};

// One icon per control, in the order CONTROLS lists them.
const CONTROL_ICONS = [CircleCheck, KeyRound, Scale, Siren, ScrollText, Plug];

const IT_QUESTIONS = [
  `Where ${SITE.shortName} is hosted, and in which region your data is stored`,
  'How data is protected in transit and at rest',
  `Who at ${SITE.shortName} can access your data, and how that access is controlled and logged`,
  `Which systems ${SITE.shortName} connects to, and with what level of access`,
  'How long data is kept, and how it is returned or deleted',
];

const PICK = new Set(['How is our data kept safe?', 'What happens when something goes wrong?', 'You are a young company. What if you disappear?']);

export default function SecurityPage() {
  return (
    <>
      <PageIntro
        chip="Security and control"
        title="AI that works inside the permissions you set."
        lede="People approve what matters. Agents act only within the rules and access you grant. Every action, by a person or an agent, is recorded."
      />

      <Section id="control-model" chip="The control model" title={`Control runs through every part of ${SITE.shortName}.`} lede="Not a settings page added at the end: every workflow is built on these six.">
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTROLS.map((c, i) => {
            const Icon = CONTROL_ICONS[i];
            return (
              <li key={c.title} data-reveal style={delay((i % 3) * 80)} className="card p-6">
                <span className="flex size-10 items-center justify-center rounded-control border border-rule bg-panel">
                  <Icon aria-hidden="true" className="size-5 text-signal-bright" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-lg font-display tracking-snug text-ink">{c.title}</h3>
                <p className="mt-2 text-sm text-graphite">{c.detail}</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 grid items-start gap-4 lg:grid-cols-2">
          <div data-reveal className="card p-4 sm:p-8">
            <AgentPermissions />
          </div>
          <div data-reveal style={delay(120)} className="card p-4 sm:p-8">
            <ActivityLog />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate">Illustrations with example data.</p>
      </Section>

      <Section id="who-acts" chip="Who acts" title="Who is allowed to do what." lede="Every step of every workflow is assigned to one of three modes, and you decide which.">
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {(['person', 'assisted', 'agent'] as Mode[]).map((m, i) => (
            <li key={m} data-reveal style={delay(i * 90)} className={'card p-7 ' + (m === 'agent' ? 'card-lit' : '')}>
              <span className="flex size-10 items-center justify-center rounded-dot border border-rule bg-panel">
                <ModeGlyph mode={m} className={'size-4 ' + (m === 'person' ? 'text-hold' : 'text-signal-bright')} />
              </span>
              <h3 className="mt-5 text-lg font-display tracking-snug text-ink">{MODES[m].label}</h3>
              <p className="mt-2 text-sm text-graphite">{MODES[m].description}</p>
            </li>
          ))}
        </ul>
        <p data-reveal className="mx-auto mt-8 max-w-narrow text-center text-base text-graphite">
          Agents run work on their own only where it is repetitive and measurable, and only where the economics and
          reliability justify it. Everything else stays with a person, with AI preparing the ground.
        </p>
      </Section>

      <Section
        id="it-review"
        chip="For your IT lead"
        title="Answered in writing, before anything connects."
        lede="Your IT or security lead can review these on your terms, and is welcome to join the operations audit."
      >
        <ol data-reveal className="card mx-auto mt-14 max-w-narrow divide-y divide-rule p-2 sm:p-4">
          {IT_QUESTIONS.map((q, i) => (
            <li key={q} className="flex items-start gap-4 px-3 py-4">
              <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-control border border-rule bg-panel text-xs font-semibold text-signal-bright">
                {i + 1}
              </span>
              <span className="pt-0.5 text-base text-ink">{q}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="questions" chip="FAQ" title="Questions about trust and control.">
        <Faq items={FAQ.filter((f) => PICK.has(f.q))} />
      </Section>

      <CtaBand
        title="Bring your IT lead to the audit."
        lede="The operations audit is free and takes about two weeks. Security questions are answered in writing before anything connects."
      />
    </>
  );
}
