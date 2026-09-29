'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { NAV } from '@/lib/site';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-11 items-center justify-center rounded-control text-ink hover:bg-mist"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
      </button>
      <nav
        id={id}
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-rule bg-paper shadow-float animate-arrive motion-reduce:animate-none"
      >
        <ul className="mx-auto flex max-w-page flex-col px-4 py-2 md:px-8">
          {NAV.map((item) => (
            <li key={item.href} className="border-b border-rule last:border-b-0">
              <Link
                href={item.href}
                prefetch={false}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex h-12 items-center text-md font-medium text-ink aria-[current=page]:text-signal"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
