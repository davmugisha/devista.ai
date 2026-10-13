// The one brand this site is served as: its name, mark and social profiles. The mark is solid
// one-colour paths in a 64 by 64 box, shared by the website, the favicon and the generated social
// images so it stays identical everywhere. Use SITE (lib/site.ts) in copy instead of the name.

export type SocialNetwork = 'instagram' | 'linkedin' | 'x';

export type Brand = {
  /** The registered domain, without www. */
  domain: string;
  /** The full name: page titles, copyright and structured data. */
  name: string;
  /** The wordmark, and the name in running copy. */
  shortName: string;
  mark: readonly string[];
  /** Profiles linked from the footer, in this order. A network with no entry shows no icon. */
  social: readonly { network: SocialNetwork; href: string }[];
};

export const BRAND: Brand = {
  domain: 'saydeed.com',
  name: 'Saydeed',
  shortName: 'Saydeed',
  // An S cut from a slashed ring: two hooks, each ending in a pointed tip, split by one
  // diagonal channel.
  mark: [
    'M7,32c0,-13.81 11.19,-25 25,-25l20.05,0l-27.47,27.47l-4.6,-4.6l15.96,-15.96c-1.27,-0.28 -2.59,-0.42 -3.94,-0.42c-10.22,0 -18.5,8.28 -18.5,18.5c0,3.84 1.17,7.41 3.18,10.37l-4.66,4.66c-3.15,-4.18 -5.02,-9.39 -5.02,-15.03z',
    'M57,32c0,13.81 -11.19,25 -25,25l-20.05,0l27.47,-27.47l4.6,4.6l-15.96,15.96c1.27,0.28 2.59,0.42 3.94,0.42c10.22,0 18.5,-8.28 18.5,-18.5c0,-3.84 -1.17,-7.41 -3.18,-10.37l4.66,-4.66c3.15,4.18 5.02,9.39 5.02,15.03z',
  ],
  // Handles chosen by the owner on 2026-10-06.
  social: [
    { network: 'instagram', href: 'https://www.instagram.com/saydeed/' },
    { network: 'linkedin', href: 'https://www.linkedin.com/company/saydeed/' },
    { network: 'x', href: 'https://x.com/saydeed' },
  ],
};

/** The public address, read at build time. Defaults to the brand's domain; no trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || `https://${BRAND.domain}`).replace(/\/$/, '');
