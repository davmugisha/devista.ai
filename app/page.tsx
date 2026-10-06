import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { Benefits } from '@/components/home/Benefits';
import { Commitments } from '@/components/home/Commitments';
import { ExplorerIsland } from '@/components/home/ExplorerIsland';
import { ExplorerView } from '@/components/home/ExplorerView';
import { Features } from '@/components/home/Features';
import { Gaps } from '@/components/home/Gaps';
import { Hero } from '@/components/home/Hero';
import { RoiCalculator } from '@/components/home/RoiCalculator';
import { SystemsMarquee } from '@/components/home/SystemsMarquee';
import { ButtonLink } from '@/components/Button';
import { Pricing } from '@/components/Pricing';
import { Section } from '@/components/Section';
import { StageCards } from '@/components/StageCards';
import { FAQ, HOME_FAQ_EXCLUDE } from '@/lib/content';
import { CTA, OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { ...OPEN_GRAPH, title: `${SITE.name}: the operating layer between your systems` },
};

export default function Home() {
  return (
    <>
      <Hero />
      <SystemsMarquee />
      <Gaps />
      <Benefits />
      <RoiCalculator />
      <Features />

      <Section
        id="idea"
        chip="Every step has an owner"
        title="People command. AI executes."
        lede="Each task goes to the best mix of people, AI and software. Pick a department to see who does each step, where approval sits, and what escalates to a person."
      >
        <div data-reveal>
          <ExplorerIsland uid="wf">
            <ExplorerView uid="wf" active={0} focus={null} />
          </ExplorerIsland>
        </div>
        <p className="mt-4 text-center text-xs text-slate">
          Examples for illustration. Your workflows, rules and approvers are mapped during the audit and set by you.
        </p>
      </Section>

      <Section
        id="how-it-works"
        chip="How it works"
        title="Start with one department. Expand when it proves itself."
        lede={`Six stages take you from the first conversation to a department running on ${SITE.shortName}, with a decision for you at each one.`}
      >
        <StageCards />
        <div data-reveal className="mt-12 flex justify-center">
          <ButtonLink href="/how-it-works" variant="secondary" track="home-how">
            How an engagement runs
          </ButtonLink>
        </div>
      </Section>

      <Section
        id="pricing"
        chip="Pricing"
        title="Start free. Decide with the findings in hand."
        lede="The audit costs nothing. Everything after it is scoped, priced and agreed in writing before any work starts."
      >
        <Pricing />
      </Section>

      <Commitments />

      <section id="faq" aria-labelledby="faq-title" className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-page gap-12 rounded-card border border-rule bg-mist px-6 py-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16 md:px-12 md:py-20">
          <div data-reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-wide text-signal">FAQ</p>
            <h2 id="faq-title" className="mt-5 max-w-sm text-4xl font-display tracking-display text-ink">What should you know before we talk?</h2>
            <p className="mt-6 max-w-sm text-base text-graphite">Clear answers about the work, the controls and the first step.</p>
            <ButtonLink href={CTA.book.href} variant="quiet" track="faq" className="mt-6">
              {CTA.book.label}
            </ButtonLink>
          </div>
          <Faq items={FAQ.filter((f) => !HOME_FAQ_EXCLUDE.has(f.q))} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
