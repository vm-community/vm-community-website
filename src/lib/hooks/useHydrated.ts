import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;

/** False on the server and during hydration, true afterwards. No setState-in-effect needed. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
