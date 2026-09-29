import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Button';
import { CTA } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-page px-4 py-24 md:px-8 md:py-32">
      <h1 id="page-title" className="max-w-narrow text-4xl font-display tracking-display text-ink">
        This page does not exist.
      </h1>
      <p className="mt-6 max-w-measure text-lg text-graphite">
        The link may be out of date. Everything on the site is one step from the homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ButtonLink href="/" variant="secondary">
          Go to the homepage
        </ButtonLink>
        <ButtonLink href={CTA.book.href} variant="quiet" track="not-found">
          {CTA.book.label}
        </ButtonLink>
      </div>
    </section>
  );
}
