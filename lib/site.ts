// Site-wide facts and navigation. One name per action, used everywhere.

export const SITE = {
  name: 'Devista AI',
  shortName: 'Devista',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://devista.ai').replace(/\/$/, ''),
  description:
    'Devista is a business operating system that connects the tools, teams and data a company already runs, with AI agents doing the work between them and people approving what matters.',
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
