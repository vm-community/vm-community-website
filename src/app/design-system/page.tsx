import type { Metadata } from 'next';
import { DesignSystemClient } from './DesignSystemClient';

export const metadata: Metadata = {
  title: 'Design system',
  robots: { index: false, follow: false },
};

/** Internal visual-regression surface: every token and component in both themes. Not linked. */
export default function DesignSystemPage() {
  return <DesignSystemClient />;
}
