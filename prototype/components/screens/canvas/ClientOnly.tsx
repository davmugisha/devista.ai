'use client';

// Renders its children only in the browser, after hydration. The Brain orb's inline geometry is
// unrounded, so its server HTML and the browser's parsed styles disagree and React reports a
// hydration mismatch; drawing it on the client avoids that without changing the orb.

import { useSyncExternalStore, type ReactNode } from 'react';

const subscribe = () => () => {};

export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return <>{isClient ? children : fallback}</>;
}
