// Abuse protection for the API routes (booking and email updates). The limiter lives in the memory
// of one server process: it slows down a single noisy visitor, it is not a global quota.

const hits = new Map<string, number[]>();

/** Counts one hit for a key. Returns false when the key has used up its allowance. */
export function allow(key: string, limit: number, windowMs: number, now = Date.now()) {
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times[times.length - 1] < now - windowMs) hits.delete(k);
  }
  const recent = (hits.get(key) ?? []).filter((t) => t > now - windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

/** The visitor's address as set by the hosting proxy. Falls back to one shared bucket. */
export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

/**
 * A queue that runs its tasks one at a time on this server, so a check and the write that
 * depends on it cannot interleave with another request's. A failed task does not stop the queue.
 */
export function serialQueue() {
  let tail: Promise<unknown> = Promise.resolve();
  return function serially<T>(task: () => Promise<T>): Promise<T> {
    const run = tail.then(task, task);
    tail = run.catch(() => undefined);
    return run;
  };
}
