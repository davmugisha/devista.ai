// Every brand this site can be served as. The domain in NEXT_PUBLIC_SITE_URL picks one at build
// time, so the logo, favicon, social images and copy follow the domain the site runs on.
// Each mark is solid one-colour paths in a 64 by 64 box, shared by the website, the favicon and
// the generated social images so it stays identical everywhere.

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

const BRANDS: readonly Brand[] = [
  {
    domain: 'devista.ai',
    name: 'Devista AI',
    shortName: 'Devista',
    // A rising pair of bars and an open D.
    mark: [
      'M5 39c0-3 1.8-5.4 4.6-7l5.2-2.9c1.1-.6 2.2.1 2.2 1.4V60H5V39Z',
      'M20 30.4c0-1.2.6-2.2 1.7-2.8l6.3-3.7c1-.6 2 .1 2 1.3V60H20V30.4Z',
      'M23 5.8c0-1.2 1.1-1.9 2.2-1.5l17.3 7C54.3 16 61 24.2 61 35.2 61 49.5 50.4 60 36 60h-2V50h2.6C45.4 50 52 43.8 52 35.2c0-7.2-4.3-12.7-12.9-16.2L23 12.6V5.8Z',
    ],
    social: [],
  },
  {
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
  },
];

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || `https://${BRANDS[0].domain}`).replace(/\/$/, '');

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export const BRAND: Brand = BRANDS.find((brand) => brand.domain === domainOf(SITE_URL)) ?? BRANDS[0];
export const BRAND_MARK_PATHS = BRAND.mark;
