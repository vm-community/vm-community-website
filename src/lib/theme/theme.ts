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
