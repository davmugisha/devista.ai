import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { PageIntro } from '@/components/PageIntro';
import { Section } from '@/components/Section';
import { Stages } from '@/components/Stages';
import { FAQ } from '@/lib/content';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'Six stages from the first conversation to a department running on Devista: Discover, Diagnose, Architect, Build, Deploy, Operate. Plus how pricing works.',
  alternates: { canonical: '/how-it-works' },
  openGraph: { title: 'How it works | Devista AI' },
};

const PRICING = [
  { title: 'Operations audit', detail: 'Free. About two weeks on one department, ending with a scoped proposal you can accept or decline.' },
  { title: 'Implementation', detail: 'A fee for the scope in the proposal, agreed before any work starts.' },
  { title: 'Platform subscription', detail: 'Grows with the departments you add. Unusually heavy workloads are charged by usage.' },
];

const PICK = new Set(['Will the rollout disrupt our operations?', 'How long does it take?', 'How do we bring our teams along?', 'How does pricing work?']);

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro
        title="Start with one department. Expand when it proves itself."
        lede="Six stages take you from the first conversation to a department running on Devista. Each one ends with a decision that is yours to make."
      />

      <Section id="stages" title="The six stages." lede="The same sequence runs for every department you add.">
        <Stages detailed />
      </Section>

      <Section
        id="one-department"
        tone="mist"
        title="Why one department first."
        lede="A single department is small enough to change without disruption and large enough to show whether the approach works in your company."
      >
        <div className="mt-8 grid max-w-narrow gap-4">
          <p className="max-w-measure text-base text-graphite">
            The first department sets the pattern: which work moves to agents, where approvals sit, and how your people
            work alongside it. The switchover plan is agreed with that department&rsquo;s head, and nothing goes live
            without sign-off.
          </p>
          <p className="max-w-measure text-base text-graphite">
            When it has proven itself, the next department follows the same six stages, reusing what the first one
            established.
          </p>
        </div>
      </Section>

      <Section
        id="pricing"
        title="How pricing works."
        lede="We do not publish a price list, because scope differs by company. You always know the cost before work starts."
      >
        <ol className="mt-12 grid gap-x-8 border-t border-rule md:grid-cols-3">
          {PRICING.map((p, i) => (
            <li key={p.title} className="border-b border-rule py-6 md:border-b-0">
              <div className="flex items-baseline gap-3">
                <span className="tabular text-sm font-semibold text-signal">{i + 1}</span>
                <h3 className="text-lg font-display tracking-display">{p.title}</h3>
              </div>
              <p className="mt-2 max-w-measure text-sm text-graphite">{p.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="questions" tone="mist" title="Questions about getting started.">
        <Faq items={FAQ.filter((f) => PICK.has(f.q))} />
      </Section>

      <CtaBand />
    </>
  );
}
