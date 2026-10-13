import { ImageResponse } from 'next/og';
import { MarkTile } from '@/lib/og';

// The home screen icon for iOS, and the logo in the site's structured data. iOS rounds the
// corners itself, so the tile is square. Layout numbers are image pixels, not site tokens.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(<MarkTile tile={size.width} mark={132} />, size);
}
