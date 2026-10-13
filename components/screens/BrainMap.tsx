'use client';

import { useEffect, useRef } from 'react';

// The app's Brain Map orb (extracted/saydeed-app/project/Brain.dc.html), drawn as SVG in the site's
// colours: the same seeded sphere of 48 nodes, each joined to its nearest neighbours, turning slowly.
// Amber nodes are the items waiting on a person. Decorative: the picture it sits in carries the label.

const N = 48;
const VIEW = 100;
// The app's orb is 340 px wide; node sizes below are its pixel sizes rescaled to the 100 unit view.
const PX = VIEW / 340;
// One amber node for each item that needs you in the example data.
const HOT = [4, 21, 38];

type Point = { x: number; y: number; z: number; s: number };

function build() {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pts: Point[] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i + rnd() * 0.6;
    const j = 0.8 + rnd() * 0.2;
    pts.push({ x: Math.cos(th) * rad * j, y: y * j, z: Math.sin(th) * rad * j, s: 0.6 + rnd() * 0.9 });
    rnd(); // the app draws a phase here for its speaking motion; kept so the shape matches
  }
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let a = 0; a < N; a++) {
    const near: [number, number][] = [];
    for (let b = 0; b < N; b++) {
      if (a === b) continue;
      const dx = pts[a].x - pts[b].x;
      const dy = pts[a].y - pts[b].y;
      const dz = pts[a].z - pts[b].z;
      near.push([dx * dx + dy * dy + dz * dz, b]);
    }
    near.sort((p, q) => p[0] - q[0]);
    const k = rnd() < 0.35 ? 3 : 2;
    for (let m = 0; m < k; m++) {
      const o = near[m][1];
      const key = a < o ? `${a}-${o}` : `${o}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, o]);
      }
    }
  }
  return { pts, edges };
}

const { pts: PTS, edges: EDGES } = build();
const f = (n: number) => n.toFixed(2);

/** Every node, edge and amber halo at time t (seconds), in draw order. */
function pose(t: number) {
  const c = VIEW / 2;
  const R = VIEW * 0.43 * (1 + 0.01 * Math.sin(t * 1.1));
  const ang = t * 0.16;
  const tilt = -0.32;
  const [ca, sa, ct, st] = [Math.cos(ang), Math.sin(ang), Math.cos(tilt), Math.sin(tilt)];
  const P = PTS.map((p, i) => {
    const x = p.x * ca + p.z * sa;
    const z0 = -p.x * sa + p.z * ca;
    return { i, sx: c + x * R, sy: c + (p.y * ct - z0 * st) * R, z: p.y * st + z0 * ct, s: p.s, hot: HOT.includes(i) };
  });
  const edges = EDGES.map(([a, b]) => ({
    x1: f(P[a].sx),
    y1: f(P[a].sy),
    x2: f(P[b].sx),
    y2: f(P[b].sy),
    o: f(0.05 + ((P[a].z + P[b].z) / 2 + 1) * 0.15),
  }));
  const nodes = [...P]
    .sort((p, q) => p.z - q.z)
    .map((p) => {
      const depth = (p.z + 1) / 2;
      const d = Math.max(2, (2 + depth * 5) * p.s * (p.hot ? 1.5 : 1)) * PX;
      return { cx: f(p.sx), cy: f(p.sy), r: f(d / 2), o: f(0.22 + depth * 0.78), hot: p.hot };
    });
  const halos = HOT.map((i) => {
    const p = P[i];
    // Each ring grows from its node and fades, out of step with the others.
    const k = (t * 0.9 + i * 0.37) % 1;
    return { cx: f(p.sx), cy: f(p.sy), r: f(((10 + k * 22) * PX) / 2), o: f((1 - k) * (0.3 + ((p.z + 1) / 2) * 0.6)) };
  });
  return { edges, nodes, halos };
}

const START = pose(1.4);
const nodeClass = (hot: boolean) => (hot ? 'fill-hold' : 'fill-ink');

export function BrainMap({ className = 'size-56' }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lines = el.querySelectorAll('line');
    const dots = el.querySelectorAll('circle[data-node]');
    const rings = el.querySelectorAll('circle[data-halo]');
    let raf = 0;
    let last = 0;
    let start: number | null = null;
    const set = (node: Element, attrs: Record<string, string>) => {
      for (const k in attrs) node.setAttribute(k, attrs[k]);
    };
    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      start ??= ts;
      if (ts - last < 40) return;
      last = ts;
      const { edges, nodes, halos } = pose(1.4 + (ts - start) / 1000);
      edges.forEach((e, i) => set(lines[i], { x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2, opacity: e.o }));
      nodes.forEach((n, i) => set(dots[i], { cx: n.cx, cy: n.cy, r: n.r, opacity: n.o, class: nodeClass(n.hot) }));
      halos.forEach((h, i) => set(rings[i], { cx: h.cx, cy: h.cy, r: h.r, opacity: h.o }));
    };
    // Turn only while the orb is on screen.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={svg} viewBox={`0 0 ${VIEW} ${VIEW}`} aria-hidden="true" className={'block ' + className}>
      {START.edges.map((e, i) => (
        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} opacity={e.o} strokeWidth={1} vectorEffect="non-scaling-stroke" className="stroke-ink" />
      ))}
      {START.halos.map((h, i) => (
        <circle key={i} data-halo="" cx={h.cx} cy={h.cy} r={h.r} opacity={h.o} strokeWidth={1.5} vectorEffect="non-scaling-stroke" className="fill-none stroke-hold" />
      ))}
      {START.nodes.map((n, i) => (
        <circle key={i} data-node="" cx={n.cx} cy={n.cy} r={n.r} opacity={n.o} className={nodeClass(n.hot)} />
      ))}
    </svg>
  );
}
