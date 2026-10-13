// The host's calendar, behind one small interface so the booking routes do not care which
// implementation is running. Server only: it reads secrets from the environment.
//
// Google: OAuth2 with the host's own refresh token, called over plain fetch. A service account
// cannot add attendees or create Meet links without Google Workspace domain-wide delegation.
// Mock: an in-memory calendar for local development when no Google credentials are set. It is
// never used in production; without credentials a production build reports "not configured".

import { BOOKING, MS_DAY, MS_HOUR } from './booking-config';
import type { Interval } from './booking-slots';

export type NewEvent = {
  start: number;
  end: number;
  summary: string;
  description: string;
  /** Everyone Google emails the invite to: the visitor and the host's own address. */
  attendees: { email: string; name: string }[];
};

export type CreatedEvent = { id: string; meetLink: string | null };

export interface CalendarProvider {
  readonly kind: 'google' | 'mock';
  /** Busy intervals between two instants. */
  busy(from: number, to: number): Promise<Interval[]>;
  /** Creates the event with a Meet link and emails the invite to every attendee. */
  create(event: NewEvent): Promise<CreatedEvent>;
}

export class NotConfiguredError extends Error {
  constructor() {
    super('Google Calendar credentials are not set.');
  }
}

export class CalendarError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

const API = 'https://www.googleapis.com/calendar/v3';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const TIMEOUT_MS = 10_000;

type Credentials = { clientId: string; clientSecret: string; refreshToken: string; calendarId: string };

function credentials(): Credentials | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  return { clientId, clientSecret, refreshToken, calendarId: process.env.GOOGLE_CALENDAR_ID || BOOKING.calendarId };
}

let token: { value: string; expires: number } | null = null;

async function accessToken(c: Credentials) {
  if (token && token.expires > Date.now() + 60_000) return token.value;
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: c.clientId,
      client_secret: c.clientSecret,
      refresh_token: c.refreshToken,
      grant_type: 'refresh_token',
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string };
  if (!res.ok || !body.access_token) throw new CalendarError(`Google token request failed: ${body.error ?? res.status}`, res.status);
  token = { value: body.access_token, expires: Date.now() + (body.expires_in ?? 3600) * 1000 };
  return token.value;
}

async function google(c: Credentials, path: string, init: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken(c)}`, 'Content-Type': 'application/json', ...init.headers },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status === 401) token = null;
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const message = (body.error as { message?: string } | undefined)?.message ?? String(res.status);
    throw new CalendarError(`Google Calendar request failed: ${message}`, res.status);
  }
  return body;
}

type GoogleEvent = {
  id?: string;
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: { entryPointType?: string; uri?: string }[];
    createRequest?: { status?: { statusCode?: string } };
  };
};

const meetLinkOf = (e: GoogleEvent) =>
  e.hangoutLink ?? e.conferenceData?.entryPoints?.find((p) => p.entryPointType === 'video')?.uri ?? null;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function googleProvider(c: Credentials): CalendarProvider {
  const calendar = encodeURIComponent(c.calendarId);
  return {
    kind: 'google',

    async busy(from, to) {
      const body = await google(c, '/freeBusy', {
        method: 'POST',
        body: JSON.stringify({
          timeMin: new Date(from).toISOString(),
          timeMax: new Date(to).toISOString(),
          items: [{ id: c.calendarId }],
        }),
      });
      const entry = (body.calendars as Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }> | undefined)?.[c.calendarId];
      // A calendar that cannot be read must not look empty: that would offer every slot.
      if (!entry || entry.errors?.length) throw new CalendarError('Google Calendar free/busy could not read the calendar.');
      return (entry.busy ?? []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
    },

    async create(event) {
      let created = (await google(c, `/calendars/${calendar}/events?conferenceDataVersion=1&sendUpdates=all`, {
        method: 'POST',
        body: JSON.stringify({
          summary: event.summary,
          description: event.description,
          start: { dateTime: new Date(event.start).toISOString(), timeZone: 'UTC' },
          end: { dateTime: new Date(event.end).toISOString(), timeZone: 'UTC' },
          attendees: event.attendees.map((a) => ({ email: a.email, displayName: a.name })),
          conferenceData: {
            createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
          },
          guestsCanModify: false,
        }),
      })) as GoogleEvent;

      // Google can finish creating the Meet room a moment after the event exists.
      for (let attempt = 0; attempt < 3 && !meetLinkOf(created) && created.id; attempt++) {
        await sleep(700);
        created = (await google(c, `/calendars/${calendar}/events/${encodeURIComponent(created.id)}?conferenceDataVersion=1`)) as GoogleEvent;
      }
      return { id: created.id ?? '', meetLink: meetLinkOf(created) };
    },
  };
}

// A development calendar that behaves like a real one: some days are full, others have meetings
// in the way, and every booking made while the server runs becomes busy time.
type MockStore = { booked: Interval[] };
const mockStore: MockStore = ((globalThis as { __saydeedMockCalendar?: MockStore }).__saydeedMockCalendar ??= { booked: [] });

function mockMeetings(from: number, to: number): Interval[] {
  const out: Interval[] = [];
  for (let day = Math.floor(from / MS_DAY) * MS_DAY; day <= to; day += MS_DAY) {
    const n = Math.floor(day / MS_DAY);
    const h = Math.imul(n, 2654435761) >>> 0;
    if (h % 5 === 0) {
      out.push({ start: day + 8 * MS_HOUR, end: day + 18 * MS_HOUR }); // a full day
      continue;
    }
    const first = 9 + (h % 5);
    out.push({ start: day + first * MS_HOUR, end: day + (first + 1) * MS_HOUR });
    const second = 13 + ((h >>> 8) % 3);
    out.push({ start: day + second * MS_HOUR, end: day + (second + 1) * MS_HOUR });
  }
  return out;
}

const mockProvider: CalendarProvider = {
  kind: 'mock',
  async busy(from, to) {
    return [...mockMeetings(from, to), ...mockStore.booked];
  },
  async create(event) {
    mockStore.booked.push({ start: event.start, end: event.end });
    return { id: `mock-${event.start}`, meetLink: 'https://meet.google.com/mock-mock-mock' };
  },
};

export function getCalendar(): CalendarProvider {
  const c = credentials();
  if (c) return googleProvider(c);
  if (process.env.NODE_ENV !== 'production') return mockProvider;
  throw new NotConfiguredError();
}
