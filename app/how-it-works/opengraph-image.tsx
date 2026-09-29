import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'Start with one department. Expand when it proves itself.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg(alt, 'How it works');
}
