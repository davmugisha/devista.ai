import Link from 'next/link';
import { HeaderCta } from './HeaderCta';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NAV } from '@/lib/site';

export function Header() {
  return (
    <header className="sticky top-3 z-30 mx-3 rounded-dot border border-rule/80 bg-mist/85 shadow-float backdrop-blur-md md:mx-auto md:max-w-heading">
      <a
        href="#main"
        className="absolute left-4 top-2 -translate-y-16 rounded-control bg-ink px-3 py-2 text-sm text-paper focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 items-center gap-3 px-4 md:px-6">
        <Logo wordmarkFrom="xs" />
        <div className="ml-auto flex items-center gap-2 lg:gap-6">
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="rounded-chip text-sm font-medium text-graphite transition-colors duration-150 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <HeaderCta />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
