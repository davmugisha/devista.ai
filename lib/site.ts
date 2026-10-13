// Site-wide facts and navigation. One name per action, used everywhere.
import { BRAND, SITE_URL } from './brand';

// Use SITE instead of writing the brand name (see lib/brand.ts).
export const SITE = {
  name: BRAND.name,
  shortName: BRAND.shortName,
  url: SITE_URL,
  // David's pitch in short (2026-10-11): the leak, one system of people and agents, people in
  // control, fixed in 7 days. No ROI multiple until a paying client's result can back it.
  tagline: 'Plug the hours leaking between your tools in 7 days.',
  description: `${BRAND.shortName} makes your team and AI agents one system. Agents do the repeat work in every department, around the clock, and your people approve what goes out. Installed in 7 days, fixed price, paid upfront, from US$1,500.`,
} as const;

// The one public contact address. The footer, the booking and legal pages link to it, and every
// booking is copied to it as a guest (lib/booking-event.ts). Change it here and nowhere else.
export const CONTACT = { email: 'david@saydeed.com' } as const;

// The founder, named on the home page, the company page and the booking card (David's choice on
// 2026-10-11). Put the photo in public/founder/ and set `photo` to its path, for example
// '/founder/david.jpg'. Until then a labelled placeholder shows.
export const FOUNDER = {
  name: 'David Mugisha',
  initials: 'DM',
  role: `Founder of ${BRAND.shortName}`,
  photo: '/founder/david-mugisha.jpg' as string,
  facts: [
    'Runs every free call and leads every install',
    'Full stack developer and designer',
    `Builds ${BRAND.shortName} Work, the software your agents run on`,
    'Based in Rwanda. Calls are booked in your time zone',
  ],
} as const;

// Open Graph fields every page shares. Next replaces the layout's openGraph with a page's own
// instead of merging them, so a page that sets openGraph spreads this in first.
export const OPEN_GRAPH = { type: 'website', siteName: SITE.name, locale: 'en' } as const;

export const CTA = {
  book: { label: 'Book a free call', href: '/book#calendar' },
  product: { label: 'See the product', href: '/product' },
  how: { label: 'See how it works', href: '/#how-it-works' },
} as const;

export const NAV = [
  { label: 'Product', href: '/product' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Security', href: '/security' },
  { label: 'Company', href: '/company' },
] as const;

export const LEGAL = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const;
