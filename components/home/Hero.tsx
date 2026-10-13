import { ButtonLink } from '../Button';
import { MagneticButtonLink } from '../MagneticButtonLink';
import { Chip } from '../Section';
import { AGENT_TEAM } from '@/lib/content';
import { CTA, SITE } from '@/lib/site';
import { TEAM_ICONS } from './team-icons';

/** The problem in one line, the offer in the next, and the kinds of agent an agency can hand work to. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero-sky relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto max-w-page px-4 pb-28 pt-14 text-center md:px-8 md:pb-36 md:pt-20">
        <div className="animate-hero">
          <Chip>AI agent setup for agencies</Chip>
        </div>
        <h1 id="hero-title" className="mx-auto mt-6 max-w-stage text-4xl font-display tracking-display text-ink animate-hero" style={{ animationDelay: '80ms' }}>
          Your agency leaks hours between tools and manual work.
          <span className="block text-signal-bright">We fix it in 7 days.</span>
        </h1>
        <p data-hero-lede className="mx-auto mt-6 max-w-narrow text-md text-graphite animate-hero" style={{ animationDelay: '160ms' }}>
          {SITE.shortName} makes your team and AI agents one system. Agents do the repeat work in every department, around the clock,
          and your people approve what goes out.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-hero" style={{ animationDelay: '240ms' }}>
          <MagneticButtonLink href={CTA.book.href} track="hero">
            {CTA.book.label}
          </MagneticButtonLink>
          <ButtonLink href={CTA.how.href} variant="secondary" track="hero-secondary">
            {CTA.how.label}
          </ButtonLink>
        </div>
        <p className="mx-auto mt-4 max-w-narrow text-sm text-slate animate-hero" style={{ animationDelay: '240ms' }}>
          US$1,500 for the first 3 founding clients. Free 30 minute call first. Paid upfront.
        </p>

        <ul aria-label="Example agents for an agency" className="mx-auto mt-14 grid max-w-stage grid-cols-2 gap-3 text-left lg:grid-cols-4">
          {AGENT_TEAM.map((part, i) => {
            const Icon = TEAM_ICONS[part.id];
            return (
              <li key={part.id} className="card p-4 animate-hero" style={{ animationDelay: `${320 + i * 70}ms` }}>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-control border border-rule bg-panel">
                    <Icon aria-hidden="true" className="size-4 text-signal-bright" strokeWidth={1.9} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{part.name}</p>
                    <p className="text-xs text-slate">{part.agents.length} example agents</p>
                  </div>
                </div>
                {/* On phones the cards show only their heading, so the hero stays short. */}
                <ul className="mt-4 hidden space-y-2 sm:block">
                  {part.agents.slice(0, 3).map((agent, j) => (
                    <li key={agent} className="flex items-center justify-between gap-3 rounded-control border border-rule bg-paper/70 px-3 py-2 text-sm text-ink">
                      {agent}
                      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-dot bg-signal-bright animate-blink" style={{ animationDelay: `${(i * 3 + j) * 260}ms` }} />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-slate">Example agents. Your setup starts with 3 to 5 agents on one workflow.</p>
      </div>

      <svg aria-hidden="true" viewBox="0 0 1440 180" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-20 w-full md:h-24">
        <path d="M0 93 C190 146 300 38 478 56 C635 71 660 34 806 54 C983 79 1007 147 1184 111 C1293 89 1354 84 1440 109 L1440 180 L0 180 Z" className="fill-panel" />
        <path d="M0 115 C203 162 361 72 522 83 C683 95 729 68 879 82 C1051 98 1122 148 1279 124 C1357 112 1402 112 1440 118 L1440 180 L0 180 Z" className="fill-paper" />
      </svg>
    </section>
  );
}
