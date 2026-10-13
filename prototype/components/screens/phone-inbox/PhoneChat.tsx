'use client';

// Let's Chat with Chief of Staff (Chat.dc.html). The morning question and answer, with the overdue
// invoices card: "Approve & send" approves the reminders through the shared store (so Inbox, Home
// and the counts change), and if they were decided elsewhere the card says so. Suggestions open
// the other two decisions or the call; messages you send stay after a reload.

import { Button, Chip, ScrollShadow, Surface } from '@heroui/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Icon } from '@/components/icons';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { ButtonLink, Mono } from '@/components/ui';
import { COMPANY, INVOICES, OVERDUE_TOTAL, TODAY, approvalResult, getApproval, type Approval } from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { Bubble, ChatHeader, Composer, TimeLabel, useStickToBottom } from './ChatParts';
import { FOCUS } from './parts';

const REMIND = getApproval('remind') as Approval;

const ASKED = [
  { initials: 'CFO', name: 'CFO agent' },
  { initials: 'BIL', name: 'Billing agent' },
] as const;

const SUGGESTION = `h-11 shrink-0 rounded-full px-4 text-[14px] font-bold whitespace-nowrap text-foreground inset-ring inset-ring-border hover:bg-surface ${FOCUS}`;

export function PhoneChat() {
  const { state, decisionOf, approve, choose, sentTo, markRead } = usePrototype();
  const decision = decisionOf('remind');
  const sent = sentTo('cos');
  const scrollRef = useStickToBottom(sent.length);
  const [day, time] = TODAY.label.split(' · ');

  // Opening the conversation reads it. Runs again if a restored state arrives without the flag.
  const read = Boolean(state.read.cos);
  useEffect(() => {
    if (!read) markRead('cos');
  }, [read, markRead]);

  return (
    <PhoneScreen label="Chief of Staff" className="leading-[normal]">
      <ChatHeader
        back={{ href: phone.home, label: 'Back to Brain Map' }}
        tile={
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-accent-soft text-accent">
            <Icon name="brainMap" size={24} />
          </span>
        }
        title="Chief of Staff"
        sub={
          <>
            <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-accent" />
            Leads {COMPANY.agents} agents
          </>
        }
        action={{ href: phone.call, label: 'Switch to interactive call', icon: 'phone' }}
      />

      <ScrollShadow ref={scrollRef} hideScrollBar size={24} className="flex min-h-0 grow flex-col px-5 pt-4 pb-4">
        <ol aria-label="Messages" className="m-0 flex list-none flex-col gap-4 p-0">
          <li className="self-center">
            <TimeLabel day={day} time={time} />
          </li>
          <Bubble from="you">What needs my attention today?</Bubble>
          <li className="flex flex-col gap-2.5">
            <p className="m-0 text-[16px] leading-normal font-medium">
              Three things. The biggest is cash: two invoices are overdue, <Mono>{OVERDUE_TOTAL}</Mono> in total.
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[12px] font-bold text-muted">Asked</span>
              {ASKED.map((a) => (
                <Chip key={a.initials} className="gap-1.5 rounded-[14px] bg-surface py-1 pr-2.5 pl-1 text-[12px] leading-normal font-bold text-ink-3">
                  <span aria-hidden className="flex size-5 items-center justify-center rounded-[7px] bg-accent-soft font-mono text-[8px] text-accent">
                    {a.initials}
                  </span>
                  <Chip.Label className="px-0">{a.name}</Chip.Label>
                </Chip>
              ))}
            </div>

            <Surface role="group" aria-label="Overdue invoices" className="flex flex-col gap-3 rounded-3xl bg-surface p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="m-0 text-[15px] font-bold">Overdue invoices</h2>
                <Mono className="text-[15px] font-semibold text-warning">{OVERDUE_TOTAL}</Mono>
              </div>
              <ul className="m-0 flex list-none flex-col p-0">
                {INVOICES.map((inv) => (
                  <li key={inv.number} className="flex items-center justify-between gap-3 border-t border-separator py-2.5">
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-semibold">{inv.client}</span>
                      <span className="text-[12px] font-semibold text-muted">
                        <Mono>{inv.number}</Mono> · {inv.late}
                      </span>
                    </span>
                    <Mono className="text-[14px]">{inv.amount}</Mono>
                  </li>
                ))}
              </ul>
              <p className="m-0 border-t border-separator pt-3 text-[14px] font-semibold text-ink-3">Billing agent drafted a reminder for each.</p>

              <div aria-live="polite">
                {!decision && (
                  <div className="flex gap-2">
                    <Button variant="primary" onPress={() => approve('remind')} className="h-11 min-w-0 grow rounded-full text-[15px] font-bold">
                      Approve &amp; send
                    </Button>
                    <ButtonLink href={phone.approval('remind')} variant="tertiary" className="h-11 rounded-full px-[18px] text-[15px] font-bold text-foreground">
                      Review
                    </ButtonLink>
                  </div>
                )}
                {decision === 'approved' && (
                  <p className="m-0 flex h-11 items-center gap-2 text-[15px] font-bold text-accent">
                    <Icon name="check" size={20} />
                    Approved · {INVOICES.length} reminders sent
                  </p>
                )}
                {decision === 'rejected' && (
                  <div className="flex min-h-11 items-center justify-between gap-3">
                    <p className="m-0 text-[14px] font-bold text-ink-3">{approvalResult(REMIND, 'rejected', 0)}</p>
                    <ButtonLink href={phone.approval('remind')} variant="tertiary" className="h-11 shrink-0 rounded-full px-[18px] text-[15px] font-bold text-foreground">
                      Review
                    </ButtonLink>
                  </div>
                )}
              </div>
            </Surface>

            <p className="m-0 text-[16px] leading-normal font-medium">Also waiting on you: the Umoja proposal, and a launch date for the client portal.</p>
          </li>
          {sent.map((text, i) => (
            <Bubble key={i} from="you">
              {text}
            </Bubble>
          ))}
        </ol>
      </ScrollShadow>

      <ScrollShadow orientation="horizontal" hideScrollBar size={24} className="shrink-0 pr-4 pb-4 pl-5">
        <nav aria-label="Suggestions" className="flex w-max gap-2">
          <Link href={phone.approval('umoja')} className={`flex items-center ${SUGGESTION}`}>
            Open the proposal
          </Link>
          <Link
            href={phone.approval('portal')}
            // Monday is the first date the team can do; the launch date opens with it chosen.
            onClick={() => {
              if (!decisionOf('portal')) choose('portal', 0);
            }}
            className={`flex items-center ${SUGGESTION}`}
          >
            Launch on Monday
          </Link>
          <Link href={phone.call} className={`flex items-center ${SUGGESTION}`}>
            Call me instead
          </Link>
        </nav>
      </ScrollShadow>

      <Composer thread="cos" label="Message Chief of Staff" placeholder="Ask anything, or @ an agent" />
    </PhoneScreen>
  );
}
