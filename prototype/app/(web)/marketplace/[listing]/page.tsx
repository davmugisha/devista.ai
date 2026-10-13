import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WebMarketItem } from '@/components/screens/web-market/WebMarketItem';
import { LISTINGS, getListing } from '@/lib/data';

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ listing: l.key }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ listing: string }> }): Promise<Metadata> {
  const { listing } = await params;
  return { title: getListing(listing)?.title ?? 'Not found' };
}

export default async function ListingPage({ params }: { params: Promise<{ listing: string }> }) {
  const { listing: key } = await params;
  const listing = getListing(key);
  if (!listing) notFound();
  // A new listing starts with its own first plan and stage.
  return <WebMarketItem key={listing.key} listing={listing} />;
}
