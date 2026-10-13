import type { NextRequest } from 'next/server';
import { allow, clientIp } from '@/lib/api-guard';
import { json, readForm } from '@/lib/api-http';
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
  const form = await readForm(request, MAX_BODY_CHARS);
  if ('response' in form) return form.response;
  const { body } = form;

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
