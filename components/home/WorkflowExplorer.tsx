'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { ExplorerView } from './ExplorerView';
import { WORKFLOWS, type Mode } from '@/lib/workflows';

/**
 * The signature interactive: pick a department, see one example workflow split into who does
 * each step, where approval sits and what escalates to a person. Tabs follow the ARIA tabs
 * pattern (arrow keys, Home, End); the legend doubles as a highlight filter.
 * Loaded by ExplorerIsland once the section nears the viewport; it takes over from identical
 * server-rendered markup, carrying over any tab the visitor already clicked or focused.
 */
export default function WorkflowExplorer({ uid, initial = 0 }: { uid: string; initial?: number }) {
  const [active, setActive] = useState(initial);
  const [focus, setFocus] = useState<Mode | null>(null);
  const [changed, setChanged] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, moveFocus = true) => {
    const n = (i + WORKFLOWS.length) % WORKFLOWS.length;
    setActive(n);
    setChanged(true);
    if (moveFocus) tabs.current[n]?.focus();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(active + 1),
      ArrowDown: () => select(active + 1),
      ArrowLeft: () => select(active - 1),
      ArrowUp: () => select(active - 1),
      Home: () => select(0),
      End: () => select(WORKFLOWS.length - 1),
    };
    const fn = keys[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  return (
    <ExplorerView
      uid={uid}
      active={active}
      focus={focus}
      animate={changed}
      interactive
      tabRefs={tabs}
      onSelect={(i) => select(i, false)}
      onTabKey={onTabKey}
      onToggle={(m) => setFocus((f) => (f === m ? null : m))}
    />
  );
}
