import type { Metadata } from 'next';
import { PageIntro } from '@/components/PageIntro';
import { DraftNotice, Prose } from '@/components/Prose';
import { OFFERS } from '@/lib/content';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: `The terms that apply when you use the ${SITE.shortName} website, how booking a call and paying for an offer work, and how to read the examples and illustrations it contains.`,
  alternates: { canonical: '/terms' },
  openGraph: { ...OPEN_GRAPH, title: `Terms of use | ${SITE.name}` },
};

const OFFER_NAMES = OFFERS.map((o) => o.name).join(', ');

export default function TermsPage() {
  return (
    <>
      <PageIntro cta={false} title="Terms of use." lede="The terms that apply when you use this website." />
      <Prose>
        <DraftNotice updated="11 October 2026" />
        <h2>About this website</h2>
        <p>
          This website describes {SITE.shortName} and what we offer: {OFFER_NAMES}. It is provided for information. Any work
          we do for you is governed by the written scope and invoice we agree with you, not by these terms.
        </p>
        <h2>Examples and illustrations</h2>
        <p>
          Workflows, product renderings and data shown on this site are examples for illustration. Your workflows, rules
          and approvers are agreed with you during a project.
        </p>
        <h2>Booking a call</h2>
        <p>
          Booking a free call creates no obligation for you or for us. You decide afterwards whether to go further.
        </p>
        <h2>Paying and scope</h2>
        <p>
          Our offers are paid upfront. Before you pay, we send you a written scope and a fixed price. Work starts only
          after the invoice is paid.
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
