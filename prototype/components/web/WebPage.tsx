import { cn } from '@heroui/react';
import type { ReactNode } from 'react';

/** The <main> of every web page: the boards' 1240px measure and side padding. */
export function WebPage({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <main
      id="main"
      aria-label={label}
      className={cn('flex w-full max-w-[1240px] flex-col gap-7 px-[clamp(16px,3vw,40px)] pt-8 pb-16', className)}
    >
      {children}
    </main>
  );
}
