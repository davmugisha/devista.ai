'use client';

// "Needs you" on web Home (WebHome.dc.html): every decision waiting on the owner, with a quick
// action that decides it through the shared store. A decided row keeps its place, says what
// happened and offers Undo, so Home, the rail and the Inbox always agree.

import { Button, Card, Chip, cn } from '@heroui/react';
import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';
import { Icon } from '@/components/icons';
import { ButtonLink, InitialsTile } from '@/components/ui';
import { APPROVALS, approvalResult, type Approval } from '@/lib/data';
import { web } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { linkFocus } from './inbox-items';

export function NeedsYouCard() {
  const { pendingCount } = usePrototype();
  const headingId = useId();
  return (
    <Card<'section'>
      aria-labelledby={headingId}
      render={(props) => <section {...props} />}
      className="gap-0 overflow-hidden rounded-[22px] p-0"
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-[18px] pb-2.5">
        <h2 id={headingId} className="flex items-center gap-2.5 text-[19px] font-bold">
          Needs you
          <Chip
            className={cn(
              'h-6 min-w-6 justify-center rounded-full px-1.5 py-0 font-mono text-xs font-semibold tabular-nums',
              pendingCount ? 'bg-warning-soft text-warning-soft-foreground' : 'bg-inset text-ink-2',
            )}
          >
            {String(pendingCount)}
          </Chip>
        </h2>
        <Link href={web.inbox()} className={cn('text-[14px] font-bold text-accent transition-colors hover:text-accent-hover', linkFocus)}>
          Open Inbox
        </Link>
      </div>
      <ul className="m-0 list-none p-0">
        {APPROVALS.map((a) => (
          <NeedsRow key={a.key} approval={a} />
        ))}
      </ul>
      {pendingCount === 0 && (
        <p className="px-5 pt-1 pb-5 text-[15px] font-semibold text-ink-3">
          You are clear for now. Chief of Staff will bring the next decision here.
        </p>
      )}
    </Card>
  );
}

function NeedsRow({ approval: a }: { approval: Approval }) {
  const { decisionOf, choiceOf, approve, undo } = usePrototype();
  const decision = decisionOf(a.key);
  const choice = choiceOf(a.key);

  // The quick action takes the date currently picked for the launch (Wed 7 Oct unless the owner
  // picked another in the Inbox), and its words name that date so the button never misleads.
  const usualChoice = !a.choices || choice === a.defaultChoice;
  const action = usualChoice ? a.action : `Accept ${a.choices?.[choice]}`;
  // Decided here with the usual answer: the board's short line. Decided any other way (another
  // date, or rejected in the Inbox): the same result line the Inbox shows.
  const result = !decision ? '' : decision === 'approved' && usualChoice ? a.doneText : approvalResult(a, decision, choice);

  // Keyboard focus follows the row: approving lands on Undo, undoing lands back on the action.
  const focusAfter = useRef<'undo' | 'action' | null>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const target = focusAfter.current;
    focusAfter.current = null;
    if (target === 'undo') undoRef.current?.focus();
    if (target === 'action') actionRef.current?.focus();
  }, [decision]);

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-3.5 shadow-[inset_0_1px_0_var(--separator)] transition-colors hover:bg-row-hover">
      <InitialsTile initials={a.who} tone={decision ? 'selected' : 'warning'} />
      <span className="flex min-w-0 flex-[1_1_240px] flex-col gap-0.5">
        <span className="text-[16px] font-bold">{a.title}</span>
        <span className="text-[14px] font-semibold text-ink-3">{a.summary}</span>
      </span>
      {decision ? (
        <span
          role="status"
          className={cn('flex flex-wrap items-center gap-2.5 text-[14px] font-bold', decision === 'approved' ? 'text-accent' : 'text-ink-2')}
        >
          {decision === 'approved' && <Icon name="check" size={18} strokeWidth={2.5} />}
          {result}
          <Button
            ref={undoRef}
            variant="tertiary"
            onPress={() => {
              focusAfter.current = 'action';
              undo(a.key);
            }}
            className="h-8 rounded-full px-3 text-[13px] text-foreground"
          >
            Undo
          </Button>
        </span>
      ) : (
        <span className="flex gap-2">
          <ButtonLink
            href={web.inbox(a.key)}
            variant="tertiary"
            className="h-10 rounded-full px-4 text-[14px] text-foreground hover:bg-accent-soft-hover"
          >
            Review
          </ButtonLink>
          <Button
            ref={actionRef}
            onPress={() => {
              focusAfter.current = 'undo';
              approve(a.key);
            }}
            className="h-10 rounded-full px-4 text-[14px]"
          >
            {action}
          </Button>
        </span>
      )}
    </li>
  );
}
