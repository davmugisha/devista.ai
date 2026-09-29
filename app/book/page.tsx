import type { Metadata } from 'next';
import Booking from './Booking';

export const metadata: Metadata = {
  title: 'Book an operations audit',
  alternates: { canonical: '/book' },
};

// Temporary: the retired booking artboard stays until Phase 3 replaces it with the real form.
export default function BookPage() {
  return <Booking />;
}
