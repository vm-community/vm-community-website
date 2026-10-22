'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { getApiClient } from './client';
import { isApiError, type ApiClient } from './types';

const ApiContext = createContext<ApiClient | null>(null);

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (isApiError(error)) {
            // Only transient faults are retried; auth/validation/not-found are final.
            return (error.code === 'NETWORK' || error.code === 'INTERNAL') && failureCount < 2;
          }
          return failureCount < 1;
        },
      },
      mutations: { retry: 0 },
    },
  });
}

export function ApiProvider({ children, client }: { children: ReactNode; client?: ApiClient }) {
  const [queryClient] = useState(makeQueryClient);
  const api = useMemo(() => client ?? getApiClient(), [client]);
  return (
    <ApiContext.Provider value={api}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApiContext.Provider>
  );
}

export function useApi(): ApiClient {
  const api = useContext(ApiContext);
  if (!api) throw new Error('useApi must be used within ApiProvider');
  return api;
}
