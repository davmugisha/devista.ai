'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { buttonClass } from '@/components/Button';
import { Chevron, controlClass, Field } from '@/components/Field';
import { BookingClosedError, fetchDay, fetchMonth, formatCivilDate, formatRange, formatTime, tzName, weekdayNames, type Slot } from '@/lib/booking-client';
import { bookableWindow } from '@/lib/booking-slots';
import { dateKey, dateKeyInZone } from '@/lib/booking-time';

type Load<T> = { status: 'loading' } | { status: 'error' } | { status: 'closed' } | { status: 'ready'; data: T };
const failed = (e: unknown): Load<never> => ({ status: e instanceof BookingClosedError ? 'closed' : 'error' });

type Props = {
  tz: string;
  timeZones: { value: string; label: string }[];
  onTzChange: (tz: string) => void;
  date: string | null;
  onDate: (date: string | null) => void;
  slot: Slot | null;
  onSlot: (slot: Slot | null) => void;
  /** Bumped when a booking was refused, so every cached answer is read again. */
  refreshKey: number;
  notice: string | null;
  /** Who the call is for, from the details step. */
  bookingFor: string;
  pending: boolean;
  /** A problem with the last attempt to book, shown above the calendar. */
  error: string | null;
  onBack: () => void;
  onBook: () => void;
};

// A month as one number, so "next month" is plus one and bounds are plain comparisons.
const monthIndex = (key: string) => Number(key.slice(0, 4)) * 12 + Number(key.slice(5, 7)) - 1;
const monthKey = (index: number) => `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`;

const spinner = (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 animate-spin fill-none stroke-current" strokeWidth="2">
    <path d="M8 2a6 6 0 1 1-6 6" />
  </svg>
);

