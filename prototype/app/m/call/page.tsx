import type { Metadata } from 'next';
import { CallScreen } from '@/components/screens/phone-home/CallScreen';

export const metadata: Metadata = { title: 'Call with Chief of Staff' };

export default function PhoneCallPage() {
  return <CallScreen />;
}
