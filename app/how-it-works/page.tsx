import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { ExplorerIsland } from '@/components/home/ExplorerIsland';
import { ExplorerView } from '@/components/home/ExplorerView';
import { PageIntro } from '@/components/PageIntro';
import { Pricing } from '@/components/Pricing';
import { delay, Section } from '@/components/Section';
import { StageCards } from '@/components/StageCards';
import { FAQ, OFFERS } from '@/lib/content';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    `Four steps from a free call to a working team of AI agents on ${SITE.shortName} Work: a free call, a written scope and invoice, a 7 day install and a training call. Fixed prices, paid upfront.`,
  alternates: { canonical: '/how-it-works' },
  openGraph: { ...OPEN_GRAPH, title: `How it works | ${SITE.name}` },
};

const PICK = new Set([
  'What exactly do I get for US$1,500?',
  'Why do I pay before the work starts?',
  'Which workflow should we start with?',
  'How long does it take?',
]);

const DECIDE = OFFERS[0].decide;

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro
        chip="How it works"
        title="From a free call to a working agent team."
        lede="The call is free. After it you get a written scope and a fixed price, and the work starts once you have paid. The install takes 7 days."
      />

      <Section id="stages" chip="The four steps" title="What happens, and what stays with you." lede="Each step ends with something for you to check or decide.">
        <StageCards detailed />
      </Section>

      <Section
        id="workflows"
        chip="Example workflows"
        title="Who does each step."
        lede="Pick a workflow to see which steps an agent does, where your approval sits and what goes to a person."
      >
        <div data-reveal>
          <ExplorerIsland uid="wf">
            <ExplorerView uid="wf" active={0} focus={null} />
          </ExplorerIsland>
        </div>
        <p className="mt-4 text-center text-xs text-slate">
          Examples for illustration. Your workflow is agreed on the call, and you set the rules and the approvers.
        </p>
      </Section>

      <Section
        id="decisions"
        chip="What you decide"
        title="The choices that stay with you."
        lede="We agree these with you on the call and before the work starts."
      >
        <div className="mx-auto mt-14 max-w-page">
          <ol className="grid gap-4 md:grid-cols-3">
            {DECIDE.map((d, i) => (
              <li key={d} data-reveal style={delay(i * 90)} className="card p-6">
                <p className="tabular text-sm font-semibold text-signal-bright">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-3 text-lg font-display tracking-snug text-ink">{d}</p>
              </li>
            ))}
          </ol>
          <p data-reveal className="mx-auto mt-8 max-w-measure text-center text-sm text-graphite">
            {OFFERS[0].foot}
          </p>
        </div>
      </Section>

      <Section
        id="pricing"
        chip="Pricing"
        title="Fixed prices, paid upfront."
        lede="Every offer has a written scope and one fixed price before you pay. Nothing starts until the invoice is paid."
      >
        <Pricing />
      </Section>

      <Section id="questions" chip="FAQ" title="Common questions before you book.">
        <Faq items={FAQ.filter((f) => PICK.has(f.q))} />
      </Section>

      <CtaBand
        title="Book a free call to pick your first workflow."
        lede="Thirty minutes to find the one workflow worth starting with. You get the scope and price in writing before you pay anything."
      />
    </>
  );
}
