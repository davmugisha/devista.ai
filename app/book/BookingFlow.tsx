'use client';

import { CalendarDays, Check, Clock, Video } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Mark } from '@/components/Logo';
import { track } from '@/lib/analytics';
import { browserTimeZone, formatDayShort, formatRange, languageRegion, postBooking, timeZoneOptions, tzName, type Slot } from '@/lib/booking-client';
import { BOOKING } from '@/lib/booking-config';
import { DIAL_CODES } from '@/lib/booking-countries';
import { EMPTY_DETAILS, type DetailsInput } from '@/lib/booking-validate';
import { ConfirmedStep } from './ConfirmedStep';
import { DetailsStep } from './DetailsStep';
import { SchedulePicker } from './SchedulePicker';

type Step = 1 | 2 | 3;
type Booked = { start: string; end: string; meetLink: string | null; firstName: string; email: string; tz: string };

const STEPS = ['Your details', 'Pick a time', 'Confirmed'] as const;

// The calendar depends on the visitor's clock and time zone, so it only exists in the browser.
// These two reads give the server and the first client render the same markup.
const noSubscribe = () => () => {};
const useIsBrowser = () => useSyncExternalStore(noSubscribe, () => true, () => false);
const useBrowserTz = () => useSyncExternalStore(noSubscribe, browserTimeZone, () => BOOKING.hostTimezone);

const initialDetails = (): DetailsInput => {
  const region = languageRegion();
  return { ...EMPTY_DETAILS, phoneRegion: region in DIAL_CODES ? region : '' };
};

/** Give details, pick a time and book, get confirmation: one card, three steps, no page loads. */
export function BookingFlow() {
  const [session, setSession] = useState(0);
  return <Flow key={session} onRestart={() => setSession((s) => s + 1)} />;
}

