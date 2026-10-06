import { ImageResponse } from 'next/og';
import { BRAND_MARK_PATHS } from '@/lib/brand';
import { COLOR } from '@/lib/tokens';

// The home screen icon for iOS, and the logo in the site's structured data. iOS rounds the
// corners itself, so the tile is square. Layout numbers are image pixels, not site tokens.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLOR.signal }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          {BRAND_MARK_PATHS.map((path) => <path key={path} d={path} fill={COLOR.mist} />)}
        </svg>
      </div>
    ),
    size,
  );
}
