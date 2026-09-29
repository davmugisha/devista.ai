'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { WORKFLOWS } from '@/lib/workflows';

const WorkflowExplorer = dynamic(() => import('./WorkflowExplorer'), { ssr: false });

/**
 * Keeps the interactive's JavaScript off the critical path. The server renders the first state
 * as plain HTML (children); this loads the interactive when the section comes within a screen of
 * the viewport, or immediately if the visitor clicks or focuses a tab first.
 */
export function ExplorerIsland({ uid, children }: { uid: string; children: ReactNode }) {
  const [live, setLive] = useState<null | { initial: number; focusTab: boolean }>(null);
  const [loaded, setLoaded] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || live) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLive((l) => l ?? { initial: 0, focusTab: false });
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [live]);

  // Once the interactive is showing, return focus to the tab the visitor was on.
  useEffect(() => {
    if (!loaded || !live?.focusTab) return;
    document.getElementById(`${uid}-tab-${WORKFLOWS[live.initial].id}`)?.focus();
  }, [loaded, live, uid]);

  // Carry an early click or focus on a static tab over to the interactive version.
  const takeOver = (e: { target: EventTarget }, focusTab: boolean) => {
    const tab = (e.target as Element).closest?.('[role=tab]');
    if (!tab || loaded) return;
    const i = WORKFLOWS.findIndex((w) => tab.id === `${uid}-tab-${w.id}`);
    setLive({ initial: Math.max(0, i), focusTab });
  };

  return (
    <div ref={box} onClickCapture={(e) => takeOver(e, true)} onFocusCapture={(e) => takeOver(e, true)}>
      {live ? (
        <>
          {loaded ? null : children}
          <Mounted onReady={() => setLoaded(true)}>
            <WorkflowExplorer uid={uid} initial={live.initial} />
          </Mounted>
        </>
      ) : (
        children
      )}
    </div>
  );
}

/** Keeps the interactive hidden until its chunk has rendered, then swaps it in within one frame. */
function Mounted({ children, onReady }: { children: ReactNode; onReady: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    // The dynamic component renders null until its chunk arrives; poll for its markup.
    let raf = 0;
    const check = () => {
      if (ref.current?.querySelector('[role=tablist]')) {
        setShown(true);
        onReady();
      } else raf = requestAnimationFrame(check);
    };
    check();
    return () => cancelAnimationFrame(raf);
    // Runs once; onReady only flips a flag in the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={ref} hidden={shown ? undefined : true}>
      {children}
    </div>
  );
}
