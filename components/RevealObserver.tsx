'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Fades each [data-reveal] element in as it enters the viewport. The root layout's inline
 * script hides them before paint and un-hides everything if this never runs, so content is
 * never lost to a failed script. Re-scans on every client navigation.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    (window as unknown as { __reveal?: boolean }).__reveal = true;
    const root = document.documentElement;
    if (!root.hasAttribute('data-reveal-ready')) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    const scan = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    scan();
    // Content that streams in after the first scan (lazy sections, client islands), batched per frame.
    let raf = 0;
    const mo = new MutationObserver(() => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), scan()));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
