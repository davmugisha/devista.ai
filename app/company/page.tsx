import type { Metadata } from 'next';
import { Check, FileCheck, Layers, Microscope, UserRoundCheck, X } from 'lucide-react';
import { CtaBand } from '@/components/CtaBand';
import { Founder } from '@/components/Founder';
import { PageIntro } from '@/components/PageIntro';
import { delay, Section } from '@/components/Section';
import { PORTFOLIO } from '@/lib/content';
import { FOUNDER, OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Company',
  description:
    `${SITE.shortName} installs a team of AI agents on one workflow in a small agency in 7 days, at a fixed price, with people making the decisions and agents doing the repeat work.`,
  alternates: { canonical: '/company' },
  openGraph: { ...OPEN_GRAPH, title: `Company | ${SITE.name}` },
};

const PRINCIPLES = [
  { Icon: UserRoundCheck, title: 'People decide, agents do the repeat work', detail: 'Judgment, approvals and client relationships stay with your people. Agents take on repeat work such as researching leads or drafting reports.' },
  { Icon: FileCheck, title: 'Fixed price and written scope before you pay', detail: 'You get the scope and one fixed price in writing first. The work starts only after you have paid.' },
  { Icon: Layers, title: 'One workflow first', detail: 'Every install starts with a single workflow, so you can see it working before you decide to add another.' },
  { Icon: Microscope, title: 'Nothing we cannot show', detail: 'We describe only what the product does today, label every example, and show past work only with the client’s written permission.' },
];

const TODAY = [
  'Leads researched by hand, one tab at a time',
  'Reports rebuilt every week from the same exports',
  'Drafts waiting in a chat thread for sign-off',
  'Proposals started from a blank page',
  'Work stalls when the person who knows the steps is away',
];

const WITH = [
  'Agents do the research and write the first drafts',
  'One queue for every draft that needs a person',
  'Reports pulled together as a draft for you to check',
  'Proposals start from your notes and your template',
  'Every action recorded, with who or what did it',
];

export default function CompanyPage() {
  return (
    <>
      <PageIntro
        chip={`About ${SITE.shortName}`}
        title="Built for small agencies that want AI doing the repeat work."
        lede={`${SITE.shortName} installs a team of AI agents on one workflow in your agency, then trains your team to run them. Your people make the decisions. The agents do the repeat work.`}
      />

      <Section id="principles" chip="How we work" title="Four commitments that shape every project.">
        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {PRINCIPLES.map(({ Icon, title, detail }, i) => (
            <li key={title} data-reveal style={delay((i % 2) * 90)} className="card flex gap-5 p-7">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-control border border-rule bg-panel">
                <Icon aria-hidden="true" className="size-5 text-signal-bright" strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-xl font-display tracking-snug text-ink">{title}</h3>
                <p className="mt-2 text-base text-graphite">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="difference" chip="Why it matters" title="What changes when the repeat work has an owner.">
        <div className="mx-auto mt-14 grid max-w-page gap-4 md:grid-cols-2">
          <div data-reveal className="card card-quiet p-7">
            <h3 className="text-lg font-semibold text-graphite">Today</h3>
            <ul className="mt-5 space-y-4">
              {TODAY.map((t) => (
                <li key={t} className="flex items-start gap-3 text-base text-graphite">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-dot bg-alert-tint">
                    <X aria-hidden="true" className="size-3 text-alert" strokeWidth={2.6} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={delay(120)} className="card card-lit p-7">
            <h3 className="text-lg font-semibold text-ink">With {SITE.shortName}</h3>
            <ul className="mt-5 space-y-4">
              {WITH.map((t) => (
                <li key={t} className="flex items-start gap-3 text-base text-ink">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-dot bg-signal">
                    <Check aria-hidden="true" className="size-3 text-on-signal" strokeWidth={2.6} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate">Examples of repeat work. What changes for you depends on the workflow we set up.</p>
      </Section>

      <Section id="past-work" chip="Past work" title="Past projects." lede="Portfolio work, shown only with the client’s written permission.">
        {PORTFOLIO.length ? (
          <ul className="mt-14 grid gap-4 md:grid-cols-2">
            {PORTFOLIO.map((p, i) => (
              <li key={p.title} data-reveal style={delay((i % 2) * 90)} className="card p-7">
                <h3 className="text-xl font-display tracking-snug text-ink">{p.title}</h3>
                <p className="mt-2 text-base text-graphite">{p.what}</p>
                {p.client ? <p className="mt-4 text-sm text-slate">Client: {p.client}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <div data-reveal className="card mx-auto mt-12 flex max-w-narrow flex-col items-center border-dashed p-10 text-center">
            <span className="rounded-chip border border-dashed border-rule-strong px-2 py-px text-xs font-medium text-slate">Placeholder</span>
            <p className="mt-5 text-lg font-medium text-ink">Past projects appear here once each client has agreed.</p>
            <p className="mt-2 max-w-measure text-base text-graphite">Nothing is listed yet.</p>
          </div>
        )}
        <p className="mt-4 text-center text-xs text-slate">Past projects are portfolio work, not {SITE.shortName} customers.</p>
      </Section>

      <Founder id="team" promises={false} />

      <CtaBand
        title={`Talk to ${FOUNDER.name.split(' ')[0]} on the free call.`}
        lede="Ask how the install works and who does each part of it. You get the scope and price in writing before you pay."
      />
    </>
  );
}
