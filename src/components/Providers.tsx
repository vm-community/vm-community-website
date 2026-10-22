'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';

/**
 * Root provider stack: only the theme, which every route needs. Toasts, the API client, session
 * and dev toolbar live in AppProviders so marketing pages stay within the JS budget.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
