import type { Metadata } from 'next';
import { PreviewCanvas } from '@/components/screens/canvas/PreviewCanvas';
import { CANVAS_TITLE } from '@/lib/boards';

export const metadata: Metadata = {
  title: { absolute: `${CANVAS_TITLE} preview` },
  description: 'Every screen of the Saydeed app design, live, laid out like the design canvas.',
};

export default function PreviewPage() {
  return <PreviewCanvas />;
}