export function SchedulePicker({ tz, timeZones, onTzChange, date, onDate, slot, onSlot, refreshKey, notice, bookingFor, pending, error, onBack, onBook }: Props) {
  // The visitor's clock is read once, when the picker first appears in the browser.
  const [now] = useState(() => Date.now());
  const bounds = useMemo(() => {
    const { from, to } = bookableWindow(now);
    return { first: dateKeyInZone(from, tz), last: dateKeyInZone(to, tz) };
  }, [now, tz]);
  const today = dateKeyInZone(now, tz);
  const weekdays = useMemo(weekdayNames, []);

  const [viewIndex, setViewIndex] = useState(() => monthIndex(bounds.first));
  const current = Math.min(Math.max(viewIndex, monthIndex(bounds.first)), monthIndex(bounds.last));
  const month = monthKey(current);
  const year = Math.floor(current / 12);
  const monthNumber = (current % 12) + 1;

  const [attempt, setAttempt] = useState(0);
  const [months, setMonths] = useState<Record<string, Load<Record<string, number>>>>({});
  const [days, setDays] = useState<Record<string, Load<Slot[]>>>({});
  const requested = useRef(new Set<string>());

  const monthId = `${refreshKey}|${attempt}|${tz}|${month}`;
  const dayId = date ? `${refreshKey}|${attempt}|${tz}|${date}` : null;

  useEffect(() => {
    if (requested.current.has(monthId)) return;
    requested.current.add(monthId);
    setMonths((m) => ({ ...m, [monthId]: { status: 'loading' } }));
    fetchMonth(month, tz).then(
      (data) => setMonths((m) => ({ ...m, [monthId]: { status: 'ready', data } })),
      (e) => setMonths((m) => ({ ...m, [monthId]: failed(e) })),
    );
  }, [monthId, month, tz]);

  useEffect(() => {
    if (!dayId || !date || requested.current.has(dayId)) return;
    requested.current.add(dayId);
    setDays((d) => ({ ...d, [dayId]: { status: 'loading' } }));
    fetchDay(date, tz).then(
      (data) => setDays((d) => ({ ...d, [dayId]: { status: 'ready', data } })),
      (e) => setDays((d) => ({ ...d, [dayId]: failed(e) })),
    );
  }, [dayId, date, tz]);

  const monthState = months[monthId] ?? { status: 'loading' as const };
  const dayState = dayId ? (days[dayId] ?? { status: 'loading' as const }) : null;

  // A time that is no longer on the day's list was taken, so it must not stay selected.
  useEffect(() => {
    if (dayState?.status !== 'ready' || !slot || !date) return;
    if (dateKeyInZone(Date.parse(slot.start), tz) === date && !dayState.data.some((s) => s.start === slot.start)) onSlot(null);
  }, [dayState, slot, date, tz, onSlot]);

  const openDays = monthState.status === 'ready' ? monthState.data : {};
  const cells = useMemo(() => {
    const lead = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7; // Monday first
    const length = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
    const list: (number | null)[] = [...Array<null>(lead).fill(null), ...Array.from({ length }, (_, i) => i + 1)];
    while (list.length % 7) list.push(null);
    const rows: (number | null)[][] = [];
    for (let i = 0; i < list.length; i += 7) rows.push(list.slice(i, i + 7));
    return rows;
  }, [year, monthNumber]);

  function pickDay(key: string) {
    if (key !== date) onSlot(null);
    onDate(key);
  }

  function changeTz(next: string) {
    onTzChange(next);
    if (slot) {
      // The chosen moment stays the same. Only the day it falls on can move.
      const key = dateKeyInZone(Date.parse(slot.start), next);
      onDate(key);
      setViewIndex(monthIndex(key));
    } else {
      onDate(null);
    }
  }

  const monthLabel = formatCivilDate(year, monthNumber, 1, 'month');
  const retry = () => setAttempt((a) => a + 1);

  return (
    <div>
      <h2 id="step-2-title" tabIndex={-1} className="text-2xl font-display tracking-display text-ink outline-none">
        Pick a time
      </h2>
      <p className="mt-2 text-sm text-graphite">
        Booking for <span className="font-medium text-ink">{bookingFor}</span>
      </p>

      {error ? (
        <div role="alert" className="mt-4 rounded-control border border-alert bg-alert-tint p-4 animate-arrive">
          <p className="text-sm font-semibold text-alert">We could not book your call.</p>
          <p className="mt-1 text-sm text-ink">{error}</p>
        </div>
      ) : null}

      {notice ? (
        <div role="alert" className="mt-4 rounded-control border border-hold bg-hold-tint p-4 text-sm font-medium text-ink animate-arrive">
          {notice}
        </div>
      ) : null}

      <div className="mt-5">
        <Field id="f-timezone" label="Time zone">
          <div className="relative">
            <select
              id="f-timezone"
              value={tz}
              onChange={(e) => changeTz(e.target.value)}
              className={controlClass(false, 'h-12 appearance-none pr-10')}
            >
              {timeZones.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </Field>
      </div>

      <div className="mt-6 grid gap-8 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 id="month-label" aria-live="polite" className="text-base font-semibold text-ink">
              {monthLabel}
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous month"
                disabled={current <= monthIndex(bounds.first)}
                onClick={() => setViewIndex(current - 1)}
                className="flex size-10 items-center justify-center rounded-control border border-rule-strong bg-panel text-ink transition-colors hover:border-signal-bright disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                disabled={current >= monthIndex(bounds.last)}
                onClick={() => setViewIndex(current + 1)}
                className="flex size-10 items-center justify-center rounded-control border border-rule-strong bg-panel text-ink transition-colors hover:border-signal-bright disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <table className="mt-3 w-full table-fixed border-separate border-spacing-y-1" aria-labelledby="month-label" aria-busy={monthState.status === 'loading'}>
            <thead>
              <tr>
                {weekdays.map((w) => (
                  <th key={w.long} scope="col" abbr={w.long} className="pb-1 text-center text-xs font-medium text-graphite">
                    {w.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cells.map((row, r) => (
                <tr key={r}>
                  {row.map((day, c) => {
                    if (day === null) return <td key={c} />;
                    const key = dateKey(year, monthNumber, day);
                    const count = openDays[key] ?? 0;
                    const enabled = count > 0 && key >= bounds.first && key <= bounds.last;
                    const selected = key === date;
                    return (
                      <td key={c} className="p-0 text-center">
                        <button
                          type="button"
                          disabled={!enabled}
                          aria-pressed={selected}
                          aria-current={key === today ? 'date' : undefined}
                          aria-label={`${formatCivilDate(year, monthNumber, day)}, ${enabled ? `${count} ${count === 1 ? 'time' : 'times'} open` : 'no times open'}`}
                          onClick={() => pickDay(key)}
                          className={
                            'tabular mx-auto flex h-11 w-full max-w-11 items-center justify-center rounded-dot text-base transition-colors ' +
                            (selected
                              ? 'bg-signal font-semibold text-on-signal'
                              : enabled
                                ? 'bg-signal-tint font-semibold text-signal-strong hover:bg-glow-deep'
                                : 'text-slate opacity-50')
                          }
                        >
                          {day}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {monthState.status === 'loading' ? (
            <p role="status" className="mt-3 flex items-center gap-2 text-sm text-graphite">
              {spinner}
              Loading open days
            </p>
          ) : null}
          {monthState.status === 'closed' ? (
            <p role="status" className="mt-3 text-sm text-hold">
              Online booking is not open yet. Please check back soon.
            </p>
          ) : null}
          {monthState.status === 'error' ? (
            <div role="alert" className="mt-3 text-sm text-alert">
              We could not load open days.{' '}
              <button type="button" onClick={retry} className="font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
                Try again
              </button>
            </div>
          ) : null}
          {monthState.status === 'ready' && Object.keys(openDays).length === 0 ? (
            <p role="status" className="mt-3 text-sm text-graphite">
              No days are open in {monthLabel}.
            </p>
          ) : null}
        </div>

        <div aria-live="polite" className="min-w-0">
          {!date || !dayState ? (
            <p className="text-sm text-graphite">Choose a day to see the open times.</p>
          ) : (
            <>
              <h3 className="text-base font-semibold text-ink">{formatCivilDate(Number(date.slice(0, 4)), Number(date.slice(5, 7)), Number(date.slice(8, 10)))}</h3>
              {dayState.status === 'loading' ? (
                <p role="status" className="mt-3 flex items-center gap-2 text-sm text-graphite">
                  {spinner}
                  Loading times
                </p>
              ) : null}
              {dayState.status === 'closed' ? (
                <p role="status" className="mt-3 text-sm text-hold">
                  Online booking is not open yet.
                </p>
              ) : null}
              {dayState.status === 'error' ? (
                <div role="alert" className="mt-3 text-sm text-alert">
                  We could not load the times.{' '}
                  <button type="button" onClick={retry} className="font-medium text-ink underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
                    Try again
                  </button>
                </div>
              ) : null}
              {dayState.status === 'ready' && dayState.data.length === 0 ? (
                <p role="status" className="mt-3 text-sm text-graphite">
                  No times left this day, try another.
                </p>
              ) : null}
              {dayState.status === 'ready' && dayState.data.length > 0 ? (
                <ul className="mt-3 grid grid-cols-2 gap-2 sm:max-h-96 sm:grid-cols-1 sm:overflow-y-auto sm:pr-1">
                  {dayState.data.map((s) => {
                    const selected = slot?.start === s.start;
                    return (
                      <li key={s.start}>
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => onSlot(s)}
                          className={
                            'tabular h-11 w-full rounded-control border text-base font-medium transition-colors ' +
                            (selected
                              ? 'border-signal bg-signal text-on-signal'
                              : 'border-rule-strong bg-panel text-ink hover:border-signal-bright hover:bg-signal-tint')
                          }
                        >
                          {formatTime(s.start, tz)}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-sm text-graphite">
          {slot ? (
            <>
              <span className="font-medium text-ink">{formatRange(slot.start, slot.end, tz)}</span>, {tzName(tz)}
            </>
          ) : (
            'Choose a day and a time to book.'
          )}
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button type="button" onClick={onBack} disabled={pending} className={buttonClass('secondary', 'md', 'w-full sm:w-auto')}>
            Edit your details
          </button>
          <button
            type="button"
            disabled={!date || !slot || pending}
            aria-disabled={!date || !slot || pending}
            onClick={onBook}
            className={buttonClass('primary', 'md', 'w-full sm:w-auto')}
          >
            {pending ? (
              <>
                {spinner}
                Booking your call
              </>
            ) : (
              'Book my call'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
