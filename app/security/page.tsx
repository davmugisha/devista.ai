import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';

export const metadata: Metadata = {
  title: 'Security and control',
  description: 'People approve what matters, agents act only within the rules and access you grant, and every action is recorded.',
  alternates: { canonical: '/security' },
};

export default function Page() {
  return <PageIntro title="AI that works inside the permissions you set." lede="People approve what matters, agents act only within the rules and access you grant, and every action is recorded." />;
}
