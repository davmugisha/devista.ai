'use client';

// The pieces the Brain Map and Dashboard share: the round menu and Inbox buttons in the header and
// the dock at the bottom (Main.dc.html and Dashboard.dc.html).

import { cn } from '@heroui/react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Icon, type IconName } from '@/components/icons';
import { RoundCount, RoundLink } from '@/components/phone/RoundButton';
import { phone } from '@/lib/routes';

/**
 * An icon at an exact pixel size. HeroUI sizes every svg inside a button to 16 or 20px; the
 * design's round buttons use 20 to 28px icons, so the size is set inline where nothing overrides it.
 */
export function Glyph({ name, size, className, style }: { name: IconName; size: number; className?: string; style?: CSSProperties }) {
  return <Icon name={name} size={size} className={className} style={{ width: size, height: size, margin: 0, ...style }} />;
}

/** "Inbox, 3 things need you", as the boards name the Inbox button. */
export function inboxLabel(count: number): string {
  if (count === 0) return 'Inbox';
  return count === 1 ? 'Inbox, 1 thing needs you' : `Inbox, ${count} things need you`;
}

export function MenuLink() {
  return (
    <RoundLink href={phone.menu} label="Open menu" tone="soft" size={60}>
      <Glyph name="menu" size={28} />
    </RoundLink>
  );
}

export function InboxLink({ count }: { count: number }) {
  return (
    <RoundLink href={phone.inbox()} label={inboxLabel(count)} tone="soft" size={60}>
      <Glyph name="bubble" size={28} />
      <RoundCount count={count} />
    </RoundLink>
  );
}

/** Focus ring for links styled by hand (HeroUI's own controls bring theirs). */
export const FOCUS_RING = 'outline-none focus-visible:focus-ring';

/**
 * The dock: dashboard (or back to the Brain Map), Let's Chat, and Call Chief of Staff.
 * `first` is the round button on the left: the Brain Map shows the dashboard, the Dashboard goes back.
 */
export function Dock({ first, className }: { first: 'dashboard' | 'home'; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {first === 'dashboard' ? (
        <RoundLink href={phone.dashboard} label="Show dashboard" tone="soft" size={60}>
          <Glyph name="grid" size={26} />
        </RoundLink>
      ) : (
        <RoundLink href={phone.home} label="Back to Brain Map" tone="soft" size={60}>
          <Glyph name="brainMap" size={28} />
        </RoundLink>
      )}
      <Link
        href={phone.chat}
        className={cn(
          'flex h-[60px] min-w-0 grow items-center gap-3.5 rounded-full bg-accent-soft px-[22px] text-[17px] font-bold text-accent transition-colors hover:bg-accent-soft-hover hover:text-accent active:scale-[0.98]',
          FOCUS_RING,
        )}
      >
        <Glyph name="chat" size={28} />
        <span className="truncate">Let’s Chat</span>
      </Link>
      <RoundLink href={phone.call} label="Call Chief of Staff" tone="soft" size={60}>
        <Glyph name="phone" size={26} />
      </RoundLink>
    </div>
  );
}
