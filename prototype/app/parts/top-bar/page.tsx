import type { Metadata } from 'next';
import { WebTopBar } from '@/components/web/WebTopBar';

export const metadata: Metadata = { title: 'Component · Web top bar' };

/** The web app's top bar on its own, full width, like its board. */
export default function TopBarPart() {
  return (
    <main className="min-h-dvh bg-surface">
      <h1 className="sr-only">Component · Web top bar</h1>
      <WebTopBar />
    </main>
  );
}
