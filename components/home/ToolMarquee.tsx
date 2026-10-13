import type { CSSProperties } from 'react';
import {
  siAirtable,
  siAsana,
  siCalendly,
  siClickup,
  siGmail,
  siGoogleanalytics,
  siGooglecalendar,
  siGoogledocs,
  siGoogledrive,
  siGooglesheets,
  siHubspot,
  siLoom,
  siNotion,
  siQuickbooks,
  siStripe,
  siTrello,
  siTypeform,
  siWebflow,
  siWordpress,
  siXero,
  siZoho,
  siZoom,
  type SimpleIcon,
} from 'simple-icons';

// Tools agencies run every day. David approved showing them on 2026-10-11 while the connections are
// being built, so the note under the strip says which ones are connected first is agreed on the call.
// Each logo keeps its own brand colour from simple-icons: the one place colour comes from outside
// the tokens.
const ROWS: SimpleIcon[][] = [
  [siGmail, siGooglesheets, siGoogledrive, siGoogledocs, siGooglecalendar, siHubspot, siNotion, siAirtable, siClickup, siAsana, siTrello],
  [siCalendly, siXero, siQuickbooks, siStripe, siZoom, siLoom, siGoogleanalytics, siWebflow, siWordpress, siZoho, siTypeform],
];

function Pill({ icon }: { icon: SimpleIcon }) {
  return (
    <li className="flex shrink-0 items-center gap-2 rounded-dot border border-rule bg-mist py-2 pl-2 pr-4 text-sm font-medium text-ink">
      {/* White in both themes, so dark brand logos (Notion, Typeform) stay visible on the dark theme. */}
      <span className="flex size-7 items-center justify-center rounded-dot border border-rule bg-white">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current" style={{ color: `#${icon.hex}` }}>
          <path d={icon.path} />
        </svg>
      </span>
      {icon.title}
    </li>
  );
}

/** Two rows of tool logos drifting in opposite directions. Each row is drawn twice so the loop has no seam. */
export function ToolMarquee() {
  return (
    <section aria-labelledby="tools-title" className="border-y border-rule bg-mist/60 py-10">
      <h2 id="tools-title" className="px-4 text-center text-sm font-medium text-graphite">
        Works with the tools your agency already uses
      </h2>
      <div className="fade-x mx-auto mt-6 grid max-w-page gap-3 overflow-hidden">
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="flex w-max animate-marquee hover:[animation-play-state:paused]"
            style={(i === 1 ? { animationDirection: 'reverse' } : undefined) as CSSProperties | undefined}
          >
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 gap-3 pr-3">
                {row.map((icon) => (
                  <Pill key={icon.slug} icon={icon} />
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-narrow px-4 text-center text-xs text-slate">
        Which of your tools we connect first is agreed on the free call.
      </p>
    </section>
  );
}
