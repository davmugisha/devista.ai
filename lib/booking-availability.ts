// Open slots: the host's grid, minus the calendar's busy time and the buffer around it, minus
// anything inside the notice period. Server only.

import { BUFFER_MS } from './booking-config';
import { getCalendar } from './booking-calendar';
import { bookableWindow, freeSlots, gridSlots, type Interval } from './booking-slots';

// Visitors flip between months and days quickly, so the same calendar read is reused for a few
// seconds. The booking route never uses this cache: it always asks the calendar directly.
const CACHE_MS = 15_000;
let cache: { key: string; at: number; busy: Interval[] } | null = null;

export function forgetBusyCache() {
  cache = null;
}

export async function openSlots(now = Date.now()): Promise<Interval[]> {
  const { from, to } = bookableWindow(now);
  const grid = gridSlots(from, to);
  if (!grid.length) return [];

  const start = grid[0].start - BUFFER_MS;
  const end = grid[grid.length - 1].end + BUFFER_MS;
  const calendar = getCalendar();
  const key = `${calendar.kind}|${start}|${end}`;

  if (!cache || cache.key !== key || now - cache.at > CACHE_MS) {
    cache = { key, at: now, busy: await calendar.busy(start, end) };
  }
  return freeSlots(grid, cache.busy);
}
