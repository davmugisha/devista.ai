import type { Metadata } from 'next';
import { ActivityLog } from '@/components/ActivityLog';
import { AuditOffer } from '@/components/AuditOffer';
import { ButtonLink } from '@/components/Button';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { Hero } from '@/components/home/Hero';
import { WorkflowExplorer } from '@/components/home/WorkflowExplorer';
import { ItemList } from '@/components/ItemList';
import { MediaFrame } from '@/components/MediaFrame';
import { Section } from '@/components/Section';
import { Stages } from '@/components/Stages';
import { CONTROLS, FAQ, GAPS, PRODUCT_PARTS } from '@/lib/content';
import { CTA } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { title: 'Devista AI: the operating layer between your systems' },
};

export default function Home() {
  return (
    <>
      <Hero />

      <Section
        id="problem"
        title="Your company is not short of software. It is short of the layer between it."
        lede="Established companies run on good systems that were never designed to work together. The work between them falls to people."
      >
        <div className="mt-12">
          <ItemList items={GAPS} />
        </div>
      </Section>

      <Section
        id="idea"
        tone="mist"
        title="People command. AI executes. Every step has an owner."
        lede="Each task goes to the most effective mix of people, AI and software. People keep strategy, approvals and exceptions. AI prepares and drafts. Agents run repetitive, measurable work, only within the rules you set."
      >
        <WorkflowExplorer />
        <p className="mt-4 text-xs text-slate">
          Examples for illustration. Your workflows, rules and approvers are mapped during the audit and set by you.
        </p>
      </Section>

      <Section
        id="product"
        title="One place to run the company from."
        lede="Your teams keep the tools they know. Devista adds the command center over them, and the agents that do the work between them."
      >
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <ItemList items={PRODUCT_PARTS} columns={1} />
            <ButtonLink href={CTA.product.href} variant="quiet" track="home-product">
              {CTA.product.label}
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <MediaFrame label="Product screen: command center overview" />
          </div>
        </div>
      </Section>

      <Section
        id="control"
        tone="mist"
        title="AI works inside the limits you set."
        lede="Nothing important happens without a person approving it, and every action, by a person or an agent, is on record."
      >
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <ItemList items={CONTROLS} />
            <ButtonLink href="/security" variant="quiet" track="home-security">
              How control and security work
            </ButtonLink>
          </div>
          <div className="lg:col-span-5">
            <ActivityLog />
          </div>
        </div>
      </Section>

      <Section
        id="how-it-works"
        title="Start with one department. Expand when it proves itself."
        lede="Six stages take you from the first conversation to a department running on Devista, with a decision for you at each one."
      >
        <Stages />
        <ButtonLink href="/how-it-works" variant="quiet" track="home-how" className="mt-6">
          How an engagement runs
        </ButtonLink>
      </Section>

      <Section
        id="audit"
        tone="mist"
        title="What happens in the operations audit."
        lede="A short, structured look at one department, run with the people who do the work. It is free, and the findings are yours to keep."
      >
        <div className="mt-12">
          <AuditOffer />
        </div>
        <ButtonLink href={CTA.book.href} track="home-audit" className="mt-12">
          {CTA.book.label}
        </ButtonLink>
      </Section>

      <Section id="faq" title="Questions executives ask before they book.">
        <Faq items={FAQ} />
      </Section>

      <CtaBand />
    </>
  );
}
