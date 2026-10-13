import type { Metadata } from 'next';
import { WebMarketplace } from '@/components/screens/web-market/WebMarketplace';
import { CATEGORIES, type CategoryKey } from '@/lib/data';

export const metadata: Metadata = { title: 'Marketplace' };

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const view = params.view === 'sell' ? 'sell' : 'buy';
  const category: CategoryKey = CATEGORIES.find((c) => c.key === params.category)?.key ?? 'all';
  // A new view or category in the URL (a breadcrumb, the Create menu) starts the page afresh.
  return <WebMarketplace key={`${view}:${category}`} initialView={view} initialCategory={category} />;
}
