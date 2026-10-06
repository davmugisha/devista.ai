// The slot grid: pure functions that turn the config's working hours into bookable instants.
// Everything is in UTC epoch milliseconds. A visitor's time zone only changes how a slot is
// labelled and which calendar day it falls on, never when it happens.

import { BOOKING, MS_DAY, MS_HOUR, MS_MINUTE } from './booking-config';
import { clockToMinutes, dateKeyInZone, zonedParts, zonedWallToUtc } from './booking-time';

export type Interval = { start: number; end: number };

/** The range of start times a visitor may pick, given the notice period and booking window. */
export function bookableWindow(now: number) {
  return { from: now + BOOKING.minNoticeHours * MS_HOUR, to: now + BOOKING.maxDaysAhead * MS_DAY };
}

/** Every slot on the host's weekly grid that starts between from and to. */
export function gridSlots(from: number, to: number): Interval[] {
  const tz = BOOKING.hostTimezone;
  const open = clockToMinutes(BOOKING.workingHours.start);
  const close = clockToMinutes(BOOKING.workingHours.end);
  const length = BOOKING.durationMinutes;
  const step = BOOKING.slotIntervalMinutes;
  const first = zonedParts(from, tz);
  const last = zonedParts(to, tz);
  const lastDay = Date.UTC(last.year, last.month - 1, last.day);
  const days = BOOKING.workingDays as readonly number[];
  const out: Interval[] = [];

  for (let day = Date.UTC(first.year, first.month - 1, first.day); day <= lastDay; day += MS_DAY) {
    const d = new Date(day);
    if (!days.includes(d.getUTCDay() || 7)) continue;
    for (let t = open; t + length <= close; t += step) {
      const start = zonedWallToUtc(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), Math.floor(t / 60), t % 60, tz);
      if (start === null || start < from || start > to) continue;
      out.push({ start, end: start + length * MS_MINUTE });
    }
  }
  return out;
}

/** True when a busy interval comes within the buffer of a slot, on either side. */
export function clashes(slot: Interval, busy: readonly Interval[]) {
  const buffer = BOOKING.bufferMinutes * MS_MINUTE;
  return busy.some((b) => slot.start < b.end + buffer && slot.end + buffer > b.start);
}

export function freeSlots(slots: readonly Interval[], busy: readonly Interval[]) {
  return slots.filter((s) => !clashes(s, busy));
}

/** Whether a start time sits exactly on the host's grid. Used to reject forged or stale requests. */
export function onGrid(start: number) {
  return gridSlots(start - MS_DAY, start + MS_DAY).some((s) => s.start === start);
}

/** Groups slots by the calendar day they fall on in a visitor's time zone. */
export function groupByDate(slots: readonly Interval[], tz: string) {
  const days = new Map<string, Interval[]>();
  for (const s of slots) {
    const key = dateKeyInZone(s.start, tz);
    const list = days.get(key);
    if (list) list.push(s);
    else days.set(key, [s]);
  }
  return days;
}
