// Everything the owner may want to change about the free call booking lives in this one file.
// It is safe to import from the browser: it holds no secrets. The Google credentials come from
// environment variables only (see .env.example).
import { FOUNDER, SITE } from './site';

export const BOOKING = {
  // Who and what the visitor is booking. The host is the founder, by name (David, 2026-10-11).
  hostName: FOUNDER.name,
  businessName: SITE.name,
  /** The calendar event title is "<callTitle> with <first> <last>". */
  callTitle: `${SITE.name} introductory call`,
  description:
    'A free call to find the one workflow worth starting with and to see whether a team of AI agents fits the way you work.',
  onTheCall: [
    'Find the one workflow worth starting with',
    'Walk through the repeat work that costs your team the most time',
    'If it fits, agree the next step: a written scope and a fixed price. Nothing starts until you have paid',
  ],
  beforeTheCall: [
    'Pick one workflow that repeats every week.',
    'Note the tools it uses. We do not need access to any of them.',
    'Invite the person who does the work, if they can join.',
  ],

  // Length and spacing, in minutes.
  durationMinutes: 30,
  slotIntervalMinutes: 30,
  /** Free time kept before and after every existing event. */
  bufferMinutes: 10,

  // When the host takes calls. Times are wall-clock in hostTimezone (an IANA name), so daylight
  // saving is handled. Days are ISO weekdays: 1 is Monday and 7 is Sunday.
  hostTimezone: 'Africa/Kigali',
  workingDays: [1, 2, 3, 4, 5],
  workingHours: { start: '09:00', end: '17:00' },

  /** The earliest bookable moment is this many hours from now. */
  minNoticeHours: 12,
  /** Visitors can book at most this many days ahead. */
  maxDaysAhead: 30,

  /** The host's Google calendar. GOOGLE_CALENDAR_ID overrides it. */
  calendarId: 'primary',

  /**
   * The text of the calendar event. A line is dropped when it holds a placeholder the visitor
   * left empty. Placeholders: {business} {name} {email} {phone} {company} {site} {teamSize}
   * {revenue} {timezone} {topic}.
   */
  eventDescription: [
    'Booked on the {business} website.',
    '',
    'Name: {name}',
    'Email: {email}',
    'Phone: {phone}',
    'Company: {company}',
    'Website: {site}',
    'Team size: {teamSize}',
    'Annual revenue: {revenue}',
    'Visitor time zone: {timezone}',
    'Task to hand to agents: {topic}',
  ].join('\n'),

  topicLabel: 'Which task would you most like agents to take over?',
  topicHint: 'A sentence or two about the work, how often it comes back and the tools it uses.',
  // Answer options, not prices. The visitor's revenue helps prepare the call; "Prefer not to say"
  // keeps the question from blocking a booking.
  revenueRanges: [
    { value: 'under-100k', label: 'Under US$100k a year' },
    { value: '100k-500k', label: 'US$100k to US$500k' },
    { value: '500k-1m', label: 'US$500k to US$1M' },
    { value: '1m-5m', label: 'US$1M to US$5M' },
    { value: '5m-plus', label: 'More than US$5M' },
    { value: 'private', label: 'Prefer not to say' },
  ],
  teamSizes: [
    { value: 'solo', label: 'Just me' },
    { value: '2-10', label: '2 to 10' },
    { value: '11-50', label: '11 to 50' },
    { value: '50+', label: 'More than 50' },
  ],
} as const;

export const MS_MINUTE = 60_000;
export const MS_HOUR = 60 * MS_MINUTE;
export const MS_DAY = 24 * MS_HOUR;
/** BOOKING.bufferMinutes in milliseconds. */
export const BUFFER_MS = BOOKING.bufferMinutes * MS_MINUTE;
