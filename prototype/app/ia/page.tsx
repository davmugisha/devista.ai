import type { Metadata } from 'next';
import { InformationArchitecture } from '@/components/screens/canvas/InformationArchitecture';

export const metadata: Metadata = {
  title: 'Information architecture',
  description: 'How the Saydeed app is organised: one home, two ways to talk to the company, one place for everything that needs you.',
};

export default function IAPage() {
  return <InformationArchitecture />;
}
