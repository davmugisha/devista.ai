import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';
import { DraftNotice, Prose } from '@/components/Prose';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: `The terms that apply when you use the ${SITE.shortName} website, including how to read the examples and illustrations it contains.`,
  alternates: { canonical: '/terms' },
  openGraph: { ...OPEN_GRAPH, title: `Terms of use | ${SITE.name}` },
};

export default function TermsPage() {
  return (
    <>
      <PageIntro cta={false} title="Terms of use." lede="The terms that apply when you use this website." />
      <Prose>
        <DraftNotice updated="29 September 2026" />
        <h2>About this website</h2>
        <p>
          This website describes {SITE.shortName} and the operations audit we offer. It is provided for information. Any work we
          do for your company is governed by a separate written agreement, not by these terms.
        </p>
        <h2>Examples and illustrations</h2>
        <p>
          Workflows, product renderings and data shown on this site are examples for illustration. Your workflows, rules
          and approvers are defined with you during an engagement.
        </p>
        <h2>Booking an audit</h2>
        <p>
          Booking an operations audit creates no obligation for you or for us. The audit is free, and you decide
          afterwards whether to go further.
        </p>
        <h2>Content</h2>
        <p>
          The text, design and illustrations on this site belong to {SITE.shortName}. You may share links to it freely.
        </p>
        <h2>Changes</h2>
        <p>We may update these terms. The date at the top shows when they last changed.</p>
      </Prose>
    </>
  );
}
