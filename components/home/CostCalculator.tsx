'use client';

import { useState, type CSSProperties } from 'react';
import { ButtonLink } from '../Button';
import { Section } from '../Section';
import { CTA } from '@/lib/site';

/** Working weeks in a year. Fewer than 52, so holidays and leave do not inflate the estimate. */
const WEEKS = 48;

const SLIDERS = [
  { id: 'team', label: 'Team size', min: 1, max: 50, step: 1, start: 6, show: (v: number) => String(v) },
  { id: 'rate', label: 'Average hourly cost', min: 10, max: 200, step: 5, start: 45, show: (v: number) => `US$${v}/h` },
  { id: 'hours', label: 'Repeat work per person, per week', min: 1, max: 30, step: 1, start: 10, show: (v: number) => `${v}h` },
] as const;

type Id = (typeof SLIDERS)[number]['id'];

// en-GB writes US dollars as US$1,500, the site's format for a worldwide audience.
const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const count = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });

/**
 * The cost of the visitor's own repeat work today, from their own numbers. Never a promised saving.
 * One compact card: the sliders on the left, the result and the call to action on the right.
 */
export function CostCalculator() {
  const [values, setValues] = useState<Record<Id, number>>(() => Object.fromEntries(SLIDERS.map((s) => [s.id, s.start])) as Record<Id, number>);
  const hours = values.team * values.hours * WEEKS;
  const yearly = hours * values.rate;

  return (
    <Section
      id="cost"
      chip="Find your number"
      title="What is repeat work costing your agency?"
      lede="Move the sliders to match your team. A rough estimate of today's cost, checked with you on the free call."
    >
      <div data-reveal className="card mx-auto mt-8 grid max-w-stage gap-5 p-4 md:grid-cols-2 md:gap-8 md:p-5">
        <div className="flex flex-col justify-center gap-4">
          {SLIDERS.map((s) => {
            const v = values[s.id];
            const fill = `${((v - s.min) / (s.max - s.min)) * 100}%`;
            return (
              <div key={s.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={`cost-${s.id}`} className="text-sm font-medium text-graphite">
                    {s.label}
                  </label>
                  <output htmlFor={`cost-${s.id}`} className="tabular shrink-0 text-md font-semibold text-ink">
                    {s.show(v)}
                  </output>
                </div>
                <input
                  id={`cost-${s.id}`}
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={v}
                  aria-valuetext={s.show(v)}
                  onChange={(e) => setValues((all) => ({ ...all, [s.id]: Number(e.target.value) }))}
                  className="range mt-1"
                  style={{ '--fill': fill } as CSSProperties}
                />
              </div>
            );
          })}
          <p className="text-xs text-slate">Example values to start. Change them to match your agency.</p>
        </div>

        <div className="flex flex-col rounded-frame border border-rule bg-panel p-4">
          <dl aria-live="polite" aria-atomic="true">
            <dt className="text-xs font-semibold uppercase tracking-wide text-graphite">Yearly cost of repeat work</dt>
            <dd data-yearly className="tabular mt-1 text-3xl font-display tracking-display text-signal-bright">
              {money.format(yearly)}
            </dd>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-rule pt-3 text-sm">
              <div>
                <dt className="text-xs text-slate">Hours a year</dt>
                <dd className="tabular font-semibold text-ink">{count.format(hours)} h</dd>
              </div>
              <div>
                <dt className="text-xs text-slate">Cost a month</dt>
                <dd className="tabular font-semibold text-ink">{money.format(yearly / 12)}</dd>
              </div>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate">
            People × hours a week × hourly cost × {WEEKS} working weeks. The cost of the work today, not a saving we promise.
          </p>
          <ButtonLink href={CTA.book.href} track="cost" className="mt-4 w-full">
            {CTA.book.label}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
