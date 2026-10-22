'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  applyThemeAttribute,
  readStoredTheme,
  resolveEffectiveTheme,
  storeTheme,
  type ThemeMode,
} from './theme';

interface ThemeContextValue {
  mode: ThemeMode;
  effective: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Tiny external store so hydration reads localStorage without setState-in-effect. */
interface ThemeSnapshot {
  mode: ThemeMode;
  effective: 'light' | 'dark';
}
const SERVER_SNAPSHOT: ThemeSnapshot = { mode: 'system', effective: 'light' };
let snapshot: ThemeSnapshot | null = null;
const listeners = new Set<() => void>();

function compute(mode: ThemeMode): ThemeSnapshot {
  return { mode, effective: resolveEffectiveTheme(mode) };
}
function emit(): void {
  for (const l of listeners) l();
}
function getSnapshot(): ThemeSnapshot {
  snapshot ??= compute(readStoredTheme());
  return snapshot;
}
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    snapshot = compute(getSnapshot().mode);
    emit();
  };
  mql.addEventListener('change', onChange);
  return () => {
    listeners.delete(listener);
    mql.removeEventListener('change', onChange);
  };
}
export function setThemeMode(mode: ThemeMode): void {
  storeTheme(mode);
  applyThemeAttribute(mode);
  snapshot = compute(mode);
  emit();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const snap = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const setMode = useCallback((next: ThemeMode) => setThemeMode(next), []);
  const value = useMemo(
    () => ({ mode: snap.mode, effective: snap.effective, setMode }),
    [snap, setMode],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
