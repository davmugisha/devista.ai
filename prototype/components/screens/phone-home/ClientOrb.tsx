'use client';

// BrainOrb drawn only in the browser. Its geometry comes from Math.atan2 and friends, whose last
// digit differs between Node and Chrome, so a server-rendered orb never hydrates cleanly. Until the
// page has mounted, an empty square of the same size holds its place, then the orb fades in.

import { cn } from '@heroui/react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { BrainOrb, type BrainOrbProps } from '@/components/BrainOrb';

const noop = () => () => {};

/** False during the server render and hydration, true once the page runs in the browser. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export function ClientOrb({ size = 340, className, ...props }: BrainOrbProps) {
  const mounted = useMounted();
  if (!mounted) return <div aria-hidden className={cn('shrink-0', className)} style={{ width: size, height: size }} />;
  return <BrainOrb size={size} className={cn('animate-in duration-500 fade-in', className)} {...props} />;
}

/**
 * The largest square that fits the measured box, between `min` and `max` pixels. Starts at `max`
 * (the size on the 844px boards) and follows the box as the phone or window changes size.
 */
export function useFitSize<T extends HTMLElement>(max: number, min: number) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState(max);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const fit = Math.floor(Math.min(el.clientWidth, el.clientHeight));
      setSize(Math.max(min, Math.min(max, fit)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [max, min]);
  return [ref, size] as const;
}
