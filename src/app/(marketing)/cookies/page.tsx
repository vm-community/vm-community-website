import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/components/marketing/LegalPage';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.legal');
  return { title: t('cookiesTitle'), robots: { index: false } };
}

export default function Page() {
  return <LegalPage titleKey="cookiesTitle" />;
}
