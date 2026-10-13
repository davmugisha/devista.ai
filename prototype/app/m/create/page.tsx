import type { Metadata } from 'next';
import { CreateScreen } from '@/components/screens/phone-home/CreateScreen';

export const metadata: Metadata = { title: 'Create' };

export default function PhoneCreatePage() {
  return <CreateScreen />;
}
