'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import { ButtonLink } from './Button';
import { AUDIT } from '@/lib/content';
import { CTA } from '@/lib/site';

type Tier = {
  name: string;
  price: string;
  sub: string;
  badge?: string;
  get: string[];
  decide: string[];
  foot: string;
  lit?: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Operations audit',
    price: 'Free',
    sub: 'About two weeks on one department, with no obligation to go further.',
    badge: 'Start here',
    get: AUDIT.deliverables.map((d) => d.title),
    decide: ['Which department or workflow we examine', 'Who from your team takes part', 'Whether to accept the proposal'],
    foot: 'You keep everything the audit produces.',
    lit: true,
  },
  {
    name: 'First implementation',
    price: 'Scoped fee',
    sub: 'Set out in the proposal and agreed in writing before any work starts.',
    get: [
      'The command center, set up for your leadership',
      'One department configured',
      'Your existing tools connected',
      'Permissions, approvals and escalation set',
      'A switchover plan agreed with the department head',
    ],
    decide: ['Approve the design and the rules', 'Review before anything goes live', 'Sign off the switchover'],
    foot: 'Proposed at the end of the audit.',
  },
  {
    name: 'Platform',
    price: 'Subscription',
    sub: 'A subscription that grows with the departments you add.',
    get: [
      'The command center for your leadership',
      'Each department you add',
      'AI agents working within your rules',
      'Approvals and a complete audit trail',
      'Usage charges only for unusually heavy workloads',
    ],
    decide: ['Which department comes next', 'Which work moves to agents', 'Who approves what'],
    foot: 'Priced by scope. We do not publish a price list.',
  },
];

const VIEWS = { get: 'What you get', decide: 'What you decide' } as const;
type View = keyof typeof VIEWS;

/** How pricing works, as three cards: the free audit, the scoped build, the platform. */
export function Pricing() {
  const [view, setView] = useState<View>('get');
  return (
    <div className="mt-12">
      <div className="flex justify-center">
        <div role="group" aria-label="Show for each stage" className="inline-flex rounded-control border border-rule bg-mist p-1">
          {(Object.keys(VIEWS) as View[]).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={
                'h-9 rounded-chip px-4 text-sm font-medium transition-colors duration-200 ' +
                (view === v ? 'bg-signal text-on-signal' : 'text-graphite hover:text-ink')
              }
            >
              {VIEWS[v]}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {TIERS.map((t) => (
          <li key={t.name} data-reveal className={'card flex flex-col p-7 ' + (t.lit ? 'card-lit' : '')}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-md font-semibold text-ink">{t.name}</h3>
              {t.badge ? (
                <span className="rounded-dot bg-signal px-3 py-px text-xs font-semibold text-on-signal">{t.badge}</span>
              ) : null}
            </div>
            <p className="mt-5 text-3xl font-display tracking-display text-ink">{t.price}</p>
            <p className="mt-3 text-sm text-graphite">{t.sub}</p>
            {t.lit ? (
              <ButtonLink href={CTA.book.href} track="pricing" className="mt-6 w-full">
                {CTA.book.label}
              </ButtonLink>
            ) : (
              <p className="mt-6 flex h-12 items-center justify-center rounded-control border border-dashed border-rule text-sm text-slate">
                {t.foot}
              </p>
            )}
            <p className="mt-7 text-xs font-semibold uppercase tracking-wide text-slate">{VIEWS[view]}</p>
            <ul key={view} className="mt-3 space-y-3 animate-arrive">
              {t[view].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-ink">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-signal-bright" strokeWidth={2.2} />
                  {line}
                </li>
              ))}
            </ul>
            {t.lit ? <p className="mt-auto pt-6 text-xs text-slate">{t.foot}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
