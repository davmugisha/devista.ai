// Site-wide facts and navigation. One name per action, used everywhere.

export const SITE = {
  name: 'Devista AI',
  shortName: 'Devista',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://devista.ai').replace(/\/$/, ''),
  description:
    'Devista connects the tools, teams and data your company already runs into one operating layer, where AI agents handle the handoffs and people approve what matters.',
} as const;

export const CTA = {
  book: { label: 'Book an operations audit', href: '/book' },
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
