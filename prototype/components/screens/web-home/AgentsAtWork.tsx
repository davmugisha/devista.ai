'use client';

// "Agents at work" on web Home. Live from the store: an agent waiting on a decision goes back to
// work, with its new task, as soon as that decision is approved anywhere.

import { Card, cn } from '@heroui/react';
import { useId } from 'react';
import { InitialsTile, StateDot } from '@/components/ui';
import { COMPANY } from '@/lib/data';
import { usePrototype } from '@/lib/store';

export function AgentsAtWork() {
  const { agents } = usePrototype();
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={headingId} className="text-[19px] font-bold">
          Agents at work
        </h2>
        <span className="text-[14px] font-semibold text-ink-3">
          {COMPANY.working} working · {COMPANY.idle} idle
        </span>
      </div>
      <Card<'ul'> render={(props) => <ul {...props} />} className="m-0 list-none gap-0 overflow-hidden rounded-[22px] p-0">
        {agents.map((a) => {
          const waiting = a.state === 'waiting';
          return (
            <li key={a.code} className="flex items-center gap-3.5 px-5 py-3.5 shadow-[inset_0_-1px_0_var(--separator)]">
              <InitialsTile initials={a.code} className="size-[38px]" />
              <span className="flex min-w-0 grow flex-col gap-0.5">
                <span className="text-[15px] font-bold">{a.name}</span>
                <span className="text-[14px] font-semibold text-ink-3">{a.doing}</span>
              </span>
              <span className={cn('flex shrink-0 items-center gap-1.5 text-[13px] font-bold', waiting ? 'text-warning' : 'text-accent')}>
                <StateDot tone={waiting ? 'warning' : 'accent'} />
                {waiting ? 'Waiting' : 'Working'}
              </span>
            </li>
          );
        })}
      </Card>
    </section>
  );
}
