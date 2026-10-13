'use client';

// The web Marketplace (WebMarketplace.dc.html). Buy browses what other companies built; Sell is
// what this company lists. The board opens a listing in place; here every card links to its own
// page, so listings can be shared and reloaded. The chosen view and category are kept in the URL
// (?view=sell, ?category=pipelines) so a reload or a breadcrumb lands in the same place.

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/icons';
import { WebPage } from '@/components/web/WebPage';
import type { CategoryKey } from '@/lib/data';
import { BuyView } from './BuyView';
import { SellerView } from './SellerView';
import { marketHref } from './parts';

export type MarketView = 'buy' | 'sell';

export function WebMarketplace({ initialView, initialCategory }: { initialView: MarketView; initialCategory: CategoryKey }) {
  const [view, setView] = useState<MarketView>(initialView);
  const [category, setCategory] = useState<CategoryKey>(initialCategory);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const href = view === 'sell' ? marketHref({ view: 'sell' }) : marketHref({ category });
    if (window.location.pathname + window.location.search !== href) window.history.replaceState(null, '', href);
  }, [view, category]);

  return (
    <WebPage className="gap-8 leading-[normal]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-2.5">
          <h1 className="m-0 text-[34px] leading-[1.1] font-bold tracking-[-0.01em]">Marketplace</h1>
          <p className="m-0 max-w-[62ch] text-[17px] leading-normal font-semibold text-ink-3">
            Workflows, agents, skills, pipelines and tools that other companies built and run on Saydeed, and experts who set them up for you.
            Everything you add runs under your approvals.
          </p>
        </div>
        <ToggleButtonGroup
          aria-label="Buy or sell"
          selectionMode="single"
          disallowEmptySelection
          isDetached
          fullWidth
          selectedKeys={[view]}
          onSelectionChange={(keys) => {
            const next = [...keys][0];
            if (next === 'buy' || next === 'sell') setView(next);
          }}
          className="segmented-accent h-[52px] flex-[0_1_280px] gap-1 p-1 shadow-[inset_0_0_0_1px_var(--border)]"
        >
          <ToggleButton id="buy" className="h-11 gap-2 text-[15px] [&_svg]:size-[18px]">
            <Icon name="bag" size={18} />
            Buy
          </ToggleButton>
          <ToggleButton id="sell" className="h-11 gap-2 text-[15px] [&_svg]:size-[18px]">
            <Icon name="tag" size={18} />
            Sell
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {view === 'buy' ? <BuyView category={category} onCategory={setCategory} query={query} onQuery={setQuery} /> : <SellerView />}
    </WebPage>
  );
}
