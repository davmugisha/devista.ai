'use client';

// The Brain Map orb: the company as a slowly turning network of 48 nodes. Amber nodes, each with a
// pulsing halo, are decisions waiting on the owner. A port of the design's Brain.dc.html: the
// same seeded layout, rotation, tilt and breathing, so the shape matches the boards exactly.

import { cn } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  s: number;
  ph: number;
}

const HOT = [4, 21, 38, 30, 13];

function buildNetwork() {
  const N = 48;
  const pts: Point[] = [];
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i + rnd() * 0.6;
    const j = 0.8 + rnd() * 0.2;
    pts.push({ x: Math.cos(th) * rad * j, y: y * j, z: Math.sin(th) * rad * j, s: 0.6 + rnd() * 0.9, ph: rnd() * 6.28 });
  }
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let a = 0; a < N; a++) {
    const d: [number, number][] = [];
    for (let b = 0; b < N; b++) {
      if (a === b) continue;
      const dx = pts[a].x - pts[b].x;
      const dy = pts[a].y - pts[b].y;
      const dz = pts[a].z - pts[b].z;
      d.push([dx * dx + dy * dy + dz * dz, b]);
    }
    d.sort((p, q) => p[0] - q[0]);
    const k = rnd() < 0.35 ? 3 : 2;
    for (let m = 0; m < k; m++) {
      const o = d[m][1];
      const key = a < o ? `${a}-${o}` : `${o}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, o]);
      }
    }
  }
  return { pts, edges };
}

const NETWORK = buildNetwork();

// Rounded the way the board rounds (toFixed), so the server's style strings and the browser's
// agree: unrounded floats re-serialise differently in the browser and break hydration.
const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;
const r3 = (n: number) => Math.round(n * 1000) / 1000;

function useClock(still: boolean) {
  const [t, setT] = useState(1.4);
  useEffect(() => {
    if (still) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last = 0;
    let start: number | null = null;
    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      if (start === null) start = ts;
      if (ts - last < 40) return; // about 25 frames a second is plenty for a slow turn
      last = ts;
      setT(1.4 + (ts - start) / 1000);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [still]);
  return t;
}

export interface BrainOrbProps {
  /** Pixel size of the square orb. */
  size?: number;
  /** How many amber "needs you" nodes to light, 0 to 5. Pass the live pending count. */
  highlights?: number;
  /** Breathe and ripple while Chief of Staff is talking (the call screen). */
  speaking?: boolean;
  /** Hold still (no animation). */
  still?: boolean;
  /** Rotation speed. */
  speed?: number;
  className?: string;
}

export function BrainOrb({ size = 340, highlights = 3, speaking = false, still = false, speed = 0.16, className }: BrainOrbProps) {
  const t = useClock(still);

  const frame = useMemo(() => {
    const c = size / 2;
    const R = size * 0.43;
    const scale = size / 340;
    const ang = t * speed;
    const tilt = -0.32;
    const ca = Math.cos(ang);
    const sa = Math.sin(ang);
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    const breathe = speaking ? 1 + 0.04 * Math.sin(t * 6.1) * Math.sin(t * 2.7 + 1) : 1 + 0.01 * Math.sin(t * 1.1);
    const hot = new Set(HOT.slice(0, Math.max(0, Math.min(highlights, HOT.length))));

    const P = NETWORK.pts.map((p, i) => {
      const w = speaking ? 1 + 0.07 * Math.sin(t * 5 + p.ph * 2) : 1;
      const x = (p.x * ca + p.z * sa) * w;
      const z0 = (-p.x * sa + p.z * ca) * w;
      const y = (p.y * ct - z0 * st) * w;
      const z = p.y * st + z0 * ct;
      return { i, sx: c + x * R * breathe, sy: c + y * R * breathe, z, s: p.s, hot: hot.has(i) };
    });

    const edges = NETWORK.edges.map(([a, b], k) => {
      const A = P[a];
      const B = P[b];
      const dx = B.sx - A.sx;
      const dy = B.sy - A.sy;
      const depth = ((A.z + B.z) / 2 + 1) / 2;
      return { k, left: r1(A.sx), top: r1(A.sy - 0.5), width: r1(Math.hypot(dx, dy)), angle: r3(Math.atan2(dy, dx)), opacity: r2(0.05 + depth * 0.3) };
    });

    const nodes = [...P]
      .sort((p, q) => p.z - q.z)
      .map((p) => {
        const depth = (p.z + 1) / 2;
        const d = Math.max(2, (2 + depth * 5) * p.s * scale * (p.hot ? 1.5 : 1));
        return {
          i: p.i,
          left: r1(p.sx - d / 2),
          top: r1(p.sy - d / 2),
          d: r1(d),
          opacity: r2(0.22 + depth * 0.78),
          hot: p.hot,
          glow: r1(p.hot ? 10 * scale : depth * 6 * scale),
        };
      });

    const halos = P.filter((p) => p.hot).map((p) => {
      const depth = (p.z + 1) / 2;
      const k = (t * 0.9 + p.i * 0.37) % 1;
      const d = (10 + k * 22) * scale;
      return { i: p.i, left: r1(p.sx - d / 2), top: r1(p.sy - d / 2), d: r1(d), opacity: r2((1 - k) * (0.3 + depth * 0.6)) };
    });

    return { edges, nodes, halos };
  }, [t, size, highlights, speaking, speed]);

  // Positions change every frame, so geometry is inline; colours come from theme variables.
  return (
    <div aria-hidden className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      {frame.edges.map((e) => (
        <div
          key={`e${e.k}`}
          className="absolute h-px origin-[0_50%] bg-foreground"
          style={{ left: e.left, top: e.top, width: e.width, opacity: e.opacity, transform: `rotate(${e.angle}rad)` }}
        />
      ))}
      {frame.halos.map((h) => (
        <div
          key={`h${h.i}`}
          className="absolute rounded-full border-[1.5px] border-warning"
          style={{ left: h.left, top: h.top, width: h.d, height: h.d, opacity: h.opacity }}
        />
      ))}
      {frame.nodes.map((n) => (
        <div
          key={`n${n.i}`}
          className={cn('absolute rounded-full', n.hot ? 'bg-warning' : 'bg-foreground')}
          style={{
            left: n.left,
            top: n.top,
            width: n.d,
            height: n.d,
            opacity: n.opacity,
            boxShadow: `0 0 ${n.glow}px ${n.hot ? 'var(--warning)' : 'var(--foreground)'}`,
          }}
        />
      ))}
    </div>
  );
}
