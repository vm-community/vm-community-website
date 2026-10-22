import type { ReactNode } from 'react';
import { AppGate } from './AppGate';

export default async function CommunityAppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AppGate slug={slug}>{children}</AppGate>;
}
