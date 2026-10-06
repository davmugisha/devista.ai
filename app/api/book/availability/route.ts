import type { NextRequest } from 'next/server';
import { openSlots } from '@/lib/booking-availability';
import { BOOKING } from '@/lib/booking-config';
import { allow, clientIp } from '@/lib/booking-guard';
import { failure, json } from '@/lib/booking-http';
import { groupByDate } from '@/lib/booking-slots';
import { isDateKey, isMonthKey, isTimeZone } from '@/lib/booking-time';

export const dynamic = 'force-dynamic';

/**
 * GET /api/book/availability?date=YYYY-MM-DD&tz=<IANA zone>  the open slots on one day.
 * GET /api/book/availability?month=YYYY-MM&tz=<IANA zone>    how many slots each day has.
 * Days are read on the visitor's calendar (tz). Slot times are UTC. Without tz the host's zone is used.
 */
export async function GET(request: NextRequest) {
  if (!allow(`availability:${clientIp(request)}`, 90, 60_000)) return json({ error: 'rate_limited' }, 429);

  const params = request.nextUrl.searchParams;
  const tz = params.get('tz') || BOOKING.hostTimezone;
  const date = params.get('date');
  const month = params.get('month');
  if (!isTimeZone(tz)) return json({ error: 'invalid_timezone' }, 400);
  if (date ? !isDateKey(date) : !month || !isMonthKey(month)) return json({ error: 'invalid_date' }, 400);

  try {
    const days = groupByDate(await openSlots(), tz);
    if (date) {
      const slots = (days.get(date) ?? []).map((s) => ({ start: new Date(s.start).toISOString(), end: new Date(s.end).toISOString() }));
      return json({ date, timezone: tz, slots });
    }
    const counts: Record<string, number> = {};
    for (const [key, list] of days) if (key.startsWith(`${month}-`)) counts[key] = list.length;
    return json({ month, timezone: tz, days: counts });
  } catch (error) {
    return failure(error);
  }
}
