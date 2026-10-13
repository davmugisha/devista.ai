import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PhoneApproval } from '@/components/screens/phone-inbox/PhoneApproval';
import { APPROVALS, getApproval } from '@/lib/data';

export function generateStaticParams() {
  return APPROVALS.map((a) => ({ approval: a.key }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ approval: string }> }): Promise<Metadata> {
  const { approval } = await params;
  return { title: getApproval(approval)?.title ?? 'Not found' };
}

export default async function PhoneApprovalPage({ params }: { params: Promise<{ approval: string }> }) {
  const { approval } = await params;
  const a = getApproval(approval);
  if (!a) notFound();
  // Keyed, so moving to the next decision starts with that decision's own drafts.
  return <PhoneApproval key={a.key} approvalKey={a.key} />;
}
