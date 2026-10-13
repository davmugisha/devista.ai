'use client';

// The phone's home, the Brain Map (Main.dc.html): the greeting, today's line with the live count of
// decisions waiting, the company as a turning orb with one amber node per decision, the one live
// activity line, and the dock. The menu and Create screens draw it behind their overlays.

import { Link as TextLink, Typography, cn } from '@heroui/react';
import Link from 'next/link';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { StateDot } from '@/components/ui';
import { COMPANY, LIVE_ACTIVITY, TODAY, USER } from '@/lib/data';
import { phone } from '@/lib/routes';
import { needYouLabel, usePrototype } from '@/lib/store';
import { ClientOrb, useFitSize } from './ClientOrb';
import { Dock, FOCUS_RING, InboxLink, MenuLink } from './PhoneChrome';

const ORB_MAX = 320;
const ORB_MIN = 140;

export function HomeScreen({ background = false }: { background?: boolean }) {
  const { pendingCount } = usePrototype();

  const body = (
    <>
      <div className="flex shrink-0 items-center justify-between">
        <MenuLink />
        <InboxLink count={pendingCount} />
      </div>

      <div className="mt-[30px] flex shrink-0 flex-col items-center gap-2 px-1 text-center">
        <Typography type="h1" align="center" className="m-0 text-[30px] leading-[1.15] font-bold tracking-normal text-foreground">
          Good morning, {USER.firstName}
        </Typography>
        <Typography align="center" className="m-0 text-[16px] leading-[1.4] font-semibold text-balance text-ink-3">
          {TODAY.short}&nbsp;· {COMPANY.name}&nbsp;· {COMPANY.working} agents at work&nbsp;·{' '}
          <TextLink
            href={phone.inbox()}
            className={cn(
              'inline rounded-sm font-bold',
              pendingCount ? 'text-warning hover:text-warning-hover' : 'text-accent hover:text-accent-hover',
            )}
          >
            {needYouLabel(pendingCount)}
          </TextLink>
        </Typography>
      </div>

      <OrbSlot highlights={pendingCount} still={background} />

      <div className="mb-4 flex shrink-0 justify-center">
        <Link
          href={phone.dashboard}
          className={cn(
            'flex h-11 max-w-full items-center gap-2.5 rounded-full bg-surface px-[18px] text-[14px] font-semibold text-ink-3 transition-colors hover:bg-selected hover:text-ink-3',
            FOCUS_RING,
          )}
        >
          <StateDot pulse />
          <span className="truncate">
            <span className="font-bold text-foreground">{LIVE_ACTIVITY.agent}</span> {LIVE_ACTIVITY.doing}
          </span>
        </Link>
      </div>

      <Dock first="dashboard" className="mt-auto shrink-0" />
    </>
  );

  const layout = 'relative flex min-h-0 grow flex-col overflow-hidden px-5 pt-14 pb-7 leading-[normal]';
  if (background) {
    // Drawn behind the menu or the Create sheet: seen, never reached.
    return (
      <div aria-hidden inert className={cn(layout, 'h-full bg-background')}>
        {body}
      </div>
    );
  }
  return <PhoneScreen className={layout}>{body}</PhoneScreen>;
}

/**
 * The orb takes the room between the greeting and the activity line: 320px on a 844px phone, as on
 * the board, and smaller on shorter phones so nothing overlaps.
 */
function OrbSlot({ highlights, still }: { highlights: number; still: boolean }) {
  const [ref, size] = useFitSize<HTMLDivElement>(ORB_MAX, ORB_MIN);
  return (
    <div className="flex max-h-[373px] min-h-0 grow basis-0 flex-col pt-2 pb-6">
      <div ref={ref} className="flex min-h-0 grow items-end justify-center">
        <ClientOrb size={size} highlights={highlights} still={still} />
      </div>
    </div>
  );
}
