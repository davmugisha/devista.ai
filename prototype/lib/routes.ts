// Every route in the prototype. Screens link through these helpers, never by typing a path.

import type { ApprovalKey, InboxFilter, ListingKey, SectionKey, ThreadKey, WebTarget } from './data';

export const web = {
  home: '/',
  inbox: (item?: ApprovalKey | ThreadKey) => (item ? `/inbox?item=${item}` : '/inbox'),
  marketplace: '/marketplace',
  listing: (key: ListingKey) => `/marketplace/${key}`,
  sell: '/marketplace/sell',
  section: (key: SectionKey) => `/${key}`,
} as const;

export const phone = {
  home: '/m',
  dashboard: '/m/dashboard',
  chat: '/m/chat',
  call: '/m/call',
  menu: '/m/menu',
  inbox: (filter?: InboxFilter) => (filter && filter !== 'all' ? `/m/inbox?filter=${filter}` : '/m/inbox'),
  approval: (key: ApprovalKey) => `/m/inbox/${key}`,
  create: '/m/create',
  marketplace: '/m/marketplace',
  listing: (key: ListingKey) => `/m/marketplace/${key}`,
  sell: '/m/marketplace/sell',
  section: (key: SectionKey) => `/m/${key}`,
} as const;

export const docs = {
  ia: '/ia',
  preview: '/preview',
  brain: '/parts/brain',
  rail: '/parts/rail',
  topBar: '/parts/top-bar',
} as const;

/** Where a search result or Create menu entry goes on the web. */
export function webHref(target: WebTarget | 'cos', item?: string): string {
  switch (target) {
    case 'home':
      return web.home;
    case 'inbox':
      return web.inbox(item as ApprovalKey | undefined);
    case 'marketplace':
      return item ? web.listing(item as ListingKey) : web.marketplace;
    case 'sell':
      return web.sell;
    case 'cos':
      return web.inbox('cos');
  }
}

/** Is `pathname` the page `href` or inside it? */
export function isActive(pathname: string, href: string): boolean {
  if (href === '/' || href === '/m') return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}
