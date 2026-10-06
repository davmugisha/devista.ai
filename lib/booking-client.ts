// Browser side of the booking API: small typed wrappers around fetch, and the date and time
// labels shown to the visitor. Labels use the visitor's own locale and the chosen time zone.

import type { DetailsInput, FieldErrors } from './booking-validate';

export type Slot = { start: string; end: string };

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`availability ${res.status}`);
  return (await res.json()) as T;
}

/** Number of open slots per day (YYYY-MM-DD) for one month, read on the given time zone's calendar. */
export async function fetchMonth(month: string, tz: string) {
  const data = await getJson<{ days: Record<string, number> }>(`/api/book/availability?month=${month}&tz=${encodeURIComponent(tz)}`);
  return data.days;
}

export async function fetchDay(date: string, tz: string) {
  const data = await getJson<{ slots: Slot[] }>(`/api/book/availability?date=${date}&tz=${encodeURIComponent(tz)}`);
  return data.slots;
}

export type BookResult =
  | { ok: true; start: string; end: string; meetLink: string | null }
  /** The time is gone, or is no longer bookable. Pick another. */
  | { ok: false; kind: 'taken' }
  | { ok: false; kind: 'invalid'; fields: FieldErrors }
  | { ok: false; kind: 'limited' | 'unavailable' | 'network' };

export async function postBooking(start: string, timezone: string, details: DetailsInput, website: string): Promise<BookResult> {
  let res: Response;
  try {
    res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...details, start, timezone, website }),
    });
  } catch {
    return { ok: false, kind: 'network' };
  }
  const body = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    fields?: FieldErrors;
    start?: string;
    end?: string;
    meetLink?: string | null;
  };
  if (res.ok && body.ok && body.start && body.end) return { ok: true, start: body.start, end: body.end, meetLink: body.meetLink ?? null };
  if (res.status === 409 || body.error === 'slot_taken' || body.error === 'invalid_slot') return { ok: false, kind: 'taken' };
  if (res.status === 400 && body.fields) return { ok: false, kind: 'invalid', fields: body.fields };
  if (res.status === 429) return { ok: false, kind: 'limited' };
  return { ok: false, kind: 'unavailable' };
}

export function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** "Africa, Kigali": the zone's name without underscores and slashes. */
export const tzName = (tz: string) => tz.replace(/_/g, ' ').replace(/\//g, ', ');

/** "Central Africa Time" or "Central European Summer Time", for a specific instant. */
export function tzLongName(tz: string, at: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, { timeZone: tz, timeZoneName: 'long' }).formatToParts(at).find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

function tzOffsetLabel(tz: string, at: Date) {
  try {
    return new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(at).find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

/** Every IANA zone the browser knows, with the detected zone and UTC always present. */
export function timeZoneOptions(detected: string) {
  let zones: string[] = [];
  try {
    zones = (Intl as unknown as { supportedValuesOf(key: string): string[] }).supportedValuesOf('timeZone');
  } catch {
    // Older browsers: the detected zone and UTC are enough to book.
  }
  const set = new Set(zones);
  set.add('UTC');
  set.add(detected);
  const now = new Date();
  return [...set].sort().map((value) => {
    const offset = tzOffsetLabel(value, now);
    return { value, label: offset ? `${tzName(value)} (${offset})` : tzName(value) };
  });
}

const cache = new Map<string, Intl.DateTimeFormat>();
function fmt(key: string, tz: string, options: Intl.DateTimeFormatOptions) {
  const id = `${key}|${tz}`;
  let f = cache.get(id);
  if (!f) {
    f = new Intl.DateTimeFormat(undefined, { ...options, timeZone: tz });
    cache.set(id, f);
  }
  return f;
}

export const formatTime = (iso: string, tz: string) => fmt('time', tz, { hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
export const formatDay = (iso: string, tz: string) =>
  fmt('day', tz, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
export const formatDayShort = (iso: string, tz: string) => fmt('dayShort', tz, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso));
export const formatRange = (start: string, end: string, tz: string) => `${formatTime(start, tz)} to ${formatTime(end, tz)}`;

/** A civil date (no time zone) written out, for example "Tuesday, 14 October 2026". */
export function formatCivilDate(year: number, month: number, day: number, style: 'long' | 'month' = 'long') {
  const options: Intl.DateTimeFormatOptions =
    style === 'month' ? { month: 'long', year: 'numeric' } : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return fmt(`civil-${style}`, 'UTC', options).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Monday-first weekday names: long for screen readers, short for the grid. */
export function weekdayNames() {
  const long = new Intl.DateTimeFormat(undefined, { weekday: 'long', timeZone: 'UTC' });
  const short = new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone: 'UTC' });
  // 2024-01-01 was a Monday.
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(2024, 0, 1 + i));
    return { long: long.format(d), short: short.format(d) };
  });
}

/** The region of the browser's language when it names one (en-GB gives GB), else empty. */
export function languageRegion() {
  try {
    return new Intl.Locale(navigator.language).region ?? '';
  } catch {
    return '';
  }
}

export function regionNames() {
  try {
    return new Intl.DisplayNames(undefined, { type: 'region' });
  } catch {
    return null;
  }
}
