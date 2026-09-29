import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'AI that works inside the permissions you set.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg(alt, 'Security');
}
