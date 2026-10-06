import { ButtonLink } from '../Button';
import { MagneticButtonLink } from '../MagneticButtonLink';
import { Mark } from '../Logo';
import { CTA, SITE } from '@/lib/site';
import { CommandCenter } from './CommandCenter';
import { HeroStage } from './HeroStage';

export function Hero() {
  return (
    <HeroStage>
      <section aria-labelledby="hero-title" className="overflow-hidden">
        <div className="hero-sky hero-editorial relative isolate flex min-h-176 flex-col items-center overflow-hidden px-4 pt-16 text-center md:min-h-192 md:px-8 md:pt-16">
          <div aria-hidden="true" className="hero-symbol relative mt-3 flex size-52 items-center justify-center sm:size-60 md:size-60">
            <span className="absolute inset-1 rounded-dot border border-rule-strong/50" />
            <span className="absolute inset-7 rounded-dot border border-rule/80" />
            <span className="absolute inset-12 rounded-dot bg-panel/75 blur-xl" />
            <Mark className="relative size-28 drop-shadow-xl sm:size-32 md:size-36" />
          </div>

          <div className="relative z-10 mt-12 animate-hero md:mt-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-wide text-signal">AI automation platform</p>
            <h1 id="hero-title" className="mx-auto mt-5 max-w-heading text-4xl font-display tracking-display text-ink">
              Turn complex workflows into autonomous operations.
            </h1>
            <p className="mx-auto mt-5 max-w-narrow text-base text-graphite md:text-lg">
              {SITE.shortName} connects the tools and teams you already run. AI agents carry the handoffs while your people stay in control.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <MagneticButtonLink href={CTA.book.href} track="hero">
                {CTA.book.label}
              </MagneticButtonLink>
              <ButtonLink href={CTA.product.href} variant="secondary" track="hero-secondary">
                Explore the platform
              </ButtonLink>
            </div>
          </div>

          <svg aria-hidden="true" viewBox="0 0 1440 180" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-28 w-full md:h-32">
            <path d="M0 93 C190 146 300 38 478 56 C635 71 660 34 806 54 C983 79 1007 147 1184 111 C1293 89 1354 84 1440 109 L1440 180 L0 180 Z" className="fill-panel" />
            <path d="M0 115 C203 162 361 72 522 83 C683 95 729 68 879 82 C1051 98 1122 148 1279 124 C1357 112 1402 112 1440 118 L1440 180 L0 180 Z" className="fill-paper" />
          </svg>
        </div>

        <div className="hero-showcase relative mx-auto max-w-stage px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16">
          <p className="mb-7 text-center font-mono text-xs font-semibold uppercase tracking-wide text-signal">One view across your operations</p>
          <div data-reveal className="mx-auto lg:w-4/5">
            <CommandCenter />
          </div>
          <p className="mt-5 text-center text-xs text-slate">Illustration of the command center with example data.</p>
        </div>
      </section>
    </HeroStage>
  );
}
