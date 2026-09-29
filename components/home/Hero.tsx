import { ButtonLink } from '../Button';
import { CommandCenter } from './CommandCenter';
import { CTA } from '@/lib/site';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-rule">
      <div className="mx-auto grid max-w-page grid-cols-1 gap-x-10 gap-y-10 px-4 pb-16 pt-12 md:px-8 md:pt-20 lg:grid-cols-12 lg:pb-24">
        <h1 id="hero-title" className="min-w-0 text-5xl font-display tracking-display text-ink lg:col-span-12">
          <span className="block">Your systems work.</span>
          <span className="block">The work between them doesn’t.</span>
        </h1>
        <div className="min-w-0 lg:col-span-5 lg:pt-2">
          <p className="max-w-measure text-lg text-graphite">
            Devista connects the tools, teams and data you already run into one operating layer, where AI agents handle
            the handoffs and your people approve what matters.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={CTA.book.href} track="hero">
              {CTA.book.label}
            </ButtonLink>
            <ButtonLink href={CTA.product.href} variant="quiet" track="hero-secondary">
              {CTA.product.label}
            </ButtonLink>
          </div>
          <p className="mt-6 max-w-measure text-sm text-graphite">
            The audit is free. One department, about two weeks, and the findings are yours to keep.
          </p>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <CommandCenter />
        </div>
      </div>
    </section>
  );
}
