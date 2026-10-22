import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BenefitGrid, CtaBand, Section, SectionHeading } from '@/components/marketing/Sections';
import { ButtonLink } from '@/components/vm/Button';
import type { IconName } from '@/content/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.trust');
  return { title: t('title'), description: t('sub'), alternates: { canonical: '/trust' } };
}

const ICONS: IconName[] = [
  'Building2',
  'ShieldCheck',
  'ClipboardCheck',
  'Lock',
  'Images',
  'Users',
  'FileText',
  'Bell',
];

export default async function TrustPage() {
  const t = await getTranslations('marketing.trust');
  const tc = await getTranslations('marketing.common');
  const tn = await getTranslations('marketing.nav');
  const security = process.env.NEXT_PUBLIC_SECURITY_EMAIL ?? 'security@example.invalid';
  return (
    <>
      <Section>
        <SectionHeading as="h1" title={t('title')} sub={t('sub')} />
        <BenefitGrid
          columns={2}
          items={ICONS.map((icon, i) => ({
            title: t(`t${i + 1}.title`),
            body: t(`t${i + 1}.body`),
            icon,
          }))}
        />
        <div className="mt-6 flex justify-center">
          <ButtonLink href={`mailto:${security}`} external pill variant="secondary">
            {t('report')}
          </ButtonLink>
        </div>
      </Section>
      <CtaBand title={tc('ctaTitle')} body={tc('ctaBody')} cta={tn('getStarted')} />
    </>
  );
}
