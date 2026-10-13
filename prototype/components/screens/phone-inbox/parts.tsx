// Small pieces the phone Inbox, Approval and Chat screens share: the conversation tiles the Hub
// board draws for each kind of thread, mono figures inside running text, and the thread links.

import { cn } from '@heroui/react';
import { Fragment } from 'react';
import { Icon } from '@/components/icons';
import type { ApprovalKey, Thread, ThreadKey } from '@/lib/data';
import { phone } from '@/lib/routes';

/** Keyboard focus for plain links and rows, the same ring HeroUI draws on its controls. */
export const FOCUS = 'outline-none focus-visible:focus-ring';

/**
 * Where a conversation opens. Chief of Staff has its own chat, the call recap opens the call, and
 * every other thread opens in the same chat layout. routes.ts has no thread helper yet.
 */
export function threadHref(key: ThreadKey): string {
  if (key === 'cos') return phone.chat;
  if (key === 'call') return phone.call;
  return `${phone.chat}?thread=${key}`;
}

/** The short names the phone uses for "Next: Umoja proposal". */
export const APPROVAL_SHORT: Record<ApprovalKey, string> = {
  remind: 'Payment reminders',
  umoja: 'Umoja proposal',
  portal: 'Portal launch date',
};

/** Sets amounts ($3,650) and invoice numbers (#0142) in mono, as the boards do. */
export function Figures({ text }: { text: string }) {
  const parts = text.split(/(\$[\d,.]+|#\d+)/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-mono">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** The 44px tile for a conversation: agent initials, the group pair, the call, a person, an alert. */
export function ThreadTile({ thread, size = 44 }: { thread: Thread; size?: 40 | 44 }) {
  const box = size === 44 ? 'size-11' : 'size-10';
  const radius = size === 44 ? 'rounded-[14px]' : 'rounded-[13px]';
  switch (thread.kind) {
    case 'agent':
      return (
        <span aria-hidden className={cn(box, radius, 'flex shrink-0 items-center justify-center bg-accent-soft font-mono text-[11px] font-semibold text-accent')}>
          {thread.initials}
        </span>
      );
    case 'human':
      return (
        <span aria-hidden className={cn(box, 'flex shrink-0 items-center justify-center rounded-full bg-person text-[14px] font-bold text-person-foreground')}>
          {thread.initials}
        </span>
      );
    case 'group':
      // The group's agent and its person (Eric), overlapping as on the board.
      return (
        <span aria-hidden className={cn(box, 'relative shrink-0')}>
          <span
            className={cn(
              'absolute top-0 left-0 flex items-center justify-center bg-accent-soft font-mono font-semibold text-accent',
              size === 44 ? 'size-[30px] rounded-[10px] text-[9px]' : 'size-[27px] rounded-[9px] text-[8px]',
            )}
          >
            {thread.initials}
          </span>
          <span
            className={cn(
              'absolute right-0 bottom-0 flex items-center justify-center rounded-full bg-person font-bold text-person-foreground ring-3 ring-background',
              size === 44 ? 'size-7 text-[12px]' : 'size-[25px] text-[11px]',
            )}
          >
            E
          </span>
        </span>
      );
    case 'call':
      return (
        <span aria-hidden className={cn(box, radius, 'flex shrink-0 items-center justify-center bg-accent-soft text-accent')}>
          <Icon name="phone" size={20} />
        </span>
      );
    case 'alert':
      return (
        <span aria-hidden className={cn(box, radius, 'flex shrink-0 items-center justify-center bg-inset text-ink-2')}>
          <Icon name="alert" size={20} />
        </span>
      );
  }
}
