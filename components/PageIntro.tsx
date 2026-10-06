import type { ReactNode } from 'react';
import { ButtonLink } from './Button';
import { Chip } from './Section';
import { CTA } from '@/lib/site';

/** The opening of every inner page: a chip, the page's h1, one sentence, the primary action, under a glow. */
export function PageIntro({
  chip,
  title,
  lede,
  cta = true,
  children,
}: {
  chip?: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  cta?: boolean;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="hero-sky relative isolate overflow-hidden">
      <div className="mx-auto max-w-page px-4 pb-16 pt-16 text-center md:px-8 md:pb-20 md:pt-24">
        {chip ? <Chip className="animate-hero">{chip}</Chip> : null}
        <h1
          id="page-title"
          className="mx-auto mt-6 max-w-heading text-5xl font-display tracking-display text-ink animate-hero"
          style={{ animationDelay: '80ms' }}
        >
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-narrow text-lg text-graphite animate-hero" style={{ animationDelay: '160ms' }}>
          {lede}
        </p>
        {cta ? (
          <div className="animate-hero" style={{ animationDelay: '240ms' }}>
            <ButtonLink href={CTA.book.href} track="page-intro" className="mt-9">
              {CTA.book.label}
            </ButtonLink>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
