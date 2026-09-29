import type { Metadata, Viewport } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ClickTracker } from '@/components/ClickTracker';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SITE } from '@/lib/site';
import { COLOR } from '@/lib/tokens';
import './globals.css';

// Self-hosted at build time by next/font; the width axis gives the semi-condensed display cut.
const instrument = Instrument_Sans({
  // Only Latin is preloaded; Latin Extended still loads on demand via unicode-range.
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-instrument',
  display: 'swap',
});

// Vercel Web Analytics only exists on Vercel; elsewhere its script would 404.
// Preview deployments must never be indexed; production must be.
const noindex = (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') || process.env.SITE_NOINDEX === '1';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Devista AI: the operating layer between your systems',
    template: '%s | Devista AI',
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en',
  },
  twitter: { card: 'summary_large_image' },
  robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: COLOR.paper,
};

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icon.svg`,
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={instrument.variable}>
      <body>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <ClickTracker />
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
