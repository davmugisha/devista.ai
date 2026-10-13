import type { Metadata } from 'next';
import { CalendarClock, Check, Clock, FileCheck, ShieldCheck } from 'lucide-react';
import { ContactLink } from '@/components/ContactLink';
import { PageIntro } from '@/components/PageIntro';
import { delay, Section } from '@/components/Section';
import { BookingFlow } from './BookingFlow';
import { BOOKING } from '@/lib/booking-config';
import { OFFERS, STEPS } from '@/lib/content';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book a free call',
  description:
    `Book a free ${BOOKING.durationMinutes} minute call with ${SITE.name} to find the one workflow worth starting with. You get the price and scope in writing before you pay.`,
  alternates: { canonical: '/book' },
  openGraph: { ...OPEN_GRAPH, title: `Book a free call | ${SITE.name}` },
};

const FACTS = [
  { Icon: Clock, text: `Free, ${BOOKING.durationMinutes} minutes` },
  { Icon: CalendarClock, text: 'Times shown in your time zone' },
  { Icon: ShieldCheck, text: 'No access to your systems needed' },
  { Icon: FileCheck, text: 'Scope and price in writing before you pay' },
];

const SETUP = OFFERS[0];

export default function BookPage() {
  return (
    <>
      <PageIntro
        chip="Book a free call"
        title="Book your free call."
        lede="Tell us about your agency, then pick a time. We look at the repeat work that costs your team the most and where agents could take it on first."
        cta={false}
      >
        <div className="text-left">
          <ul className="mx-auto mt-8 flex max-w-stage flex-wrap justify-center gap-x-6 gap-y-2 animate-hero" style={{ animationDelay: '240ms' }}>
            {FACTS.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm text-graphite">
                <Icon aria-hidden="true" className="size-4 shrink-0 text-signal-bright" strokeWidth={1.9} />
                {text}
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-8 max-w-stage">
            <BookingFlow />
            <p className="mt-6 text-center text-sm text-graphite">
              No time that suits you? Email <ContactLink /> and we will find one.
            </p>
          </div>
        </div>
      </PageIntro>

      <Section
        id="after-the-call"
        chip="After the call"
        title="What happens after the call."
        lede="A written scope and a fixed price come first. The work starts once you have paid."
      >
        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {STEPS.map((s, i) => (
              <li key={s.name} data-reveal style={delay((i % 2) * 90)} className="card p-6">
                <p className="tabular text-sm font-semibold text-signal-bright">Step {i + 1}</p>
                <h3 className="mt-3 text-lg font-display tracking-snug text-ink">{s.name}</h3>
                <p className="mt-2 text-sm text-graphite">{s.detail}</p>
              </li>
            ))}
          </ol>

          <div data-reveal style={delay(120)} className="card card-lit flex flex-col p-7 lg:col-span-5">
            <h3 className="text-md font-semibold text-ink">{SETUP.name}</h3>
            <p className="mt-4 text-3xl font-display tracking-display text-ink">{SETUP.price}</p>
            <p className="mt-2 text-sm text-graphite">{SETUP.priceNote}</p>
            <ul className="mt-6 space-y-3">
              {SETUP.get.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-ink">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-signal-bright" strokeWidth={2.2} />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-6 text-xs text-slate">{SETUP.foot}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
