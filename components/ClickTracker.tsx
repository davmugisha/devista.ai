'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** One delegated listener: any link or button with data-track reports a cta_click. */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      track('cta_click', {
        location: el.dataset.track || 'unknown',
        label: (el.textContent || '').trim().slice(0, 60),
        path: window.location.pathname,
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
