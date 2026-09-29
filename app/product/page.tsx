import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';

export const metadata: Metadata = {
  title: 'Product',
  description: 'See what your teams will use: the command center, the departments you choose, the AI agents that work inside them, and the approvals that keep people in charge.',
  alternates: { canonical: '/product' },
};

export default function Page() {
  return <PageIntro title="One command center over the systems you already run." lede="See what your teams will use: the command center, the departments you choose, the AI agents that work inside them, and the approvals that keep people in charge." />;
}
