import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Quicksand } from 'next/font/google';
import type { ReactNode } from 'react';
import { TOKENS } from '@/lib/tokens';
import { Providers } from './providers';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Saydeed app prototype', template: '%s · Saydeed app prototype' },
  description: 'A working prototype of the Saydeed app design. Every name, number and listing is example data.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: TOKENS.background,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`light ${quicksand.variable} ${jetbrainsMono.variable}`} data-theme="light">
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
