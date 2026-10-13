#!/usr/bin/env node
// Gets the GOOGLE_REFRESH_TOKEN that /book needs, with no dependencies.
//
//   npm run booking:auth            prints the three lines to put in .env.local and the server .env
//   npm run booking:auth -- --write also writes them to .env.local in this folder
//
// It reads GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from the environment or .env.local, opens
// Google's consent screen in the browser for the account whose calendar takes the bookings, catches
// the redirect on http://localhost:53682/oauth2callback, and swaps the code for a refresh token.
// The token is printed once and never sent anywhere but Google. See deploy/README.md, "Booking".

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = join(ROOT, '.env.local');
const PORT = 53682;
const REDIRECT = `http://localhost:${PORT}/oauth2callback`;
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.freebusy',
];
const WRITE = process.argv.includes('--write');

function readEnvFile() {
  if (!existsSync(ENV_FILE)) return {};
  const out = {};
  for (const raw of readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

const fileEnv = readEnvFile();
const clientId = process.env.GOOGLE_CLIENT_ID || fileEnv.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || fileEnv.GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  fail(
    'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set.\n' +
      'Create an OAuth client in Google Cloud (deploy/README.md, "Booking"), then either put both\n' +
      'in .env.local or run:\n\n' +
      '  GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... npm run booking:auth',
  );
}

const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  });

function page(title, body) {
  return `<!doctype html><meta charset="utf-8"><title>${title}</title>
<body style="font:16px/1.5 system-ui;max-width:40rem;margin:4rem auto;padding:0 1rem">
<h1 style="font-size:1.4rem">${title}</h1><p>${body}</p></body>`;
}

async function exchange(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT,
      grant_type: 'authorization_code',
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${body.error ?? res.status}: ${body.error_description ?? 'token request failed'}`);
  return body;
}

async function whoAmI(accessToken) {
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const body = await res.json().catch(() => null);
  return body?.id ?? null;
}

function upsertEnv(values) {
  const lines = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8').split(/\r?\n/) : [];
  const seen = new Set();
  const next = lines.map((line) => {
    const key = line.split('=')[0].trim();
    if (key in values) {
      seen.add(key);
      return `${key}=${values[key]}`;
    }
    return line;
  });
  if (next.length && next[next.length - 1] !== '') next.push('');
  for (const key of Object.keys(values)) if (!seen.has(key)) next.push(`${key}=${values[key]}`);
  writeFileSync(ENV_FILE, next.join('\n').replace(/\n*$/, '\n'));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  if (url.pathname !== '/oauth2callback') {
    res.writeHead(404).end();
    return;
  }
  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code');
  if (error || !code || url.searchParams.get('state') !== state) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(page('Sign-in did not finish', `Google returned: ${error ?? 'no code'}. Close this tab and run the command again.`));
    server.close();
    fail(`Google returned: ${error ?? 'no code'}`);
    return;
  }

  try {
    const tokens = await exchange(code);
    if (!tokens.refresh_token) {
      throw new Error(
        'Google did not return a refresh token. Remove the app at https://myaccount.google.com/permissions and run again.',
      );
    }
    const calendar = await whoAmI(tokens.access_token);
    const values = {
      GOOGLE_CLIENT_ID: clientId,
      GOOGLE_CLIENT_SECRET: clientSecret,
      GOOGLE_REFRESH_TOKEN: tokens.refresh_token,
      GOOGLE_CALENDAR_ID: 'primary',
    };

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(page('Connected', `Bookings will go to ${calendar ?? 'this account'}. You can close this tab and return to the terminal.`));
    server.close();

    console.log(`\nConnected. Bookings will land on the calendar of: ${calendar ?? '(unknown account)'}\n`);
    console.log('Put these lines in .env.local for local testing and in /docker/saydeed/.env on the server:\n');
    for (const [key, value] of Object.entries(values)) console.log(`${key}=${value}`);
    console.log('');
    if (WRITE) {
      upsertEnv(values);
      console.log(`Written to ${ENV_FILE}. Restart "npm run dev" to use the real calendar.\n`);
    } else {
      console.log('Add --write to save them to .env.local for you.\n');
    }
    process.exit(0);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(page('Token exchange failed', String(e.message ?? e)));
    server.close();
    fail(String(e.message ?? e));
  }
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') fail(`Port ${PORT} is in use. Close whatever is using it and run again.`);
  fail(String(e.message ?? e));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Opening Google sign-in in your browser. Sign in with the account whose calendar should receive bookings.');
  console.log(`If nothing opens, visit:\n\n${authUrl}\n`);
  // No shell: a shell would need every "&" in the link escaped and Windows gets that wrong.
  const [cmd, args] =
    process.platform === 'win32'
      ? ['rundll32', ['url.dll,FileProtocolHandler', authUrl]]
      : process.platform === 'darwin'
        ? ['open', [authUrl]]
        : ['xdg-open', [authUrl]];
  spawn(cmd, args, { stdio: 'ignore', detached: true }).on('error', () => {}).unref();
});
