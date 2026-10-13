import Image from 'next/image';
import { Check, ShieldCheck } from 'lucide-react';
import { delay, Section } from './Section';
import { COMMITMENTS } from '@/lib/content';
import { FOUNDER } from '@/lib/site';

const firstName = FOUNDER.name.split(' ')[0];

/** The founder's photo, or a labelled placeholder with initials until FOUNDER.photo is set. */
function Photo() {
  const box = 'relative size-36 shrink-0 overflow-hidden rounded-frame border sm:size-44';
  if (FOUNDER.photo) {
    return (
      <div className={box + ' border-rule'}>
        <Image src={FOUNDER.photo} alt={`Photo of ${FOUNDER.name}`} fill sizes="176px" className="object-cover object-top" />
      </div>
    );
  }
  return (
    <div role="img" aria-label={`Placeholder for a photo of ${FOUNDER.name}`} className={box + ' flex flex-col items-center justify-center gap-3 border-dashed border-rule-strong bg-panel'}>
      <span className="text-4xl font-display tracking-display text-signal-bright">{FOUNDER.initials}</span>
      <span className="rounded-chip border border-dashed border-rule-strong px-2 py-px text-xs font-medium text-slate">Photo coming</span>
    </div>
  );
}

/** Who the buyer works with, and the promises they can hold the business to. */
export function Founder({ id = 'founder', promises = true }: { id?: string; promises?: boolean }) {
  return (
    <Section
      id={id}
      chip="Meet the founder"
      title="You work with the person who builds your agents."
      lede={`No account managers in between. Every free call, scope and invoice comes from ${firstName} directly.`}
    >
      <div className={'mx-auto mt-14 grid gap-4 ' + (promises ? 'max-w-stage lg:grid-cols-12' : 'max-w-heading')}>
        <article data-reveal className={'card flex flex-col gap-6 p-6 sm:flex-row sm:items-start md:p-8 ' + (promises ? 'lg:col-span-7' : '')}>
          <Photo />
          <div>
            <h3 className="text-2xl font-display tracking-display text-ink">{FOUNDER.name}</h3>
            <p className="mt-1 text-sm font-medium text-signal-bright">{FOUNDER.role}</p>
            <ul className="mt-5 space-y-3">
              {FOUNDER.facts.map((f) => (
                <li key={f} className="flex items-start gap-3 text-base text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-signal-bright" strokeWidth={2.2} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {promises ? (
          <div data-reveal style={delay(120)} className="card card-lit p-6 md:p-8 lg:col-span-5">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="size-5 text-signal-bright" strokeWidth={1.8} />
              <h3 className="text-lg font-display tracking-snug text-ink">Four promises you can hold us to</h3>
            </div>
            <ol className="mt-5 space-y-4">
              {COMMITMENTS.map((c, i) => (
                <li key={c} className="flex gap-3 text-base text-ink">
                  <span className="tabular flex size-6 shrink-0 items-center justify-center rounded-dot bg-signal-tint text-xs font-semibold text-signal-strong">
                    {i + 1}
                  </span>
                  {c}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
