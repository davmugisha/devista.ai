import { Quote } from 'lucide-react';
import { Mark } from '../Logo';
import { delay, SectionHead } from '../Section';
import { SITE } from '@/lib/site';

// Taken from the FAQ answers and principles, so each promise is stated the same way everywhere.
const COMMITMENTS = [
  { text: 'We never scope a project around cutting headcount. The people who do the work decide which steps agents take on.', where: 'In every audit' },
  { text: 'Nothing goes live without your sign-off. The switchover plan is agreed with the head of the department.', where: 'In every rollout' },
  { text: 'You know the cost before work starts. Scope, timeline and fee are in the proposal, in writing.', where: 'In every proposal' },
  { text: `If you stop using ${SITE.shortName}, the proposal already says what you own and how your data and configuration are handled.`, where: 'In every proposal' },
];

/** Where a template shows testimonials, Devista shows the promises it puts in writing. */
export function Commitments() {
  return (
    <section id="commitments" aria-labelledby="commitments-title" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-page px-4 md:px-8">
        <SectionHead
          id="commitments"
          chip="Our commitments"
          title="Promises we put in writing."
          lede="Before you trust any vendor with your operations, you should know what they will and will not do."
        />
        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {COMMITMENTS.map((c, i) => (
            <li key={c.text} data-reveal style={delay((i % 2) * 90)} className="card flex flex-col p-7">
              <Quote aria-hidden="true" className="size-6 text-signal-bright" strokeWidth={1.8} />
              <p className="mb-7 mt-5 text-lg text-ink">{c.text}</p>
              <div className="mt-auto flex items-center gap-3 border-t border-rule pt-5">
                <Mark className="size-8" />
                <div>
                  <p className="text-sm font-semibold text-ink">{SITE.shortName}</p>
                  <p className="text-xs text-graphite">{c.where}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
