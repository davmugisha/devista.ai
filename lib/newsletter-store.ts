// Where email updates subscribers are kept: one CSV file (subscribed_at, email) that opens in any
// spreadsheet. Server only. Production needs SUBSCRIBERS_FILE (the Docker setup mounts it on the
// server's disk); without it the route refuses, so no visitor is told they subscribed when nothing
// was saved. Development writes to a scratch file in the system temp folder.
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { SITE } from './site';

export class StoreNotConfiguredError extends Error {}

function storePath() {
  if (process.env.SUBSCRIBERS_FILE) return process.env.SUBSCRIBERS_FILE;
  if (process.env.NODE_ENV !== 'production') return join(tmpdir(), `${SITE.shortName.toLowerCase()}-subscribers.csv`);
  throw new StoreNotConfiguredError();
}

/** Quotes a cell, and stops a leading = + - or @ from running as a formula in a spreadsheet. */
function cell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

// One write at a time, so two requests for the same address cannot both add it.
let tail: Promise<unknown> = Promise.resolve();

/** Adds the address unless it is already on the list. Resolves once it is safely on disk. */
export function addSubscriber(email: string, now = new Date()): Promise<'added' | 'already'> {
  const task = async () => {
    const file = storePath();
    const entry = cell(email.trim().toLowerCase());
    let existing = '';
    try {
      existing = await readFile(file, 'utf8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      await mkdir(dirname(file), { recursive: true });
    }
    if (existing.split('\n').some((line) => line.endsWith(`,${entry}`))) return 'already' as const;
    await appendFile(file, `${existing ? '' : 'subscribed_at,email\n'}${now.toISOString()},${entry}\n`, 'utf8');
    return 'added' as const;
  };
  const run = tail.then(task, task);
  tail = run.catch(() => undefined);
  return run;
}
