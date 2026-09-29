import Link from 'next/link';
import { ButtonLink } from './Button';
import { Mark } from './Logo';
import { CTA, LEGAL, NAV } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-rule bg-mist">
      <div className="mx-auto grid max-w-page gap-12 px-4 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2">
            <Mark />
            <span className="text-lg font-semibold tracking-snug wdth-display">Devista</span>
          </div>
          <p className="mt-4 max-w-measure text-sm text-graphite">
            A business operating system for established companies. People command, AI executes, and every step is on
            record.
          </p>
          <ButtonLink href={CTA.book.href} track="footer" className="mt-6">
            {CTA.book.label}
          </ButtonLink>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-6 md:col-start-7">
          <div>
            <h2 className="text-sm font-semibold">Site</h2>
            <ul className="mt-3 space-y-2">
              {[{ label: 'Home', href: '/' }, ...NAV].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-graphite hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Get in touch</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href={CTA.book.href} className="text-sm text-graphite hover:text-ink" data-track="footer-contact">
                  {CTA.book.label}
                </Link>
              </li>
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-graphite hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-rule">
        <p className="mx-auto max-w-page px-4 py-6 text-xs text-slate md:px-8">
          Copyright {new Date().getFullYear()} Devista AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
