import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/marketing/Sections';
import { GetStartedForm } from './GetStartedForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.getStarted');
  return { title: t('title'), description: t('sub'), alternates: { canonical: '/get-started' } };
}

export default async function GetStartedPage() {
  const t = await getTranslations('marketing.getStarted');
  return (
    <Section>
      <div className="grid items-start gap-7 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h1 className="text-display font-bold">{t('title')}</h1>
          <p className="max-w-prose text-body text-text-muted">{t('sub')}</p>
          <h2 className="text-h2 font-semibold">{t('expect')}</h2>
          <ol className="flex list-decimal flex-col gap-2 ps-5 text-body text-text-muted">
            <li>{t('expect1')}</li>
            <li>{t('expect2')}</li>
            <li>{t('expect3')}</li>
          </ol>
        </div>
        <GetStartedForm />
      </div>
    </Section>
  );
}
