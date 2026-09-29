import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'The people behind Devista.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg(alt, 'Company');
}
