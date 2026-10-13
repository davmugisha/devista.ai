// What a nav item without a design opens. The design links these sections to "#"; the prototype
// says so plainly and offers the screens that do exist, instead of inventing one.

import { EmptyState } from '@heroui/react';
import { SECTIONS, type SectionKey } from '@/lib/data';
import { Icon } from './icons';
import { ButtonLink } from './ui';

export function NotDesigned({
  section,
  links,
}: {
  section: SectionKey;
  links: { label: string; href: string }[];
}) {
  const { title, icon, mode } = SECTIONS[section];
  return (
    <EmptyState className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl bg-surface px-6 py-12 text-center shadow-ring">
      <span aria-hidden className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <Icon name={icon} size={28} />
      </span>
      <h1 className="m-0 text-[26px] leading-tight font-bold text-foreground">{title} is not designed yet</h1>
      <p className="m-0 text-[15px] leading-relaxed font-semibold text-ink-3">
        {mode === 'code' ? 'Code' : 'This part of Work'} is in the menu but has no screen in the design, so this prototype stops here.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {links.map((l, i) => (
          <ButtonLink key={l.href} href={l.href} variant={i === 0 ? 'primary' : 'tertiary'}>
            {l.label}
          </ButtonLink>
        ))}
      </div>
    </EmptyState>
  );
}
