import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'One command center over the systems you already run.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg(alt, 'Product');
}
