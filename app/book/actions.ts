'use server';

import { deliverLead, validateLead, type FieldErrors } from '@/lib/lead';

export type BookingState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: FieldErrors }
  | { status: 'failed' }
  | { status: 'sent'; firstName: string; email: string; timezone: string };

/**
 * Validates on the server (the client checks are a convenience, not a guarantee) and reports
 * success only when the lead was accepted for delivery. A failed delivery is surfaced to the
 * visitor so the request is never silently lost.
 */
export async function requestAudit(_prev: BookingState, form: FormData): Promise<BookingState> {
  // Honeypot: a field people never see. Bots that fill it get a quiet, harmless response.
  if (String(form.get('website') ?? '').trim()) return { status: 'idle' };

  const input = Object.fromEntries([...form.entries()].map(([k, v]) => [k, typeof v === 'string' ? v : '']));
  const result = validateLead(input);
  if (!result.ok) return { status: 'invalid', errors: result.errors };

  const delivery = await deliverLead(result.lead);
  if (!delivery.ok) {
    console.error(`[booking] delivery failed: ${delivery.reason}`);
    return { status: 'failed' };
  }
  return {
    status: 'sent',
    firstName: result.lead.name.split(/\s+/)[0],
    email: result.lead.email,
    timezone: result.lead.timezone,
  };
}
