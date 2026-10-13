'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { buttonClass } from './Button';
import { CheckBadge, controlClass, describedBy, Field, Honeypot } from './Field';
import { track } from '@/lib/analytics';
import { newsletterEmailError } from '@/lib/newsletter';

type Status = 'idle' | 'sending' | 'done' | 'failed';

const ID = 'newsletter-email';

/** The footer's email updates signup. It confirms only after /api/subscribe has saved the address. */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState('');
  const started = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track('form_start', { form: 'newsletter' });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const problem = newsletterEmailError(email);
    setError(problem);
    setFailure('');
    if (problem) {
      input.current?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), website: honeypot.current?.value ?? '' }),
      });
      const body: { ok?: boolean; message?: string } = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setStatus('done');
        track('form_submit', { form: 'newsletter' });
        return;
      }
      if (res.status === 400 && body.message) {
        setError(body.message);
        setStatus('idle');
        input.current?.focus();
        return;
      }
      setFailure(
        res.status === 429
          ? 'Too many attempts from this connection. Wait a few minutes and try again.'
          : 'We could not save your email just now, so you are not subscribed yet. Try again in a moment.',
      );
      setStatus('failed');
      track('form_error', { form: 'newsletter', reason: String(res.status) });
    } catch {
      setFailure('We could not reach the server, so you are not subscribed yet. Check your connection and try again.');
      setStatus('failed');
      track('form_error', { form: 'newsletter', reason: 'network' });
    }
  };

  if (status === 'done') {
    return (
      <p role="status" className="flex items-center gap-3 text-base text-ink">
        <CheckBadge />
        You’re subscribed. Thank you.
      </p>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} onFocus={onStart} aria-label="Subscribe to email updates">
      <Field id={ID} label="Email address" error={error}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            ref={input}
            id={ID}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(newsletterEmailError(e.target.value));
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${describedBy(ID)} ${ID}-note`}
            className={controlClass(!!error, 'h-12 sm:flex-1')}
          />
          <button type="submit" disabled={status === 'sending'} className={buttonClass('primary', 'md')}>
            {status === 'sending' ? 'Subscribing' : 'Subscribe'}
          </button>
        </div>
      </Field>
      {status === 'failed' ? (
        <p role="alert" className="mt-2 text-sm text-alert">
          {failure}
        </p>
      ) : null}
      <Honeypot id="newsletter-website" ref={honeypot} />
      <p id={`${ID}-note`} className="mt-3 text-xs text-slate">
        We use your address only to send these updates. Unsubscribe at any time. See the{' '}
        <Link href="/privacy" prefetch={false} className="underline decoration-rule-strong underline-offset-2 hover:text-ink">
          privacy notice
        </Link>
        .
      </p>
    </form>
  );
}
