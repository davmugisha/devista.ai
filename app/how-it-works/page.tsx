import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { PageIntro } from '@/components/PageIntro';
import { Pricing } from '@/components/Pricing';
import { delay, Section } from '@/components/Section';
import { StageCards } from '@/components/StageCards';
import { FAQ } from '@/lib/content';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    `Six stages from the first conversation to a department running on ${SITE.shortName}: Discover, Diagnose, Architect, Build, Deploy, Operate. Plus how pricing works.`,
  alternates: { canonical: '/how-it-works' },
  openGraph: { ...OPEN_GRAPH, title: `How it works | ${SITE.name}` },
};

const PICK = new Set(['Will the rollout disrupt our operations?', 'How long does it take?', 'How do we bring our teams along?', 'How does pricing work?']);

const DEPARTMENTS = [
  { name: 'Finance', state: 'Live' },
  { name: 'Operations', state: 'Next' },
  { name: 'Sales', state: 'Later' },
  { name: 'Support', state: 'Later' },
  { name: 'Projects', state: 'Later' },
  { name: 'Marketing', state: 'Later' },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro
        chip="How it works"
        title="Start with one department. Expand when it proves itself."
        lede={`Six stages take you from the first conversation to a department running on ${SITE.shortName}. Each one ends with a decision that is yours to make.`}
      />

      <Section id="stages" chip="The six stages" title="The same sequence, for every department you add." lede="What we do at each stage, and the decision that stays with you.">
        <StageCards detailed />
      </Section>

      <Section
        id="one-department"
        chip="Why one department first"
        title="Small enough to change safely. Large enough to prove it."
        lede="The first department sets the pattern: which work moves to agents, where approvals sit, and how your people work alongside it."
      >
        <div data-reveal className="card mx-auto mt-14 max-w-page p-6 md:p-10">
          <p className="text-sm font-semibold text-ink">Then the next department, one at a time</p>
          <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {DEPARTMENTS.map((d, i) => (
              <li
                key={d.name}
                data-reveal
                style={delay(i * 80)}
                className={
                  'rounded-frame border px-4 py-4 ' +
                  (d.state === 'Live'
                    ? 'border-signal/60 bg-signal-tint shadow-glow'
                    : d.state === 'Next'
                      ? 'border-dashed border-rule-strong bg-panel'
                      : 'border-rule bg-paper/40')
                }
              >
                <p className="tabular text-xs text-slate">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-2 text-md font-semibold text-ink">{d.name}</p>
                <p className={'mt-1 flex items-center gap-2 text-xs ' + (d.state === 'Live' ? 'text-signal-bright' : 'text-graphite')}>
                  {d.state === 'Live' ? (
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full rounded-dot bg-signal-bright animate-ping" />
                      <span className="relative inline-flex size-2 rounded-dot bg-signal-bright" />
                    </span>
                  ) : null}
                  {d.state}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-measure text-sm text-graphite">
            The switchover plan is agreed with each department&rsquo;s head, and nothing goes live without sign-off. When a
            department has proven itself, the next follows the same six stages, reusing what the first one established.
          </p>
          <p className="mt-3 text-xs text-slate">Example order. You choose which department starts and what follows.</p>
        </div>
      </Section>

      <Section
        id="pricing"
        chip="Pricing"
        title="You always know the cost before work starts."
        lede="We do not publish a price list, because scope differs by company. The audit is free, and everything after it is agreed in writing."
      >
        <Pricing />
      </Section>

      <Section id="questions" chip="FAQ" title="Questions about getting started.">
        <Faq items={FAQ.filter((f) => PICK.has(f.q))} />
      </Section>

      <CtaBand />
    </>
  );
}
