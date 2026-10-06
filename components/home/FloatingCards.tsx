import { Check, TriangleAlert } from 'lucide-react';
import { ModeGlyph } from '../ModeGlyph';

const frame = 'rounded-frame border border-white/70 bg-mist/75 p-4 text-left shadow-float backdrop-blur-xl';

/**
 * Four moments from the command center, floating around the hero window at different depths:
 * a decision waiting, an agent working, an escalation, and the record. Decorative; the window's
 * label describes the scene for assistive technology.
 */
export function FloatingCards() {
  return (
    <div aria-hidden="true">
      <div className="parallax-near absolute -left-2 -top-10 hidden lg:block xl:-left-14">
        <div className={frame + ' relative w-72 animate-float'}>
          <p className="flex items-center gap-2 text-xs font-medium text-hold">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-dot bg-hold animate-ping" />
              <span className="relative inline-flex size-2 rounded-dot bg-hold" />
            </span>
            Waiting for you
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">Supplier invoice above limit</p>
          <p className="mt-1 text-xs text-graphite">Finance, matched to order and receipt</p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-control bg-signal px-3 py-1 text-xs font-medium text-on-signal">Approve</span>
            <span className="rounded-control border border-rule px-3 py-1 text-xs font-medium text-ink">Review</span>
          </div>
        </div>
      </div>

      <div className="parallax-far absolute -right-2 -top-14 hidden lg:block xl:-right-14">
        <div className={frame + ' relative w-72 animate-float-late'}>
          <p className="flex items-center gap-2 text-xs font-medium text-signal-bright">
            <ModeGlyph mode="agent" className="size-3 text-signal-bright" />
            Agent at work
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">Weekly operations report</p>
          <p className="mt-1 text-xs text-graphite">Compiling from finance, sales and support</p>
          <div className="mt-3 h-1 overflow-hidden rounded-dot bg-panel">
            <div className="h-full origin-left rounded-dot bg-signal-bright animate-grow" />
          </div>
        </div>
      </div>

      <div className="parallax-far absolute -left-6 bottom-28 hidden lg:block xl:-left-20">
        <div className={frame + ' relative w-64 animate-float-late'}>
          <p className="flex items-center gap-2 text-xs font-medium text-hold">
            <TriangleAlert className="size-3" strokeWidth={2.2} />
            Escalated to a person
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">Supplier not on the approved list</p>
          <p className="mt-1 text-xs text-graphite">Assigned to the procurement lead</p>
        </div>
      </div>

      <div className="parallax-near absolute -right-4 bottom-20 hidden lg:block xl:-right-16">
        <div className={frame + ' relative w-72 animate-float'}>
          <p className="text-xs font-medium text-graphite">Audit trail</p>
          <ul className="mt-2 space-y-2">
            {[
              ['10:02', 'CFO approved payment'],
              ['10:02', 'Invoice agent added it to the payment run'],
            ].map(([t, what]) => (
              <li key={what} className="flex items-start gap-2 text-xs">
                <span className="tabular text-slate">{t}</span>
                <Check className="mt-px size-3 shrink-0 text-signal-bright" strokeWidth={2.4} />
                <span className="text-ink">{what}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
