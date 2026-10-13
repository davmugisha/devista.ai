import type { NextRequest } from 'next/server';
import { forgetBusyCache } from '@/lib/booking-availability';
import { getCalendar } from '@/lib/booking-calendar';
import { BOOKING, BUFFER_MS, MS_MINUTE } from '@/lib/booking-config';
import { attendeeName, cleanLine, eventDescription, eventTitle, guestList } from '@/lib/booking-event';
import { allow, clientIp, serialQueue } from '@/lib/api-guard';
import { failure, json, readForm } from '@/lib/api-http';
import { bookableWindow, clashes, onGrid } from '@/lib/booking-slots';
import { isTimeZone } from '@/lib/booking-time';
import { LIMITS, validateDetails } from '@/lib/booking-validate';

export const dynamic = 'force-dynamic';

const MAX_BODY_CHARS = 16_000;

// Check and create as one step, so two visitors cannot both be told the same time is free.
const serially = serialQueue();

/**
 * POST /api/book creates the calendar event with a Meet link and lets Google email the invite.
 * Body: { start (UTC ISO), timezone, firstName, lastName, email, phoneRegion, phone, company, site,
 * teamSize, revenue, topic, website (honeypot, must be empty) }.
 */
export async function POST(request: NextRequest) {
  if (!allow(`book:${clientIp(request)}`, 5, 10 * 60_000)) return json({ error: 'rate_limited' }, 429);
  const form = await readForm(request, MAX_BODY_CHARS);
  if ('response' in form) return form.response;
  const { body } = form;

  const details = validateDetails(body);
  if (!details.ok) return json({ error: 'invalid', fields: details.errors }, 400);

  // The slot must be a real instant, on the host's grid, inside the notice period and booking window.
  const startIso = typeof body.start === 'string' ? body.start : '';
  const start = Date.parse(startIso);
  if (!Number.isFinite(start) || new Date(start).toISOString() !== startIso) return json({ error: 'invalid_slot' }, 400);
  const bookable = bookableWindow(Date.now());
  if (start < bookable.from || start > bookable.to || !onGrid(start)) return json({ error: 'invalid_slot' }, 400);

  const end = start + BOOKING.durationMinutes * MS_MINUTE;
  const timezone = typeof body.timezone === 'string' && isTimeZone(body.timezone) ? body.timezone : 'UTC';
  const { data } = details;

  try {
    const calendar = getCalendar();
    const created = await serially(async () => {
      const busy = await calendar.busy(start - BUFFER_MS, end + BUFFER_MS);
      if (clashes({ start, end }, busy)) return null;
      return calendar.create({
        start,
        end,
        summary: eventTitle(data),
        description: eventDescription(data, timezone),
        attendees: guestList({ email: cleanLine(data.email, LIMITS.email), name: attendeeName(data) }),
      });
    });
    if (!created) return json({ error: 'slot_taken' }, 409);
    forgetBusyCache();
    return json({ ok: true, start: new Date(start).toISOString(), end: new Date(end).toISOString(), meetLink: created.meetLink });
  } catch (error) {
    return failure(error);
  }
}
