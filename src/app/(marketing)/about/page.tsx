import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/marketing/Sections';
import { ButtonLink } from '@/components/vm/Button';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.about');
  return { title: t('title'), description: t('body'), alternates: { canonical: '/about' } };
}

export default async function AboutPage() {
  const t = await getTranslations('marketing.about');
  return (
    <Section>
      <div className="mx-auto flex max-w-prose flex-col gap-4">
        <h1 className="text-display font-bold">{t('title')}</h1>
        <p className="text-body text-text-muted">{t('body')}</p>
        <ButtonLink
          href="https://vibemindsolutions.ai"
          external
          pill
          variant="secondary"
          className="w-fit"
        >
          {t('parent')}
        </ButtonLink>
      </div>
    </Section>
  );
}
