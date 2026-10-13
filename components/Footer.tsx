import Link from 'next/link';
import { ButtonLink } from './Button';
import { ContactLink } from './ContactLink';
import { Logo } from './Logo';
import { NewsletterForm } from './NewsletterForm';
import { SocialLinks } from './SocialLinks';
import { ThemeToggle } from './ThemeToggle';
import { CTA, LEGAL, SITE } from '@/lib/site';

// Two balanced groups, so the columns pair up on a phone. Every link goes somewhere different;
// booking is the button beside them.
const GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/product' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Example workflows', href: '/how-it-works#workflows' },
      { label: 'Pricing', href: '/#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '/company' },
      { label: 'Security', href: '/security' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-rule bg-mist">
      <div className="mx-auto max-w-page px-4 pt-16 md:px-8 md:pt-20">
        <section
          aria-labelledby="newsletter-title"
          className="card grid gap-6 p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12"
        >
          <div>
            <h2 id="newsletter-title" className="text-2xl font-display tracking-display text-ink">
              Get updates by email
            </h2>
            <p className="mt-3 max-w-measure text-sm text-graphite">
              Occasional notes on handing repeat work to AI agents, plus news from {SITE.shortName}.
            </p>
          </div>
          <NewsletterForm />
        </section>
      </div>
      <div className="mx-auto grid max-w-page gap-12 px-4 py-16 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16 md:px-8 md:py-20">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-graphite">{SITE.description}</p>
          <ButtonLink href={CTA.book.href} size="sm" track="footer" className="mt-6">
            {CTA.book.label}
          </ButtonLink>
          <p className="mt-4 text-sm text-graphite">
            Prefer email? Write to <ContactLink />
          </p>
          <SocialLinks className="mt-8" />
        </div>
        <div className="grid grid-cols-2 gap-8 md:gap-16">
          {GROUPS.map((group) => (
            <nav key={group.title} aria-labelledby={`footer-${group.title.toLowerCase()}`}>
              <h2 id={`footer-${group.title.toLowerCase()}`} className="text-xs font-semibold uppercase tracking-wide text-ink">
                {group.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} prefetch={false} className="rounded-chip text-sm text-graphite transition-colors hover:text-signal-bright">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-slate md:px-8">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <nav aria-label="Legal">
              <ul className="flex items-center gap-6">
                {LEGAL.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} prefetch={false} className="rounded-chip hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
