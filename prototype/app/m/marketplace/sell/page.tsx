import type { Metadata } from 'next';
import { SellScreen } from '@/components/screens/phone-market/SellScreen';

export const metadata: Metadata = { title: 'Sell on Marketplace' };

export default function PhoneSellPage() {
  return <SellScreen />;
}
