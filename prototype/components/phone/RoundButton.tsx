'use client';

// The phone app's round buttons. Every phone header uses them: a white 48px circle to go back or
// close, a soft cyan 48px circle for the screen's one extra action, and 60px soft circles on the
// Brain Map and Dashboard (menu, Inbox, dock).

import { Button, buttonVariants, cn } from '@heroui/react';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

export type RoundTone = 'surface' | 'soft' | 'inset' | 'accent';
export type RoundSize = 44 | 48 | 60;

const TONE: Record<RoundTone, string> = {
  surface: 'bg-surface text-foreground hover:bg-selected',
  soft: 'bg-accent-soft text-accent hover:bg-accent-soft-hover',
  inset: 'bg-inset text-foreground hover:bg-track',
  accent: 'bg-accent text-accent-foreground hover:bg-accent-hover',
};

const SIZE: Record<RoundSize, string> = {
  44: 'size-11 min-w-11',
  48: 'size-12 min-w-12',
  60: 'size-[60px] min-w-[60px]',
};

function roundClass(tone: RoundTone, size: RoundSize, className?: string) {
  return cn(buttonVariants({ variant: 'ghost', isIconOnly: true }), 'relative shrink-0 rounded-full p-0 transition-colors', SIZE[size], TONE[tone], className);
}

/** A round icon link. `label` is its accessible name (the design's aria-label). */
export function RoundLink({
  href,
  label,
  tone = 'surface',
  size = 48,
  className,
  children,
  ...rest
}: Omit<ComponentProps<typeof Link>, 'className' | 'aria-label'> & {
  label: string;
  tone?: RoundTone;
  size?: RoundSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} aria-label={label} className={roundClass(tone, size, className)} {...rest}>
      {children}
    </Link>
  );
}

/** A round icon button for actions that stay on the screen (captions, mute, close a sheet). */
export function RoundButton({
  label,
  tone = 'surface',
  size = 48,
  className,
  children,
  ...rest
}: Omit<ComponentProps<typeof Button>, 'className' | 'aria-label' | 'children' | 'size'> & {
  label: string;
  tone?: RoundTone;
  size?: RoundSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Button isIconOnly variant="ghost" aria-label={label} className={roundClass(tone, size, className)} {...rest}>
      {children}
    </Button>
  );
}

/** The amber count on a round button ("3" on the Inbox button). */
export function RoundCount({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      aria-hidden
      className="absolute -top-0.5 -right-0.5 flex h-6 min-w-6 items-center justify-center rounded-full border-[3px] border-background bg-warning px-1.5 text-xs font-bold text-warning-foreground"
    >
      {count}
    </span>
  );
}
