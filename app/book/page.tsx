import type { Metadata } from 'next';
import { CalendarClock, Clock, Gift, ShieldCheck } from 'lucide-react';
import { AuditDeliverables, RENDERED } from '@/components/AuditDeliverables';
import { AuditOffer } from '@/components/AuditOffer';
import { Chip, delay, Section } from '@/components/Section';
import { BookingFlow } from './BookingFlow';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book a free call',
  description:
    `Book a free introductory call with ${SITE.name} to discuss your workflows and the next step.`,
  alternates: { canonical: '/book' },
  openGraph: { ...OPEN_GRAPH, title: `Book a free call | ${SITE.name}` },
};

const FACTS = [
  { Icon: Gift, title: 'Free, no obligation', detail: 'You keep the findings either way.' },
  { Icon: Clock, title: 'About two weeks', detail: 'One department or workflow.' },
  { Icon: ShieldCheck, title: 'No system access needed', detail: 'We work from walkthroughs.' },
];

export default function BookPage() {
  return (
    <>
      <section aria-labelledby="page-title" className="hero-sky relative isolate overflow-hidden">
        <div className="mx-auto max-w-page px-4 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
          <div className="text-center">
            <Chip className="animate-hero">Book a free call</Chip>
            <h1
              id="page-title"
              className="mx-auto mt-6 max-w-heading text-5xl font-display tracking-display text-ink animate-hero"
              style={{ animationDelay: '80ms' }}
            >
              Let’s talk about the work you want to automate.
            </h1>
            <p className="mx-auto mt-6 max-w-narrow text-lg text-graphite animate-hero" style={{ animationDelay: '160ms' }}>
              Tell us who you are, then choose a time for a free introductory call. We will discuss your workflows and where an agent could help first.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-narrow">
            <ul className="grid gap-3 sm:grid-cols-2">
              {[FACTS[0], {
                Icon: CalendarClock,
                title: 'Choose a time now',
                detail: 'Book in your time zone.',
              }, ...FACTS.slice(1)].map(({ Icon, title, detail }, i) => (
                <li key={title} className="card flex items-center gap-4 p-5 animate-hero" style={{ animationDelay: `${240 + i * 60}ms` }}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-control border border-rule bg-panel">
                    <Icon aria-hidden="true" className="size-5 text-signal-bright" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="text-sm text-graphite">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto mt-4 max-w-stage">
            <BookingFlow />
          </div>
        </div>
      </section>

      <Section
        id="offer"
        chip="What the audit covers"
        title="A structured look at one department."
        lede="Run with the people who do the work. You keep everything it produces."
      >
        <div className="mt-14">
          <AuditDeliverables />
        </div>
        <div data-reveal style={delay(80)} className="card card-quiet mt-10 p-6 md:p-10">
          <AuditOffer except={RENDERED} />
        </div>
      </Section>
    </>
  );
}
