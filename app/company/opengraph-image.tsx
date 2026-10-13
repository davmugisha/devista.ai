import { OG_SIZE, renderOg } from '@/lib/og';
import { SITE } from '@/lib/site';

export const alt = `Who is behind ${SITE.shortName}.`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg(alt, 'Company');
}
