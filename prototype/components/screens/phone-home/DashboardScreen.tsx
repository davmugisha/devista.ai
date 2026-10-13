'use client';

// The phone Dashboard (Dashboard.dc.html): decisions waiting on the owner as a row of amber cards
// (live from the store, an all-clear card once none are left), today's four numbers, anything
// pinned from a call, and the agents at work with their live state.

import { Button, Card, Meter, ScrollShadow, Separator, cn } from '@heroui/react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { ButtonLink, InitialsTile, Mono, NeedsCount, StateDot } from '@/components/ui';
import { COMPANY, NUMBERS, type Agent, type Approval } from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { CALL_PINS } from './callContent';
import { Dock, FOCUS_RING, Glyph, InboxLink, MenuLink } from './PhoneChrome';
import { usePins } from './session';

export function DashboardScreen() {
  const { pending, pendingCount, agents } = usePrototype();

  return (
    <PhoneScreen className="overflow-hidden leading-[normal]">
      <div className="flex shrink-0 items-center justify-between px-5 pt-14">
        <MenuLink />
        <div className="flex min-w-0 flex-col items-center gap-0.5 text-center">
          <h1 className="m-0 text-[20px] font-bold text-foreground">Dashboard</h1>
          <p className="m-0 text-[12px] font-semibold text-muted">{COMPANY.name} · today</p>
        </div>
        <InboxLink count={pendingCount} />
      </div>

      <div className="flex min-h-0 grow flex-col gap-6 overflow-y-auto pt-5 pb-[136px]">
        <section aria-labelledby="dashboard-needs" className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 px-5">
            <h2 id="dashboard-needs" className="m-0 flex items-center gap-2 text-[18px] font-bold text-foreground">
              Needs you <NeedsCount count={pendingCount} />
            </h2>
            <Link href={phone.inbox('needs')} className={cn('rounded-sm text-[14px] font-bold text-accent hover:text-accent-hover', FOCUS_RING)}>
              See all
            </Link>
          </div>
          {pending.length ? (
            <ScrollShadow
              orientation="horizontal"
              hideScrollBar
              size={24}
              className="flex snap-x snap-mandatory scroll-px-5 gap-2.5 px-5"
            >
              {pending.map((a) => (
                <DecisionCard key={a.key} approval={a} />
              ))}
            </ScrollShadow>
          ) : (
            <AllClear />
          )}
        </section>

        <section aria-label="Today’s numbers" className="grid grid-cols-2 gap-2.5 px-5">
          <NumberCard label={NUMBERS.cash.label}>
            <Value>{NUMBERS.cash.value}</Value>
            <p className="m-0 text-[12px] font-bold text-accent">
              <Mono>{NUMBERS.cash.delta}</Mono> {NUMBERS.cash.deltaNote}
            </p>
          </NumberCard>
          <NumberCard label={NUMBERS.runway.label}>
            <Value>{NUMBERS.runway.value}</Value>
            <Meter
              aria-label={`Runway, ${NUMBERS.runway.months} of the ${NUMBERS.runway.goal} month goal`}
              value={NUMBERS.runway.months}
              minValue={0}
              maxValue={NUMBERS.runway.goal}
              className="flex items-center gap-2"
            >
              <Meter.Track className="h-1.5 grow rounded-full bg-inset">
                <Meter.Fill className="rounded-full bg-accent" />
              </Meter.Track>
              <span className="shrink-0 text-[12px] font-bold text-muted">
                goal <Mono>{NUMBERS.runway.goal}</Mono>
              </span>
            </Meter>
          </NumberCard>
          <NumberCard label={NUMBERS.revenue.shortLabel}>
            <Value>{NUMBERS.revenue.value}</Value>
            <svg width="120" height="22" viewBox="0 0 120 22" aria-hidden className="max-w-full">
              <polyline
                points="2,19 18,15 34,17 50,11 66,13 82,7 98,9 118,3"
                className="fill-none stroke-accent"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NumberCard>
          <NumberCard label={NUMBERS.spend.label}>
            <div className="flex items-baseline gap-1.5">
              <Value>{NUMBERS.spend.value}</Value>
              <Mono className="text-[13px] text-muted">/ {NUMBERS.spend.capLabel}</Mono>
            </div>
            <Meter
              aria-label={`Agent spend today, ${NUMBERS.spend.value} of your ${NUMBERS.spend.capLabel} cap`}
              value={NUMBERS.spend.amount}
              minValue={0}
              maxValue={NUMBERS.spend.cap}
              className="flex"
            >
              <Meter.Track className="h-1.5 grow rounded-full bg-inset">
                <Meter.Fill className="rounded-full bg-accent" />
              </Meter.Track>
            </Meter>
          </NumberCard>
        </section>

        <PinnedFromCall />

        <section aria-labelledby="dashboard-agents" className="flex flex-col gap-3 px-5">
          <div className="flex items-center justify-between gap-3">
            <h2 id="dashboard-agents" className="m-0 text-[18px] font-bold text-foreground">
              Agents at work
            </h2>
            <span className="text-[13px] font-bold text-muted">
              {COMPANY.working} working · {COMPANY.idle} idle
            </span>
          </div>
          <Card className="gap-0 rounded-[22px] bg-surface px-4 py-0 shadow-none">
            <ul className="m-0 flex list-none flex-col p-0">
              {agents.map((agent, i) => (
                <li key={agent.code}>
                  {i > 0 && <Separator />}
                  <AgentRow agent={agent} />
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[170px] bg-linear-to-b from-background/0 to-background to-60%" />
      <Dock first="home" className="absolute inset-x-5 bottom-7" />
    </PhoneScreen>
  );
}

/** One decision waiting: who asks and when, what, the figures, and the way in. */
function DecisionCard({ approval: a }: { approval: Approval }) {
  return (
    <Card className="w-[290px] max-w-[calc(100vw-56px)] shrink-0 snap-start gap-2 rounded-3xl border border-warning-line bg-warning-wash p-4 shadow-none">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-warning-soft-foreground">
        <InitialsTile initials={a.who} className="size-6 rounded-lg text-[9px] text-accent" />
        <span>
          {a.asker} · <Mono>{a.time}</Mono>
        </span>
      </div>
      <h3 className="m-0 text-[17px] font-bold text-foreground">{a.title}</h3>
      <p className="m-0 text-[13px] font-semibold text-warning-soft-foreground">
        <MoneyText text={a.detail} />
      </p>
      <div className="flex gap-2 pt-1">
        <ButtonLink
          href={phone.approval(a.key)}
          className="h-11 rounded-full bg-warning px-5 text-[15px] text-warning-foreground hover:bg-warning-hover"
        >
          Review
        </ButtonLink>
        <ButtonLink href={phone.chat} variant="ghost" className="h-11 rounded-full px-4 text-[15px] text-foreground hover:bg-warning-soft">
          Ask why
        </ButtonLink>
      </div>
    </Card>
  );
}

function AllClear() {
  return (
    <div className="px-5">
      <Card className="flex-row items-center gap-3 rounded-3xl bg-surface p-4 shadow-none">
        <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Glyph name="check" size={20} />
        </span>
        <p className="m-0 text-[14px] font-semibold text-ink-2">
          You are clear for now. Chief of Staff will bring the next decision here.
        </p>
      </Card>
    </div>
  );
}

function NumberCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card className="min-w-0 gap-1.5 rounded-[22px] bg-surface p-4 shadow-none">
      <h3 className="m-0 text-[13px] font-bold text-muted">{label}</h3>
      {children}
    </Card>
  );
}

function Value({ children }: { children: ReactNode }) {
  return <Mono className="text-[22px] font-semibold text-foreground">{children}</Mono>;
}

function AgentRow({ agent }: { agent: Agent }) {
  const waiting = agent.state === 'waiting';
  return (
    <div className="flex h-16 items-center gap-3">
      <InitialsTile initials={agent.code} className="size-10 rounded-[13px] text-accent" />
      <div className="flex min-w-0 grow flex-col gap-0.5">
        <span className="truncate text-[15px] font-bold text-foreground">{agent.name}</span>
        <span className={cn('truncate text-[13px] font-semibold', waiting ? 'text-warning' : 'text-ink-3')}>{agent.doing}</span>
      </div>
      <StateDot tone={waiting ? 'warning' : 'accent'} pulse={!waiting} className="size-2.5" />
      <span className="sr-only">{waiting ? 'Waiting' : 'Working'}</span>
    </div>
  );
}

/** Visuals the owner pinned during a call with Chief of Staff. Nothing shows until one is pinned. */
function PinnedFromCall() {
  const { pins, unpin } = usePins();
  if (!pins.length) return null;
  return (
    <section aria-labelledby="dashboard-pinned" className="flex flex-col gap-3 px-5">
      <h2 id="dashboard-pinned" className="m-0 text-[18px] font-bold text-foreground">
        Pinned from your call
      </h2>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {pins.map((key) => {
          const pin = CALL_PINS[key];
          return (
            <li key={key}>
              <Card className="flex-row items-center gap-3 rounded-[22px] bg-surface p-4 shadow-none">
                <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-accent-soft text-accent">
                  <Glyph name="pin" size={20} />
                </span>
                <div className="flex min-w-0 grow flex-col gap-0.5">
                  <span className="text-[12px] font-bold tracking-[0.06em] text-muted uppercase">{pin.label}</span>
                  <span className="truncate text-[15px] font-bold text-foreground">{pin.value}</span>
                  <span className="truncate text-[13px] font-semibold text-ink-3">{pin.note}</span>
                </div>
                <Button
                  isIconOnly
                  variant="ghost"
                  aria-label={`Unpin ${pin.label.toLowerCase()}`}
                  onPress={() => unpin(key)}
                  className="size-11 min-w-11 shrink-0 rounded-full text-ink-3"
                >
                  <Glyph name="close" size={18} />
                </Button>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Sets the dollar amounts in a line in mono, as the boards do: "$3,650 overdue · ...". */
export function MoneyText({ text }: { text: string }) {
  const parts = text.split(/(\$[\d,]+(?:\.\d+)?)/);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <Mono key={i}>{part}</Mono> : part))}
    </>
  );
}
