import type { Metadata } from 'next';
import { MenuScreen } from '@/components/screens/phone-home/MenuScreen';

export const metadata: Metadata = { title: 'Menu' };

export default function PhoneMenuPage() {
  return <MenuScreen />;
}
