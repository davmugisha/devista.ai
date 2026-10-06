import type { ReactNode } from 'react';
import { ButtonLink } from '../Button';
import { AgentConsole } from '../screens/AgentConsole';
import { AgentPermissions } from '../screens/AgentPermissions';
import { ApprovalsDemo } from '../screens/ApprovalsDemo';
import { CompanyOverview } from '../screens/CompanyOverview';
import { Chip, delay, SectionHead } from '../Section';
import { CTA, SITE } from '@/lib/site';

type Row = { chip: string; title: string; body: string; tags: string[]; visual: ReactNode; note?: string; after?: ReactNode };

const ROWS: Row[] = [
  {
    chip: 'Command center',
    title: 'See the whole company in one place',
    body: 'Goals, tasks, approvals, alerts and reports for every department, drawn from the tools each team already uses.',
    tags: ['Goals', 'Approvals', 'Alerts', 'Reports'],
    visual: <CompanyOverview />,
  },
  {
    chip: 'AI agents',
    title: 'Hand the handoffs to agents',
    body: 'Agents carry repetitive, measurable work from one system to the next: reading, matching, routing and compiling, only within the permissions you set.',
    tags: ['Invoices', 'Reports', 'Ticket triage', 'Purchase orders'],
    visual: <AgentConsole />,
  },
  {
    chip: 'Approvals',
    title: 'Decide in one queue, with the context attached',
    body: 'Every decision that needs a person arrives with what the agent did, why it stopped, and what happens once you decide. Try it.',
    tags: ['Invoices above the limit', 'Purchases', 'Refunds'],
    visual: <ApprovalsDemo />,
    note: 'Interactive example with sample data.',
  },
  {
    chip: 'Control',
    title: 'Agents work inside the rules you write',
    body: 'Set what each agent may do on its own, what needs a person, and what it may never do. Every action, by a person or an agent, is on record.',
    tags: ['Permissions', 'Policies', 'Escalation', 'Audit trail'],
    visual: <AgentPermissions />,
    after: (
      <ButtonLink href="/security" variant="quiet" track="home-security" className="mt-4">
        How control and security work
      </ButtonLink>
    ),
  },
];

/** The product, one capability per row, each shown working rather than described. */
export function Features() {
  return (
    <section id="product" aria-labelledby="product-title" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-page px-4 md:px-8">
        <SectionHead
          id="product"
          chip="The product"
          title="One operating layer over every system you run."
          lede={`Your teams keep the tools they know. ${SITE.shortName} adds the command center over them, and the agents that do the work between them.`}
        />
        <div className="mt-16 grid gap-20 md:mt-20 md:gap-28">
          {ROWS.map((r, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={r.chip} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div data-reveal className={'card relative p-4 sm:p-8 ' + (flip ? 'lg:order-2' : '')}>
                  <span aria-hidden="true" className="glow-pool left-1/2 top-1/2 -z-10 h-64 w-80 -translate-x-1/2 -translate-y-1/2 opacity-40" />
                  {r.visual}
                  <p className="mt-3 text-center text-xs text-slate">{r.note ?? 'Illustration with example data.'}</p>
                </div>
                <div data-reveal style={delay(120)} className={flip ? 'lg:order-1' : ''}>
                  <Chip>{r.chip}</Chip>
                  <h3 className="mt-5 text-3xl font-display tracking-display text-ink">{r.title}</h3>
                  <p className="mt-4 max-w-measure text-md text-graphite">{r.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {r.tags.map((t) => (
                      <li key={t} className="rounded-control border border-rule bg-mist px-3 py-1 text-sm text-ink">
                        {t}
                      </li>
                    ))}
                  </ul>
                  {r.after}
                </div>
              </article>
            );
          })}
        </div>
        <div data-reveal className="mt-20 flex justify-center">
          <ButtonLink href={CTA.product.href} variant="secondary" track="home-product">
            {CTA.product.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
