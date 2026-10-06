// Time zone helpers built on Intl, so daylight saving is always right and no UTC offset is
// hardcoded. Used by the server (slot grid) and the browser (calendar and labels).

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(tz: string) {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    formatters.set(tz, f);
  }
  return f;
}

export type Zoned = { year: number; month: number; day: number; hour: number; minute: number; second: number };

/** The wall-clock reading in a time zone at an instant (epoch milliseconds). */
export function zonedParts(ms: number, tz: string): Zoned {
  const p: Record<string, number> = {};
  for (const part of formatter(tz).formatToParts(new Date(ms))) {
    if (part.type !== 'literal') p[part.type] = Number(part.value);
  }
  return { year: p.year, month: p.month, day: p.day, hour: p.hour === 24 ? 0 : p.hour, minute: p.minute, second: p.second };
}

/** How far ahead of UTC a time zone is at an instant, in milliseconds. */
export function tzOffsetMs(ms: number, tz: string) {
  const p = zonedParts(ms, tz);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000;
}

/**
 * The instant at which a time zone's clock reads the given wall time. Returns null when that
 * wall time does not exist (the hour skipped by a clock change).
 */
export function zonedWallToUtc(year: number, month: number, day: number, hour: number, minute: number, tz: string): number | null {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const first = guess - tzOffsetMs(guess, tz);
  const utc = guess - tzOffsetMs(first, tz);
  const p = zonedParts(utc, tz);
  return p.year === year && p.month === month && p.day === day && p.hour === hour && p.minute === minute ? utc : null;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** YYYY-MM-DD for an instant, read on a time zone's calendar. */
export function dateKeyInZone(ms: number, tz: string) {
  const p = zonedParts(ms, tz);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export const dateKey = (year: number, month: number, day: number) => `${year}-${pad(month)}-${pad(day)}`;

export function isDateKey(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

export const isMonthKey = (s: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(s);

export function isTimeZone(tz: string) {
  if (!tz || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** "09:30" to minutes after midnight. */
export function clockToMinutes(clock: string) {
  const [h, m] = clock.split(':').map(Number);
  return h * 60 + m;
}
