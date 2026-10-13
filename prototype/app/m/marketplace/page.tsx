import type { Metadata } from 'next';
import { MarketplaceScreen } from '@/components/screens/phone-market/MarketplaceScreen';

export const metadata: Metadata = { title: 'Marketplace' };

export default function PhoneMarketplacePage() {
  return <MarketplaceScreen />;
}
