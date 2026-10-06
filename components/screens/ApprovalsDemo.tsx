'use client';

import { Check, RotateCcw, Undo2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { WindowBar } from './Window';
import { ModeGlyph } from '../ModeGlyph';

type Item = { title: string; dept: string; who: string; did: string; why: string; next: string };
type State = 'waiting' | 'approved' | 'returned';

const ITEMS: Item[] = [
  {
    title: 'Supplier invoice above approval limit',
    dept: 'Finance',
    who: 'the CFO',
    did: 'Read the invoice and matched it to the purchase order and goods receipt.',
    why: 'The amount is above the approval limit set for Finance.',
    next: 'Once approved, it joins the next payment run.',
  },
  {
    title: 'Purchase request above threshold',
    dept: 'Operations',
    who: 'the COO',
    did: 'Checked the remaining budget, the purchasing policy and the approved supplier list.',
    why: 'The amount is above the threshold you set.',
    next: 'Once approved, the agent raises the purchase order in the ERP.',
  },
  {
    title: 'Refund above the support limit',
    dept: 'Support',
    who: 'the support lead',
    did: 'Collected the order history and the customer’s messages.',
    why: 'Refunds above your limit need the support lead.',
    next: 'Once approved, the refund is issued and the customer is told.',
  },
];

const DONE_TEXT: Record<Exclude<State, 'waiting'>, string> = {
  approved: 'Approved. The agent carries on from here.',
  returned: 'Sent back with your note. Nothing moves until it is fixed.',
};

/**
 * A working approvals queue with example data: pick a decision, read what the agent did and
 * why it stopped, then approve it or send it back. Nothing leaves the page.
 */
export function ApprovalsDemo({ className = '' }: { className?: string }) {
  const [states, setStates] = useState<State[]>(ITEMS.map(() => 'waiting'));
  const [sel, setSel] = useState(0);
  const [flash, setFlash] = useState<Exclude<State, 'waiting'> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const decide = (s: Exclude<State, 'waiting'>) => {
    const next = states.map((v, i) => (i === sel ? s : v));
    setStates(next);
    setFlash(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setFlash(null);
      const n = next.findIndex((v) => v === 'waiting');
      if (n >= 0) setSel(n);
    }, 1400);
  };

  const reset = () => {
    clearTimeout(timer.current);
    setStates(ITEMS.map(() => 'waiting'));
    setSel(0);
    setFlash(null);
  };

  const waiting = states.filter((s) => s === 'waiting').length;
  const item = ITEMS[sel];
  const state = states[sel];
  const allDone = waiting === 0 && !flash;

  return (
    <div className={'@container overflow-hidden rounded-window border border-rule bg-mist text-left shadow-float ' + className}>
      <WindowBar title="Approvals" meta={waiting ? `${waiting} waiting` : 'All clear'} />
      <p className="sr-only">Interactive example with sample data. Choosing approve or send back changes only this illustration.</p>
      <div className="grid @sm:grid-cols-5">
        <ul className="border-b border-rule @sm:col-span-2 @sm:border-b-0 @sm:border-r">
          {ITEMS.map((it, i) => (
            <li key={it.title} className="border-b border-rule last:border-b-0">
              <button
                type="button"
                onClick={() => setSel(i)}
                aria-current={i === sel ? 'true' : undefined}
                className={
                  'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-200 ' +
                  (i === sel ? 'bg-signal-tint' : 'hover:bg-panel')
                }
              >
                <span className="mt-1.5 flex size-2 shrink-0">
                  {states[i] === 'waiting' ? (
                    <span className="size-2 rounded-dot bg-hold" />
                  ) : states[i] === 'approved' ? (
                    <Check className="-ml-1 -mt-1 size-4 text-signal-bright" strokeWidth={2.6} />
                  ) : (
                    <Undo2 className="-ml-1 -mt-1 size-4 text-graphite" strokeWidth={2.2} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink">{it.title}</span>
                  <span className="mt-px block text-xs text-graphite">
                    <span className="font-medium text-signal-bright">{it.dept}</span>, waiting for {it.who}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="min-h-72 p-4 @sm:col-span-3 @sm:p-5">
          {allDone ? (
            <div role="status" className="flex h-full flex-col items-center justify-center py-10 text-center animate-arrive">
              <span className="flex size-12 items-center justify-center rounded-dot bg-signal-tint">
                <Check className="size-6 text-signal-bright" strokeWidth={2.4} />
              </span>
              <p className="mt-4 text-md font-semibold text-ink">Nothing is waiting for you.</p>
              <p className="mt-1 text-sm text-graphite">Every decision is on record in the audit trail.</p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-control border border-rule px-4 text-sm font-medium text-ink transition-colors hover:border-rule-strong hover:bg-panel"
              >
                <RotateCcw className="size-4" strokeWidth={2} />
                Replay the example
              </button>
            </div>
          ) : (
            <div key={sel} className="animate-arrive">
              <p className="text-md font-semibold text-ink">{item.title}</p>
              <ol className="mt-4 space-y-3">
                <li className="flex gap-3">
                  <ModeGlyph mode="agent" className="mt-1.5 size-3 text-signal-bright" />
                  <p className="text-sm text-graphite">
                    <span className="font-medium text-ink">What the agent did. </span>
                    {item.did}
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 block size-3 shrink-0 rounded-dot bg-hold" />
                  <p className="text-sm text-graphite">
                    <span className="font-medium text-ink">Why it stopped. </span>
                    {item.why}
                  </p>
                </li>
                <li className="flex gap-3">
                  <ModeGlyph mode="agent" className="mt-1.5 size-3 text-signal-bright" />
                  <p className="text-sm text-graphite">
                    <span className="font-medium text-ink">What happens next. </span>
                    {item.next}
                  </p>
                </li>
              </ol>
              <div className="mt-5 border-t border-rule pt-4">
                {state === 'waiting' ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => decide('approved')}
                      className="inline-flex h-10 items-center gap-2 rounded-control bg-signal px-4 text-sm font-medium text-on-signal shadow-glow transition-colors hover:bg-signal-strong"
                    >
                      <Check className="size-4" strokeWidth={2.4} />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => decide('returned')}
                      className="inline-flex h-10 items-center gap-2 rounded-control border border-rule px-4 text-sm font-medium text-ink transition-colors hover:border-rule-strong hover:bg-panel"
                    >
                      Send back
                    </button>
                  </div>
                ) : (
                  <p role="status" className={'flex items-center gap-2 text-sm font-medium animate-arrive ' + (state === 'approved' ? 'text-signal-bright' : 'text-graphite')}>
                    {state === 'approved' ? <Check className="size-4" strokeWidth={2.4} /> : <Undo2 className="size-4" strokeWidth={2.2} />}
                    {DONE_TEXT[state]}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
