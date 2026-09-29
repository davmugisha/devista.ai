import type { ReactNode } from 'react';

type Props = {
  id: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: 'paper' | 'mist';
  /** h2 on the homepage and deeper pages; h1 only when a section opens a page. */
  as?: 'h1' | 'h2';
  children?: ReactNode;
  className?: string;
};

/** A page section that answers one buyer question: a heading, an optional one-sentence lede, content. */
export function Section({ id, title, lede, tone = 'paper', as: H = 'h2', children, className = '' }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={(tone === 'mist' ? 'bg-mist ' : 'bg-paper ') + 'py-16 md:py-24 ' + className}
    >
      <div className="mx-auto max-w-page px-4 md:px-8">
        <div className="max-w-narrow">
          <H id={`${id}-title`} className="text-3xl font-display tracking-display text-ink">
            {title}
          </H>
          {lede ? <p className="mt-4 max-w-measure text-md text-graphite">{lede}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
