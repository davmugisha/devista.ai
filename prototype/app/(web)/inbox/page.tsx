import type { Metadata } from 'next';
import { WebInbox } from '@/components/screens/web-home/WebInbox';
import { isInboxKey } from '@/components/screens/web-home/inbox-items';

export const metadata: Metadata = { title: 'Inbox' };

/** /inbox opens on the first decision; /inbox?item=<decision or conversation> opens that one. */
export default async function InboxPage({ searchParams }: { searchParams: Promise<{ item?: string | string[] }> }) {
  const { item } = await searchParams;
  return <WebInbox item={isInboxKey(item) ? item : undefined} />;
}
