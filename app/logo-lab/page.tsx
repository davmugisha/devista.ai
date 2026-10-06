import type { Metadata } from 'next';
import { BRAND } from '@/lib/brand';
import { LogoLab } from './LogoLab';

export const metadata: Metadata = {
  title: 'Logo concepts',
  description: 'A working comparison of refined references and two new logo directions.',
  robots: { index: false, follow: false },
};

export default function LogoLabPage() {
  return <LogoLab initialBrand={BRAND.domain === 'saydeed.com' ? 'saydeed' : 'devista'} />;
}
