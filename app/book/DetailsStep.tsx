'use client';

import { useMemo, useRef, useState, type FormEvent } from 'react';
import { buttonClass } from '@/components/Button';
import { Chevron, controlClass, describedBy, Field } from '@/components/Field';
import { track } from '@/lib/analytics';
import { regionNames } from '@/lib/booking-client';
import { BOOKING } from '@/lib/booking-config';
import { DIAL_CODES, REGIONS } from '@/lib/booking-countries';
import { DETAIL_FIELDS, detailErrors, LIMITS, type DetailField, type DetailsInput } from '@/lib/booking-validate';

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
      <h2 id="step-1-title" tabIndex={-1} className="text-2xl font-display tracking-display text-ink outline-none">
        Your details
      </h2>
      <p className="mt-2 text-sm text-graphite">Tell us who we are meeting. Next, you pick a day and time.</p>

      {error ? (
        <div role="alert" className="mt-5 rounded-control border border-alert bg-alert-tint p-4 animate-arrive">
          <p className="text-sm font-semibold text-alert">We could not book your call.</p>
          <p className="mt-1 text-sm text-ink">{error}</p>
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="f-first" label="First name" error={shown('firstName')}>
            <input
              id="f-first"
              name="firstName"
              autoComplete="given-name"
              maxLength={LIMITS.firstName}
              value={values.firstName}
              onChange={set('firstName')}
              onBlur={blur('firstName')}
              aria-invalid={!!shown('firstName')}
              aria-describedby={describedBy('f-first')}
              aria-required="true"
              className={controlClass(!!shown('firstName'), 'h-12')}
            />
          </Field>
          <Field id="f-last" label="Last name" optional error={shown('lastName')}>
            <input
              id="f-last"
              name="lastName"
              autoComplete="family-name"
              maxLength={LIMITS.lastName}
              value={values.lastName}
              onChange={set('lastName')}
              onBlur={blur('lastName')}
              aria-invalid={!!shown('lastName')}
              aria-describedby={describedBy('f-last')}
              className={controlClass(!!shown('lastName'), 'h-12')}
            />
          </Field>
        </div>

        <Field id="f-email" label="Work email" error={shown('email')}>
          <input
            id="f-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            value={values.email}
            onChange={set('email')}
            onBlur={blur('email')}
            aria-invalid={!!shown('email')}
            aria-describedby={describedBy('f-email')}
            aria-required="true"
            className={controlClass(!!shown('email'), 'h-12')}
          />
        </Field>

        <Field id="f-phone" label="Phone" optional error={shown('phone') ?? shown('phoneRegion')}>
          <div className="grid gap-2 sm:grid-cols-[13rem_minmax(0,1fr)]">
            <div className="relative">
              <select
                name="phoneRegion"
                aria-label="Country code"
                value={values.phoneRegion}
                onChange={set('phoneRegion')}
                onBlur={blur('phoneRegion')}
                aria-invalid={!!shown('phone') || !!shown('phoneRegion')}
                aria-describedby={describedBy('f-phone')}
                className={controlClass(!!shown('phoneRegion'), 'h-12 appearance-none pr-10')}
              >
                <option value="">Country code</option>
                {countries.map((c) => (
                  <option key={c.region} value={c.region}>
                    {c.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
            <input
              id="f-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={LIMITS.phone}
              value={values.phone}
              onChange={set('phone')}
              onBlur={blur('phone')}
              aria-invalid={!!shown('phone')}
              aria-describedby={describedBy('f-phone')}
              className={controlClass(!!shown('phone'), 'h-12')}
            />
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="f-company" label="Company" optional error={shown('company')}>
            <input
              id="f-company"
              name="company"
              autoComplete="organization"
              maxLength={LIMITS.company}
              value={values.company}
              onChange={set('company')}
              onBlur={blur('company')}
              aria-invalid={!!shown('company')}
              aria-describedby={describedBy('f-company')}
              className={controlClass(!!shown('company'), 'h-12')}
            />
          </Field>
          <Field id="f-team" label="Team size" optional error={shown('teamSize')}>
            <div className="relative">
              <select
                id="f-team"
                name="teamSize"
                value={values.teamSize}
                onChange={set('teamSize')}
                onBlur={blur('teamSize')}
                aria-invalid={!!shown('teamSize')}
                aria-describedby={describedBy('f-team')}
                className={controlClass(!!shown('teamSize'), 'h-12 appearance-none pr-10')}
              >
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
        </div>

        <Field id="f-topic" label={BOOKING.topicLabel} optional hint={BOOKING.topicHint} error={shown('topic')}>
          <textarea
            id="f-topic"
            name="topic"
            rows={4}
            maxLength={LIMITS.topic}
            value={values.topic}
            onChange={set('topic')}
            onBlur={blur('topic')}
            aria-invalid={!!shown('topic')}
            aria-describedby={describedBy('f-topic', true)}
            className={controlClass(!!shown('topic'), 'resize-y py-3')}
          />
        </Field>

        {/* Honeypot, hidden from people and assistive technology. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="f-website">Website</label>
          <input id="f-website" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="border-t border-rule pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button type="submit" className={buttonClass('primary', 'md', 'w-full sm:w-auto')}>
              Next: pick a time
            </button>
          </div>
          <p id="details-note" className="mt-3 text-sm text-graphite">
            We only use this to set up your call.
          </p>
        </div>
      </div>
    </form>
  );
}
