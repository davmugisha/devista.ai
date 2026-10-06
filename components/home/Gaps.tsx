import { HubDiagram } from './HubDiagram';
import { delay, SectionHead } from '../Section';
import { GAPS } from '@/lib/content';

/** The problem: the four gaps people fill by hand, beside the diagram that redraws them. */
export function Gaps() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-page px-4 md:px-8">
        <SectionHead
          id="problem"
          chip="The problem"
          title="Your people shouldn’t be the integration layer."
          lede="Established companies run on good systems that were never designed to work together. The work between them falls to people."
        />
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <ol className="grid gap-3 lg:col-span-5">
            {GAPS.map((g, i) => (
              <li
                key={g.title}
                data-reveal
                style={delay(i * 90)}
                className="group flex gap-4 rounded-frame border border-rule bg-mist p-5 transition-colors duration-300 hover:border-hold/50 hover:bg-panel"
              >
                <span className="tabular pt-px font-mono text-xs text-slate transition-colors group-hover:text-hold">
                  /{String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{g.title}</h3>
                  <p className="mt-1 text-sm text-graphite">{g.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <div data-reveal style={delay(120)} className="lg:col-span-7">
            <HubDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
