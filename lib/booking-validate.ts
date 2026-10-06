// Validation for the details step. The browser uses it to show inline messages and to enable the
// button; the server runs the same rules again, because the browser is not trusted.

import { BOOKING } from './booking-config';
import { DIAL_CODES } from './booking-countries';
import { EMAIL_MAX, isEmail } from './email';

export const LIMITS = { firstName: 80, lastName: 80, email: EMAIL_MAX, phone: 20, company: 160, topic: 2000 } as const;

export type DetailsInput = {
  firstName: string;
  lastName: string;
  email: string;
  /** ISO region of the dialling code, for example RW. */
  phoneRegion: string;
  phone: string;
  company: string;
  teamSize: string;
  topic: string;
};
export type DetailField = keyof DetailsInput;
export type FieldErrors = Partial<Record<DetailField, string>>;

export const EMPTY_DETAILS: DetailsInput = {
  firstName: '',
  lastName: '',
  email: '',
  phoneRegion: '',
  phone: '',
  company: '',
  teamSize: '',
  topic: '',
};

export const DETAIL_FIELDS = Object.keys(EMPTY_DETAILS) as DetailField[];

const PHONE_CHARS = /^[\d\s().-]+$/;

const tooLong = (what: string, max: number) => `Shorten ${what} to ${max} characters or fewer.`;

/** One field's problem, in words that say how to fix it. Undefined means the field is fine. */
export function fieldError(field: DetailField, raw: string | undefined, all: Partial<DetailsInput> = {}): string | undefined {
  const v = (raw ?? '').trim();
  switch (field) {
    case 'firstName':
      if (!v) return 'Enter your first name so we know who to address.';
      if (v.length > LIMITS.firstName) return tooLong('your first name', LIMITS.firstName);
      return;
    case 'lastName':
      if (v.length > LIMITS.lastName) return tooLong('your last name', LIMITS.lastName);
      return;
    case 'email':
      if (!v) return 'Enter your work email. The calendar invite is sent there.';
      if (v.length > LIMITS.email) return 'This email address is too long. Check it and try again.';
      if (!isEmail(v)) return 'Enter an email address in the format name@company.com.';
      return;
    case 'phoneRegion':
      if (v && !(v in DIAL_CODES)) return 'Choose a country code from the list.';
      return;
    case 'phone': {
      if (!v) return;
      if (!PHONE_CHARS.test(v)) return 'Use digits only. Spaces, dashes and brackets are fine.';
      const digits = v.replace(/\D/g, '').length;
      if (digits < 6 || digits > 15 || v.length > LIMITS.phone) return 'Enter a phone number with 6 to 15 digits.';
      if (!all.phoneRegion?.trim()) return 'Choose a country code for this number.';
      return;
    }
    case 'company':
      if (v.length > LIMITS.company) return tooLong('the company name', LIMITS.company);
      return;
    case 'teamSize':
      if (v && !BOOKING.teamSizes.some((o) => o.value === v)) return 'Choose a team size from the list.';
      return;
    case 'topic':
      if (v.length > LIMITS.topic) return `Keep this under ${LIMITS.topic} characters. You can say more on the call.`;
      return;
  }
}

export function detailErrors(values: Partial<DetailsInput>): FieldErrors {
  const errors: FieldErrors = {};
  for (const f of DETAIL_FIELDS) {
    const e = fieldError(f, values[f], values);
    if (e) errors[f] = e;
  }
  return errors;
}

export type DetailsResult = { ok: true; data: DetailsInput } | { ok: false; errors: FieldErrors };

/** Server entry point: takes untrusted JSON and returns trimmed, checked values. */
export function validateDetails(raw: unknown): DetailsResult {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const values = { ...EMPTY_DETAILS };
  for (const f of DETAIL_FIELDS) {
    const v = src[f];
    values[f] = typeof v === 'string' ? v.trim() : '';
  }
  const errors = detailErrors(values);
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: values };
}

/** "+250 788 123 456", for the calendar event. Empty when no number was given. */
export function phoneForDisplay(d: Pick<DetailsInput, 'phoneRegion' | 'phone'>) {
  return d.phone ? `+${DIAL_CODES[d.phoneRegion] ?? ''} ${d.phone}`.trim() : '';
}
