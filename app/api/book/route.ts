import type { NextRequest } from 'next/server';
import { forgetBusyCache } from '@/lib/booking-availability';
import { getCalendar } from '@/lib/booking-calendar';
import { BOOKING, MS_MINUTE } from '@/lib/booking-config';
import { attendeeName, cleanLine, eventDescription, eventTitle } from '@/lib/booking-event';
import { allow, clientIp, serially } from '@/lib/booking-guard';
import { failure, json } from '@/lib/booking-http';
import { bookableWindow, clashes, onGrid } from '@/lib/booking-slots';
import { isTimeZone } from '@/lib/booking-time';
import { validateDetails } from '@/lib/booking-validate';

export const dynamic = 'force-dynamic';

const MAX_BODY_CHARS = 16_000;

/**
 * POST /api/book creates the calendar event with a Meet link and lets Google email the invite.
 * Body: { start (UTC ISO), timezone, firstName, lastName, email, phoneRegion, phone, company,
 * teamSize, topic, website (honeypot, must be empty) }.
 */
export async function POST(request: NextRequest) {
  if (!allow(`book:${clientIp(request)}`, 5, 10 * 60_000)) return json({ error: 'rate_limited' }, 429);
  // Requiring JSON makes a cross-site form post impossible without a CORS preflight.
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ error: 'invalid' }, 415);

  const text = await request.text();
  if (text.length > MAX_BODY_CHARS) return json({ error: 'invalid' }, 413);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'invalid' }, 400);
  }

  // Honeypot: a field people never see. A bot that fills it gets a success that books nothing.
  if (typeof body.website === 'string' && body.website.trim()) return json({ ok: true });

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
    // Check and create as one step, so two visitors cannot both be told the same time is free.
    const created = await serially(async () => {
      const pad = BOOKING.bufferMinutes * MS_MINUTE;
      const busy = await calendar.busy(start - pad, end + pad);
      if (clashes({ start, end }, busy)) return null;
      return calendar.create({
        start,
        end,
        summary: eventTitle(data),
        description: eventDescription(data, timezone),
        attendee: { email: cleanLine(data.email, 254), name: attendeeName(data) },
      });
    });
    if (!created) return json({ error: 'slot_taken' }, 409);
    forgetBusyCache();
    return json({ ok: true, start: new Date(start).toISOString(), end: new Date(end).toISOString(), meetLink: created.meetLink });
  } catch (error) {
    return failure(error);
  }
}
