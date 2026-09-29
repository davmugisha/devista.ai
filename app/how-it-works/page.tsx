import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'Six stages take you from the first conversation to a department running on Devista, with a fixed scope and a clear decision at each step.',
  alternates: { canonical: '/how-it-works' },
};

export default function Page() {
  return <PageIntro title="Start with one department. Expand when it proves itself." lede="Six stages take you from the first conversation to a department running on Devista, with a fixed scope and a clear decision at each step." />;
}
