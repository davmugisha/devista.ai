import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { WorkflowExplorer } from '@/components/home/WorkflowExplorer';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      <Hero />
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
    </>
  );
}
