'use client';

import { useEffect, useState } from 'react';
import { BRAND } from '@/lib/brand';
import { SITE } from '@/lib/site';

type Node = { name: string; x: number; y: number };

// Five kinds of tool an agency already runs, on a ring around the center of a 520 by 420 canvas.
// Kinds of system, never vendors. The picture and its labels are both built from this array.
const NODES: Node[] = [
  { name: 'CRM', x: 260, y: 52 },
  { name: 'Inbox', x: 444, y: 160 },
  { name: 'Spreadsheets', x: 372, y: 360 },
  { name: 'Project tool', x: 148, y: 360 },
  { name: 'Documents', x: 76, y: 160 },
];

const SYSTEMS = `${NODES.length} systems, ${NODES.slice(0, -1).map((n) => n.name).join(', ')} and ${NODES[NODES.length - 1].name}`;
const C = { x: 260, y: 212 };
// Today: people carry work along every edge between systems, and across two diagonals.
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3], [4, 2]];

const STATES = {
  today: {
    label: 'Today',
    caption: 'People carry the work between systems: re-keying, chasing, forwarding, exporting.',
    aria: `Today: ${SYSTEMS}, with people carrying work along every connection between them.`,
  },
  with: {
    label: `With ${SITE.shortName}`,
    caption: 'One place carries it. Agents do the handoffs, and people approve what matters.',
    aria: `With ${SITE.shortName}: the same ${NODES.length} systems each connect once, to ${SITE.shortName} in the center, which carries work between them and sends decisions to people.`,
  },
} as const;

type View = keyof typeof STATES;

/**
 * The problem and the answer on one canvas. "Today" draws the tangle of person-carried
 * handoffs; the second view redraws the same systems around one hub. Plays on its own until the
 * visitor chooses a view; reduced motion shows the second view still.
 */
export function HubDiagram() {
  const [mode, setMode] = useState<View>('today');
  const [auto, setAuto] = useState(true);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setStill(reduce);
    if (reduce) {
      setMode('with');
      setAuto(false);
    }
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setMode((m) => (m === 'today' ? 'with' : 'today')), 4200);
    return () => clearInterval(t);
  }, [auto]);

  const choose = (m: View) => {
    setAuto(false);
    setMode(m);
  };

  const withOn = mode === 'with';

  return (
    <div className="card card-quiet p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Choose a view" className="inline-flex rounded-control border border-rule bg-paper p-1">
          {(Object.keys(STATES) as View[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => choose(m)}
              className={
                'h-9 rounded-chip px-4 text-sm font-medium transition-colors duration-200 ' +
                (mode === m ? (m === 'with' ? 'bg-signal text-on-signal' : 'bg-hold-tint text-hold') : 'text-graphite hover:text-ink')
              }
            >
              {STATES[m].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate">Example systems</p>
      </div>

      <svg viewBox="0 0 520 420" role="img" aria-label={STATES[mode].aria} className="mt-4 w-full">
        <defs>
          <radialGradient id="hub-glow">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Today: the tangle. */}
        <g className={'transition-opacity duration-700 ' + (withOn ? 'opacity-0' : 'opacity-100')}>
          {EDGES.map(([a, b]) => {
            const A = NODES[a];
            const B = NODES[b];
            return (
              <g key={`${a}-${b}`}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="stroke-hold/60 flow" strokeWidth="1.5" />
                <circle cx={(A.x + B.x) / 2} cy={(A.y + B.y) / 2} r="7" className="fill-hold-tint stroke-hold" strokeWidth="1.5" />
                <circle cx={(A.x + B.x) / 2} cy={(A.y + B.y) / 2} r="3" className="fill-hold animate-blink" />
              </g>
            );
          })}
        </g>

        {/* The second view: every system connects once, to the hub. */}
        <g className={'transition-opacity duration-700 ' + (withOn ? 'opacity-100' : 'opacity-0')}>
          <circle cx={C.x} cy={C.y} r="120" fill="url(#hub-glow)" className="text-glow" />
          {NODES.map((n, i) => {
            const d = `M${n.x} ${n.y} L${C.x} ${C.y}`;
            return (
              <g key={n.name}>
                <path d={d} className="stroke-signal-bright/70 flow" strokeWidth="1.6" fill="none" />
                {!still ? (
                  <circle r="3.5" className="fill-glow-cyan">
                    <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${i * 0.5}s`} path={i % 2 ? `M${C.x} ${C.y} L${n.x} ${n.y}` : d} />
                  </circle>
                ) : null}
              </g>
            );
          })}
          <circle cx={C.x} cy={C.y} r="50" className="fill-signal-tint stroke-signal-bright" strokeWidth="1.5" />
          <g transform={`translate(${C.x - 16} ${C.y - 33}) scale(0.5)`} className="fill-ink">
            {BRAND.mark.map((path) => <path key={path} d={path} />)}
          </g>
          <text x={C.x} y={C.y + 22} textAnchor="middle" className="fill-ink text-xs font-semibold">
            {SITE.shortName}
          </text>
        </g>

        {/* The systems themselves stay put in both views. */}
        {NODES.map((n) => (
          <g key={n.name}>
            <rect x={n.x - 64} y={n.y - 22} width="128" height="44" rx="10" className="fill-panel stroke-rule-strong/70" strokeWidth="1" />
            <text x={n.x} y={n.y + 6} textAnchor="middle" className="fill-ink text-base font-semibold">
              {n.name}
            </text>
          </g>
        ))}
      </svg>

      <p aria-live={auto ? 'off' : 'polite'} className={'mt-2 text-center text-sm ' + (withOn ? 'text-signal-bright' : 'text-hold')}>
        {STATES[mode].caption}
      </p>
    </div>
  );
}
