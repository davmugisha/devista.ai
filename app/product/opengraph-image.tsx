import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'Agents do the repeat work. You approve what matters.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg(alt, 'Product');
}
