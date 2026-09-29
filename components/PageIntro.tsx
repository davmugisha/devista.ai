import type { ReactNode } from 'react';
import { ButtonLink } from './Button';
import { CTA } from '@/lib/site';

/** The opening of every inner page: the page's h1, one sentence on how, and the primary action. */
export function PageIntro({ title, lede, cta = true, children }: { title: ReactNode; lede: ReactNode; cta?: boolean; children?: ReactNode }) {
  return (
    <section aria-labelledby="page-title" className="border-b border-rule">
      <div className="mx-auto max-w-page px-4 pb-16 pt-12 md:px-8 md:pb-20 md:pt-20">
        <h1 id="page-title" className="max-w-narrow text-4xl font-display tracking-display text-ink">
          {title}
        </h1>
        <p className="mt-6 max-w-measure text-lg text-graphite">{lede}</p>
        {cta ? (
          <ButtonLink href={CTA.book.href} track="page-intro" className="mt-8">
            {CTA.book.label}
          </ButtonLink>
        ) : null}
        {children}
      </div>
    </section>
  );
}
