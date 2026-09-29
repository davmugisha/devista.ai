import type { Metadata } from 'next';
import { ActivityLog } from '@/components/ActivityLog';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { ItemList } from '@/components/ItemList';
import { ModeGlyph } from '@/components/ModeGlyph';
import { PageIntro } from '@/components/PageIntro';
import { Section } from '@/components/Section';
import { CONTROLS, FAQ } from '@/lib/content';
import { MODES, type Mode } from '@/lib/workflows';

export const metadata: Metadata = {
  title: 'Security and control',
  description:
    'How Devista keeps people in control: approvals, permissions, policies, escalation and a complete audit trail, plus the questions we answer in writing for your IT lead.',
  alternates: { canonical: '/security' },
  openGraph: { title: 'Security and control | Devista AI' },
};

const IT_QUESTIONS = [
  'Where Devista is hosted, and in which region your data is stored',
  'How data is protected in transit and at rest',
  'Who at Devista can access your data, and how that access is controlled and logged',
  'Which systems Devista connects to, and with what level of access',
  'How long data is kept, and how it is returned or deleted',
];

const PICK = new Set(['How is our data kept safe?', 'What happens when something goes wrong?', 'You are a young company. What if you disappear?']);

export default function SecurityPage() {
  return (
    <>
      <PageIntro
        title="AI that works inside the permissions you set."
        lede="People approve what matters. Agents act only within the rules and access you grant. Every action, by a person or an agent, is recorded."
      />

      <Section id="control-model" title="The control model." lede="Control runs through every part of Devista, not a settings page added at the end.">
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <ItemList items={CONTROLS} />
          </div>
          <div className="lg:col-span-5">
            <ActivityLog />
          </div>
        </div>
      </Section>

      <Section
        id="who-acts"
        tone="mist"
        title="Who is allowed to do what."
        lede="Every step of every workflow is assigned to one of three modes, and you decide which."
      >
        <ul className="mt-12 grid gap-x-12 md:grid-cols-3">
          {(['person', 'assisted', 'agent'] as Mode[]).map((m) => (
            <li key={m} className="border-t border-rule py-6">
              <div className="flex items-center gap-3">
                <ModeGlyph mode={m} className="size-4" />
                <h3 className="text-lg font-display tracking-display">{MODES[m].label}</h3>
              </div>
              <p className="mt-2 max-w-measure text-base text-graphite">{MODES[m].description}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-measure text-base text-graphite">
          Agents run work on their own only where it is repetitive and measurable, and only where the economics and
          reliability justify it. Everything else stays with a person, with AI preparing the ground.
        </p>
      </Section>

      <Section
        id="it-review"
        title="For your IT and security lead."
        lede="Before anything is connected, we answer these questions in writing, so your IT or security lead can review them on your terms."
      >
        <ul className="mt-10 max-w-narrow border-t border-rule">
          {IT_QUESTIONS.map((q) => (
            <li key={q} className="flex gap-3 border-b border-rule py-4 text-base text-ink">
              <span aria-hidden="true" className="mt-3 size-1 shrink-0 rounded-dot bg-ink" />
              {q}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-measure text-base text-graphite">
          Your IT lead is welcome to join the operations audit. Mention it when you book.
        </p>
      </Section>

      <Section id="questions" tone="mist" title="Questions about trust and control.">
        <Faq items={FAQ.filter((f) => PICK.has(f.q))} />
      </Section>

      <CtaBand title="Bring your IT lead to the audit." lede="The operations audit is free and takes about two weeks. Security questions are answered in writing before anything connects." />
    </>
  );
}
