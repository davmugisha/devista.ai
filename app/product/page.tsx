import type { Metadata } from 'next';
import { BarChart3, BellRing, CircleCheck, FileText, LifeBuoy, Search, Target, Wallet, Workflow } from 'lucide-react';
import { CtaBand } from '@/components/CtaBand';
import { FloatingCards } from '@/components/home/FloatingCards';
import { CommandCenter } from '@/components/home/CommandCenter';
import { HeroStage } from '@/components/home/HeroStage';
import { HubDiagram } from '@/components/home/HubDiagram';
import { MediaFrame } from '@/components/MediaFrame';
import { PageIntro } from '@/components/PageIntro';
import { AgentConsole } from '@/components/screens/AgentConsole';
import { AgentPermissions } from '@/components/screens/AgentPermissions';
import { ApprovalsDemo } from '@/components/screens/ApprovalsDemo';
import { DepartmentView } from '@/components/screens/DepartmentView';
import { delay, Section } from '@/components/Section';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Product',
  description:
    `The ${SITE.shortName} command center, the departments you configure, the AI agents that work inside your rules, and one approvals queue for every decision that needs a person.`,
  alternates: { canonical: '/product' },
  openGraph: { ...OPEN_GRAPH, title: `Product | ${SITE.name}` },
};

const COMMAND = [
  { Icon: Target, title: 'Goals and tasks', detail: 'What each department is working toward, and who or what is doing each piece of work.' },
  { Icon: CircleCheck, title: 'Approvals', detail: 'Every decision waiting for a person, with the context needed to decide.' },
  { Icon: BellRing, title: 'Alerts and status', detail: 'What is running, what is stuck, and what has escalated to someone.' },
  { Icon: BarChart3, title: 'Reports', detail: 'Reports compiled from your systems, so no one rebuilds them by hand each week.' },
];

const AGENTS = [
  { Icon: BarChart3, title: 'Reporting', detail: 'Compiles the weekly operations report from your systems and sends a draft for review.' },
  { Icon: FileText, title: 'Documents', detail: 'Prepares proposals, contracts and records from your templates for a person to check.' },
  { Icon: Wallet, title: 'Finance', detail: 'Matches invoices to orders and prepares entries within the limits you set.' },
  { Icon: LifeBuoy, title: 'Support', detail: 'Sorts incoming tickets by topic and urgency and routes them to the right queue.' },
  { Icon: Search, title: 'Research', detail: 'Gathers and summarizes information for a decision someone on your team will make.' },
  { Icon: Workflow, title: 'Operations', detail: 'Checks requests against budget and policy and moves approved work to the next system.' },
];

function IconCards({ items, cols = 'lg:grid-cols-4' }: { items: typeof COMMAND; cols?: string }) {
  return (
    <ul className={'mt-14 grid gap-4 sm:grid-cols-2 ' + cols}>
      {items.map(({ Icon, title, detail }, i) => (
        <li key={title} data-reveal style={delay((i % 4) * 80)} className="card p-6">
          <span className="flex size-10 items-center justify-center rounded-control border border-rule bg-panel">
            <Icon aria-hidden="true" className="size-5 text-signal-bright" strokeWidth={1.8} />
          </span>
          <h3 className="mt-5 text-lg font-display tracking-snug text-ink">{title}</h3>
          <p className="mt-2 text-sm text-graphite">{detail}</p>
        </li>
      ))}
    </ul>
  );
}

export default function ProductPage() {
  return (
    <>
      <HeroStage>
        <PageIntro
          chip="The product"
          title="One command center over the systems you already run."
          lede={`Your teams keep the tools they know. ${SITE.shortName} adds one place to see and direct the work across departments, and AI agents that carry it between systems under your rules.`}
        >
          <div className="hero-showcase relative mx-auto mt-16 max-w-stage text-left">
            <span aria-hidden="true" className="glow-pool left-1/2 top-1/3 -z-10 h-96 w-full -translate-x-1/2 opacity-80" />
            <div className="animate-hero" style={{ animationDelay: '320ms' }}>
              <div className="tilt mx-auto lg:w-4/5">
                <CommandCenter />
              </div>
            </div>
            <FloatingCards />
            <p className="mt-5 text-center text-xs text-slate">Illustration of the command center with example data.</p>
          </div>
        </PageIntro>
      </HeroStage>

      <Section
        id="command-center"
        chip="Command center"
        title="Where leadership sees the whole company."
        lede="How every department is running, and the calls that need a person, in one place."
      >
        <IconCards items={COMMAND} />
      </Section>

      <Section
        id="departments"
        chip="Departments"
        title="Configured around how each department works."
        lede="You choose which departments to start with, and not every company needs every module."
      >
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="card p-4 sm:p-8">
            <DepartmentView />
            <p className="mt-3 text-center text-xs text-slate">Illustration with example data.</p>
          </div>
          <div data-reveal style={delay(120)} className="space-y-4 text-md text-graphite">
            <p className="max-w-measure">
              Companies typically start with one of finance, operations, sales or support, and add others such as
              marketing, projects, knowledge and documents as each one proves itself.
            </p>
            <p className="max-w-measure">
              A department module brings together that department&rsquo;s work from the tools it already uses, with its
              own approvals, rules and reports.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="agents"
        chip="AI agents"
        title="Agents, explained by what they do."
        lede="An agent carries out a defined piece of work, such as matching invoices or compiling a report, within the permissions and rules you give it. The agents you use are chosen during the audit."
      >
        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="card p-4 sm:p-8">
            <AgentConsole />
            <p className="mt-3 text-center text-xs text-slate">Illustration with example data.</p>
          </div>
          <div data-reveal style={delay(120)} className="card p-4 sm:p-8">
            <AgentPermissions />
            <p className="mt-3 text-center text-xs text-slate">Illustration with example data.</p>
          </div>
        </div>
        <IconCards items={AGENTS} cols="lg:grid-cols-3" />
        <p className="mt-4 text-center text-xs text-slate">Examples. The agents you use are chosen during the audit.</p>
      </Section>

      <Section
        id="approvals"
        chip="Approvals"
        title="One queue for every decision that needs a person."
        lede="Invoices above the limit, purchases above a threshold, refunds: each arrives with what the agent did, why it stopped, and what happens once you decide. Try it."
      >
        <div data-reveal className="card mx-auto mt-14 max-w-page p-4 sm:p-8">
          <ApprovalsDemo />
          <p className="mt-3 text-center text-xs text-slate">Interactive example with sample data.</p>
        </div>
      </Section>

      <Section
        id="systems"
        chip="Your systems"
        title="Built on the systems you already run."
        lede={`${SITE.shortName} connects to the tools you already use rather than replacing them. Which of your systems connect, and how, is confirmed in writing during the audit.`}
      >
        <div data-reveal className="mx-auto mt-14 max-w-narrow">
          <HubDiagram />
        </div>
      </Section>

      <Section id="tour" chip="Product tour" title="A recorded walkthrough is on its way." lede="Until then, the renderings on this page show the command center with example data.">
        <div data-reveal className="mx-auto mt-12 max-w-narrow">
          <MediaFrame label="Product tour video" ratio="video" />
        </div>
      </Section>

      <CtaBand title={`See what ${SITE.shortName} would run in your company.`} />
    </>
  );
}
