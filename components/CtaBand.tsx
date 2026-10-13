import { MagneticButtonLink } from './MagneticButtonLink';
import { CTA } from '@/lib/site';

/** A spacious closing invitation between the FAQ and footer. */
export function CtaBand({
  title = 'Book a free call to pick your first workflow.',
  lede = 'Thirty minutes, free, and you leave knowing which workflow to start with.',
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="border-t border-rule px-4 py-24 text-center md:px-8 md:py-32">
      <div data-reveal className="mx-auto max-w-page">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-signal-bright">Ready to talk?</p>
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
