import type { Metadata } from 'next';
import { ToastProvider } from '@/components/vm/Toast';
import { DesignSystemClient } from './DesignSystemClient';

export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
};

/** Internal visual-regression surface: every token and component in both themes. Not linked. */
export default function DesignSystemPage() {
  return (
    <ToastProvider>
      <DesignSystemClient />
    </ToastProvider>
  );
}
