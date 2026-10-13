'use client';

import { Check, CircleAlert, RotateCcw, Undo2 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { AgentChip, AppWindow } from './AppWindow';
import { AGENT, NEEDS } from './app-data';
import { SITE } from '@/lib/site';

// The web app's Inbox (the WebInbox board in extracted/saydeed-app) as a working example with
// sample data: pick an item, read what it traces to and the draft, then approve and send, ask why
// the agent stopped, or reject it. Nothing leaves the page.

type State = 'waiting' | 'approved' | 'returned';
type Decided = Exclude<State, 'waiting'>;

const DONE_TEXT: Record<Decided, string> = {
  approved: 'Approved. In this example nothing is sent.',
  returned: 'Sent back to the agent. Nothing moves until it is fixed.',
};

const STATE_NAME: Record<State, string> = { waiting: 'Needs you', approved: 'Approved', returned: 'Sent back' };

const STATE_PILL: Record<State, string> = {
  waiting: 'bg-hold-tint text-hold',
  approved: 'bg-signal-tint text-signal-strong',
  returned: 'bg-panel text-graphite',
};

function StateIcon({ state }: { state: State }) {
  if (state === 'approved') return <Check aria-hidden="true" className="size-4 text-signal-bright" strokeWidth={2.6} />;
  if (state === 'returned') return <Undo2 aria-hidden="true" className="size-4 text-graphite" strokeWidth={2.2} />;
  return <CircleAlert aria-hidden="true" className="size-4 text-hold" strokeWidth={2.2} />;
}

export function ApprovalsDemo({ className = '' }: { className?: string }) {
  const [states, setStates] = useState<State[]>(NEEDS.map(() => 'waiting'));
  const [sel, setSel] = useState(0);
  const [flash, setFlash] = useState<Decided | null>(null);
  const [why, setWhy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const whyId = useId();

  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (i: number) => {
    setSel(i);
    setWhy(false);
  };

  const decide = (s: Decided) => {
    const next = states.map((v, i) => (i === sel ? s : v));
    setStates(next);
    setFlash(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setFlash(null);
      const n = next.findIndex((v) => v === 'waiting');
      if (n >= 0) choose(n);
    }, 1400);
  };

  const reset = () => {
    clearTimeout(timer.current);
    setStates(NEEDS.map(() => 'waiting'));
    setFlash(null);
    choose(0);
  };

  const waiting = states.filter((s) => s === 'waiting').length;
  const item = NEEDS[sel];
  const state = states[sel];
  const allDone = waiting === 0 && !flash;

  return (
    <AppWindow
      interactive
      active="inbox"
      needs={waiting}
      kind="inbox"
      className={className}
      label={`Interactive example of the ${SITE.shortName} Work inbox, with sample data`}
    >
      <p className="sr-only">Approve and send, ask why and reject change only this example. Nothing is sent.</p>
      {/* grid-cols-1 caps the single column at the window width; an implicit column would grow to the untruncated titles. */}
      <div className="grid grid-cols-1 @narrow:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="border-b border-rule p-4 @narrow:border-b-0 @narrow:border-r">
          <p className="text-xl font-display tracking-display text-ink">Inbox</p>
          <div aria-hidden="true" className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-dot bg-signal px-3 py-1 text-on-signal">All</span>
            <span className="rounded-dot border border-rule bg-mist px-3 py-1 text-ink">Agents</span>
            <span className="rounded-dot border border-rule bg-mist px-3 py-1 text-ink">People</span>
          </div>
          <p className="mt-4 text-xs font-semibold text-slate">
            Needs you · <span data-needs-count className="tabular text-hold">{waiting}</span> waiting
          </p>
          <ul className="mt-2 space-y-1">
            {NEEDS.map((n, i) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-current={i === sel ? 'true' : undefined}
                  className={
                    'flex w-full items-center gap-3 rounded-control px-2 py-2 text-left transition-colors duration-200 ' +
                    (i === sel ? 'bg-signal-tint ring-1 ring-signal/40' : 'hover:bg-panel')
                  }
                >
                  <AgentChip agent={n.agent} wait={states[i] === 'waiting'} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{n.title}</span>
                    <span className="block truncate text-xs text-graphite">{n.sub}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="tabular font-mono text-xs text-slate">{n.time}</span>
                    <StateIcon state={states[i]} />
                    <span className="sr-only">{STATE_NAME[states[i]]}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-h-96 p-4 @narrow:p-6">
          {allDone ? (
            <div role="status" className="flex h-full flex-col items-center justify-center py-10 text-center animate-arrive">
              <span className="flex size-12 items-center justify-center rounded-dot bg-signal-tint">
                <Check aria-hidden="true" className="size-6 text-signal-bright" strokeWidth={2.4} />
              </span>
              <p className="mt-4 text-md font-semibold text-ink">Nothing is waiting for you.</p>
              <p className="mt-1 text-sm text-graphite">Every decision is saved in the activity record.</p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-dot border border-rule px-4 text-sm font-medium text-ink transition-colors hover:border-rule-strong hover:bg-panel"
              >
                <RotateCcw aria-hidden="true" className="size-4" strokeWidth={2} />
                Replay the example
              </button>
            </div>
          ) : (
            <div key={sel} className="animate-arrive">
              <p className="flex flex-wrap items-center gap-2 text-xs text-graphite">
                <AgentChip agent={item.agent} wait={state === 'waiting'} className="size-6" />
                {AGENT[item.agent].name} asks · <span className="tabular font-mono">{item.time}</span>
                <span className={'rounded-dot px-2 font-semibold ' + STATE_PILL[state]}>{STATE_NAME[state]}</span>
              </p>
              <h3 className="mt-3 text-xl font-display tracking-display text-ink">{item.title}</h3>

              <p className="mt-4 text-xs font-semibold text-slate">Traces to</p>
              <ol className="mt-2 space-y-3">
                {item.traces.map(([kind, title, who], i) => (
                  <li key={title} className="relative flex gap-3">
                    {i < item.traces.length - 1 ? <span aria-hidden="true" className="absolute left-1 top-4 h-full w-px bg-signal/40" /> : null}
                    <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-dot bg-signal" />
                    <span>
                      <span className="block text-sm font-semibold text-ink">{title}</span>
                      <span className="block text-xs text-slate">
                        {kind} · {who}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-4 rounded-frame bg-panel p-4">
                <p className="text-xs font-semibold text-slate">{item.draft.count}</p>
                <dl className="mt-2 grid grid-cols-[4rem_minmax(0,1fr)] gap-y-1 text-sm">
                  <dt className="text-slate">To</dt>
                  <dd className="text-ink">{item.draft.to}</dd>
                  <dt className="text-slate">Subject</dt>
                  <dd className="text-ink">{item.draft.subject}</dd>
                </dl>
                <p className="mt-3 text-sm text-graphite">{item.draft.body}</p>
              </div>

              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span className="text-graphite">
                  <span className="font-semibold text-ink">{item.sends}</span> will send
                </span>
                <span className="font-semibold text-hold">No undo once sent</span>
              </p>

              <div id={whyId} data-why hidden={!why} className="mt-4 rounded-frame border border-signal/30 bg-signal-tint p-4 text-sm animate-arrive">
                <p className="font-semibold text-ink">Why it stopped</p>
                <p className="mt-1 text-graphite">{item.why}</p>
              </div>

              <div className="mt-4">
                {state === 'waiting' ? (
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={() => decide('approved')}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-dot bg-signal px-4 text-sm font-semibold text-on-signal shadow-glow transition-colors hover:bg-signal/90"
                    >
                      <Check aria-hidden="true" className="size-4" strokeWidth={2.4} />
                      Approve and send
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWhy((w) => !w)}
                        aria-expanded={why}
                        aria-controls={whyId}
                        className="h-11 rounded-dot bg-signal-tint px-4 text-sm font-semibold text-signal-strong transition-colors hover:bg-panel"
                      >
                        Ask why
                      </button>
                      <button
                        type="button"
                        onClick={() => decide('returned')}
                        className="h-11 rounded-dot border border-rule bg-panel px-4 text-sm font-semibold text-ink transition-colors hover:border-rule-strong"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <p role="status" className={'flex items-center gap-2 text-sm font-medium animate-arrive ' + (state === 'approved' ? 'text-signal-bright' : 'text-graphite')}>
                    <StateIcon state={state} />
                    {DONE_TEXT[state]}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppWindow>
  );
}
