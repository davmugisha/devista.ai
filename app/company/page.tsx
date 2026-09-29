import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';

export const metadata: Metadata = {
  title: 'Company',
  description: 'Devista builds the operating layer that lets established companies run as one, with people in command and AI doing the work between systems.',
  alternates: { canonical: '/company' },
};

export default function Page() {
  return <PageIntro title="The people behind Devista." lede="Devista builds the operating layer that lets established companies run as one, with people in command and AI doing the work between systems." />;
}
