import type { Metadata } from 'next';
import { connection } from 'next/server';
import { PhoneInbox } from '@/components/screens/phone-inbox/PhoneInbox';

export const metadata: Metadata = { title: 'Inbox' };

export default async function PhoneInboxPage() {
  // Rendered per request, so the screen reads ?filter= on the server too and arrives on the
  // right chip with no flash.
  await connection();
  return <PhoneInbox />;
}
