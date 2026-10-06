import type { Metadata } from 'next';
import { Check, Crown, Layers, Microscope, Plug, UsersRound, X } from 'lucide-react';
import { CtaBand } from '@/components/CtaBand';
import { PageIntro } from '@/components/PageIntro';
import { delay, Section } from '@/components/Section';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Company',
  description:
    `${SITE.shortName} builds the operating layer that lets established companies run as one, with people in command and AI doing the work between systems.`,
  alternates: { canonical: '/company' },
  openGraph: { ...OPEN_GRAPH, title: `Company | ${SITE.name}` },
};

const PRINCIPLES = [
  { Icon: Crown, title: 'People command, AI executes', detail: 'Judgment, accountability and relationships stay with people. AI takes on the work that only needs doing, not deciding.' },
  { Icon: Plug, title: 'Connect before replacing', detail: 'Companies have invested years in their systems. We build on them and recommend a replacement only where a tool cannot do the job.' },
  { Icon: Layers, title: 'Prove it in one department', detail: 'Every engagement starts small, with a free audit and one department, so you judge us on results before committing further.' },
  { Icon: Microscope, title: 'Nothing we cannot show', detail: 'We describe only what the product does today, and we put scope, cost and ownership in writing before work starts.' },
];

const TODAY = [
  'The same data typed into several systems',
  'Approvals chased over email and chat',
  'Reports rebuilt by hand every week',
  'No one place that shows how the company is running',
  'Work stalls when the person who knows the steps is away',
];

const WITH = [
  'Agents carry data from one system to the next',
  'One queue for every decision, with the context attached',
  'Reports compiled from your systems, sent as a draft',
  'A command center over every department',
  'Every step written down, with an owner and a record',
];

export default function CompanyPage() {
  return (
    <>
      <PageIntro
        chip={`About ${SITE.shortName}`}
        title="Built for companies that already run on good systems."
        lede={`${SITE.shortName} builds the layer that lets established companies run as one company, with people in command and AI doing the work between systems.`}
      />

      <Section id="principles" chip="How we work" title="Four commitments that shape every engagement.">
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

      <Section id="difference" chip="Why it matters" title="What changes when the work between systems has an owner.">
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
      </Section>

      <Section id="team" chip="Our team" title="Who you will work with.">
        <div data-reveal className="card mx-auto mt-12 flex max-w-narrow flex-col items-center p-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-dot border border-rule bg-panel">
            <UsersRound aria-hidden="true" className="size-6 text-signal-bright" strokeWidth={1.8} />
          </span>
          <p className="mt-5 text-lg font-medium text-ink">Team profiles and company details are being added.</p>
          <p className="mt-2 max-w-measure text-base text-graphite">
            In the meantime, book an operations audit: you will meet the people who run it on the introductory call.
          </p>
        </div>
      </Section>

      <CtaBand title="Meet the team on the introductory call." />
    </>
  );
}
