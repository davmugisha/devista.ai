import { ImageResponse } from 'next/og';
import { COLOR } from './tokens';

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Shared Open Graph card: the page's own headline on white, the mark and name, and one rule.
 * Layout numbers here are image pixels for a fixed 1200 by 630 canvas, not site tokens.
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
          background: COLOR.paper,
          padding: 80,
          borderBottom: `16px solid ${COLOR.signal}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: COLOR.brandMark,
              color: COLOR.brandMarkInk,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: COLOR.ink }}>Devista</div>
          {section ? <div style={{ fontSize: 32, color: COLOR.graphite, marginLeft: 16 }}>{section}</div> : null}
        </div>
        <div style={{ fontSize: 72, lineHeight: 1.08, letterSpacing: -2, fontWeight: 700, color: COLOR.ink, maxWidth: 1000 }}>
          {title}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
