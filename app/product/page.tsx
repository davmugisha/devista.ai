import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { ItemList } from '@/components/ItemList';
import { MediaFrame } from '@/components/MediaFrame';
import { PageIntro } from '@/components/PageIntro';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Product',
  description:
    'The Devista command center, the departments you configure, the AI agents that work inside your rules, and one approvals queue for every decision that needs a person.',
  alternates: { canonical: '/product' },
  openGraph: { title: 'Product | Devista AI' },
};

const COMMAND = [
  { title: 'Goals and tasks', detail: 'What each department is working toward, and who or what is doing each piece of work.' },
  { title: 'Approvals', detail: 'Every decision waiting for a person, with the context needed to decide.' },
  { title: 'Alerts and status', detail: 'What is running, what is stuck, and what has escalated to someone.' },
  { title: 'Reports', detail: 'Reports compiled from your systems, so no one rebuilds them by hand each week.' },
];

const AGENTS = [
  { title: 'Reporting', detail: 'Compiles the weekly operations report from your systems and sends a draft for review.' },
  { title: 'Documents', detail: 'Prepares proposals, contracts and records from your templates for a person to check.' },
  { title: 'Finance', detail: 'Matches invoices to orders and prepares entries within the limits you set.' },
  { title: 'Support', detail: 'Sorts incoming tickets by topic and urgency and routes them to the right queue.' },
  { title: 'Research', detail: 'Gathers and summarizes information for a decision someone on your team will make.' },
  { title: 'Operations', detail: 'Checks requests against budget and policy and moves approved work to the next system.' },
];

export default function ProductPage() {
  return (
    <>
      <PageIntro
        title="One command center over the systems you already run."
        lede="Your teams keep the tools they know. Devista adds one place to see and direct the work across departments, and AI agents that carry it between systems under your rules."
      >
        <div className="mt-12 max-w-narrow">
          <MediaFrame label="Product tour video" ratio="video" caption="A walkthrough of the command center is being recorded." />
        </div>
      </PageIntro>

      <Section
        id="command-center"
        title="The command center."
        lede="Where leadership sees how the company is running and makes the calls that need a person."
      >
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <ItemList items={COMMAND} columns={1} />
          </div>
          <div className="lg:col-span-7">
            <MediaFrame label="Product screen: command center overview" />
          </div>
        </div>
      </Section>

      <Section
        id="departments"
        tone="mist"
        title="Departments, configured for your company."
        lede="Each department gets a module set up around how it actually works. You choose which departments to start with, and not every company needs every module."
      >
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <MediaFrame label="Product screen: department view" />
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-measure text-base text-graphite">
              Companies typically start with one of finance, operations, sales or support, and add others such as
              marketing, projects, knowledge and documents as each one proves itself.
            </p>
            <p className="mt-4 max-w-measure text-base text-graphite">
              A department module brings together that department&rsquo;s work from the tools it already uses, with its own
              approvals, rules and reports.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="agents"
        title="AI agents, explained by what they do."
        lede="An agent is software that carries out a defined piece of work, such as matching invoices or compiling a report, within the permissions and rules you give it. These are examples; the agents you use are chosen during the audit."
      >
        <div className="mt-12">
          <ItemList items={AGENTS} />
        </div>
        <div className="mt-12">
          <MediaFrame label="Product screen: agents and their permissions" />
        </div>
      </Section>

      <Section
        id="approvals"
        tone="mist"
        title="One queue for every decision that needs a person."
        lede="Invoices above the limit, messages to customers, purchases above a threshold: each arrives with what the agent did, why it stopped, and what happens once you decide."
      >
        <div className="mt-12">
          <MediaFrame label="Product screen: approvals queue" />
        </div>
      </Section>

      <Section
        id="systems"
        title="Built on the systems you already run."
        lede="Devista connects to the tools a company already uses rather than replacing them. Where a tool cannot do the job, we say so and recommend an alternative. Which of your systems connect, and how, is confirmed in writing during the audit."
      />

      <CtaBand title="See what Devista would run in your company." />
    </>
  );
}
