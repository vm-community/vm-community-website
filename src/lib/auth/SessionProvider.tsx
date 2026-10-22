'use client';

import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { z } from 'zod';
import { useApi } from '@/lib/api/provider';
import { isApiError } from '@/lib/api/types';
import { type RoleKey, roleKeyFromName } from './scopes';
import {
  EMPTY_SESSION,
  type ClientSession,
  clearSession,
  getSessionSnapshot,
  readSession,
  subscribeSession,
  writeSession,
} from './session';

export const meSchema = z.object({
  email: z.string(),
  full_name: z.string(),
  tenant: z.string(),
  community: z.string(),
  role: z.string(),
  scopes: z.array(z.string()),
});
export type Me = z.infer<typeof meSchema>;

interface SessionContextValue {
  session: ClientSession;
  /** False during SSR and the first client render; true once localStorage has been read. */
  hydrated: boolean;
  signIn: (communitySlug: string, role: RoleKey | null) => void;
  switchCommunity: (communitySlug: string) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

let primed = false;
function subscribe(listener: () => void): () => void {
  if (!primed) {
    primed = true;
    readSession(); // first read from storage happens on the client, after mount
    queueMicrotask(listener);
  }
  return subscribeSession(() => listener());
}
const getServerSnapshot = () => EMPTY_SESSION;
const subscribeHydration = () => () => undefined;

export function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(subscribe, getSessionSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const queryClient = useQueryClient();

  const signIn = useCallback(
    (communitySlug: string, role: RoleKey | null) => {
      writeSession({ communitySlug, role });
      void queryClient.invalidateQueries();
    },
    [queryClient],
  );
  const switchCommunity = useCallback(
    (communitySlug: string) => {
      writeSession({ ...readSession(), communitySlug });
      void queryClient.resetQueries();
    },
    [queryClient],
  );
  const signOut = useCallback(() => {
    clearSession();
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({ session, hydrated, signIn, switchCommunity, signOut }),
    [session, hydrated, signIn, switchCommunity, signOut],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

export const ME_QUERY_KEY = (slug: string | null) => ['auth', 'me', slug] as const;

/** `auth.me` for the active community; the scope list is already the server's closure. */
export function useMe(): UseQueryResult<Me> {
  const api = useApi();
  const { session, hydrated } = useSession();
  return useQuery({
    queryKey: ME_QUERY_KEY(session.communitySlug),
    queryFn: async () => meSchema.parse(await api.call('auth.me')),
    enabled: hydrated && Boolean(session.communitySlug),
    staleTime: 5 * 60_000,
    retry: (count, error) => isApiError(error) && error.code === 'NETWORK' && count < 2,
  });
}

export function useScopes(): ReadonlySet<string> {
  const me = useMe();
  return useMemo(() => new Set(me.data?.scopes ?? []), [me.data?.scopes]);
}

export function useRoleKey(): RoleKey | null {
  const me = useMe();
  return me.data ? (roleKeyFromName(me.data.role) ?? null) : null;
}
