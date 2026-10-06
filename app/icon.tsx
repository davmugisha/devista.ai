import { BRAND_MARK_PATHS } from '@/lib/brand';
import { COLOR } from '@/lib/tokens';

// The favicon: this domain's brand mark (lib/brand.ts) in white on the signal tile, as a crisp
// vector. Generated once at build time.
export const contentType = 'image/svg+xml';

export default function Icon() {
  const paths = BRAND_MARK_PATHS.map((d) => `<path d="${d}"/>`).join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="14" fill="${COLOR.signal}"/><g fill="${COLOR.mist}">${paths}</g></svg>`;
  return new Response(svg, { headers: { 'Content-Type': contentType } });
}
