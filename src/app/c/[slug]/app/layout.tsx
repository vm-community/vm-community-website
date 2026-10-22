import type { ReactNode } from 'react';
import { AppProviders } from '@/components/AppProviders';
import { AppGate } from './AppGate';

export default async function CommunityAppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <AppProviders>
      <AppGate slug={slug}>{children}</AppGate>
    </AppProviders>
  );
}
