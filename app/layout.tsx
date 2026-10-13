import type { Metadata, Viewport } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ClickTracker } from '@/components/ClickTracker';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { RevealObserver } from '@/components/RevealObserver';
import { OPEN_GRAPH, SITE } from '@/lib/site';
import { COLOR_DARK } from '@/lib/tokens';
import './globals.css';

// Self-hosted at build time by next/font.
const instrument = Instrument_Sans({
  // Only Latin is preloaded; Latin Extended still loads on demand via unicode-range.
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

// Vercel Web Analytics only exists on Vercel; elsewhere its script would 404.
// Preview deployments must never be indexed; production must be.
const noindex = (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') || process.env.SITE_NOINDEX === '1';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: OPEN_GRAPH,
  twitter: { card: 'summary_large_image' },
  robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: COLOR_DARK.paper,
  colorScheme: 'dark',
};

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/apple-icon`,
  description: SITE.description,
};

// Runs before first paint: arms the scroll reveal, and disarms it if RevealObserver has not
// started within three seconds, so a failed script can never leave content hidden.
// The page is served dark (data-theme on <html>). The script restores a saved light choice (the
// footer switch, components/ThemeToggle.tsx) before anything is painted, so it never flashes dark.
const REVEAL_SCRIPT =
  "(function(){var d=document.documentElement;d.setAttribute('data-reveal-ready','');" +
  "try{if(localStorage.getItem('theme')==='light')d.removeAttribute('data-theme')}catch(e){}" +
  "setTimeout(function(){if(!window.__reveal)d.removeAttribute('data-reveal-ready')},3000)})()";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={instrument.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
      </head>
      <body>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <ClickTracker />
        <RevealObserver />
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
