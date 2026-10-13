import type { Metadata } from 'next';
import { HomeScreen } from '@/components/screens/phone-home/HomeScreen';

export const metadata: Metadata = { title: 'Brain Map' };

export default function PhoneHomePage() {
  return <HomeScreen />;
}
