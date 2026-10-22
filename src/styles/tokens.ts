/**
 * Typed mirror of tokens.css. This file (together with tokens.css and globals.css) is the ONLY
 * place where raw colour, spacing and radius literals may live. Everything else references these.
 */
export const colorTokens = {
  light: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    secondary: '#7C3AED',
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceRaised: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    textMuted: '#64748B',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#0284C7',
    onPrimary: '#FFFFFF',
    scrim: 'rgba(0, 0, 0, 0.70)',
    onScrim: '#FFFFFF',
  },
  dark: {
    primary: '#818CF8',
    primaryHover: '#A5B4FC',
    secondary: '#A78BFA',
    bg: '#0F172A',
    surface: '#1E293B',
    surfaceRaised: '#334155',
    border: '#334155',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#38BDF8',
    onPrimary: '#0F172A',
    scrim: 'rgba(0, 0, 0, 0.70)',
    onScrim: '#FFFFFF',
  },
} as const;

export type ThemeName = keyof typeof colorTokens;

export const gradientBrand = 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%)';

/** Named accents used by the sample communities of §1 and as preset defaults. */
export const accentPalette = {
  indigo: '#4F46E5',
  sky: '#0284C7',
  teal: '#0D9488',
  emerald: '#047857',
  orange: '#C2410C',
  violet: '#7C3AED',
} as const;
export type AccentKey = keyof typeof accentPalette;

/** Pure white / near-black used for accent derivation (mix 25% white in dark; hover mixes). */
export const mixBases = { white: '#FFFFFF', black: '#000000' } as const;

export const spaceTokens = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 } as const;
export type SpaceStep = keyof typeof spaceTokens;

export const radiusTokens = { sm: 6, md: 8, lg: 12, full: 9999 } as const;

export const typeTokens = {
  display: '2.25rem',
  h1: '1.5rem',
  h2: '1.25rem',
  h3: '1.125rem',
  body: '1rem',
  small: '0.875rem',
  caption: '0.75rem',
  lhBody: 1.5,
  lhHeading: 1.25,
} as const;

export const motionTokens = {
  fast: 120,
  base: 200,
  slow: 320,
  ease: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const breakpoints = { phoneMax: 600, tabletMax: 840, desktopMin: 841, wide: 1200 } as const;

export const layoutTokens = {
  contentMax: 1200,
  proseMax: 720,
  sidebar: 264,
  sidebarCollapsed: 72,
  topbar: 56,
  bottomNav: 64,
  control: 40,
  controlTouch: 48,
  targetMin: 44,
  icon: 20,
  iconSm: 16,
  iconLg: 24,
  iconStroke: 1.75,
} as const;

/** CSS custom property names, for the rare case code must address a token by name. */
export const cssVar = {
  primary: '--vm-color-primary',
  primaryHover: '--vm-color-primary-hover',
  onPrimary: '--vm-color-on-primary',
  bg: '--vm-color-bg',
  text: '--vm-color-text',
} as const;
