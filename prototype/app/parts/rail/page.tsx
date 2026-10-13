import type { Metadata } from 'next';
import { WebRail } from '@/components/web/WebRail';

export const metadata: Metadata = { title: 'Component · Web nav rail' };

/** The web app's left rail on its own, 248px wide with Marketplace current, like its board. */
export default function RailPart() {
  return (
    <main className="min-h-dvh bg-surface">
      <h1 className="sr-only">Component · Web nav rail</h1>
      <div className="w-[248px] max-w-full">
        <WebRail active="marketplace" responsive={false} />
      </div>
    </main>
  );
}
