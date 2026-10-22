import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { AppProviders } from '@/components/AppProviders';
import { SignInClient } from './SignInClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('signin');
  return { title: t('title'), robots: { index: false } };
}

export default function SignInPage() {
  return (
    <AppProviders>
      <Suspense fallback={null}>
        <SignInClient />
      </Suspense>
    </AppProviders>
  );
}
