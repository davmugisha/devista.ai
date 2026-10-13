'use client';

// The listing's bottom sheet (MarketItem.dc.html): Chief of Staff's three checks for the chosen
// plan, then the done state once approved. Approving installs the listing through the shared
// store, so the Marketplace list, this listing and the web listing all show it from then on.
// The sheet portals into the phone frame, so on a wide window it stays inside the device.

import { Button, Drawer } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { ButtonLink, InitialsTile } from '@/components/ui';
import { buyChecks, buyWords, type Listing, type Plan } from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { CheckRow } from './shared';

/** Where the done action goes on the phone. */
export function doneHref(l: Listing): string {
  switch (l.done.phone) {
    case 'chat':
      return phone.chat;
    case 'dashboard':
      return phone.dashboard;
    case 'inbox':
      return phone.inbox();
  }
}

/** The done action's words on the phone: the phone opens Dashboard where the web shows Home. */
export function doneAction(l: Listing): string {
  return l.done.phone === 'dashboard' ? 'Open Dashboard' : l.done.action;
}

type Stage = 'review' | 'done';

/** Calls `run` once the sheet has left the page, after React Aria has tried to restore focus. */
function AfterClose({ run }: { run?: () => void }) {
  useEffect(
    () => () => {
      if (run) requestAnimationFrame(() => requestAnimationFrame(run));
    },
    [run],
  );
  return null;
}

export function BuySheet({
  listing,
  plan,
  isOpen,
  onOpenChange,
  onClosed,
}: {
  listing: Listing;
  plan: Plan;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** After the sheet has closed and left the page. */
  onClosed?: () => void;
}) {
  const { install } = usePrototype();
  const [stage, setStage] = useState<Stage>('review');
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const words = buyWords(listing, plan);
  const checks = buyChecks(listing, plan);

  // Every time the sheet opens it starts at the checks.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setStage('review');
  }

  // Approving removes the button that had focus; move focus to the result so it is announced.
  useEffect(() => {
    if (stage === 'done') doneHeading.current?.focus();
  }, [stage]);

  const close = () => onOpenChange(false);
  const approve = () => {
    install({ listing: listing.key, plan: plan.key });
    setStage('done');
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} className="h-full">
      <Drawer.Content placement="bottom" className="h-full">
        {/* The board's backdrop is a button: tapping above the sheet closes it. */}
        <Button
          variant="ghost"
          aria-label="Close"
          onPress={close}
          className="pointer-events-auto absolute inset-0 h-full w-full rounded-none bg-transparent p-0 data-[focus-visible=true]:ring-inset"
        >
          {null}
        </Button>
        <Drawer.Dialog
          aria-label={stage === 'done' ? listing.done.title : `Confirm ${listing.title}`}
          className="max-h-[calc(100%-48px)] gap-[18px] leading-[normal] rounded-t-[32px] bg-surface px-5 pt-3 pb-8 text-foreground shadow-none"
        >
          <AfterClose run={onClosed} />
          <Drawer.Handle className="p-0 [&>[data-slot=drawer-handle-bar]]:h-[5px] [&>[data-slot=drawer-handle-bar]]:w-10 [&>[data-slot=drawer-handle-bar]]:rounded-[3px] [&>[data-slot=drawer-handle-bar]]:bg-hairline" />

          {stage === 'review' ? (
            <>
              <Drawer.Header className="gap-2">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-3">
                  <InitialsTile initials="CoS" className="size-[26px] rounded-[9px] bg-accent-soft text-[9px] text-accent" />
                  Chief of Staff checked it
                </div>
                <Drawer.Heading className="m-0 text-[24px] leading-[1.2] font-bold text-foreground">
                  {listing.title} · {plan.label}
                </Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body className="m-0 flex flex-col gap-3 p-0 leading-[normal] text-foreground">
                {checks.map((c) => (
                  <CheckRow key={c.title} title={c.title} sub={c.sub} />
                ))}
              </Drawer.Body>
              <Drawer.Footer className="m-0 justify-start gap-2.5">
                <Button
                  isIconOnly
                  variant="tertiary"
                  aria-label="Cancel"
                  onPress={close}
                  className="size-[60px] min-w-[60px] shrink-0 rounded-full bg-inset text-foreground hover:bg-track"
                >
                  <Icon name="close" size={22} className="size-[22px]" />
                </Button>
                <Button onPress={approve} className="h-[60px] grow gap-2 rounded-full text-[17px]">
                  <Icon name="check" size={20} strokeWidth={2.5} className="mx-0 size-5" />
                  {words.approve}
                </Button>
              </Drawer.Footer>
            </>
          ) : (
            <>
              <Drawer.Header className="gap-2.5">
                <Drawer.Heading
                  ref={doneHeading}
                  tabIndex={-1}
                  className="m-0 flex items-center gap-2.5 text-[20px] font-bold text-accent outline-none"
                >
                  <Icon name="check" size={24} strokeWidth={2.5} />
                  {listing.done.title}
                </Drawer.Heading>
                <p className="m-0 text-[15px] leading-normal font-semibold text-ink-2">{listing.done.text}</p>
              </Drawer.Header>
              <Drawer.Footer className="m-0 justify-start gap-2.5">
                <ButtonLink
                  href={phone.marketplace}
                  variant="tertiary"
                  className="h-[60px] shrink-0 rounded-full bg-inset px-[22px] text-[16px] text-foreground hover:bg-track"
                >
                  Marketplace
                </ButtonLink>
                <ButtonLink href={doneHref(listing)} className="h-[60px] grow rounded-full text-[17px]">
                  {doneAction(listing)}
                </ButtonLink>
              </Drawer.Footer>
            </>
          )}
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
