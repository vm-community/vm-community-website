'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, type ReactNode } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { SkeletonList } from '@/components/vm/Skeleton';
import { ErrorState } from '@/components/vm/States';
import { isApiError } from '@/lib/api/types';
import { useMe, useSession } from '@/lib/auth/SessionProvider';
import { VerticalProvider } from '@/lib/verticals/VerticalProvider';

/**
 * Client gate for /c/<slug>/app: aligns the session with the URL's community, sends anonymous
 * visitors to sign-in, and renders the shell once `auth.me` has resolved.
 */
export function AppGate({ slug, children }: { slug: string; children: ReactNode }) {
  const t = useTranslations('common');
  const router = useRouter();
  const { session, hydrated, switchCommunity } = useSession();

  useEffect(() => {
    if (!hydrated) return;
    if (!session.communitySlug) {
      router.replace(
        `/signin?community=${encodeURIComponent(slug)}&next=${encodeURIComponent(`/c/${slug}/app`)}`,
      );
      return;
    }
    if (session.communitySlug !== slug) switchCommunity(slug);
  }, [hydrated, session.communitySlug, slug, router, switchCommunity]);

  if (!hydrated || session.communitySlug !== slug) {
    return (
      <main id="main" className="vm-gutter mx-auto max-w-content py-6">
        <SkeletonList rows={6} />
        <p className="vm-sr-only">{t('loading')}</p>
      </main>
    );
  }
  return (
    <VerticalProvider>
      <MeGate slug={slug}>{children}</MeGate>
    </VerticalProvider>
  );
}

function MeGate({ slug, children }: { slug: string; children: ReactNode }) {
  const me = useMe();
  const router = useRouter();
  const { signOut } = useSession();

  useEffect(() => {
    if (me.isError && isApiError(me.error) && me.error.code === 'AUTH_TOKEN_INVALID') {
      signOut();
      router.replace('/signin');
    }
  }, [me.isError, me.error, router, signOut]);

  if (me.isPending) {
    return (
      <main id="main" className="vm-gutter mx-auto max-w-content py-6">
        <SkeletonList rows={6} />
      </main>
    );
  }
  if (me.isError) {
    return (
      <main id="main" className="vm-gutter mx-auto max-w-content py-6">
        <ErrorState error={me.error} onRetry={() => void me.refetch()} />
      </main>
    );
  }
  return <AppShell slug={slug}>{children}</AppShell>;
}
