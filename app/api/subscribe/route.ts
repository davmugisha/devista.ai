import type { NextRequest } from 'next/server';
import { allow, clientIp } from '@/lib/booking-guard';
import { json } from '@/lib/booking-http';
import { newsletterEmailError } from '@/lib/newsletter';
import { addSubscriber, StoreNotConfiguredError } from '@/lib/newsletter-store';

export const dynamic = 'force-dynamic';

const MAX_BODY_CHARS = 2_000;

/**
 * POST /api/subscribe adds an address to the email updates list.
 * Body: { email, website (honeypot, must be empty) }. Answers { ok: true } only once the address
 * is saved. A repeat signup gets the same answer, so the route never reveals who is on the list.
 */
export async function POST(request: NextRequest) {
  if (!allow(`subscribe:${clientIp(request)}`, 5, 10 * 60_000)) return json({ error: 'rate_limited' }, 429);
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

  // Honeypot: a field people never see. A bot that fills it gets a success that saves nothing.
  if (typeof body.website === 'string' && body.website.trim()) return json({ ok: true });

  const email = typeof body.email === 'string' ? body.email : '';
  const problem = newsletterEmailError(email);
  if (problem) return json({ error: 'invalid', message: problem }, 400);

  try {
    await addSubscriber(email);
    return json({ ok: true });
  } catch (error) {
    if (error instanceof StoreNotConfiguredError) {
      console.error('[subscribe] not configured: set SUBSCRIBERS_FILE');
      return json({ error: 'not_configured' }, 503);
    }
    console.error('[subscribe]', error instanceof Error ? error.message : error);
    return json({ error: 'unavailable' }, 502);
  }
}
