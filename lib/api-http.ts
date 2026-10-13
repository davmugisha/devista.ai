// Request and response helpers for the API routes; failure() is the booking routes' error
// mapping. Server only.

import { NextResponse } from 'next/server';
import { NotConfiguredError } from './booking-calendar';

export function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/**
 * The checks every form post shares. Returns the body as an object, or the response to send
 * instead. Requiring JSON makes a cross-site form post impossible without a CORS preflight. The
 * honeypot is a `website` field people never see: a bot that fills it gets a success that does
 * nothing.
 */
export async function readForm(request: Request, maxChars: number): Promise<{ body: Record<string, unknown> } | { response: NextResponse }> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return { response: json({ error: 'invalid' }, 415) };
  const text = await request.text();
  if (text.length > maxChars) return { response: json({ error: 'invalid' }, 413) };
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { response: json({ error: 'invalid' }, 400) };
  const body = parsed as Record<string, unknown>;
  if (typeof body.website === 'string' && body.website.trim()) return { response: json({ ok: true }) };
  return { body };
}

/** Turns an unexpected error into a safe response. Details go to the server log, never the visitor. */
export function failure(error: unknown) {
  if (error instanceof NotConfiguredError) {
    console.error('[booking] not configured: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REFRESH_TOKEN');
    return json({ error: 'not_configured' }, 503);
  }
  console.error('[booking]', error instanceof Error ? error.message : error);
  return json({ error: 'unavailable' }, 502);
}
