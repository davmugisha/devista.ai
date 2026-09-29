// The booking form's single source of truth: options, limits, validation and delivery.
// Imported by the client form (validation, options) and the server action (validation,
// delivery). No path aliases here, so the gate checks can import it directly in Node.

export const SIZES = [
  { value: '1-49', label: 'Fewer than 50 people' },
  { value: '50-199', label: '50 to 199 people' },
  { value: '200-499', label: '200 to 499 people' },
  { value: '500-999', label: '500 to 999 people' },
  { value: '1000-4999', label: '1,000 to 4,999 people' },
  { value: '5000+', label: '5,000 people or more' },
] as const;

export const ROLES = [
  { value: 'ceo', label: 'CEO, founder or owner' },
  { value: 'coo', label: 'COO or head of operations' },
  { value: 'cfo', label: 'CFO or finance lead' },
  { value: 'it', label: 'IT or security lead' },
  { value: 'department', label: 'Head of a department' },
  { value: 'other', label: 'Another role' },
] as const;

export const BOTTLENECKS = [
  { value: 'handoffs', label: 'Handoffs between teams and tools' },
  { value: 'rekeying', label: 'Re-keying the same data into several systems' },
  { value: 'reporting', label: 'Reports assembled by hand' },
  { value: 'approvals', label: 'Approvals chased over email and chat' },
  { value: 'visibility', label: 'No single view of how the company is running' },
  { value: 'outgrown', label: 'Workflows that have outgrown our systems' },
  { value: 'other', label: 'Something else' },
] as const;

export const FIELD_LIMITS = { name: 120, email: 254, company: 160, details: 2000 } as const;

export type LeadInput = Record<string, string | undefined>;
export type Lead = {
  name: string;
  email: string;
  company: string;
  size: string;
  role: string;
  bottleneck: string;
  details: string;
  timezone: string;
};
export type FieldErrors = Partial<Record<keyof Lead, string>>;
export type Validation = { ok: true; lead: Lead } | { ok: false; errors: FieldErrors };

const has = (list: readonly { value: string }[], v: string) => list.some((o) => o.value === v);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isTimeZone(tz: string) {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Validates one field; returns a specific message saying what is wrong and how to fix it. */
export function fieldError(field: keyof Lead, raw: string | undefined): string | undefined {
  const v = (raw ?? '').trim();
  switch (field) {
    case 'name':
      if (!v) return 'Enter your full name so we know who to address.';
      if (v.length > FIELD_LIMITS.name) return `Shorten your name to ${FIELD_LIMITS.name} characters or fewer.`;
      return;
    case 'email':
      if (!v) return 'Enter your work email. We send the call times there.';
      if (!EMAIL.test(v)) return 'Enter an email address in the format name@company.com.';
      if (v.length > FIELD_LIMITS.email) return 'This email address is too long. Check it and try again.';
      return;
    case 'company':
      if (!v) return 'Enter the name of your company.';
      if (v.length > FIELD_LIMITS.company) return `Shorten the company name to ${FIELD_LIMITS.company} characters or fewer.`;
      return;
    case 'size':
      if (!has(SIZES, v)) return 'Choose the range that matches how many people work at your company.';
      return;
    case 'role':
      if (!has(ROLES, v)) return 'Choose the role closest to yours, or Another role.';
      return;
    case 'bottleneck':
      if (!has(BOTTLENECKS, v)) return 'Choose the bottleneck that costs you most, or Something else.';
      return;
    case 'details':
      if (v.length > FIELD_LIMITS.details) return `Keep this under ${FIELD_LIMITS.details} characters. You can tell us more on the call.`;
      return;
    default:
      return;
  }
}

export const REQUIRED: (keyof Lead)[] = ['name', 'email', 'company', 'size', 'role', 'bottleneck'];

export function validateLead(input: LeadInput): Validation {
  const errors: FieldErrors = {};
  for (const f of [...REQUIRED, 'details'] as (keyof Lead)[]) {
    const e = fieldError(f, input[f]);
    if (e) errors[f] = e;
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  const tz = (input.timezone ?? '').trim();
  return {
    ok: true,
    lead: {
      name: input.name!.trim(),
      email: input.email!.trim(),
      company: input.company!.trim(),
      size: input.size!,
      role: input.role!,
      bottleneck: input.bottleneck!,
      details: (input.details ?? '').trim(),
      timezone: isTimeZone(tz) ? tz : 'UTC',
    },
  };
}

const label = (list: readonly { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label ?? v;

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function leadEmail(lead: Lead, receivedAt: Date) {
  const rows: [string, string][] = [
    ['Name', lead.name],
    ['Work email', lead.email],
    ['Company', lead.company],
    ['Company size', label(SIZES, lead.size)],
    ['Role', label(ROLES, lead.role)],
    ['Biggest bottleneck', label(BOTTLENECKS, lead.bottleneck)],
    ['Details', lead.details || '(none)'],
    ['Time zone', lead.timezone],
    ['Received', receivedAt.toISOString()],
  ];
  return {
    subject: `Operations audit request: ${lead.company} (${label(SIZES, lead.size)})`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n') + '\n\nReply within one working day with three call times in the requester’s time zone.',
    html:
      '<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
      rows.map(([k, v]) => `<tr><th align="left">${escape(k)}</th><td>${escape(v).replace(/\n/g, '<br>')}</td></tr>`).join('') +
      '</table>',
  };
}

export type Delivery = { ok: true; id: string } | { ok: false; reason: 'not_configured' | 'rejected' | 'unreachable' };

/**
 * Sends the lead to the owner's inbox through Resend's REST API. Returns ok only when Resend
 * accepted the message; the form never confirms otherwise. RESEND_API_URL exists for tests.
 */
export async function deliverLead(lead: Lead, env: Record<string, string | undefined> = process.env): Promise<Delivery> {
  const key = env.RESEND_API_KEY;
  const to = env.LEAD_TO_EMAIL;
  const from = env.LEAD_FROM_EMAIL;
  if (!key || !to || !from) return { ok: false, reason: 'not_configured' };
  const mail = leadEmail(lead, new Date());
  try {
    const res = await fetch((env.RESEND_API_URL || 'https://api.resend.com') + '/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: to.split(',').map((s) => s.trim()), reply_to: lead.email, ...mail }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { ok: false, reason: 'rejected' };
    const body = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: body.id ?? 'accepted' };
  } catch {
    return { ok: false, reason: 'unreachable' };
  }
}
