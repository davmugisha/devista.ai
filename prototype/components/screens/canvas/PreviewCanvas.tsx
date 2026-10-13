'use client';

// The design canvas, live (the role of extracted/saydeed-app/preview.html). Canvas view places
// every board's route in a frame at its canvas position and size, with the row titles, scaled to
// fit the window. Screens view shows the frames one by one. All frames share the prototype's
// session state, so a decision made in one frame shows in the others.

import { Button, ToggleButton, ToggleButtonGroup, cn, toast } from '@heroui/react';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { BOARDS, CANVAS_TITLE, NOTES, type Board } from '@/lib/boards';
import { docs, phone, web } from '@/lib/routes';
import { usePrototype } from '@/lib/store';

type View = 'canvas' | 'screens';

/** Each board's title sits above its frame, so the last row needs this much more room. */
const LABEL = 40;
/** Boards wider than this take a full row in Screens view and scroll inside their own box. */
const WIDE = 600;

// The canvas box, from the boards and the row titles, as preview.html computes it.
const ITEMS = [...NOTES.map((n) => ({ x: n.x, y: n.y, w: 0, h: 60 })), ...BOARDS];
const MIN_X = Math.min(...ITEMS.map((i) => i.x));
const MIN_Y = Math.min(...ITEMS.map((i) => i.y));
const CANVAS_W = Math.max(...ITEMS.map((i) => i.x + i.w)) - MIN_X;
const CANVAS_H = Math.max(...ITEMS.map((i) => i.y + i.h)) - MIN_Y + LABEL;

const QUIET_LINKS = [
  { label: 'Web app', href: web.home },
  { label: 'Phone app', href: phone.home },
  { label: 'Information architecture', href: docs.ia },
];

function Caption({ board, as: Tag }: { board: Board; as: 'p' | 'figcaption' }) {
  return (
    <Tag className="m-0 mb-2 truncate text-[13px] leading-[1.4] text-muted">
      <Link
        href={board.route}
        className="rounded-sm underline decoration-border underline-offset-2 transition-colors outline-none hover:text-foreground hover:decoration-current focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {board.title}
      </Link>
    </Tag>
  );
}

function Frame({ board, style }: { board: Board; style?: CSSProperties }) {
  return (
    <iframe
      src={board.route}
      title={board.title}
      width={board.w}
      height={board.h}
      loading="lazy"
      className="block shrink-0 rounded-xl border-0 bg-surface shadow-ring"
      style={style}
    />
  );
}

function CanvasView({ scale }: { scale: number }) {
  return (
    // A transform keeps the unscaled box, so this box takes the scaled size and clips the rest.
    <div className="relative overflow-hidden" style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}>
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})` }}
      >
        {NOTES.map((n) => (
          <h2
            key={n.text}
            className="absolute m-0 text-[40px] leading-[1.4] font-bold whitespace-nowrap"
            style={{ left: n.x - MIN_X, top: n.y - MIN_Y }}
          >
            {n.text}
          </h2>
        ))}
        {BOARDS.map((b) => (
          <div key={b.file} className="absolute" style={{ left: b.x - MIN_X, top: b.y - MIN_Y, width: b.w }}>
            <Caption board={b} as="p" />
            <Frame board={b} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreensView({ width }: { width: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {BOARDS.map((b) => {
        if (b.w > WIDE) {
          return (
            <figure key={b.file} className="m-0 flex min-w-0 basis-full justify-center">
              <div className="w-fit max-w-full min-w-0">
                <Caption board={b} as="figcaption" />
                {/* The board keeps its real width and scrolls sideways in its own box. */}
                <div className="overflow-x-auto p-px">
                  <Frame board={b} />
                </div>
              </div>
            </figure>
          );
        }
        // Narrow boards shrink to fit a phone-width window rather than scroll.
        const s = Math.min(1, width / b.w);
        return (
          <figure key={b.file} className="m-0 min-w-0" style={{ width: b.w * s }}>
            <Caption board={b} as="figcaption" />
            <div style={{ width: b.w * s, height: b.h * s }}>
              <Frame board={b} style={s < 1 ? { transform: `scale(${s})`, transformOrigin: '0 0' } : undefined} />
            </div>
          </figure>
        );
      })}
    </div>
  );
}

export function PreviewCanvas() {
  const { reset } = usePrototype();
  const [view, setView] = useState<View>('canvas');
  // The width the views can use, measured on the client; nothing is framed until it is known.
  const [width, setWidth] = useState<number | null>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    // The view lives in the address (?view=screens), so Back from a screen returns to it.
    if (new URLSearchParams(window.location.search).get('view') === 'screens') setView('screens');
    const el = fitRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <header className="z-10 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-border bg-surface px-4 py-3">
        <h1 className="m-0 text-base leading-[1.4] font-bold">{CANVAS_TITLE}</h1>
        <nav aria-label="Prototype" className="flex flex-wrap items-center gap-x-1 gap-y-1 max-md:order-last max-md:-ml-2.5 max-md:basis-full">
          {QUIET_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-2.5 py-1 text-[13px] font-semibold text-muted transition-colors outline-none hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-focus"
            >
              {l.label}
            </Link>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onPress={() => {
              reset();
              toast('Example data reset', { description: 'Every approval, purchase and message is undone, in every frame.' });
            }}
            className="h-7 rounded-full px-2.5 text-[13px] font-semibold text-muted hover:text-foreground md:h-7"
          >
            Reset example data
          </Button>
        </nav>
        <ToggleButtonGroup
          aria-label="View"
          isDetached
          disallowEmptySelection
          selectionMode="single"
          size="sm"
          selectedKeys={[view]}
          onSelectionChange={(keys) => {
            const next = [...keys][0];
            if (next !== 'canvas' && next !== 'screens') return;
            setView(next);
            mainRef.current?.scrollTo({ top: 0 });
            window.history.replaceState(null, '', next === 'screens' ? '?view=screens' : window.location.pathname);
          }}
          className="segmented-accent ml-auto shadow-ring"
        >
          <ToggleButton id="canvas" className="h-8 px-3.5 text-sm md:h-8">
            Canvas
          </ToggleButton>
          <ToggleButton id="screens" className="h-8 px-3.5 text-sm md:h-8">
            Screens
          </ToggleButton>
        </ToggleButtonGroup>
      </header>

      {/* The page scrolls here, with a steady gutter so a scrollbar never changes the scale. */}
      <main ref={mainRef} className="min-h-0 grow overflow-x-hidden overflow-y-auto px-4 pt-6 pb-12 [scrollbar-gutter:stable]">
        <div ref={fitRef} className="w-full">
          {width !== null && (view === 'canvas' ? <CanvasView scale={Math.min(1, width / CANVAS_W)} /> : <ScreensView width={width} />)}
        </div>
      </main>
    </div>
  );
}
