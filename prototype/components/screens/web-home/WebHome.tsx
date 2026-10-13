'use client';

// Web Home (WebHome.dc.html): the morning greeting with the live count of decisions, then what
// needs the owner, the numbers, the agents, and beside them the Brain Map and a Marketplace
// suggestion. Below about 870px the right column drops under the main one.

import { WebPage } from '@/components/web/WebPage';
import { COMPANY, TODAY, USER } from '@/lib/data';
import { needYouLabel, usePrototype } from '@/lib/store';
import { AgentsAtWork } from './AgentsAtWork';
import { BrainMapCard, MarketplaceSuggestion } from './HomeAside';
import { NeedsYouCard } from './NeedsYouCard';
import { TodayNumbers } from './TodayNumbers';

export function WebHome() {
  const { pendingCount } = usePrototype();
  return (
    <WebPage className="leading-[normal]">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[34px] leading-[1.15] font-bold tracking-[-0.01em]">Good morning, {USER.firstName}</h1>
        <p className="text-[16px] font-semibold text-ink-3">
          {TODAY.long} · {COMPANY.name} · {COMPANY.working} agents at work,{' '}
          <span className="font-bold text-warning">{needYouLabel(pendingCount)}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-6">
          <NeedsYouCard />
          <TodayNumbers />
          <AgentsAtWork />
        </div>
        <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-6">
          <BrainMapCard />
          <MarketplaceSuggestion />
        </aside>
      </div>
    </WebPage>
  );
}
