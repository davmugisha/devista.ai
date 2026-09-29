import Link from 'next/link';
import { ButtonLink } from './Button';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { CTA, NAV } from '@/lib/site';

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper">
      <a
        href="#main"
        className="absolute left-4 top-2 -translate-y-16 rounded-control bg-ink px-3 py-2 text-sm text-paper focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-page items-center gap-3 px-4 md:px-8">
        <Logo wordmarkFrom="xs" />
        <nav aria-label="Main" className="ml-10 hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-chip text-sm font-medium text-graphite transition-colors duration-150 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ButtonLink href={CTA.book.href} size="sm" track="header" className="md:h-11 md:px-4">
            {CTA.book.label}
          </ButtonLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
