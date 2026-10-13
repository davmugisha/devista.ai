// The web app frame from the boards: the rail on the left and the top bar over the page. The two
// columns wrap, so below about 800px the rail sits above the page as a row.

import type { ReactNode } from 'react';
import { WebRail } from './WebRail';
import { WebTopBar } from './WebTopBar';

export function WebShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full flex-wrap items-stretch bg-background text-foreground">
      <div className="min-w-0 grow basis-[248px] border-border bg-surface max-md:border-b md:max-w-[248px] md:border-r">
        <WebRail />
      </div>
      <div className="flex min-w-0 grow-[999] basis-[560px] flex-col">
        <WebTopBar />
        {children}
      </div>
    </div>
  );
}
