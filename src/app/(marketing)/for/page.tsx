import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BenefitGrid, CtaBand, Section, SectionHeading } from '@/components/marketing/Sections';
import type { IconName } from '@/content/types';
import { VERTICAL_CONTENT, forPath } from '@/content/verticals';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.common');
  return {
    title: t('typeIndexTitle'),
    description: t('typeIndexSub'),
    alternates: { canonical: '/for' },
  };
}

const ICONS: Record<string, IconName> = {
  church: 'Users',
  mosque: 'Megaphone',
  temple: 'Star',
  club: 'Trophy',
  'family-association': 'Network',
  alumni: 'GraduationCap',
  society: 'Home',
  charity: 'Gift',
};

export default async function ForIndexPage() {
  const tc = await getTranslations('marketing.common');
  const tn = await getTranslations('marketing.nav');
  return (
    <>
      <Section>
        <SectionHeading as="h1" title={tc('typeIndexTitle')} sub={tc('typeIndexSub')} />
        <BenefitGrid
          columns={4}
          items={VERTICAL_CONTENT.map((c) => ({
            title: c.title.replace(/^VibeMind for /, ''),
            body: c.hero.headline,
            icon: ICONS[c.key] ?? 'Users',
            href: forPath(c),
            cta: tc('seeHow'),
          }))}
        />
      </Section>
      <CtaBand title={tc('ctaTitle')} body={tc('ctaBody')} cta={tn('getStarted')} />
    </>
  );
}
