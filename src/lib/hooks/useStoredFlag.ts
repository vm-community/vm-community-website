import { useCallback, useSyncExternalStore } from 'react';

const listeners = new Map<string, Set<() => void>>();

function read(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function write(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    /* storage unavailable */
  }
  for (const l of listeners.get(key) ?? []) l();
}

/** A boolean persisted in localStorage (try/catch), read without setState-in-effect; SSR → false. */
export function useStoredFlag(key: string): [boolean, (value: boolean) => void] {
  const subscribe = useCallback(
    (listener: () => void) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(listener);
      return () => {
        set.delete(listener);
      };
    },
    [key],
  );
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => false,
  );
  const setValue = useCallback((v: boolean) => write(key, v), [key]);
  return [value, setValue];
}
