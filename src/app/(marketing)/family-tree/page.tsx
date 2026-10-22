import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TreeMotif } from '@/components/marketing/NetworkMotif';
import {
  BenefitGrid,
  CtaBand,
  Icon,
  Section,
  SectionHeading,
} from '@/components/marketing/Sections';
import { InlineAlert } from '@/components/vm/Banner';
import { ButtonLink } from '@/components/vm/Button';
import { Chip } from '@/components/vm/Chip';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.familyTree');
  return { title: t('title'), description: t('sub'), alternates: { canonical: '/family-tree' } };
}

export default async function FamilyTreePage() {
  const t = await getTranslations('marketing.familyTree');
  const tc = await getTranslations('marketing.common');
  const tn = await getTranslations('marketing.nav');
  return (
    <>
      <section className="vm-hero-glow">
        <div className="vm-gutter mx-auto grid max-w-content items-center gap-7 py-8 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h1 className="text-display font-bold md:text-display-lg">{t('title')}</h1>
            <p className="max-w-prose text-body text-text-muted md:text-h3">{t('sub')}</p>
            <ButtonLink href="/get-started" pill arrow size="lg" className="w-fit">
              {tn('getStarted')}
            </ButtonLink>
          </div>
          <div className="text-primary">
            <TreeMotif />
          </div>
        </div>
      </section>

      <Section id="demo" tone="surface">
        <SectionHeading title={t('demoTitle')} sub={t('demoSub')} />
        <div className="mx-auto flex max-w-content flex-col gap-3">
          <Chip tone="muted" className="w-fit">
            {tc('illustrativeSample')}
          </Chip>
          <div className="rounded-lg bg-surface-raised p-5 text-primary vm-elevated-1">
            <TreeMotif className="mx-auto max-w-prose" />
          </div>
          <InlineAlert tone="info">{t('demoPending')}</InlineAlert>
        </div>
      </Section>

      <Section>
        <BenefitGrid
          columns={2}
          items={[
            { title: t('linksTitle'), body: t('linksBody'), icon: 'Network' },
            { title: t('privacyTitle'), body: t('privacyBody'), icon: 'Lock' },
            { title: t('relativesTitle'), body: t('relativesBody'), icon: 'Users' },
            { title: t('exportTitle'), body: t('exportBody'), icon: 'FileText' },
          ]}
        />
      </Section>

      <Section tone="surface">
        <div className="mx-auto flex max-w-prose flex-col items-center gap-3 text-center">
          <span className="rounded-md p-2 vm-tint-primary">
            <Icon name="Sparkles" />
          </span>
          <h2 className="text-h1 font-semibold">{t('whoTitle')}</h2>
          <p className="text-body text-text-muted">{t('whoBody')}</p>
        </div>
      </Section>

      <CtaBand title={tc('ctaTitle')} body={tc('ctaBody')} cta={tn('getStarted')} />
    </>
  );
}
