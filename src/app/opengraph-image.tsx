import { ImageResponse } from 'next/og';
import { colorTokens, gradientBrand } from '@/styles/tokens';

export const alt = 'VibeMind Community';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Site-wide OpenGraph image rendered with next/og. Token colours only. */
export default function OpenGraphImage() {
  const c = colorTokens.light;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        background: c.bg,
        color: c.text,
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 36, fontWeight: 700 }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 9999, background: gradientBrand }} />
        VibeMind Community
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          One home for your whole community.
        </div>
        <div style={{ fontSize: 32, color: c.textMuted }}>
          Members, events, giving, groups and family connections. Web and mobile.
        </div>
      </div>
      <div style={{ height: 12, borderRadius: 9999, background: gradientBrand }} />
    </div>,
    size,
  );
}

export const dynamic = 'force-static';
