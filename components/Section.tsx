import type { CSSProperties, ReactNode } from 'react';

/** The small tag above every section heading. */
export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={'inline-flex items-center gap-2 rounded-control border border-rule bg-mist px-3 py-1 text-sm font-medium text-ink ' + className}>
      {children}
    </span>
  );
}

/** Stagger helper for [data-reveal] children: delay in milliseconds. */
export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

type HeadProps = {
  id: string;
  chip?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
};

/** Chip, centred h2 and one-sentence lede. */
export function SectionHead({ id, chip, title, lede }: HeadProps) {
  return (
    <div className="mx-auto flex max-w-heading flex-col items-center text-center">
      {chip ? (
        <div data-reveal>
          <Chip>{chip}</Chip>
        </div>
      ) : null}
      <h2 id={`${id}-title`} data-reveal style={delay(80)} className="mt-5 text-4xl font-display tracking-display text-ink">
        {title}
      </h2>
      {lede ? (
        <p data-reveal style={delay(160)} className="mx-auto mt-5 max-w-narrow text-lg text-graphite">
          {lede}
        </p>
      ) : null}
    </div>
  );
}

type Props = HeadProps & {
  children?: ReactNode;
  className?: string;
};

/** A page section that answers one buyer question: chip, heading, lede, then its content. */
export function Section({ id, children, className = '', ...head }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={'relative py-16 md:py-24 ' + className}>
      <div className="mx-auto max-w-page px-4 md:px-8">
        <SectionHead id={id} {...head} />
        {children}
      </div>
    </section>
  );
}
