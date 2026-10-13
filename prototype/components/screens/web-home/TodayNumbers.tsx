'use client';

// "The numbers today" on web Home: cash, runway against the goal, September revenue and agent
// spend against the owner's cap, all example data from lib/data.ts.

import { Card, Meter } from '@heroui/react';
import { useId, type ReactNode } from 'react';
import { Mono } from '@/components/ui';
import { NUMBERS } from '@/lib/data';

const { cash, runway, revenue, spend } = NUMBERS;

/** "$4,800 more if Umoja signs": the leading amount is set in mono, as on the board. */
function splitAmount(note: string): [string, string] {
  const space = note.indexOf(' ');
  return space < 0 ? [note, ''] : [note.slice(0, space), note.slice(space)];
}

export function TodayNumbers() {
  const headingId = useId();
  const [revenueAmount, revenueRest] = splitAmount(revenue.note);
  return (
    <section aria-labelledby={headingId} className="@container flex flex-col gap-3">
      <h2 id={headingId} className="text-[19px] font-bold">
        The numbers today
      </h2>
      {/* Four across as on the board, two by two in a mid-width column, one by one on a phone.
          The 1px gaps show the card's separator colour as the lines between cells. */}
      <Card<'dl'>
        render={(props) => <dl {...props} />}
        className="m-0 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] bg-separator p-0 @[400px]:grid-cols-2 @[720px]:grid-cols-4"
      >
        <Cell label={cash.label} value={cash.value}>
          <span className="text-accent">
            <Mono>{cash.delta}</Mono> {cash.deltaNote}
          </span>
        </Cell>
        <Cell label={runway.label} value={runway.value}>
          <span className="flex items-center gap-2">
            <Meter
              aria-label={`Runway against the ${runway.goal} month goal`}
              value={runway.months}
              minValue={0}
              maxValue={runway.goal}
              valueLabel={`${runway.months} of ${runway.goal} months`}
              className="flex min-w-0 grow gap-0"
            >
              <Meter.Track className="h-1.5 w-full rounded-[3px] bg-inset">
                <Meter.Fill className="rounded-none bg-accent" />
              </Meter.Track>
            </Meter>
            goal <Mono>{runway.goal}</Mono>
          </span>
        </Cell>
        <Cell label={revenue.label} value={revenue.value}>
          <Mono>{revenueAmount}</Mono>
          {revenueRest}
        </Cell>
        <Cell
          label={spend.label}
          value={
            <>
              {spend.value} <span className="text-[16px] text-muted">/ {spend.capLabel}</span>
            </>
          }
        >
          {spend.note}
        </Cell>
      </Card>
    </section>
  );
}

function Cell({ label, value, children }: { label: string; value: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 bg-surface px-5 py-[18px]">
      <dt className="text-[14px] font-bold text-ink-3">{label}</dt>
      <dd className="font-mono text-[26px] font-semibold tabular-nums">{value}</dd>
      <dd className="text-[13px] font-semibold text-ink-3">{children}</dd>
    </div>
  );
}
