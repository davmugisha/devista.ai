// What the web Inbox lists: the decisions waiting on the owner and the conversations, with the
// tile each one wears (WebInbox.dc.html, LOOK). Shared by the list and the detail.

import { cn } from '@heroui/react';
import { Icon } from '@/components/icons';
import { InitialsTile, type TileTone } from '@/components/ui';
import { getApproval, getThread, type ApprovalKey, type Thread, type ThreadKey, type ThreadKind } from '@/lib/data';

/** Anything the Inbox can show in its detail: a decision or a conversation. */
export type InboxKey = ApprovalKey | ThreadKey;

/** The board opens on the first decision. */
export const DEFAULT_ITEM: InboxKey = 'remind';

export function isInboxKey(value: unknown): value is InboxKey {
  return typeof value === 'string' && Boolean(getApproval(value) ?? getThread(value));
}

const KIND_TONE: Record<ThreadKind, TileTone> = {
  agent: 'agent',
  group: 'agent',
  call: 'agent',
  human: 'person',
  alert: 'neutral',
};

/** A conversation's tile: initials for agents, groups, calls and people; a gauge for alerts. */
export function ThreadTile({ thread, className, iconSize = 20 }: { thread: Thread; className?: string; iconSize?: number }) {
  if (thread.kind === 'alert') {
    return (
      <span aria-hidden className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-inset text-ink-2', className)}>
        <Icon name="gauge" size={iconSize} />
      </span>
    );
  }
  return <InitialsTile initials={thread.initials} tone={KIND_TONE[thread.kind]} className={className} />;
}

// Focus rings for links, as the boards draw them (2px accent outline). The style is set with the
// width: in Tailwind 4 `outline-none` would leave the style at none.

/** Inset ring for links inside cards that clip their overflow. */
export const insetFocus =
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus focus-visible:outline-solid';

/** The boards' ring for links. */
export const linkFocus =
  'rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus focus-visible:outline-solid';
