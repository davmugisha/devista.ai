import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactLink } from '@/components/ContactLink';
import { PageIntro } from '@/components/PageIntro';
import { DraftNotice, Prose } from '@/components/Prose';
import { OPEN_GRAPH, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: `What ${SITE.shortName} collects when you book a free call or join the email list, why, where it goes, how long it is kept, and how to have it deleted.`,
  alternates: { canonical: '/privacy' },
  openGraph: { ...OPEN_GRAPH, title: `Privacy notice | ${SITE.name}` },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        cta={false}
        title="Privacy notice."
        lede="What we collect when you book a free call or join the email list, why we collect it, and what you can ask us to do with it."
      />
      <Prose>
        <DraftNotice updated="11 October 2026" />
        <h2>What we collect</h2>
        <p>When you book a free call, we collect the details you enter in the form:</p>
        <ul>
          <li>your first name, your last name if you give it, and your email address</li>
          <li>your phone number, agency or company name, and team size, if you give them</li>
          <li>anything you write in the optional text box about what you want to talk about</li>
          <li>the time you pick, and the time zone you want call times in</li>
        </ul>
        <p>We do not ask for payment details on this website, and we do not use advertising cookies.</p>
        <h2>Why we collect it</h2>
        <p>
          We use these details only to arrange and run your call, and to follow up about it. We do not sell them or share
          them for marketing.
        </p>
        <h2>Where it goes</h2>
        <p>
          Booking a call creates an event in our Google Calendar, with a video link. The details you entered are saved in
          that event, and Google emails the invitation to you and to our own address, <ContactLink />. Google handles
          those details as our calendar provider.
        </p>
        <h2>Email updates</h2>
        <p>
          If you subscribe to email updates at the foot of any page, we keep your email address and the date you
          subscribed, on the server that runs this website. We use it only to send you updates from {SITE.shortName}, and
          we keep it until you unsubscribe. Every update will include a way to unsubscribe, and you can also ask us to
          remove your address by emailing <ContactLink />.
        </p>
        <h2>Site analytics</h2>
        <p>
          Where site analytics are switched on, we count page views and button clicks in aggregate to understand how the
          site is used. This does not use cookies and does not identify you.
        </p>
        <h2>How long we keep it</h2>
        <p>
          We keep booking details only as long as needed to arrange and follow up on the call, and delete them sooner on
          request.
        </p>
        <h2>Your choices</h2>
        <p>
          You can ask to see, correct or delete the details you sent us by emailing <ContactLink />. You can also{' '}
          <Link href="/book">book a free call</Link> and ask on the call.
        </p>
      </Prose>
    </>
  );
}
