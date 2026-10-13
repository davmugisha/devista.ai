'use client';

// Small pieces the three web Marketplace screens share: the breadcrumb with its back pill, the
// kind chip, step numbers, check dots, the Chief of Staff tile, status chips and cards that are
// links.

import { Breadcrumbs, Card, Chip, Radio, cn } from '@heroui/react';
import Link from 'next/link';
import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react';
import { Icon } from '@/components/icons';
import { InitialsTile } from '@/components/ui';
import { CATEGORIES, type CategoryKey, type ListingKind } from '@/lib/data';
import { web } from '@/lib/routes';

/** The Marketplace with a view or category already chosen (deep links and back links). */
export function marketHref(opts: { view?: 'sell'; category?: CategoryKey } = {}): string {
  const params = new URLSearchParams();
  if (opts.view) params.set('view', opts.view);
  if (opts.category && opts.category !== 'all') params.set('category', opts.category);
  const query = params.toString();
  return query ? `${web.marketplace}?${query}` : web.marketplace;
}

/** The category a listing kind is browsed under ("Agents + skills" holds agents and skills). */
export function categoryOf(kind: ListingKind): CategoryKey {
  return CATEGORIES.find((c) => c.kinds?.includes(kind))?.key ?? 'all';
}

/**
 * Marketplace / … / current page. The first crumb is the white back pill from the boards; the
 * last is the page itself. Separators are the boards' slashes.
 */
