import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PhoneChat } from '@/components/screens/phone-inbox/PhoneChat';
import { PhoneThread } from '@/components/screens/phone-inbox/PhoneThread';
import { getThread } from '@/lib/data';

type Search = Promise<{ thread?: string | string[] }>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const key = first((await searchParams).thread);
  if (!key || key === 'cos') return { title: 'Chief of Staff' };
  return { title: getThread(key)?.title ?? 'Not found' };
}

/** /m/chat is Chief of Staff; /m/chat?thread=<key> opens any other Inbox conversation. */
export default async function PhoneChatPage({ searchParams }: { searchParams: Search }) {
  const key = first((await searchParams).thread);
  if (!key || key === 'cos') return <PhoneChat />;
  const thread = getThread(key);
  if (!thread) notFound();
  return <PhoneThread key={thread.key} threadKey={thread.key} />;
}
