import { MagneticButtonLink } from './MagneticButtonLink';
import { CTA } from '@/lib/site';

/** A spacious closing invitation between the FAQ and footer. */
export function CtaBand({
  title = 'Your next hire could be an AI agent.',
  lede = 'See which handoffs your team can give back to an agent, with your people in control of every important decision.',
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="border-t border-rule px-4 py-24 text-center md:px-8 md:py-32">
      <div data-reveal className="mx-auto max-w-page">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-signal">Ready to automate?</p>
        <h2 id="cta-title" className="mx-auto mt-5 max-w-heading text-4xl font-display tracking-display text-ink">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-narrow text-base text-graphite">{lede}</p>
        <MagneticButtonLink href={CTA.book.href} track="closing" className="mt-8">
          {CTA.book.label}
        </MagneticButtonLink>
      </div>
    </section>
  );
}
