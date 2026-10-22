import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BrowserFrame, PhoneFrame } from '@/components/marketing/DeviceFrames';
import { Faq } from '@/components/marketing/Faq';
import { FeatureTabsLazy } from '@/components/marketing/FeatureTabsLazy';
import { HeroRotator } from '@/components/marketing/HeroRotator';
import { NetworkMotif, TreeMotif } from '@/components/marketing/NetworkMotif';
import { PhoneScreen } from '@/components/marketing/PhoneScreens';
import {
  BenefitGrid,
  CtaBand,
  Icon,
  Section,
  SectionHeading,
  Steps,
} from '@/components/marketing/Sections';
import { WebScreen } from '@/components/marketing/WebScreens';
import { ButtonLink } from '@/components/vm/Button';
import { VERTICAL_CONTENT, forPath } from '@/content/verticals';
import type { IconName } from '@/content/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.home');
  return { title: t('heroTitle'), description: t('heroSub'), alternates: { canonical: '/' } };
}

const TYPE_ICONS: Record<string, IconName> = {
  church: 'Users',
  mosque: 'Megaphone',
  temple: 'Star',
  club: 'Trophy',
  'family-association': 'Network',
  alumni: 'GraduationCap',
  society: 'Home',
  charity: 'Gift',
};

export default async function HomePage() {
  const t = await getTranslations('marketing.home');
  const tc = await getTranslations('marketing.common');
  const tv = await getTranslations('verticals');
  const tn = await getTranslations('marketing.nav');
  const faq = await getTranslations('homeFaq');
  const benefits = await getTranslations('homeBenefits');

  const types = VERTICAL_CONTENT.map((c) => ({
    key: c.key,
    href: forPath(c),
    name: tv(`${c.key}.name`),
    promise: tv(`${c.key}.promise`),
  }));
  const benefitKeys = [
    'everyone',
    'moment',
    'contribute',
    'connect',
    'control',
    'private',
  ] as const;
  const benefitIcons: Record<(typeof benefitKeys)[number], IconName> = {
    everyone: 'Users',
    moment: 'Bell',
    contribute: 'HandCoins',
    connect: 'Network',
    control: 'ShieldCheck',
    private: 'Lock',
  };
  const faqItems = (
    ['onlyChurches', 'several', 'payments', 'separate', 'colours', 'devices'] as const
  ).map((k) => ({ q: faq(`${k}.q`), a: faq(`${k}.a`) }));

  return (
    <>
      <section className="vm-hero-glow relative overflow-hidden">
        <div className="vm-gutter mx-auto grid max-w-content items-center gap-7 py-8 md:grid-cols-2 md:py-8">
          <div className="flex flex-col gap-5">
            <h1 className="text-display font-bold md:text-display-lg">{t('heroTitle')}</h1>
            <p className="max-w-prose text-body text-text-muted md:text-h3">{t('heroSub')}</p>
            <p className="text-small text-text-muted">
              {t('rotatingPrefix')} <HeroRotator words={types.map((x) => x.name.toLowerCase())} />
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/get-started" pill arrow size="lg">
                {tn('getStarted')}
              </ButtonLink>
              <ButtonLink href="/communities" pill variant="secondary" size="lg">
                {t('findCommunity')}
              </ButtonLink>
            </div>
            <ul className="flex flex-wrap gap-2">
              {types.map((x) => (
                <li key={x.key}>
                  <Link
                    href={x.href}
                    className="inline-flex items-center rounded-full px-3 py-1 text-small vm-border vm-hover-surface vm-target"
                  >
                    {x.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-primary">
            <NetworkMotif animated />
          </div>
        </div>
      </section>

      <Section id="types" tone="surface">
        <SectionHeading title={t('typesTitle')} sub={t('typesSub')} />
        <BenefitGrid
          columns={4}
          items={types.map((x) => ({
            title: x.name,
            body: x.promise,
            icon: TYPE_ICONS[x.key] ?? 'Users',
            href: x.href,
            cta: tc('seeHow'),
          }))}
        />
      </Section>

      <Section id="why">
        <SectionHeading title={t('whyTitle')} sub={t('whySub')} />
        <BenefitGrid
          items={benefitKeys.map((k) => ({
            title: benefits(`${k}.title`),
            body: benefits(`${k}.body`),
            icon: benefitIcons[k],
          }))}
        />
      </Section>

      <Section id="sync" tone="surface">
        <SectionHeading title={t('syncTitle')} sub={t('syncSub')} />
        <div className="grid items-start gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-h2 font-semibold">{t('syncWebTitle')}</h3>
            <p className="text-small text-text-muted">{t('syncWebBody')}</p>
            <BrowserFrame>
              <WebScreen kind="dashboard" />
            </BrowserFrame>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-h2 font-semibold">{t('syncPhoneTitle')}</h3>
            <p className="text-small text-text-muted">{t('syncPhoneBody')}</p>
            <PhoneFrame>
              <PhoneScreen kind="feed" />
            </PhoneFrame>
          </div>
        </div>
      </Section>

      <Section id="features">
        <SectionHeading title={t('featuresTitle')} sub={t('featuresSub')} />
        <FeatureTabsLazy />
      </Section>

      <Section id="tree" tone="surface">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="text-primary">
            <TreeMotif />
          </div>
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-md p-2 vm-tint-primary">
              <Icon name="Network" />
            </span>
            <h2 className="text-h1 font-semibold md:text-display">{t('treeTitle')}</h2>
            <p className="text-body text-text-muted">{t('treeBody')}</p>
            <ButtonLink href="/family-tree" pill arrow variant="secondary" className="w-fit">
              {t('treeCta')}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section id="how">
        <SectionHeading title={t('howTitle')} />
        <Steps
          items={[1, 2, 3].map((n) => ({ title: t(`how${n}Title`), body: t(`how${n}Body`) }))}
        />
      </Section>

      <Section id="trust" tone="surface">
        <div className="mx-auto flex max-w-prose flex-col items-center gap-3 text-center">
          <span className="rounded-md p-2 vm-tint-success">
            <Icon name="ShieldCheck" />
          </span>
          <h2 className="text-h1 font-semibold">{t('trustTitle')}</h2>
          <p className="text-body text-text-muted">{t('trustBody')}</p>
          <Link href="/trust" className="text-small font-medium text-primary hover:underline">
            {t('trustCta')}
          </Link>
        </div>
      </Section>

      <Section id="faq">
        <Faq title={t('faqTitle')} items={faqItems} />
      </Section>

      <CtaBand title={tc('ctaTitle')} body={tc('ctaBody')} cta={tn('getStarted')} />
    </>
  );
}
