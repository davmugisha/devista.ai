import type { Metadata } from 'next';
import Booking from './Booking';

export const metadata: Metadata = {
  title: 'Book your free Process Audit · Devista AI',
};

export default function BookPage() {
  return (
    <main id="main">
      <Booking />
    </main>
  );
}
