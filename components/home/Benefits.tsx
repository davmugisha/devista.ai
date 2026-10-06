'use client';

import { ChartColumn, CircleCheck, LayoutDashboard, Plug, Repeat, ScrollText } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHead } from '../Section';
import { SITE } from '@/lib/site';

const BENEFITS = [
  { Icon: Repeat, title: 'No more re-keying', detail: 'Agents carry data from one system to the next, so no one types the same order twice.' },
  { Icon: CircleCheck, title: 'Approvals that don’t wait', detail: 'Every decision reaches the right person with the context attached, in one queue.' },
  { Icon: ChartColumn, title: 'Reports without the rebuild', detail: 'Agents compile the weekly report from your systems and send a draft for review.' },
  { Icon: LayoutDashboard, title: 'One view of the company', detail: 'Goals, work, approvals and alerts across departments, in one command center.' },
  { Icon: ScrollText, title: 'Every action on record', detail: 'What happened, when and on whose authority, for people and agents alike.' },
  { Icon: Plug, title: 'Keep the tools you have', detail: `${SITE.shortName} works through the systems you already run. It does not replace them.` },
];

/** Uneven glass cards make the outcomes scannable without implying measured results. */
export function Benefits() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="benefits" aria-labelledby="benefits-title" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-page px-4 md:px-8">
        <SectionHead
          id="benefits"
          chip="What changes"
          title="The work between systems, handled."
          lede="Your people stop carrying data, chasing approvals and rebuilding reports, and spend the time on the decisions only they can make."
        />
        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-3">
          {BENEFITS.map(({ Icon, title, detail }, i) => (
            <motion.li
              key={title}
              data-reveal
              className={'glass-tile group flex flex-col p-7 ' + (i === 0 ? 'md:col-span-2 lg:row-span-2 lg:min-h-96' : '')}
              whileHover={reduceMotion ? undefined : { y: -5, transition: { duration: 0.25 } }}
            >
              <span className="flex size-11 items-center justify-center rounded-control border border-rule bg-panel/70">
                <Icon aria-hidden="true" className="size-5 text-signal-bright" strokeWidth={1.8} />
              </span>
              <div className={i === 0 ? 'mt-auto pt-16' : 'mt-6'}>
                {i === 0 ? <p className="mb-3 font-mono text-xs uppercase tracking-wide text-signal-bright">From handoff to done</p> : null}
                <h3 className={'font-display tracking-snug text-ink ' + (i === 0 ? 'text-3xl' : 'text-xl')}>{title}</h3>
                <p className="mt-2 max-w-measure text-base text-graphite">{detail}</p>
              </div>
              {i === 0 ? (
                <div aria-hidden="true" className="mt-8 flex flex-wrap items-center gap-2 border-t border-rule pt-6 text-sm text-graphite">
                  <span className="rounded-control border border-rule bg-paper/50 px-3 py-2">Your CRM</span>
                  <span className="text-signal-bright">→</span>
                  <span className="rounded-control border border-signal/40 bg-signal-tint px-3 py-2 text-ink">{SITE.shortName} agent</span>
                  <span className="text-signal-bright">→</span>
                  <span className="rounded-control border border-rule bg-paper/50 px-3 py-2">Your accounts</span>
                </div>
              ) : null}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
