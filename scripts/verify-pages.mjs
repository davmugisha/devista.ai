// Serves the production build locally and checks every page and the two form endpoints.
// Needs `npm run build` first. Usage: node scripts/verify-pages.mjs
// It never books a call: it only reads availability and writes a test address to a temp file.
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PORT = 3199;
const BASE = `http://127.0.0.1:${PORT}`;
const dir = mkdtempSync(join(tmpdir(), 'saydeed-verify-'));
const subscribers = join(dir, 'subscribers.csv');
const failures = [];
const fail = (msg) => failures.push(msg);

// NEXT_DIST_DIR (see next.config.ts) names the build folder when it is not the default .next.
if (!existsSync(join(process.env.NEXT_DIST_DIR || '.next', 'BUILD_ID'))) {
  console.error('No production build found. Run npm run build first.');
  process.exit(1);
}

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT)], {
  env: { ...process.env, SUBSCRIBERS_FILE: subscribers, NODE_ENV: 'production' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let log = '';
server.stdout.on('data', (d) => (log += d));
server.stderr.on('data', (d) => (log += d));

function stop() {
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill('SIGKILL');
}

async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE + '/robots.txt');
      if (r.status === 200) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

const PAGES = ['/', '/product', '/how-it-works', '/company', '/book', '/security', '/privacy', '/terms'];
const NEVER = [/autonomous/i, /next hire/i, /devista/i, /paperclip/i, /free audit/i, /operations audit/i, /bigger payroll/i, /executive sponsor/i];
const HOME_MUST = ['We fix it in 7 days', 'US$1,500', 'US$3,000', 'US$5,000', 'US$1,000', 'Book a free call'];

try {
  if (!(await waitUp())) {
    fail('server did not start in 30 seconds:\n' + log.slice(-600));
  } else {
    for (const path of PAGES) {
      const res = await fetch(BASE + path);
      const html = await res.text();
      if (res.status !== 200) {
        fail(`${path} returned ${res.status}`);
        continue;
      }
      if (!/<title>[^<]*Saydeed/i.test(html)) fail(`${path} title does not say Saydeed`);
      const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
      for (const re of NEVER) if (re.test(visible)) fail(`${path} still contains ${re}`);
      if (path === '/') for (const must of HOME_MUST) if (!visible.includes(must)) fail(`/ is missing "${must}"`);
      if (path === '/book' && !visible.includes('Book a free call')) fail('/book is missing "Book a free call"');
    }

    const sitemap = await fetch(BASE + '/sitemap.xml');
    if (sitemap.status !== 200) fail(`/sitemap.xml returned ${sitemap.status}`);

    // Booking availability answers JSON (slots when the Google keys are present, an error code when not).
    const day = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
    const avail = await fetch(`${BASE}/api/book/availability?date=${day}&tz=Africa/Kigali`);
    const availBody = await avail.json().catch(() => null);
    if (!availBody || !('slots' in availBody || 'error' in availBody)) fail('availability did not answer JSON with slots or an error code');

    // A good address is saved, a bad one is refused.
    const email = `verify-${Date.now()}@example.com`;
    const post = (body) => fetch(BASE + '/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const good = await post({ email, website: '' });
    const goodBody = await good.json().catch(() => ({}));
    if (good.status !== 200 || goodBody.ok !== true) fail(`subscribe refused a valid address (${good.status})`);
    else if (!existsSync(subscribers) || !readFileSync(subscribers, 'utf8').includes(email)) fail('subscribe said ok but the address is not in the file');
    const bad = await post({ email: 'not-an-email', website: '' });
    if (bad.status !== 400) fail(`subscribe accepted a bad address (${bad.status})`);
  }
} finally {
  stop();
  rmSync(dir, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`pages check FAILED with ${failures.length} problem(s):\n- ` + failures.join('\n- '));
  process.exit(1);
}
console.log('pages check passed');
