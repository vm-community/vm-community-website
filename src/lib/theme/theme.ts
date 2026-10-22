import { colorTokens, cssVar, mixBases } from '@/styles/tokens';
import { meetsAA, mix, parseHex, toHex } from './contrast';

export type ThemeMode = 'light' | 'dark' | 'system';
export const THEME_STORAGE_KEY = 'vm.theme';
export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

/**
 * Inline bootstrap applied before first paint (nonce'd in the root layout). Reads the stored
 * choice; when absent, leaves the attribute off so the `prefers-color-scheme` block applies.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var m=localStorage.getItem('${THEME_STORAGE_KEY}');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m);}else{document.documentElement.removeAttribute('data-theme');}}catch(e){}})();`;

export function readStoredTheme(): ThemeMode {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function storeTheme(mode: ThemeMode): void {
  try {
    if (mode === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* storage unavailable: in-memory only */
  }
}

export function applyThemeAttribute(mode: ThemeMode): void {
  const el = document.documentElement;
  if (mode === 'system') el.removeAttribute('data-theme');
  else el.setAttribute('data-theme', mode);
}

/** The theme actually in effect right now (resolves `system`). */
export function resolveEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') return mode;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export interface AccentResolution {
  /** Final primary colour to apply (hex), or null to keep the token default. */
  primary: string | null;
  hover: string | null;
  /** True when the requested accent failed AA against on-primary and the default was kept. */
  fellBack: boolean;
}

/**
 * Per-community accent (§2): in dark mode lighten by mixing 25% white, derive hover with 85%
 * accent + black (light) / white (dark), and verify AA contrast of `on-primary` text. On failure
 * keep the default indigo.
 */
export function resolveAccent(
  accentHex: string | null | undefined,
  theme: 'light' | 'dark',
): AccentResolution {
  const requested = accentHex ? parseHex(accentHex) : null;
  if (!requested) return { primary: null, hover: null, fellBack: false };
  const white = parseHex(mixBases.white);
  const black = parseHex(mixBases.black);
  const onPrimary = parseHex(colorTokens[theme].onPrimary);
  if (!white || !black || !onPrimary) return { primary: null, hover: null, fellBack: false };

  const base = theme === 'dark' ? mix(white, requested, 25) : requested;
  // Buttons use at least 14px semibold text; we still require normal-text AA (4.5) to be safe.
  if (!meetsAA(onPrimary, base)) return { primary: null, hover: null, fellBack: true };
  const hover = theme === 'dark' ? mix(base, white, 85) : mix(base, black, 85);
  return { primary: toHex(base), hover: toHex(hover), fellBack: false };
}

export function applyAccent(resolution: AccentResolution): void {
  const style = document.documentElement.style;
  if (resolution.primary && resolution.hover) {
    style.setProperty(cssVar.primary, resolution.primary);
    style.setProperty(cssVar.primaryHover, resolution.hover);
  } else {
    style.removeProperty(cssVar.primary);
    style.removeProperty(cssVar.primaryHover);
  }
}
