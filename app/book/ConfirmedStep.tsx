'use client';

import { CalendarPlus, Check } from 'lucide-react';
import { buttonClass, ButtonLink } from '@/components/Button';
import { formatDay, formatRange, tzLongName, tzName } from '@/lib/booking-client';
import { BOOKING } from '@/lib/booking-config';
import { buildIcs } from '@/lib/booking-ics';
import { SITE } from '@/lib/site';

type Props = {
  firstName: string;
  email: string;
  start: string;
  end: string;
  tz: string;
  meetLink: string | null;
  onRestart: () => void;
};

export function ConfirmedStep({ firstName, email, start, end, tz, meetLink, onRestart }: Props) {
  const longName = tzLongName(tz, new Date(start));

  function download() {
    const body = buildIcs({
      uid: `${Date.parse(start)}@${window.location.hostname}`,
      start,
      end,
      title: BOOKING.callTitle,
      description: meetLink
        ? `${BOOKING.description}\n\nVideo call: ${meetLink}`
        : `${BOOKING.description}\n\nThe video call link is in your email invite.`,
      location: meetLink,
    });
    const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${SITE.shortName.toLowerCase()}-call.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const facts = [
    { label: 'When', value: formatDay(start, tz) },
    { label: 'Time', value: formatRange(start, end, tz) },
    { label: 'Time zone', value: tzName(tz), detail: longName },
  ];

  return (
    <div className="animate-arrive">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-dot bg-signal-tint" aria-hidden="true">
          <Check className="size-4 text-signal-bright" strokeWidth={2.2} />
        </span>
        <h2 id="step-3-title" tabIndex={-1} className="text-2xl font-display tracking-display text-ink outline-none">
          You’re booked, {firstName}.
        </h2>
      </div>
      <p className="mt-4 text-base text-graphite">
        A calendar invite with the video link is on its way to <span className="font-medium text-ink break-words">{email}</span>.
      </p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} className="rounded-window border border-rule bg-panel p-4">
            <dt className="text-sm text-graphite">{f.label}</dt>
            <dd className="mt-1 text-base font-semibold text-ink">{f.value}</dd>
            {f.detail ? <dd className="mt-1 text-sm text-graphite">{f.detail}</dd> : null}
          </div>
        ))}
      </dl>

      <h3 className="mt-8 text-base font-semibold text-ink">Before the call</h3>
      <ul className="mt-3 space-y-3">
        {BOOKING.beforeTheCall.map((tip) => (
          <li key={tip} className="grid grid-cols-[auto_1fr] gap-x-3 text-sm text-graphite">
            <Check aria-hidden="true" className="mt-1 size-4 text-signal-bright" strokeWidth={2.2} />
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:flex-wrap sm:items-center">
        <button type="button" onClick={download} className={buttonClass('primary', 'md', 'w-full sm:w-auto')}>
          <CalendarPlus aria-hidden="true" className="size-5" />
          Add to calendar
        </button>
        <ButtonLink href="/" variant="secondary" track="booking-confirmed" className="w-full sm:w-auto">
          Back to the site
        </ButtonLink>
        <button type="button" onClick={onRestart} className={buttonClass('quiet', 'md', 'justify-center sm:justify-start')}>
          Start over
        </button>
      </div>
    </div>
  );
}