function Flow({ onRestart }: { onRestart: () => void }) {
  const browser = useIsBrowser();
  const detectedTz = useBrowserTz();
  const [tzChoice, setTzChoice] = useState<string | null>(null);
  const tz = tzChoice ?? detectedTz;
  const timeZones = useMemo(() => (browser ? timeZoneOptions(detectedTz) : []), [browser, detectedTz]);

  const [step, setStep] = useState<Step>(1);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [values, setValues] = useState<DetailsInput>(initialDetails);
  const [notice, setNotice] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pending, setPending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [revealAll, setRevealAll] = useState(false);
  const [booked, setBooked] = useState<Booked | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const submitting = useRef(false);

  // Move keyboard and screen reader focus to the new step's heading, but not on first load.
  const shownStep = useRef(step);
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    document.getElementById(`step-${step}-title`)?.focus();
  }, [step]);

  function pickSlot(next: Slot | null) {
    setSlot(next);
    if (next) setNotice(null);
  }

  function toSchedule(trap: string) {
    setHoneypot(trap);
    setSendError(null);
    setStep(2);
  }

  async function submit() {
    if (submitting.current || !slot) return;
    submitting.current = true;
    setPending(true);
    setSendError(null);
    const result = await postBooking(slot.start, tz, values, honeypot);
    submitting.current = false;
    setPending(false);

    if (result.ok) {
      track('form_submit', { form: 'book', teamSize: values.teamSize || 'unset' });
      setBooked({ start: result.start, end: result.end, meetLink: result.meetLink, firstName: values.firstName.trim(), email: values.email.trim(), tz });
      setStep(3);
      return;
    }
    track('form_error', { form: 'book', reason: result.kind });
    switch (result.kind) {
      case 'taken':
        setNotice('That time was just taken. Pick another.');
        setSlot(null);
        setRefreshKey((k) => k + 1);
        break;
      case 'invalid':
        setRevealAll(true);
        setSendError('Check the answers marked below, then pick your time again.');
        setStep(1);
        break;
      case 'limited':
        setSendError('There were too many attempts from your connection. Wait a few minutes and try again.');
        break;
      case 'network':
        setSendError('We could not reach the server. Check your connection and try again. Your answers are still here.');
        break;
      default:
        setSendError('The booking did not go through. Your answers are still here. Try again in a minute.');
    }
  }

  return (
    <div id="calendar" className="card card-lit animate-hero lg:grid lg:grid-cols-[20rem_minmax(0,1fr)]" style={{ animationDelay: '480ms' }}>
      <aside aria-label="About the call" className="border-b border-rule p-5 sm:p-8 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-dot border border-rule bg-panel">
            <Mark className="size-6" />
          </span>
          <p className="text-base font-semibold text-ink">{BOOKING.hostName}</p>
        </div>
        <h2 className="mt-5 text-2xl font-display tracking-display text-ink">Book a free call</h2>
        <ul className="mt-4 space-y-2 text-sm text-graphite">
          <li className="flex items-center gap-2">
            <Clock aria-hidden="true" className="size-4 shrink-0 text-signal-bright" />
            {BOOKING.durationMinutes} minutes
          </li>
          <li className="flex items-center gap-2">
            <Video aria-hidden="true" className="size-4 shrink-0 text-signal-bright" />
            Video call, link sent by email
          </li>
          <li aria-live="polite" className="flex items-start gap-2">
            {slot ? (
              <>
                <CalendarDays aria-hidden="true" className="mt-1 size-4 shrink-0 text-signal-bright" />
                <span>
                  <span className="font-medium text-ink">{formatDayShort(slot.start, tz)}</span>
                  <br />
                  {formatRange(slot.start, slot.end, tz)}, {tzName(tz)}
                </span>
              </>
            ) : null}
          </li>
        </ul>
        <p className="mt-5 text-base text-graphite">{BOOKING.description}</p>
        <h3 className="mt-6 text-sm font-semibold text-ink">On the call</h3>
        <ul className="mt-3 space-y-3">
          {BOOKING.onTheCall.map((item) => (
            <li key={item} className="grid grid-cols-[auto_1fr] gap-x-3 text-sm text-graphite">
              <Check aria-hidden="true" className="mt-1 size-4 text-signal-bright" strokeWidth={2.2} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0 p-5 sm:p-8">
        <ol aria-label="Booking steps" className="flex items-center gap-2 sm:gap-3">
          {STEPS.map((label, i) => {
            const n = (i + 1) as Step;
            const done = n < step;
            const active = n === step;
            return (
              <li key={label} aria-current={active ? 'step' : undefined} className="flex items-center gap-2 sm:gap-3">
                {i > 0 ? <span aria-hidden="true" className="h-px w-4 bg-rule-strong sm:w-8" /> : null}
                <span
                  className={
                    'tabular flex size-7 shrink-0 items-center justify-center rounded-dot text-sm font-semibold ' +
                    (active ? 'bg-signal text-on-signal' : done ? 'bg-signal-tint text-signal-strong' : 'border border-rule-strong text-graphite')
                  }
                >
                  {done ? <Check aria-hidden="true" className="size-4" strokeWidth={2.4} /> : n}
                </span>
                {/* On a phone only the current step shows its name; the others stay readable by screen readers. */}
                <span className={(active ? 'text-ink' : 'sr-only text-graphite sm:not-sr-only') + ' text-sm font-medium'}>
                  {label}
                  {done ? <span className="sr-only"> (done)</span> : null}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-8">
          {browser ? (
            <>
              <div hidden={step !== 1}>
                <DetailsStep values={values} onChange={setValues} error={step === 1 ? sendError : null} revealAll={revealAll} onNext={toSchedule} />
              </div>
              {/* Mounted from the start, so open days load while the visitor fills in the form. */}
              <div hidden={step !== 2}>
                <SchedulePicker
                  tz={tz}
                  timeZones={timeZones}
                  onTzChange={setTzChoice}
                  date={date}
                  onDate={setDate}
                  slot={slot}
                  onSlot={pickSlot}
                  refreshKey={refreshKey}
                  notice={notice}
                  bookingFor={[values.firstName.trim(), values.lastName.trim()].filter(Boolean).join(' ') + `, ${values.email.trim()}`}
                  pending={pending}
                  error={step === 2 ? sendError : null}
                  onBack={() => {
                    setSendError(null);
                    setStep(1);
                  }}
                  onBook={submit}
                />
              </div>
              {step === 3 && booked ? <ConfirmedStep {...booked} onRestart={onRestart} /> : null}
            </>
          ) : (
            <div>
              <h2 id="step-1-title" className="text-2xl font-display tracking-display text-ink">
                Your details
              </h2>
              <p role="status" className="mt-5 text-sm text-graphite">
                Loading the booking form
              </p>
              <noscript>
                <p className="mt-3 text-sm text-graphite">Booking needs JavaScript. Turn it on to book a call.</p>
              </noscript>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
