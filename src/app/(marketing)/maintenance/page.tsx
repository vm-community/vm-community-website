import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/marketing/Sections';
import { ButtonLink } from '@/components/vm/Button';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('errors');
  return { title: t('maintenanceTitle'), robots: { index: false } };
}

export default async function MaintenancePage() {
  const t = await getTranslations('errors');
  return (
    <Section>
      <div className="mx-auto flex max-w-prose flex-col items-center gap-4 text-center">
        <h1 className="text-display font-bold">{t('maintenanceTitle')}</h1>
        <p className="text-body text-text-muted">{t('maintenanceBody')}</p>
        <ButtonLink href="/" pill arrow variant="secondary">
          {t('goHome')}
        </ButtonLink>
      </div>
    </Section>
  );
}
