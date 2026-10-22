'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/vm/Toast';
import { ApiProvider } from '@/lib/api/provider';
import { isMockMode } from '@/lib/api/client';
import { SessionProvider } from '@/lib/auth/SessionProvider';

const DevToolbar = isMockMode()
  ? dynamic(() => import('@/devtools/DevToolbar').then((m) => m.DevToolbar), { ssr: false })
  : () => null;

/** Provider stack for signed-in surfaces and sign-in: toasts, API client, session, and the mock dev toolbar. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ApiProvider>
      <SessionProvider>
        <ToastProvider>
          {children}
          <DevToolbar />
        </ToastProvider>
      </SessionProvider>
    </ApiProvider>
  );
}
