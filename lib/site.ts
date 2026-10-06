// Site-wide facts and navigation. One name per action, used everywhere.
import { BRAND, SITE_URL } from './brand';

// The name follows the deployment's domain (see lib/brand.ts). Use it instead of writing a name.
export const SITE = {
  name: BRAND.name,
  shortName: BRAND.shortName,
  url: SITE_URL,
  description: `${BRAND.shortName} connects the tools, teams and data your company already runs into one operating layer, where AI agents handle the handoffs and people approve what matters.`,
} as const;

// Open Graph fields every page shares. Next replaces the layout's openGraph with a page's own
// instead of merging them, so a page that sets openGraph spreads this in first.
export const OPEN_GRAPH = { type: 'website', siteName: SITE.name, locale: 'en' } as const;

export const CTA = {
  book: { label: 'Book a free call', href: '/book#calendar' },
  product: { label: 'See the product', href: '/product' },
} as const;

export const NAV = [
  { label: 'Product', href: '/product' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Security', href: '/security' },
  { label: 'Company', href: '/company' },
] as const;

export const LEGAL = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const;
