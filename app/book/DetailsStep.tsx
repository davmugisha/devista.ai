'use client';

import { useMemo, useRef, useState, type FormEvent } from 'react';
import { buttonClass } from '@/components/Button';
import { Chevron, controlClass, describedBy, Field, Honeypot } from '@/components/Field';
import { track } from '@/lib/analytics';
import { regionNames } from '@/lib/booking-client';
import { BOOKING } from '@/lib/booking-config';
import { DIAL_CODES, REGIONS } from '@/lib/booking-countries';
import { DETAIL_FIELDS, detailErrors, LIMITS, TOPIC_MIN, type DetailField, type DetailsInput } from '@/lib/booking-validate';

type Props = {
  values: DetailsInput;
  onChange: (values: DetailsInput) => void;
  /** A problem with the last attempt to book, shown above the form. */
  error: string | null;
  /** Show every problem at once, for example after the server rejected an answer. */
  revealAll: boolean;
  /** Called with the honeypot value once every answer is valid. */
  onNext: (honeypot: string) => void;
};

/** Controls stay compact so the whole form fits on one laptop screen. */
const H = 'h-11';

export function DetailsStep({ values, onChange, error, revealAll, onNext }: Props) {
  const [touched, setTouched] = useState<Partial<Record<DetailField, boolean>>>({});
  const started = useRef(false);
  const errors = useMemo(() => detailErrors(values), [values]);
  const valid = Object.keys(errors).length === 0;

  const countries = useMemo(() => {
    const names = regionNames();
    // The code comes first so it stays visible when a long country name is cut off in the closed select.
    return REGIONS.map((region) => ({ region, name: names?.of(region) ?? region }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ region, name }) => ({ region, label: `+${DIAL_CODES[region]} ${name}` }));
  }, []);

  const shown = (f: DetailField) => (touched[f] || revealAll ? errors[f] : undefined);
  const set = (f: DetailField) => (e: { target: { value: string } }) => onChange({ ...values, [f]: e.target.value });
  const blur = (f: DetailField) => () => setTouched((t) => ({ ...t, [f]: true }));
  /** The props every control shares: value, change and blur handlers, and its error state. */
  const bind = (f: DetailField, id: string, hint = false) => ({
    id,
    name: f,
    value: values[f],
    onChange: set(f),
    onBlur: blur(f),
    'aria-invalid': !!shown(f),
    'aria-describedby': describedBy(id, hint),
  });

  const topicLength = values.topic.trim().length;

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track('form_start', { form: 'book' });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid) {
      // Show what is missing instead of leaving a dead button.
      setTouched(Object.fromEntries(DETAIL_FIELDS.map((f) => [f, true])));
      // The errors render on the next frame; then move focus to the first field that needs fixing.
      requestAnimationFrame(() => document.querySelector<HTMLElement>('#calendar [aria-invalid="true"]')?.focus());
      return;
    }
    onNext(String(new FormData(e.currentTarget).get('website') ?? ''));
  };

  return (
    <form onSubmit={submit} onFocus={onStart} noValidate aria-describedby="details-note">
      <h2 id="step-1-title" tabIndex={-1} className="text-xl font-display tracking-display text-ink outline-none">
        Your details
      </h2>
      <p className="mt-1 text-sm text-graphite">Tell us about you and your agency. Next, you pick a day and time.</p>

      {error ? (
        <div role="alert" className="mt-5 rounded-control border border-alert bg-alert-tint p-4 animate-arrive">
          <p className="text-sm font-semibold text-alert">We could not book your call.</p>
          <p className="mt-1 text-sm text-ink">{error}</p>
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="f-first" label="First name" error={shown('firstName')}>
            <input {...bind('firstName', 'f-first')} autoComplete="given-name" maxLength={LIMITS.firstName} aria-required="true" className={controlClass(!!shown('firstName'), H)} />
          </Field>
          <Field id="f-last" label="Last name" optional error={shown('lastName')}>
            <input {...bind('lastName', 'f-last')} autoComplete="family-name" maxLength={LIMITS.lastName} className={controlClass(!!shown('lastName'), H)} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="f-email" label="Work email" error={shown('email')}>
            <input
              {...bind('email', 'f-email')}
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              aria-required="true"
              className={controlClass(!!shown('email'), H)}
            />
          </Field>
          <Field id="f-phone" label="Phone" optional error={shown('phone') ?? shown('phoneRegion')}>
            <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-2">
              <div className="relative">
                <select
                  name="phoneRegion"
                  aria-label="Country code"
                  value={values.phoneRegion}
                  onChange={set('phoneRegion')}
                  onBlur={blur('phoneRegion')}
                  aria-invalid={!!shown('phone') || !!shown('phoneRegion')}
                  aria-describedby={describedBy('f-phone')}
                  className={controlClass(!!shown('phoneRegion'), H + ' appearance-none truncate pl-3 pr-8')}
                >
                  <option value="">Code</option>
                  {countries.map((c) => (
                    <option key={c.region} value={c.region}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
              <input
                {...bind('phone', 'f-phone')}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                maxLength={LIMITS.phone}
                className={controlClass(!!shown('phone'), H)}
              />
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="f-company" label="Agency or company" error={shown('company')}>
            <input {...bind('company', 'f-company')} autoComplete="organization" maxLength={LIMITS.company} aria-required="true" className={controlClass(!!shown('company'), H)} />
          </Field>
          <Field id="f-site" label="Website" optional error={shown('site')}>
            <input
              {...bind('site', 'f-site')}
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="youragency.com"
              maxLength={LIMITS.site}
              className={controlClass(!!shown('site'), H)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="f-team" label="Team size" optional error={shown('teamSize')}>
            <div className="relative">
              <select {...bind('teamSize', 'f-team')} className={controlClass(!!shown('teamSize'), H + ' appearance-none pr-10')}>
                <option value="">Choose one</option>
                {BOOKING.teamSizes.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>
          <Field id="f-revenue" label="Annual revenue" error={shown('revenue')}>
            <div className="relative">
              <select {...bind('revenue', 'f-revenue')} aria-required="true" className={controlClass(!!shown('revenue'), H + ' appearance-none pr-10')}>
                <option value="">Choose a range</option>
                {BOOKING.revenueRanges.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>
        </div>

        <Field id="f-topic" label={BOOKING.topicLabel} hint={`${BOOKING.topicHint} At least ${TOPIC_MIN} characters.`} error={shown('topic')}>
          <textarea
            {...bind('topic', 'f-topic', true)}
            rows={3}
            maxLength={LIMITS.topic}
            aria-required="true"
            className={controlClass(!!shown('topic'), 'resize-y py-3')}
          />
          <p aria-hidden="true" className={'tabular mt-1 text-right text-xs ' + (topicLength >= TOPIC_MIN ? 'text-signal-bright' : 'text-slate')}>
            {topicLength >= TOPIC_MIN ? 'Enough to prepare your call' : `${topicLength} of ${TOPIC_MIN} characters`}
          </p>
        </Field>

        <Honeypot id="f-website" />

        <div className="flex flex-col gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p id="details-note" className="text-sm text-graphite">
            We only use this to prepare your call.
          </p>
          <button type="submit" className={buttonClass('primary', 'md', 'w-full sm:w-auto')}>
            Next: pick a time
          </button>
        </div>
      </div>
    </form>
  );
}
