'use client';

import { Check, Hourglass, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { WindowBar } from './Window';

type Line = { text: string; state: 'done' | 'person' | 'wait' };

const LINES: Line[] = [
  { text: 'Read 12 new invoices from the accounts inbox', state: 'done' },
  { text: 'Matched 11 to purchase orders and goods receipts', state: 'done' },
  { text: 'One is above the approval limit. Sent to the CFO', state: 'person' },
  { text: 'Drafted ledger entries for the clerk to confirm', state: 'done' },
  { text: 'Waiting for approval before scheduling payment', state: 'wait' },
];

const ICON = {
  done: <Check className="size-3.5 text-signal-bright" strokeWidth={2.4} />,
  person: <UserRound className="size-3.5 text-hold" strokeWidth={2.2} />,
  wait: <Hourglass className="size-3.5 text-graphite" strokeWidth={2.2} />,
};

const TYPE_MS = 22;
const PAUSE_MS = 500;
const HOLD_MS = 3200;

/**
 * An agent writing its own work log, line by line, while it is on screen: what it did, what it
 * sent to a person, and what it is waiting for. Example data; the full log is in the label.
 */
export function AgentConsole({ className = '' }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [still, setStill] = useState(false);
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || still) return;
    let t: ReturnType<typeof setTimeout>;
    if (line >= LINES.length) {
      t = setTimeout(() => {
        setLine(0);
        setChars(0);
      }, HOLD_MS);
    } else if (chars < LINES[line].text.length) {
      t = setTimeout(() => setChars((c) => c + 1), TYPE_MS);
    } else {
      t = setTimeout(() => {
        setLine((l) => l + 1);
        setChars(0);
      }, PAUSE_MS);
    }
    return () => clearTimeout(t);
  }, [visible, still, line, chars]);

  const shown = still ? LINES.length : line;

  return (
    <div
      ref={box}
      role="img"
      aria-label={'Example work log of a finance invoice agent: ' + LINES.map((l) => l.text).join('. ') + '.'}
      className={'overflow-hidden rounded-window border border-rule bg-mist text-left shadow-float ' + className}
    >
      <div aria-hidden="true">
        <WindowBar title="Invoice agent" meta="Finance" />
        <div className="flex items-center gap-4 border-b border-rule px-5 py-4">
          <span className="orb size-11 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-ink">Working inside your rules</p>
            <p className="text-xs text-graphite">Escalates to the accounts payable lead</p>
          </div>
        </div>
        <ol className="min-h-56 space-y-3 px-5 py-4 font-mono text-xs">
          {LINES.map((l, i) => {
            if (i > shown) return null;
            const typing = i === shown && !still;
            if (typing && line >= LINES.length) return null;
            const text = typing ? l.text.slice(0, chars) : l.text;
            return (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-px flex size-4 shrink-0 items-center justify-center">
                  {typing ? <span className="size-1.5 rounded-dot bg-signal-bright animate-blink" /> : ICON[l.state]}
                </span>
                <span className={l.state === 'person' && !typing ? 'text-hold' : 'text-ink'}>
                  {text}
                  {typing ? <span className="ml-px inline-block h-3.5 w-1.5 translate-y-0.5 bg-signal-bright animate-caret" /> : null}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="border-t border-rule px-5 py-3">
          <p className="flex items-center justify-between rounded-control border border-rule bg-panel px-3 py-2 text-xs text-slate">
            Ask the agent why it stopped
            <span className="rounded-chip bg-signal px-2 py-px text-xs font-medium text-on-signal">Ask</span>
          </p>
        </div>
      </div>
    </div>
  );
}
