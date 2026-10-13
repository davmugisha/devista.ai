import { OG_SIZE, renderOg } from '@/lib/og';
import { SITE } from '@/lib/site';

export const alt = `Book a free 30 minute call with ${SITE.name}.`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg(alt, 'Free call');
}
