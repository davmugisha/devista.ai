'use client';

import Link from 'next/link';
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from 'react';
import { buttonClass } from '@/components/Button';
import { Chevron, controlClass, describedBy, Field } from '@/components/Field';
import { track } from '@/lib/analytics';
import { BOTTLENECKS, FIELD_LIMITS, fieldError, REQUIRED, ROLES, SIZES, type FieldErrors, type Lead } from '@/lib/lead';
import { requestAudit, type BookingState } from './actions';

type Values = Record<keyof Lead, string>;

const EMPTY: Values = { name: '', email: '', company: '', size: '', role: '', bottleneck: '', details: '', timezone: '' };
const LABELS: Record<keyof Lead, string> = {
  name: 'Full name',
  email: 'Work email',
  company: 'Company',
  size: 'Company size',
  role: 'Your role',
  bottleneck: 'Biggest operational bottleneck',
  details: 'Anything else we should know',
  timezone: 'Time zone for the call',
};

const tzLabel = (tz: string) => tz.replace(/_/g, ' ').replace(/\//g, ', ');

function timeZones(): string[] {
  try {
    return (Intl as unknown as { supportedValuesOf(k: string): string[] }).supportedValuesOf('timeZone');
  } catch {
    return ['UTC'];
  }
}

export function BookingForm() {
  const [state, action, pending] = useActionState<BookingState, FormData>(requestAudit, { status: 'idle' });
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof Lead, boolean>>>({});
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState<(keyof Lead)[]>([]);
  const [editingTz, setEditingTz] = useState(false);
  const started = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const failRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  // The visitor's own time zone, detected in the browser; editable.
  useEffect(() => {
    let tz = 'UTC';
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {}
    setValues((v) => (v.timezone ? v : { ...v, timezone: tz }));
  }, []);

  // Server-side validation errors replace the client ones, so both paths look the same.
  useEffect(() => {
    if (state.status === 'invalid') {
      setClientErrors(state.errors);
      const keys = Object.keys(state.errors) as (keyof Lead)[];
      setSummary(keys);
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
    if (state.status === 'failed') {
      track('form_error', { reason: 'delivery' });
      requestAnimationFrame(() => failRef.current?.focus());
    }
    if (state.status === 'sent') {
      track('form_submit', { size: values.size, role: values.role, bottleneck: values.bottleneck });
      requestAnimationFrame(() => doneRef.current?.focus());
    }
    // values are read at the moment the state changes; they are not a trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track('form_start');
  };

  const set = (k: keyof Lead) => (e: { target: { value: string } }) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [k]: v }));
    // Once a field has shown an error, re-check it as the visitor fixes it.
    if (touched[k] || clientErrors[k]) setClientErrors((prev) => ({ ...prev, [k]: fieldError(k, v) }));
  };

  const blur = (k: keyof Lead) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    if (values[k] || clientErrors[k]) setClientErrors((prev) => ({ ...prev, [k]: fieldError(k, values[k]) }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: FieldErrors = {};
    for (const k of [...REQUIRED, 'details'] as (keyof Lead)[]) {
      const m = fieldError(k, values[k]);
      if (m) errs[k] = m;
    }
    setClientErrors(errs);
    const keys = Object.keys(errs) as (keyof Lead)[];
    setSummary(keys);
    if (keys.length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  };

  if (state.status === 'sent') {
    return (
      <div className="animate-arrive motion-reduce:animate-none">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-dot bg-signal-tint" aria-hidden="true">
            <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-signal" strokeWidth="2">
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
          </span>
          <h2 ref={doneRef} tabIndex={-1} className="text-2xl font-display tracking-display text-ink outline-none">
            Your audit request is in.
          </h2>
        </div>
        <p className="mt-4 text-base text-graphite">Thank you, {state.firstName}. Here is what happens next.</p>
        <ol className="mt-6 space-y-4 border-t border-rule pt-6">
          <li className="grid grid-cols-[auto_1fr] gap-x-3">
            <span className="tabular text-sm font-semibold text-signal">1</span>
            <p className="text-sm text-graphite">
              <span className="font-medium text-ink">Within one working day</span>, we email{' '}
              <span className="font-medium text-ink">{state.email}</span> with three times for a 30-minute introductory
              call, shown in <span className="font-medium text-ink">{tzLabel(state.timezone)}</span> time.
            </p>
          </li>
          <li className="grid grid-cols-[auto_1fr] gap-x-3">
            <span className="tabular text-sm font-semibold text-signal">2</span>
            <p className="text-sm text-graphite">
              On the call we confirm fit and choose the department or workflow to examine.
            </p>
          </li>
          <li className="grid grid-cols-[auto_1fr] gap-x-3">
            <span className="tabular text-sm font-semibold text-signal">3</span>
            <p className="text-sm text-graphite">Two working sessions and a readout follow over about two weeks.</p>
          </li>
        </ol>
        <p className="mt-6 text-sm text-graphite">
          Nothing to prepare yet. If our email has not arrived within one working day, check your spam folder for a
          message from Devista.
        </p>
        <Link href="/" className="mt-6 inline-flex text-sm font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
          Back to the homepage
        </Link>
      </div>
    );
  }

  const err = (k: keyof Lead) => clientErrors[k];

  return (
    <form action={action} onSubmit={onSubmit} onFocus={onStart} noValidate aria-describedby="form-note">
      {summary.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-control border border-alert bg-alert-tint p-4 outline-none animate-arrive motion-reduce:animate-none"
        >
          <p className="text-sm font-semibold text-alert">
            {summary.length === 1 ? 'Check 1 answer before sending.' : `Check ${summary.length} answers before sending.`}
          </p>
          <ul className="mt-2 space-y-1">
            {summary.map((k) => (
              <li key={k}>
                <a href={`#f-${k}`} className="text-sm text-ink underline underline-offset-2">
                  {LABELS[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.status === 'failed' ? (
        <div
          ref={failRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-control border border-alert bg-alert-tint p-4 outline-none animate-arrive motion-reduce:animate-none"
        >
          <p className="text-sm font-semibold text-alert">We could not send your request.</p>
          <p className="mt-1 text-sm text-ink">
            Your answers are still here. Try again in a minute. If it fails again, the problem is on our side; please
            try again later today.
          </p>
        </div>
      ) : null}

      <div className="space-y-5">
        <Field id="f-name" label={LABELS.name} error={err('name')}>
          <input
            id="f-name"
            name="name"
            autoComplete="name"
            maxLength={FIELD_LIMITS.name}
            value={values.name}
            onChange={set('name')}
            onBlur={blur('name')}
            aria-invalid={!!err('name')}
            aria-describedby={describedBy('f-name')}
            aria-required="true"
            className={controlClass(!!err('name'), 'h-12')}
          />
        </Field>
        <Field id="f-email" label={LABELS.email} error={err('email')}>
          <input
            id="f-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={FIELD_LIMITS.email}
            value={values.email}
            onChange={set('email')}
            onBlur={blur('email')}
            aria-invalid={!!err('email')}
            aria-describedby={describedBy('f-email')}
            aria-required="true"
            className={controlClass(!!err('email'), 'h-12')}
          />
        </Field>
        <Field id="f-company" label={LABELS.company} error={err('company')}>
          <input
            id="f-company"
            name="company"
            autoComplete="organization"
            maxLength={FIELD_LIMITS.company}
            value={values.company}
            onChange={set('company')}
            onBlur={blur('company')}
            aria-invalid={!!err('company')}
            aria-describedby={describedBy('f-company')}
            aria-required="true"
            className={controlClass(!!err('company'), 'h-12')}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="f-size" label={LABELS.size} error={err('size')}>
            <div className="relative">
              <select
                id="f-size"
                name="size"
                value={values.size}
                onChange={set('size')}
                onBlur={blur('size')}
                aria-invalid={!!err('size')}
                aria-describedby={describedBy('f-size')}
                aria-required="true"
                className={controlClass(!!err('size'), 'h-12 appearance-none pr-10')}
              >
                <option value="">Choose a range</option>
                {SIZES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>
          <Field id="f-role" label={LABELS.role} error={err('role')}>
            <div className="relative">
              <select
                id="f-role"
                name="role"
                value={values.role}
                onChange={set('role')}
                onBlur={blur('role')}
                aria-invalid={!!err('role')}
                aria-describedby={describedBy('f-role')}
                aria-required="true"
                className={controlClass(!!err('role'), 'h-12 appearance-none pr-10')}
              >
                <option value="">Choose a role</option>
                {ROLES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>
        </div>
        <Field id="f-bottleneck" label={LABELS.bottleneck} error={err('bottleneck')}>
          <div className="relative">
            <select
              id="f-bottleneck"
              name="bottleneck"
              value={values.bottleneck}
              onChange={set('bottleneck')}
              onBlur={blur('bottleneck')}
              aria-invalid={!!err('bottleneck')}
              aria-describedby={describedBy('f-bottleneck')}
              aria-required="true"
              className={controlClass(!!err('bottleneck'), 'h-12 appearance-none pr-10')}
            >
              <option value="">Choose one</option>
              {BOTTLENECKS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </Field>
        <Field id="f-details" label={LABELS.details} optional hint="For example, which systems are involved, or a workflow you want looked at first." error={err('details')}>
          <textarea
            id="f-details"
            name="details"
            rows={4}
            maxLength={FIELD_LIMITS.details}
            value={values.details}
            onChange={set('details')}
            onBlur={blur('details')}
            aria-invalid={!!err('details')}
            aria-describedby={describedBy('f-details', true)}
            className={controlClass(!!err('details'), 'resize-y py-3')}
          />
        </Field>

        <div>
          <input type="hidden" name="timezone" value={values.timezone} />
          {editingTz ? (
            <Field id="f-timezone" label={LABELS.timezone}>
              <div className="relative">
                <select
                  id="f-timezone"
                  value={values.timezone}
                  onChange={set('timezone')}
                  className={controlClass(false, 'h-12 appearance-none pr-10')}
                >
                  {timeZones().map((z) => (
                    <option key={z} value={z}>
                      {tzLabel(z)}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </Field>
          ) : (
            <div className="text-sm text-graphite">
              <p>We will propose call times in your time zone:</p>
              <p className="mt-1 flex min-h-6 flex-wrap items-baseline gap-x-3">
                <span className="font-medium text-ink">{values.timezone ? tzLabel(values.timezone) : 'Detecting'}</span>
                <button
                  type="button"
                  onClick={() => setEditingTz(true)}
                  className="font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
                >
                  Change time zone
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Honeypot, hidden from people and assistive technology. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="f-website">Website</label>
          <input id="f-website" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="border-t border-rule pt-6">
          <button type="submit" disabled={pending} aria-disabled={pending} className={buttonClass('primary', 'md', 'w-full sm:w-auto')}>
            {pending ? (
              <>
                <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 animate-spin fill-none stroke-current motion-reduce:animate-none" strokeWidth="2">
                  <path d="M8 2a6 6 0 1 1-6 6" />
                </svg>
                Sending your request
              </>
            ) : (
              'Book an operations audit'
            )}
          </button>
          <p id="form-note" className="mt-3 text-sm text-graphite">
            Free, with no obligation. We reply within one working day. Your details are used only to arrange the audit,
            as set out in the{' '}
            <Link href="/privacy" className="text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
              privacy notice
            </Link>
            .
          </p>
        </div>
      </div>
    </form>
  );
}
