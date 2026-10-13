'use client';

// The menu and the Create sheet are routes (/m/menu, /m/create) drawn as overlays on the Brain Map.
// They open once the page has mounted, so they slide in, and closing them (Escape, a tap outside,
// a swipe, or the close link) plays the exit before the router goes back to the Brain Map.

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';

const EXIT_MS = 220;

export function useRouteOverlay(closeTo: string) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const leaving = useRef(false);

  useEffect(() => {
    router.prefetch(closeTo);
    const release = holdFocusOutsideFrame();
    // Open after the first paint so the overlay animates in, as it would from the Brain Map.
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => {
      cancelAnimationFrame(frame);
      release();
    };
  }, [router, closeTo]);

  const close = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    setOpen(false);
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => router.push(closeTo), still ? 0 : EXIT_MS);
  }, [router, closeTo]);

  /** For a close link: a plain click animates out; a modified click (new tab) is left alone. */
  const onCloseClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      close();
    },
    [close],
  );

  return { open, close, onCloseClick, onOpenChange: (next: boolean) => (next ? undefined : close()) };
}

/**
 * On the preview canvas these screens load in frames and open by themselves. A dialog takes focus
 * as it opens (and again half a second later), which would pull focus and the keyboard out of the
 * canvas into the frame. When the frame does not have focus, its page is inert while the dialog
 * opens, so those focus calls do nothing; afterwards the frame works as usual. Opened from inside
 * the frame, or as a page of its own, the dialog takes focus as a dialog should. Returns a cleanup.
 */
function holdFocusOutsideFrame(): () => void {
  if (window.self === window.top || document.hasFocus()) return () => {};
  const page = document.body;
  page.inert = true;
  const timer = window.setTimeout(() => {
    page.inert = false;
  }, 1500);
  return () => {
    window.clearTimeout(timer);
    page.inert = false;
  };
}
