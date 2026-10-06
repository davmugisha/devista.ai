'use client';

import { usePathname } from 'next/navigation';
import { ButtonLink } from './Button';
import { CTA } from '@/lib/site';

/** The header's primary action, everywhere except the booking page, where the form is the action. */
export function HeaderCta() {
  const pathname = usePathname();
  if (pathname === '/book') return null;
  return (
    <ButtonLink href={CTA.book.href} size="sm" track="header" className="md:h-11">
      {CTA.book.label}
    </ButtonLink>
  );
}
