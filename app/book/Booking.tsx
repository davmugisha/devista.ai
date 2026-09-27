'use client';

import dynamic from 'next/dynamic';

// The calendar starts from today's date and the visitor's time zone, so it renders in the
// browser only; a server render would disagree with it.
const Book = dynamic(() => import('../_v2/Book'), { ssr: false });
const BookMobile = dynamic(() => import('../_v2/BookMobile'), { ssr: false });

export default function Booking() {
  return (
    <>
      <div className="v2-wide">
        <Book />
      </div>
      <div className="v2-narrow">
        <BookMobile />
      </div>
    </>
  );
}
