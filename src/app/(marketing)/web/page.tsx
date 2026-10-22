import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BrowserFrame } from '@/components/marketing/DeviceFrames';
import { CtaBand, Icon, Section, SectionHeading } from '@/components/marketing/Sections';
import { WebScreen } from '@/components/marketing/WebScreens';
import { ButtonLink } from '@/components/vm/Button';
import type { IconName } from '@/content/types';
import type { WebTask } from '@/content/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.web');
  return { title: t('title'), description: t('sub'), alternates: { canonical: '/web' } };
}

const GROUPS: Array<{
  key: 'leaders' | 'treasurers' | 'admins';
  icon: IconName;
  screens: WebTask['screen'][];
}> = [
  { key: 'leaders', icon: 'BarChart3', screens: ['dashboard', 'events'] },
  { key: 'treasurers', icon: 'HandCoins', screens: ['ledger'] },
  { key: 'admins', icon: 'ShieldCheck', screens: ['members', 'roles', 'approvals', 'tree'] },
];

export default async function WebPage() {
  const t = await getTranslations('marketing.web');
  const tc = await getTranslations('marketing.common');
  const tn = await getTranslations('marketing.nav');
  return (
    <>
      <section className="vm-hero-glow">
        <div className="vm-gutter mx-auto grid max-w-content items-center gap-7 py-8 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h1 className="text-display font-bold md:text-display-lg">{t('title')}</h1>
            <p className="max-w-prose text-body text-text-muted md:text-h3">{t('sub')}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/get-started" pill arrow size="lg">
                {tn('getStarted')}
              </ButtonLink>
              <ButtonLink href="/mobile" pill variant="secondary" size="lg">
                {tc('seeMobile')}
              </ButtonLink>
            </div>
          </div>
          <BrowserFrame>
            <WebScreen kind="dashboard" />
          </BrowserFrame>
        </div>
      </section>
      {GROUPS.map((g, i) => (
        <Section key={g.key} tone={i % 2 === 0 ? 'surface' : 'bg'}>
          <div className="grid items-start gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <span className="w-fit rounded-md p-2 vm-tint-primary">
                <Icon name={g.icon} />
              </span>
              <h2 className="text-h1 font-semibold">{t(`${g.key}Title`)}</h2>
              <p className="max-w-prose text-body text-text-muted">{t(`${g.key}Body`)}</p>
            </div>
            <div className="grid gap-4">
              {g.screens.map((s) => (
                <BrowserFrame key={s}>
                  <WebScreen kind={s} />
                </BrowserFrame>
              ))}
            </div>
          </div>
        </Section>
      ))}
      <Section>
        <SectionHeading title={t('together')} sub={t('togetherBody')} />
        <div className="flex justify-center">
          <ButtonLink href="/mobile" pill arrow variant="secondary">
            {tc('seeMobile')}
          </ButtonLink>
        </div>
      </Section>
      <CtaBand title={tc('ctaTitle')} body={tc('ctaBody')} cta={tn('getStarted')} />
    </>
  );
}
