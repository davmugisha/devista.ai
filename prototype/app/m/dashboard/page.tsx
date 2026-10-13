import type { Metadata } from 'next';
import { DashboardScreen } from '@/components/screens/phone-home/DashboardScreen';

export const metadata: Metadata = { title: 'Dashboard' };

export default function PhoneDashboardPage() {
  return <DashboardScreen />;
}
