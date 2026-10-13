import type { Metadata } from 'next';
import { BrainOrb } from '@/components/BrainOrb';
import { ClientOnly } from '@/components/screens/canvas/ClientOnly';

export const metadata: Metadata = { title: 'Component · Brain orb' };

/** The Brain orb on its own, at the 340 × 340 size of its board. */
export default function BrainPart() {
  return (
    <main className="min-h-dvh bg-surface">
      <h1 className="sr-only">Component · Brain orb</h1>
      <ClientOnly fallback={<div className="size-[340px]" />}>
        <BrainOrb size={340} />
      </ClientOnly>
    </main>
  );
}
