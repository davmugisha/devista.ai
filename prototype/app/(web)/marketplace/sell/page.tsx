import type { Metadata } from 'next';
import { WebMarketSell } from '@/components/screens/web-market/WebMarketSell';

export const metadata: Metadata = { title: 'Sell something you built' };

export default function SellPage() {
  return <WebMarketSell />;
}
