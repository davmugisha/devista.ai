import type { Metadata } from 'next';
import { WebHome } from '@/components/screens/web-home/WebHome';

export const metadata: Metadata = { title: 'Home' };

export default function HomePage() {
  return <WebHome />;
}
