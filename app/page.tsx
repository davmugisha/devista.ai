import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Button';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { Founder } from '@/components/Founder';
import { AgentTeam } from '@/components/home/AgentTeam';
import { CostCalculator } from '@/components/home/CostCalculator';
import { Deliverables } from '@/components/home/Deliverables';
import { Hero } from '@/components/home/Hero';
import { Pains } from '@/components/home/Pains';
import { ToolMarquee } from '@/components/home/ToolMarquee';
import { MagneticButtonLink } from '@/components/MagneticButtonLink';
import { Pricing } from '@/components/Pricing';
import { Section } from '@/components/Section';
import { StageCards } from '@/components/StageCards';
import { FAQ, HOME_FAQ_EXCLUDE } from '@/lib/content';
import { CTA, OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: { absolute: `${SITE.name}: ${SITE.tagline}` },
  description: SITE.description,
  openGraph: { ...OPEN_GRAPH, title: `${SITE.name}: ${SITE.tagline}`, description: SITE.description },
};

// Service first (David, 2026-10-11): the page sells the problem, the agent team, the steps, what
// the buyer gets and who they work with. App screens live on /product only.
export default function Home() {
  return (
    <>
      <Hero />
      <ToolMarquee />
      <Pains />

      <Section
        id="how-it-works"
        chip="How it works"
        title="From a free call to agents at work in 7 days."
        lede="Four steps, and each one ends with something you can check. The install starts once you have paid and we have agreed the workflow."
      >
        <StageCards />
        <div data-reveal className="card card-lit mt-6 flex flex-col items-start gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-xl font-display tracking-snug text-ink">Know what you get and what it costs before you pay anything.</p>
            <p className="mt-1 text-sm text-graphite">The call is free. The scope and the price come in writing after it.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <ButtonLink href="/how-it-works" variant="quiet" track="home-how">
              How the install runs
            </ButtonLink>
            <MagneticButtonLink href={CTA.book.href} track="how">
              {CTA.book.label}
            </MagneticButtonLink>
          </div>
        </div>
      </Section>

      <CostCalculator />
      <AgentTeam />
      <Deliverables />

      <Section
        id="pricing"
        chip="Pricing"
        title="Fixed prices, paid upfront."
        lede="Start with the Agent Team Setup: 3 to 5 agents on one workflow in 7 days. The other two offers are scoped on the free call."
      >
        <Pricing />
      </Section>

      <Founder />

      {/* One centred column of question cards, closing with the booking button (after altari.ai). */}
      <section id="faq" aria-labelledby="faq-title" className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-narrow">
          <div data-reveal className="text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-wide text-signal-bright">FAQ</p>
            <h2 id="faq-title" className="mt-4 text-4xl font-display tracking-display text-ink">
              Common <span className="text-signal-bright">questions.</span>
            </h2>
          </div>
          <Faq className="mt-10" items={FAQ.filter((f) => !HOME_FAQ_EXCLUDE.has(f.q))} />
          <div data-faq-more data-reveal className="mt-10 text-center">
            <p className="text-base text-graphite">Still got questions? Get them answered in 30 minutes.</p>
            <ButtonLink href={CTA.book.href} track="faq" className="mt-4">
              {CTA.book.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <CtaBand
        title="Let’s find the hours your agency is losing."
        lede="A free 30 minute call. You leave knowing which workflow to hand to agents first and what it costs."
      />
    </>
  );
}
