import type { Metadata } from 'next';
import { BarChart3, BellRing, CircleCheck, FileText, ListChecks, ScrollText, Search, Send, UserRoundCheck } from 'lucide-react';
import { CtaBand } from '@/components/CtaBand';
import { HeroApp } from '@/components/home/HeroApp';
import { HeroStage } from '@/components/home/HeroStage';
import { HubDiagram } from '@/components/home/HubDiagram';
import { MediaFrame } from '@/components/MediaFrame';
import { PageIntro } from '@/components/PageIntro';
import { AgentPermissions } from '@/components/screens/AgentPermissions';
import { ApprovalsDemo } from '@/components/screens/ApprovalsDemo';
import { AppWindow } from '@/components/screens/AppWindow';
import { AGENTS_LABEL, AgentsCard } from '@/components/screens/HomeView';
import { PhoneCreate } from '@/components/screens/Phones';
import { delay, Section } from '@/components/Section';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Product',
  description:
    `${SITE.shortName} Work is where your AI agents run and where you see what they did, approve what matters and correct what is wrong. See the screens, the agents and the approvals queue.`,
  alternates: { canonical: '/product' },
  openGraph: { ...OPEN_GRAPH, title: `Product | ${SITE.name}` },
};

const OVERVIEW = [
  { Icon: ListChecks, title: 'Tasks', detail: 'What each agent is working on, and what it has finished.' },
  { Icon: CircleCheck, title: 'Approvals', detail: 'Every draft or action waiting for a person, with the context needed to decide.' },
  { Icon: BellRing, title: 'Alerts and status', detail: 'What is running, what is stuck, and what has been passed to a person.' },
  { Icon: ScrollText, title: 'Activity record', detail: 'Every action by a person or an agent, with what happened and when.' },
];

const AGENTS = [
  { Icon: Search, title: 'Lead research', detail: 'Looks up prospects that fit the criteria you set and collects what your team needs to approach them.' },
  { Icon: Send, title: 'Outreach drafts', detail: 'Drafts a first message for each prospect and holds it for a person to review.' },
  { Icon: BarChart3, title: 'Client reports', detail: 'Pulls the week’s numbers together into a draft report for you to check.' },
  { Icon: FileText, title: 'Proposals', detail: 'Turns call notes into a first draft of a proposal, using your own template.' },
  { Icon: UserRoundCheck, title: 'Status updates', detail: 'Writes a short project update for a client from the work logged, for you to review.' },
  { Icon: BellRing, title: 'Follow up reminders', detail: 'Flags the people who have not replied and drafts a nudge for you to approve.' },
];

function IconCards({ items, cols = 'lg:grid-cols-4' }: { items: typeof OVERVIEW; cols?: string }) {
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
          title="Where your agents work, and where you check them."
          lede={`${SITE.shortName} Work is where the agents run. You see what they did, approve what matters and correct what is wrong. Your team keeps the tools it already uses.`}
        >
          <div className="hero-showcase relative mx-auto mt-16 max-w-stage text-left">
            <span aria-hidden="true" className="glow-pool left-1/2 top-1/3 -z-10 h-96 w-full -translate-x-1/2 opacity-80" />
            <div className="animate-hero" style={{ animationDelay: '320ms' }}>
              <HeroApp />
            </div>
            <p className="mt-6 text-center text-xs text-slate xl:mt-28">Illustration of {SITE.shortName} Work, web and phone views, with example data.</p>
          </div>
        </PageIntro>
      </HeroStage>

      <Section
        id="overview"
        chip="Overview"
        title="One place to see what the agents are doing."
        lede="What is running, what is waiting for you, and what has stopped."
      >
        <IconCards items={OVERVIEW} />
      </Section>

      <Section
        id="workflows"
        chip="Workflows"
        title="Set up around one workflow, then more."
        lede="We install the agents on the one workflow you choose. You can add another once the first is running."
      >
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="card p-4 sm:p-8">
            <AppWindow label={AGENTS_LABEL}>
              <div className="p-4">
                <AgentsCard showWorkflow />
              </div>
            </AppWindow>
            <p className="mt-3 text-center text-xs text-slate">Illustration with example data.</p>
          </div>
          <div data-reveal style={delay(120)} className="space-y-4 text-md text-graphite">
            <p className="max-w-measure">
              Common starting points are researching leads and drafting outreach, building client reports and drafting
              proposals. We choose the final one together on the free call.
            </p>
            <p className="max-w-measure">
              A workflow lists its steps, who or what does each one, and which steps wait for a person to approve them.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="agents"
        chip="AI agents"
        title="Agents, explained by what they do."
        lede="An agent carries out a defined piece of work, such as researching leads or drafting a client report, within the permissions and rules you give it."
      >
        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="card p-4 sm:p-8">
            <div className="flex justify-center">
              <PhoneCreate />
            </div>
            <p className="mt-3 text-center text-xs text-slate">Illustration with example data.</p>
          </div>
          <div data-reveal style={delay(120)} className="card p-4 sm:p-8">
            <AgentPermissions />
            <p className="mt-3 text-center text-xs text-slate">Illustration with example data.</p>
          </div>
        </div>
        <IconCards items={AGENTS} cols="lg:grid-cols-3" />
        <p className="mt-4 text-center text-xs text-slate">Examples. We choose the agents with you on the free call.</p>
      </Section>

      <Section
        id="approvals"
        chip="Approvals"
        title="One queue for every decision that needs a person."
        lede="Each item arrives with the work it traces to, the draft itself, and what will happen once you decide. Ask why the agent stopped, then approve or reject. Try it."
      >
        <div data-reveal className="card mx-auto mt-14 max-w-page p-4 sm:p-8">
          <ApprovalsDemo />
          <p className="mt-3 text-center text-xs text-slate">Interactive example with sample data.</p>
        </div>
      </Section>

      <Section
        id="systems"
        chip="Your tools"
        title="Built to work alongside the tools you already use."
        lede={`${SITE.shortName} sits alongside your tools rather than replacing them. If one cannot be connected, we tell you on the call, and before you pay we confirm in writing which access each agent needs.`}
      >
        <div data-reveal className="mx-auto mt-14 max-w-narrow">
          <HubDiagram />
        </div>
      </Section>

      <Section
        id="demo"
        chip="Demo"
        title="A two minute demo is on its way."
        lede="It will show lead research and outreach drafting. Until it is recorded, the pictures on this page use example data."
      >
        <div data-reveal className="mx-auto mt-12 max-w-narrow">
          <MediaFrame
            label={`Two minute demo: ${SITE.shortName} researching leads and drafting outreach`}
            ratio="video"
            caption="The recording is coming and is not available yet."
          />
        </div>
      </Section>

      <CtaBand
        title="Book a free call to pick your first workflow."
        lede="On the call we choose the one workflow worth starting with. You get the scope and price in writing before you pay."
      />
    </>
  );
}
