import { describe, expect, it } from 'vitest';
import { accentPalette, colorTokens } from '@/styles/tokens';
import { contrastRatio, meetsAA, mix, parseHex, toHex } from './contrast';
import { resolveAccent } from './theme';

describe('contrast maths', () => {
  it('parses and serialises hex', () => {
    expect(parseHex('#4F46E5')).toEqual({ r: 79, g: 70, b: 229 });
    expect(parseHex('fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex('nope')).toBeNull();
    expect(toHex({ r: 79, g: 70, b: 229 })).toBe('#4F46E5');
  });

  it('computes WCAG ratios', () => {
    const white = parseHex('#FFFFFF');
    const black = parseHex('#000000');
    if (!white || !black) throw new Error('parse');
    expect(contrastRatio(white, black)).toBeCloseTo(21, 0);
    expect(meetsAA(white, black)).toBe(true);
  });

  it('mix mirrors color-mix percentages', () => {
    const a = { r: 0, g: 0, b: 0 };
    const b = { r: 100, g: 100, b: 100 };
    expect(mix(a, b, 25)).toEqual({ r: 75, g: 75, b: 75 });
  });
});

describe('resolveAccent (§2 per-community accent)', () => {
  it('keeps the default when no accent is given', () => {
    expect(resolveAccent(null, 'light')).toEqual({ primary: null, hover: null, fellBack: false });
  });

  it('accepts the indigo default in both themes', () => {
    const light = resolveAccent(accentPalette.indigo, 'light');
    expect(light.primary).toBe('#4F46E5');
    expect(light.fellBack).toBe(false);
    const dark = resolveAccent(accentPalette.indigo, 'dark');
    expect(dark.fellBack).toBe(false);
    expect(dark.primary).not.toBe('#4F46E5'); // lightened by 25% white
  });

  it('verifies the mid-tone accents #0284C7 and #0D9488 and falls back when AA fails', () => {
    const onLight = parseHex(colorTokens.light.onPrimary);
    const onDark = parseHex(colorTokens.dark.onPrimary);
    if (!onLight || !onDark) throw new Error('parse');
    for (const hex of [accentPalette.sky, accentPalette.teal]) {
      for (const theme of ['light', 'dark'] as const) {
        const r = resolveAccent(hex, theme);
        const on = theme === 'light' ? onLight : onDark;
        if (r.primary) {
          const p = parseHex(r.primary);
          if (!p) throw new Error('parse');
          expect(meetsAA(on, p)).toBe(true);
        } else {
          expect(r.fellBack).toBe(true);
        }
      }
    }
  });

  it('falls back for an accent that cannot carry white text', () => {
    const r = resolveAccent('#FFFF00', 'light');
    expect(r.primary).toBeNull();
    expect(r.fellBack).toBe(true);
  });

  it('derives hover as 85% accent mixed with black (light) or white (dark)', () => {
    const light = resolveAccent('#4F46E5', 'light');
    const dark = resolveAccent('#4F46E5', 'dark');
    expect(light.hover).toBe('#433CC3');
    const base = parseHex(dark.primary ?? '');
    const hov = parseHex(dark.hover ?? '');
    if (!base || !hov) throw new Error('parse');
    expect(hov.r).toBeGreaterThan(base.r);
  });
});
