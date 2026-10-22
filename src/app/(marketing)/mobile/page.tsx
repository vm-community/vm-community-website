import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PhoneFrame } from '@/components/marketing/DeviceFrames';
import { PhoneScreen, type PhoneScreenKind } from '@/components/marketing/PhoneScreens';
import { CtaBand, Icon, Section, SectionHeading } from '@/components/marketing/Sections';
import { ButtonLink } from '@/components/vm/Button';
import { InlineAlert } from '@/components/vm/Banner';
import type { IconName } from '@/content/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.mobile');
  return { title: t('title'), description: t('sub'), alternates: { canonical: '/mobile' } };
}

const SECTIONS: Array<{ n: 1 | 2 | 3 | 4 | 5 | 6 | 7; icon: IconName; screen: PhoneScreenKind }> = [
  { n: 1, icon: 'Newspaper', screen: 'feed' },
  { n: 2, icon: 'CalendarDays', screen: 'event' },
  { n: 3, icon: 'HandCoins', screen: 'giving' },
  { n: 4, icon: 'Network', screen: 'family' },
  { n: 5, icon: 'HeartHandshake', screen: 'serving' },
  { n: 6, icon: 'Lock', screen: 'privacy' },
  { n: 7, icon: 'Sparkles', screen: 'communities' },
];

export default async function MobilePage() {
  const t = await getTranslations('marketing.mobile');
  const tc = await getTranslations('marketing.common');
  const tn = await getTranslations('marketing.nav');
  const ios = process.env.NEXT_PUBLIC_IOS_URL;
  const android = process.env.NEXT_PUBLIC_ANDROID_URL;
  return (
    <>
      <section className="vm-hero-glow">
        <div className="vm-gutter mx-auto grid max-w-content items-center gap-7 py-8 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h1 className="text-display font-bold md:text-display-lg">{t('title')}</h1>
            <p className="max-w-prose text-body text-text-muted md:text-h3">{t('sub')}</p>
            <div className="flex flex-wrap gap-3">
              {ios ? (
                <ButtonLink href={ios} external pill>
                  {t('ios')}
                </ButtonLink>
              ) : null}
              {android ? (
                <ButtonLink href={android} external pill>
                  {t('android')}
                </ButtonLink>
              ) : null}
              {!ios && !android && (
                <ButtonLink href="/get-started" pill arrow>
                  {t('earlyAccess')}
                </ButtonLink>
              )}
              <ButtonLink href="/web" pill variant="secondary">
                {tc('seeWeb')}
              </ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PhoneFrame>
              <PhoneScreen kind="feed" />
            </PhoneFrame>
            <PhoneFrame className="mt-7">
              <PhoneScreen kind="event" />
            </PhoneFrame>
          </div>
        </div>
      </section>

      {SECTIONS.map((s, i) => (
        <Section key={s.n} tone={i % 2 === 0 ? 'surface' : 'bg'}>
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div className={i % 2 === 1 ? 'flex flex-col gap-3 md:order-2' : 'flex flex-col gap-3'}>
              <span className="w-fit rounded-md p-2 vm-tint-primary">
                <Icon name={s.icon} />
              </span>
              <h2 className="text-h1 font-semibold">{t(`s${s.n}Title`)}</h2>
              <p className="max-w-prose text-body text-text-muted">{t(`s${s.n}Body`)}</p>
            </div>
            <PhoneFrame>
              <PhoneScreen kind={s.screen} />
            </PhoneFrame>
          </div>
        </Section>
      ))}

      <Section>
        <SectionHeading title={t('need')} />
        <ul className="mx-auto flex max-w-prose list-disc flex-col gap-2 ps-5 text-body text-text-muted">
          <li>{t('need1')}</li>
          <li>{t('need2')}</li>
        </ul>
        <div className="mx-auto mt-5 max-w-prose">
          <InlineAlert tone="info">{t('honesty')}</InlineAlert>
        </div>
      </Section>

      <CtaBand title={tc('ctaTitle')} body={tc('ctaBody')} cta={tn('getStarted')} />
    </>
  );
}
