import { ButtonLink } from './Button';
import { CTA } from '@/lib/site';

/** The closing call to action on every content page. */
export function CtaBand({
  title = 'See where your operations lose time between systems.',
  lede = 'The operations audit is free and takes about two weeks. You keep the findings whether or not you go further.',
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="border-t border-rule bg-paper">
      <div className="mx-auto flex max-w-page flex-col items-start gap-8 px-4 py-16 md:px-8 md:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-narrow">
          <h2 id="cta-title" className="text-3xl font-display tracking-display text-ink">
            {title}
          </h2>
          <p className="mt-4 max-w-measure text-md text-graphite">{lede}</p>
        </div>
        <ButtonLink href={CTA.book.href} track="closing" className="shrink-0">
          {CTA.book.label}
        </ButtonLink>
      </div>
    </section>
  );
}
