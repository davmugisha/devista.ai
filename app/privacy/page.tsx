import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/components/PageIntro';
import { DraftNotice, Prose } from '@/components/Prose';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: 'What Devista collects when you book an operations audit, why, where it goes, how long it is kept, and how to have it deleted.',
  alternates: { canonical: '/privacy' },
  openGraph: { title: 'Privacy notice | Devista AI' },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        cta={false}
        title="Privacy notice."
        lede="What we collect when you book an operations audit, why we collect it, and what you can ask us to do with it."
      />
      <Prose>
        <DraftNotice updated="29 September 2026" />
        <h2>What we collect</h2>
        <p>When you book an operations audit, we collect the details you enter in the form:</p>
        <ul>
          <li>your name, work email address, company, company size and role</li>
          <li>the operational bottleneck you choose, and anything you add in the optional text field</li>
          <li>the time zone you want call times in</li>
        </ul>
        <p>We do not ask for payment details, and we do not use advertising cookies.</p>
        <h2>Why we collect it</h2>
        <p>
          We use these details only to arrange and run your operations audit, and to follow up about it. We do not sell
          them or share them for marketing.
        </p>
        <h2>Where it goes</h2>
        <p>
          Your request is sent by email to the Devista team through an email delivery provider, which processes it on our
          behalf only to deliver it.
        </p>
        <h2>Site analytics</h2>
        <p>
          We count page views and button clicks in aggregate to understand how the site is used. This does not use
          cookies and does not identify you.
        </p>
        <h2>How long we keep it</h2>
        <p>
          We keep booking requests only as long as needed to arrange and follow up on the audit, and delete them sooner
          on request.
        </p>
        <h2>Your choices</h2>
        <p>
          You can ask to see, correct or delete the details you sent us by replying to any email we send you. You can
          also <Link href="/book">book an operations audit</Link> and ask on the introductory call.
        </p>
      </Prose>
    </>
  );
}
