// Everything the owner may want to change about the free call booking lives in this one file.
// It is safe to import from the browser: it holds no secrets. The Google credentials come from
// environment variables only (see .env.example).
import { SITE } from './site';

export const BOOKING = {
  // Who and what the visitor is booking. The host is shown as the team, not a named person.
  hostName: `The ${SITE.shortName} team`,
  businessName: SITE.name,
  /** The calendar event title is "<callTitle> with <first> <last>". */
  callTitle: `${SITE.name} introductory call`,
  description:
    'A free introductory call about the work you want to automate and where an agent could help first.',
  onTheCall: [
    'Confirm fit and choose the department or workflow to examine',
    'Walk through the handoffs, re-keying and approvals that cost you most time',
    'Agree the next step. The audit is free and you keep the findings either way',
  ],
  beforeTheCall: [
    'Pick one workflow that costs your team the most time.',
    'Note the systems it passes through. We do not need access to any of them.',
    'Invite the person who does the work, if they can join.',
  ],

  // Length and spacing, in minutes.
  durationMinutes: 30,
  slotIntervalMinutes: 30,
  /** Free time kept before and after every existing event. */
  bufferMinutes: 10,

  // When the host takes calls. Times are wall-clock in hostTimezone (an IANA name), so daylight
  // saving is handled. Days are ISO weekdays: 1 is Monday and 7 is Sunday.
  hostTimezone: 'UTC',
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
   * left empty. Placeholders: {business} {name} {email} {phone} {company} {teamSize}
   * {timezone} {topic}.
   */
  eventDescription: [
    'Booked on the {business} website.',
    '',
    'Name: {name}',
    'Email: {email}',
    'Phone: {phone}',
    'Company: {company}',
    'Team size: {teamSize}',
    'Visitor time zone: {timezone}',
    'Wants to talk about: {topic}',
  ].join('\n'),

  topicLabel: 'What would you like to talk about?',
  topicHint: 'For example, a workflow you want looked at first, or the systems involved.',
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
