import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ListingScreen } from '@/components/screens/phone-market/ListingScreen';
import { LISTINGS, getListing } from '@/lib/data';

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ listing: l.key }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ listing: string }> }): Promise<Metadata> {
  const { listing } = await params;
  return { title: getListing(listing)?.title ?? 'Not found' };
}

export default async function PhoneListingPage({ params }: { params: Promise<{ listing: string }> }) {
  const { listing } = await params;
  const item = getListing(listing);
  if (!item) notFound();
  return <ListingScreen listingKey={item.key} />;
}
