import { ImageResponse } from 'next/og';
import { BRAND } from './brand';
import { COLOR } from './tokens';
import { SITE } from './site';

export const OG_SIZE = { width: 1200, height: 630 };

/** The brand mark in white on the signal tile, for generated images. Sizes are image pixels. */
export function MarkTile({ tile, mark, radius = 0 }: { tile: number; mark: number; radius?: number }) {
  return (
    <div style={{ width: tile, height: tile, borderRadius: radius, background: COLOR.signal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={mark} height={mark} viewBox="0 0 64 64">
        {BRAND.mark.map((path) => <path key={path} d={path} fill={COLOR.mist} />)}
      </svg>
    </div>
  );
}

/**
 * Shared Open Graph card: the page's headline on the light cyan canvas, with the mark and name.
 * Layout numbers are image pixels for a fixed
 * 1200 by 630 canvas, not site tokens.
 */
export function renderOg(title: string, section?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: `radial-gradient(ellipse 70% 60% at 50% -10%, ${COLOR.glow}66, ${COLOR.glowDeep}33 45%, ${COLOR.paper} 75%)`,
          backgroundColor: COLOR.paper,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <MarkTile tile={64} mark={54} radius={16} />
          <div style={{ fontSize: 40, fontWeight: 700, color: COLOR.ink }}>{SITE.shortName}</div>
          {section ? <div style={{ fontSize: 32, color: COLOR.graphite, marginLeft: 16 }}>{section}</div> : null}
        </div>
        <div style={{ fontSize: 72, lineHeight: 1.08, letterSpacing: -2, fontWeight: 700, color: COLOR.ink, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: 'flex', height: 6, width: 220, borderRadius: 3, background: COLOR.signal }} />
      </div>
    ),
    OG_SIZE,
  );
}
