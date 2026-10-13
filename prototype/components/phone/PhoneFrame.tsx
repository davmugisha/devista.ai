'use client';

// The phone app's frame. On a phone (or in a 390px preview frame) the app fills the screen. On a
// wider window it sits in a 390 × 844 device on the page, like the design boards. The device is
// the containing block for fixed overlays and the portal target for HeroUI sheets and menus, so
// drawers and bottom sheets open inside the phone, not across the whole window.

import { cn } from '@heroui/react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { UNSAFE_PortalProvider } from 'react-aria';
import { web } from '@/lib/routes';

export function PhoneFrame({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<HTMLDivElement | null>(null);
  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-background sm:justify-center sm:gap-4 sm:py-8">
      <div
        ref={setDevice}
        className={cn(
          'relative isolate flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground [transform:translateZ(0)]',
          'sm:h-[844px] sm:w-[390px] sm:rounded-[48px] sm:shadow-phone',
        )}
      >
        {/* Read only when an overlay opens, which is always after mount. */}
        <UNSAFE_PortalProvider getContainer={() => device ?? document.body}>{children}</UNSAFE_PortalProvider>
      </div>
      <p className="hidden text-sm font-semibold text-muted sm:block">
        Phone app prototype · example data ·{' '}
        <Link href={web.home} className="font-bold text-accent hover:text-accent-hover">
          Open the web app
        </Link>
      </p>
    </div>
  );
}

/** A screen inside the phone frame: fills the device and scrolls its own content. */
export function PhoneScreen({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <main aria-label={label} className={cn('relative flex min-h-0 grow flex-col', className)}>
      {children}
    </main>
  );
}
