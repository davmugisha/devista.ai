// Response helpers for the API routes; failure() is the booking routes' error mapping. Server only.

import { NextResponse } from 'next/server';
import { NotConfiguredError } from './booking-calendar';

export function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
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
