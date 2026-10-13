import type { Metadata } from 'next';
import { CircleCheck, KeyRound, Plug, ScrollText, Scale, Siren } from 'lucide-react';
import { ActivityLog } from '@/components/ActivityLog';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { ModeGlyph } from '@/components/ModeGlyph';
import { PageIntro } from '@/components/PageIntro';
import { AgentPermissions } from '@/components/screens/AgentPermissions';
import { delay, Section } from '@/components/Section';
import { CONTROLS, FAQ, OFFERS } from '@/lib/content';
import { MODES, MODE_ORDER } from '@/lib/workflows';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Security and control',
  description:
    `How ${SITE.shortName} keeps people in control: approvals, permissions, rules, escalation and an activity record, plus what we put in writing about access before you pay.`,
  alternates: { canonical: '/security' },
  openGraph: { ...OPEN_GRAPH, title: `Security and control | ${SITE.name}` },
};

// One icon per control, in the order CONTROLS lists them.
const CONTROL_ICONS = [CircleCheck, KeyRound, Scale, Siren, ScrollText, Plug];

// What the buyer is told before paying. Each line restates the FAQ or the offer in lib/content.ts.
const BEFORE_YOU_PAY = [
  'Which access each agent needs, in writing, so you can say no to any of it',
  'Which of your tools can be connected, and which cannot',
  OFFERS[0].get[3],
];

const PICK = new Set(['How is our data kept safe?', 'Do we have to replace the tools we use?', 'Will the agents replace my team?']);

export default function SecurityPage() {
  return (
    <>
      <PageIntro
        chip="Security and control"
        title="AI that works inside the permissions you set."
        lede="People approve what matters. Agents act only within the rules and access you grant. Every action, by a person or an agent, is recorded."
      />

      <Section id="control-model" chip="The control model" title="How you stay in control." lede="Six controls, described in plain words.">
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

      <Section id="who-acts" chip="Who acts" title="Who is allowed to do what." lede="Every step of a workflow is assigned to one of three modes, and you decide which.">
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {MODE_ORDER.map((m, i) => (
            <li key={m} data-reveal style={delay(i * 90)} className={'card p-7 ' + (m === 'agent' ? 'card-lit' : '')}>
              <span className="flex size-10 items-center justify-center rounded-dot border border-rule bg-panel">
                <ModeGlyph mode={m} tinted className="size-4" />
              </span>
              <h3 className="mt-5 text-lg font-display tracking-snug text-ink">{MODES[m].label}</h3>
              <p className="mt-2 text-sm text-graphite">{MODES[m].description}</p>
            </li>
          ))}
        </ul>
        <p data-reveal className="mx-auto mt-8 max-w-narrow text-center text-base text-graphite">
          Agents work alone only on repeat work that has clear rules. Everything else stays with a person, with AI
          preparing the first draft.
        </p>
      </Section>

      <Section
        id="before-you-pay"
        chip="Before you pay"
        title="What we put in front of you before you pay."
        lede="Access comes first, and you can say no to any of it."
      >
        <ol data-reveal className="card mx-auto mt-14 max-w-narrow divide-y divide-rule p-2 sm:p-4">
          {BEFORE_YOU_PAY.map((q, i) => (
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
        title="Bring your questions to the free call."
        lede="Ask what the agents can and cannot do, and what access they would need. You get the scope and price in writing before you pay."
      />
    </>
  );
}
