'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { ApiProvider } from '@/lib/api/provider';
import { isMockMode } from '@/lib/api/client';
import { SessionProvider } from '@/lib/auth/SessionProvider';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ToastProvider } from '@/components/vm/Toast';

const DevToolbar = isMockMode()
  ? dynamic(() => import('@/devtools/DevToolbar').then((m) => m.DevToolbar), { ssr: false })
  : () => null;

/** Client-side provider stack shared by every route. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ApiProvider>
        <SessionProvider>
          <ToastProvider>
            {children}
            <DevToolbar />
          </ToastProvider>
        </SessionProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}