export function MarketBreadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <Breadcrumbs
        separator={<span aria-hidden>/</span>}
        className={cn(
          'min-w-0 flex-nowrap gap-2.5 text-[14px] font-bold text-muted',
          '[&_[data-slot=breadcrumbs-item]]:gap-2.5',
          // On narrow screens the current page's name shortens instead of wrapping under a slash.
          '[&_[data-slot=breadcrumbs-item]:last-child]:min-w-0 [&_[data-slot=breadcrumbs-item]:last-child]:shrink',
          '[&_[data-current=true]]:block [&_[data-current=true]]:w-auto [&_[data-current=true]]:min-w-0 [&_[data-current=true]]:truncate',
          '[&_[data-slot=breadcrumbs-separator]]:size-auto [&_[data-slot=breadcrumbs-separator]]:text-muted',
          '[&_[data-slot=link]]:text-[14px] [&_[data-slot=link]]:font-bold [&_[data-slot=link]]:text-muted',
          '[&_[data-current=true]]:text-ink-2',
        )}
      >
        <Breadcrumbs.Item href={web.marketplace}>
          <span className="flex h-10 items-center gap-1.5 rounded-full bg-surface pr-4 pl-2.5 text-foreground transition-colors hover:bg-accent-soft">
            <Icon name="back" size={18} />
            Marketplace
          </span>
        </Breadcrumbs.Item>
        {trail.map((crumb) => (
          <Breadcrumbs.Item key={crumb.label} href={crumb.href}>
            {crumb.label}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>
    </nav>
  );
}

/** "Workflow", "Expert": the small rounded label on cards and in the listing header. */
export function KindChip({ children, tone = 'inset', className }: { children: ReactNode; tone?: 'inset' | 'accent'; className?: string }) {
  return (
    <Chip
      className={cn(
        'h-[26px] shrink-0 rounded-full px-2.5 py-0 text-[12px] leading-none font-bold',
        tone === 'accent' ? 'bg-accent-soft text-accent-deep' : 'bg-inset text-ink-2',
        className,
      )}
    >
      {children}
    </Chip>
  );
}

/** The accent "Installed" chip on listings this company already added. */
export function InstalledChip({ className }: { className?: string }) {
  return (
    <Chip className={cn('h-[26px] shrink-0 gap-1 rounded-full bg-accent-soft py-0 pr-2.5 pl-2 text-[12px] leading-none font-bold text-accent', className)}>
      <Icon name="check" size={13} strokeWidth={3} />
      Installed
    </Chip>
  );
}

/** Live, In review and Draft on the seller's own listings. */
export function StatusChip({ status }: { status: 'Live' | 'In review' | 'Draft' }) {
  const tone =
    status === 'Live'
      ? 'bg-selected text-accent'
      : status === 'In review'
        ? 'bg-accent-soft text-accent'
        : 'bg-inset text-ink-3';
  return (
    <Chip className={cn('h-[26px] gap-1.5 rounded-full px-2.5 py-0 text-[12px] leading-none font-bold whitespace-nowrap', tone)}>
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
      {status}
    </Chip>
  );
}

/** The filled accent circle with a step number. */
export function StepNumber({ n, className }: { n: number | string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-flex size-[30px] shrink-0 items-center justify-center rounded-full bg-accent text-[14px] font-bold text-accent-foreground', className)}
    >
      {n}
    </span>
  );
}

/** A tick in a pale circle, for checks and promises. */
export function CheckDot({ size = 28, iconSize = 16, className }: { size?: number; iconSize?: number; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full bg-selected text-accent', className)}
    >
      <Icon name="check" size={iconSize} strokeWidth={2.5} />
    </span>
  );
}

/** The "CoS" tile beside anything Chief of Staff says. */
export function CosTile({ className }: { className?: string }) {
  return <InitialsTile initials="CoS" className={cn('size-7 rounded-[9px] bg-accent-soft text-accent', className)} />;
}

/** A HeroUI Card that is a Next link: the whole card opens the page. */
export function CardLink({
  href,
  className,
  children,
  ...rest
}: { href: string; className?: string; children: ReactNode } & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  return (
    <Card
      className={cn(
        'text-left text-foreground no-underline transition-[box-shadow,background-color] duration-150 outline-none',
        'hover:shadow-[0_8px_22px_color-mix(in_srgb,var(--foreground)_10%,transparent),inset_0_0_0_1px_var(--color-selected-ring)]',
        'focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      render={(props) => <Link {...(props as Omit<ComponentProps<typeof Link>, 'href'>)} {...rest} href={href} />}
    >
      {children}
    </Card>
  );
}

/**
 * A HeroUI Radio drawn as a selectable card (plans, things to sell). The native radio input is
 * stretched invisibly over the whole card, so a click anywhere on the card is a click on the radio
 * itself, and it mirrors its state as data-selected for anything that reads the input.
 */
export function CardRadio({
  value,
  isSelected,
  className,
  contentClassName,
  children,
}: {
  value: string;
  isSelected: boolean;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (isSelected) input.setAttribute('data-selected', 'true');
    else input.removeAttribute('data-selected');
  }, [isSelected]);
  return (
    <Radio value={value} inputRef={inputRef} className={cn('mt-0 w-full min-w-0', className)}>
      <Radio.Content
        className={cn(
          'group relative w-full leading-[normal] text-foreground',
          '[&>span:first-child]:inset-0! [&>span:first-child]:z-[1] [&>span:first-child]:m-0! [&>span:first-child]:size-full! [&>span:first-child]:[clip-path:none]! [&>span:first-child]:[clip:auto]!',
          '[&_input]:absolute [&_input]:inset-0 [&_input]:m-0 [&_input]:size-full [&_input]:cursor-pointer [&_input]:appearance-none [&_input]:opacity-0',
          'transition-[background-color,box-shadow] duration-150 data-[hovered=true]:not-data-[selected=true]:bg-row-hover',
          'data-[selected=true]:bg-selected data-[selected=true]:shadow-[inset_0_0_0_2px_var(--accent)]',
          'data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-focus data-[focus-visible=true]:ring-offset-2',
          contentClassName,
        )}
      >
        {children}
      </Radio.Content>
    </Radio>
  );
}

/** The round radio mark: a hairline ring, filled with the accent once chosen. */
export function RadioMark({ className }: { className?: string }) {
  return (
    <Radio.Control
      className={cn(
        'size-5 rounded-full border-2 border-border bg-transparent shadow-none group-data-[selected=true]:border-accent group-data-[selected=true]:bg-accent',
        // The card draws the focus ring, so the mark does not draw a second one.
        'group-data-[focus-visible=true]:ring-0',
        className,
      )}
    />
  );
}
