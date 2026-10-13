// The design canvas (extracted/saydeed-app/project/canvas.json) mapped to prototype routes.
// The preview page lays these out like the original preview.html, and the checks in
// .unlazy/app-prototype-2026-10-11 compare each route with its board. No imports, so plain
// Node can load this file too.

export type BoardKind = 'doc' | 'phone' | 'web' | 'part';

export interface Board {
  file: string;
  route: string;
  title: string;
  kind: BoardKind;
  w: number;
  h: number;
  x: number;
  y: number;
}

export const CANVAS_TITLE = 'Saydeed App';

/** In canvas order. */
export const BOARDS: Board[] = [
  { file: 'IA.dc.html', route: '/ia', title: '00 · Information architecture', kind: 'doc', w: 1800, h: 1220, x: 0, y: 0 },
  { file: 'Main.dc.html', route: '/m', title: '01 · Brain Map (home)', kind: 'phone', w: 390, h: 844, x: 0, y: 1600 },
  { file: 'Dashboard.dc.html', route: '/m/dashboard', title: '02 · Dashboard', kind: 'phone', w: 390, h: 844, x: 470, y: 1600 },
  { file: 'Chat.dc.html', route: '/m/chat', title: '03 · Let’s Chat · Chief of Staff', kind: 'phone', w: 390, h: 844, x: 940, y: 1600 },
  { file: 'Call.dc.html', route: '/m/call', title: '04 · Interactive Call', kind: 'phone', w: 390, h: 844, x: 1410, y: 1600 },
  { file: 'Brain.dc.html', route: '/parts/brain', title: 'Component · Brain orb', kind: 'part', w: 340, h: 340, x: 1880, y: 1600 },
  { file: 'Sidebar.dc.html', route: '/m/menu', title: '05 · Sidebar (Work | Code)', kind: 'phone', w: 390, h: 844, x: 0, y: 2824 },
  { file: 'Hub.dc.html', route: '/m/inbox', title: '06 · Inbox', kind: 'phone', w: 390, h: 844, x: 470, y: 2824 },
  { file: 'Approval.dc.html', route: '/m/inbox/remind', title: '07 · Approval', kind: 'phone', w: 390, h: 844, x: 940, y: 2824 },
  { file: 'Create.dc.html', route: '/m/create', title: '08 · Create', kind: 'phone', w: 390, h: 844, x: 1410, y: 2824 },
  { file: 'Marketplace.dc.html', route: '/m/marketplace', title: '09 · Marketplace', kind: 'phone', w: 390, h: 844, x: 0, y: 4048 },
  { file: 'MarketItem.dc.html', route: '/m/marketplace/invoice-chaser', title: '10 · Listing', kind: 'phone', w: 390, h: 844, x: 470, y: 4048 },
  { file: 'MarketSell.dc.html', route: '/m/marketplace/sell', title: '11 · Sell what you built', kind: 'phone', w: 390, h: 844, x: 940, y: 4048 },
  { file: 'WebMarketplace.dc.html', route: '/marketplace', title: '14 · Web · Marketplace', kind: 'web', w: 1440, h: 1294, x: 3040, y: 5272 },
  { file: 'WebMarketItem.dc.html', route: '/marketplace/invoice-chaser', title: '15 · Web · Listing', kind: 'web', w: 1440, h: 960, x: 4560, y: 5272 },
  { file: 'WebMarketSell.dc.html', route: '/marketplace/sell', title: '16 · Web · Sell', kind: 'web', w: 1440, h: 1451, x: 6080, y: 5272 },
  { file: 'WebRail.dc.html', route: '/parts/rail', title: 'Component · Web nav rail', kind: 'part', w: 248, h: 819, x: 7600, y: 5272 },
  { file: 'WebHome.dc.html', route: '/', title: '12 · Web · Home', kind: 'web', w: 1440, h: 1053, x: 0, y: 5272 },
  { file: 'WebInbox.dc.html', route: '/inbox', title: '13 · Web · Inbox', kind: 'web', w: 1440, h: 1049, x: 1520, y: 5272 },
  { file: 'WebTopBar.dc.html', route: '/parts/top-bar', title: 'Component · Web top bar', kind: 'part', w: 1192, h: 72, x: 7928, y: 5272 },
];

/** Row titles on the canvas. */
export const NOTES: { text: string; x: number; y: number }[] = [
  { text: 'Saydeed · mobile-first, with web', x: 0, y: -260 },
  { text: 'Home and the dock: Brain, Dashboard, Chat, Call', x: 0, y: 1340 },
  { text: 'Menu, Inbox and decisions', x: 0, y: 2564 },
  { text: 'Marketplace: buy, sell, list', x: 0, y: 3788 },
  { text: 'Web: the app with a left rail and top bar', x: 0, y: 5012 },
];
