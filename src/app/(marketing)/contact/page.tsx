import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/marketing/Sections';
import { ButtonLink } from '@/components/vm/Button';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.contact');
  return { title: t('title'), description: t('body'), alternates: { canonical: '/contact' } };
}

export default async function ContactPage() {
  const t = await getTranslations('marketing.contact');
  const tn = await getTranslations('marketing.nav');
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@example.invalid';
  return (
    <Section>
      <div className="mx-auto flex max-w-prose flex-col gap-4">
        <h1 className="text-display font-bold">{t('title')}</h1>
        <p className="text-body text-text-muted">{t('body')}</p>
        <p className="text-body">
          {t('email')}:{' '}
          <a href={`mailto:${contact}`} className="text-primary hover:underline">
            {contact}
          </a>
        </p>
        <ButtonLink href="/get-started" pill arrow className="w-fit">
          {tn('getStarted')}
        </ButtonLink>
      </div>
    </Section>
  );
}
