// The text of the calendar event. Visitor input is cleaned before it reaches the host's calendar:
// control characters are removed and angle brackets are neutralised, because Google Calendar
// renders event descriptions as HTML.

import { BOOKING } from './booking-config';
import { LIMITS, phoneForDisplay, type DetailsInput } from './booking-validate';

// Control characters and the Unicode line and paragraph separators.
const CONTROL = /[\p{Cc}\p{Zl}\p{Zp}]/gu;

const neutralise = (s: string) => s.replace(/</g, '‹').replace(/>/g, '›');

/** One line of text: no line breaks, no control characters, no angle brackets. */
export function cleanLine(s: string, max: number) {
  return neutralise(s.replace(/[\r\n\t]+/g, ' ').replace(CONTROL, '').replace(/\s{2,}/g, ' ').trim()).slice(0, max);
}

/** Several lines of text: line breaks are kept, runs of blank lines are collapsed. */
export function cleanBlock(s: string, max: number) {
  const lines = s.replace(/\r\n?/g, '\n').split('\n').map((line) => line.replace(CONTROL, ''));
  return neutralise(lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()).slice(0, max);
}

const label = (value: string) => BOOKING.teamSizes.find((o) => o.value === value)?.label ?? '';

export function eventTitle(d: Pick<DetailsInput, 'firstName' | 'lastName'>) {
  const name = cleanLine(`${d.firstName} ${d.lastName}`, LIMITS.firstName + LIMITS.lastName + 1);
  return `${BOOKING.callTitle} with ${name}`;
}

export function eventDescription(d: DetailsInput, timezone: string) {
  const values: Record<string, string> = {
    business: BOOKING.businessName,
    name: cleanLine(`${d.firstName} ${d.lastName}`, 200),
    email: cleanLine(d.email, LIMITS.email),
    phone: cleanLine(phoneForDisplay(d), 40),
    company: cleanLine(d.company, LIMITS.company),
    teamSize: label(d.teamSize),
    timezone: cleanLine(timezone, 64),
    topic: cleanBlock(d.topic, LIMITS.topic),
  };
  return BOOKING.eventDescription
    .split('\n')
    .map((line) => {
      let empty = false;
      const filled = line.replace(/\{(\w+)\}/g, (_, key: string) => {
        const v = values[key] ?? '';
        if (!v) empty = true;
        return v;
      });
      return empty ? null : filled;
    })
    .filter((line): line is string => line !== null)
    .join('\n');
}

/** Display name for the attendee entry. */
export function attendeeName(d: Pick<DetailsInput, 'firstName' | 'lastName'>) {
  return cleanLine(`${d.firstName} ${d.lastName}`, 200);
}
