'use client';

import { motion, useReducedMotion, useSpring } from 'framer-motion';
import type { ComponentProps, PointerEvent } from 'react';
import { ButtonLink } from './Button';

type Props = ComponentProps<typeof ButtonLink>;

/** A small pointer response around the real link; keyboard and touch keep the link still. */
export function MagneticButtonLink(props: Props) {
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 20 });
  const y = useSpring(0, { stiffness: 260, damping: 20 });

  function move(event: PointerEvent<HTMLSpanElement>) {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      <ButtonLink {...props} />
    </motion.span>
  );
}
