import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PhoneFrame } from '@/components/phone/PhoneFrame';

export const metadata: Metadata = {
  title: { default: 'Phone', template: '%s · Phone · Saydeed app prototype' },
};

export default function PhoneLayout({ children }: { children: ReactNode }) {
  return <PhoneFrame>{children}</PhoneFrame>;
}
