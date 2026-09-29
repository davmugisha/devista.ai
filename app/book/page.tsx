import type { Metadata } from 'next';
import { AuditOffer } from '@/components/AuditOffer';
import { BookingForm } from './BookingForm';

export const metadata: Metadata = {
  title: 'Book an operations audit',
  description:
    'Book a free operations audit: about two weeks, one department, run with the people who do the work. You keep the workflow map and a scoped first implementation.',
  alternates: { canonical: '/book' },
  openGraph: { title: 'Book an operations audit | Devista AI' },
};

export default function BookPage() {
  return (
    <>
      <section aria-labelledby="page-title" className="border-b border-rule">
        <div className="mx-auto grid max-w-page grid-cols-1 gap-12 px-4 pb-16 pt-12 md:px-8 md:pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-24">
          <div className="min-w-0 lg:col-span-5">
            <h1 id="page-title" className="text-4xl font-display tracking-display text-ink">
              Book an operations audit.
            </h1>
            <p className="mt-6 max-w-measure text-lg text-graphite">
              Tell us about your company and the bottleneck that costs you most. We reply within one working day with
              times for a 30-minute introductory call.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-rule pt-6">
              <div>
                <dt className="text-sm font-semibold text-ink">Cost</dt>
                <dd className="text-sm text-graphite">Free, no obligation</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Duration</dt>
                <dd className="text-sm text-graphite">About two weeks</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">Scope</dt>
                <dd className="text-sm text-graphite">One department</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink">System access</dt>
                <dd className="text-sm text-graphite">Not needed</dd>
              </div>
            </dl>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <div className="rounded-frame border border-rule bg-paper p-5 shadow-float sm:p-8">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="offer-title" className="bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-page px-4 md:px-8">
          <h2 id="offer-title" className="max-w-narrow text-3xl font-display tracking-display text-ink">
            What the audit covers.
          </h2>
          <p className="mt-4 max-w-measure text-md text-graphite">
            A structured look at one department, run with the people who do the work. You keep everything it produces.
          </p>
          <div className="mt-12">
            <AuditOffer />
          </div>
        </div>
      </section>
    </>
  );
}
