import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { ItemList } from '@/components/ItemList';
import { PageIntro } from '@/components/PageIntro';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Company',
  description:
    'Devista builds the operating layer that lets established companies run as one, with people in command and AI doing the work between systems.',
  alternates: { canonical: '/company' },
  openGraph: { title: 'Company | Devista AI' },
};

const PRINCIPLES = [
  { title: 'People command, AI executes', detail: 'Judgment, accountability and relationships stay with people. AI takes on the work that only needs doing, not deciding.' },
  { title: 'Connect before replacing', detail: 'Companies have invested years in their systems. We build on them and recommend a replacement only where a tool cannot do the job.' },
  { title: 'Prove it in one department', detail: 'Every engagement starts small, with a free audit and one department, so you judge us on results before committing further.' },
  { title: 'Nothing we cannot show', detail: 'We describe only what the product does today, and we put scope, cost and ownership in writing before work starts.' },
];

export default function CompanyPage() {
  return (
    <>
      <PageIntro
        title="The people behind Devista."
        lede="Devista builds the operating layer that lets established companies run as one company, with people in command and AI doing the work between systems."
      />

      <Section id="principles" title="How we work." lede="Four commitments that shape every engagement.">
        <div className="mt-12">
          <ItemList items={PRINCIPLES} />
        </div>
      </Section>

      <Section id="team" tone="mist" title="Who you will work with.">
        <div className="mt-8 max-w-narrow rounded-frame border border-dashed border-rule-strong bg-paper p-6">
          <p className="text-base font-medium text-ink">Team profiles and company details are being added.</p>
          <p className="mt-2 max-w-measure text-base text-graphite">
            In the meantime, book an operations audit: you will meet the people who run it on the introductory call.
          </p>
        </div>
      </Section>

      <CtaBand title="Meet the team on the introductory call." />
    </>
  );
}
