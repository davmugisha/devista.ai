'use client';

import { useRef, type ReactNode } from 'react';

/**
 * Feeds the pointer position to the hero as --mx and --my (-1 to 1), which the tilt and
 * parallax classes turn into depth. Mouse and pen only; touch and reduced motion get the
 * still composition.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = ((e.clientY - r.top) / r.height) * 2 - 1;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      ref.current?.style.setProperty('--mx', x.toFixed(3));
      ref.current?.style.setProperty('--my', y.toFixed(3));
    });
  };

  const onLeave = () => {
    ref.current?.style.setProperty('--mx', '0');
    ref.current?.style.setProperty('--my', '0');
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
