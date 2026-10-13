import { BadgeCheck, CalendarDays } from 'lucide-react';
import { ButtonLink } from './Button';
import { delay } from './Section';
import { OFFERS, STEPS } from '@/lib/content';
import { CTA } from '@/lib/site';

// Laid out after the ui-layouts "pricing-overview" block (21st.dev, David's pick on 2026-10-11):
// framed cards with a price panel, a booking button with a calendar icon and a two-column
// checklist, and one wide dark card for the offer to start with. Extended for trust: what you
// decide in every offer, and the four steps that follow the booking. Only the real offers and
// prices from lib/content.ts appear.

type Offer = (typeof OFFERS)[number];

function Checklist({ items, tone, className = '' }: { items: readonly string[]; tone: 'light' | 'deep'; className?: string }) {
  return (
    <ul className={'grid gap-x-6 gap-y-3 sm:grid-cols-2 ' + className}>
      {items.map((line) => (
        <li key={line} className={'flex items-start gap-2 text-sm ' + (tone === 'deep' ? 'text-on-signal/85' : 'text-ink')}>
          <BadgeCheck aria-hidden="true" className={'mt-px size-4 shrink-0 ' + (tone === 'deep' ? 'text-glow' : 'text-signal-bright')} strokeWidth={2} />
          {line}
        </li>
      ))}
    </ul>
  );
}

function BookButton({ variant }: { variant: 'primary' | 'inverse' }) {
  return (
    <ButtonLink href={CTA.book.href} variant={variant} track="pricing" className="w-full">
      {CTA.book.label}
      <CalendarDays aria-hidden="true" className="size-4" strokeWidth={2} />
    </ButtonLink>
  );
}

/** The offer to start with: a wide dark card, the founding price and both lists side by side. */
function Featured({ offer }: { offer: Offer }) {
  return (
    <article
      data-offer
      data-featured
      data-reveal
      className="relative isolate overflow-hidden rounded-card bg-linear-to-b from-deep to-deep-2 p-6 text-on-signal shadow-float md:p-10"
    >
      <span aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-72 rounded-dot bg-glow-cyan/30 blur-xl" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-on-signal">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-dot bg-glow animate-ping" />
              <span className="relative inline-flex size-2 rounded-dot bg-glow" />
            </span>
            Founding price for the first 3 clients
          </p>
          <h3 className="mt-4 text-3xl font-display tracking-display">{offer.name}</h3>
          <p className="mt-3 max-w-measure text-base text-on-signal/75">{offer.summary}</p>
          <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="tabular text-5xl font-display tracking-display">{offer.price}</span>
            <span className="text-sm text-on-signal/70">{offer.priceNote}</span>
          </p>
          <div className="mt-6 max-w-sm">
            <BookButton variant="inverse" />
          </div>
          <p className="mt-4 text-xs text-on-signal/65">{offer.foot}</p>
        </div>
        <div className="space-y-6 lg:border-l lg:border-on-signal/15 lg:pl-12">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-on-signal/65">What you get</h4>
            <Checklist className="mt-3" items={offer.get} tone="deep" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-on-signal/65">What you decide</h4>
            <Checklist className="mt-3" items={offer.decide} tone="deep" />
          </div>
        </div>
      </div>
    </article>
  );
}

/** The other offers: a tinted frame around a white card with the price panel, then the checklist. */
function Framed({ offer, index }: { offer: Offer; index: number }) {
  return (
    <article data-offer data-reveal style={delay(120 + index * 80)} className="flex flex-col rounded-card border border-rule bg-panel p-2">
      <div className="rounded-frame bg-mist p-1.5">
        <div className="space-y-3 rounded-window border border-rule bg-panel/60 p-5">
          <h3 className="text-2xl font-display tracking-display text-ink">{offer.name}</h3>
          <p className="text-sm text-graphite">{offer.summary}</p>
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="tabular text-2xl font-display tracking-display text-ink">{offer.price}</span>
            <span className="text-sm text-slate">{offer.priceNote}</span>
          </p>
          <BookButton variant="primary" />
        </div>
      </div>
      <div className="space-y-4 p-4">
        <Checklist items={offer.get} tone="light" />
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate">You decide</h4>
          <Checklist className="mt-3" items={offer.decide} tone="light" />
        </div>
        <p className="text-xs text-slate">{offer.foot}</p>
      </div>
    </article>
  );
}

/** The three real offers, the one to start with first, then what happens after the booking. */
export function Pricing() {
  const [first, ...rest] = [...OFFERS].sort((a, b) => Number(b.lit) - Number(a.lit));
  return (
    <div className="mx-auto mt-12 max-w-stage space-y-4">
      <Featured offer={first} />
      <div className="grid gap-4 md:grid-cols-2">
        {rest.map((o, i) => (
          <Framed key={o.id} offer={o} index={i} />
        ))}
      </div>

      <div data-pricing-steps data-reveal className="card p-5 md:p-6">
        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
          <h3 className="text-lg font-display tracking-snug text-ink">What happens after you book</h3>
          <p className="text-sm text-graphite">Every offer is paid upfront. We agree the scope on a free call and write it down before you pay.</p>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.name} className="rounded-frame border border-rule bg-mist p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="tabular flex size-6 shrink-0 items-center justify-center rounded-dot bg-signal-tint text-xs text-signal-strong">{i + 1}</span>
                {s.name}
              </p>
              <p className="mt-2 text-xs text-slate">You get</p>
              <p className="text-sm text-graphite">{s.output}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
