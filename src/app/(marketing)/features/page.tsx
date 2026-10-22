import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CtaBand, Icon, Section, SectionHeading } from '@/components/marketing/Sections';
import { Chip } from '@/components/vm/Chip';
import type { IconName } from '@/content/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.features');
  return { title: t('title'), description: t('sub'), alternates: { canonical: '/features' } };
}

const MODULES: Array<{ key: string; icon: IconName; mobile: boolean }> = [
  { key: 'members', icon: 'Users', mobile: true },
  { key: 'families', icon: 'Home', mobile: true },
  { key: 'tree', icon: 'Network', mobile: true },
  { key: 'events', icon: 'CalendarDays', mobile: true },
  { key: 'giving', icon: 'HandCoins', mobile: true },
  { key: 'community', icon: 'Newspaper', mobile: true },
  { key: 'groups', icon: 'UsersRound', mobile: true },
  { key: 'prayer', icon: 'HandHeart', mobile: true },
  { key: 'ministry', icon: 'HeartHandshake', mobile: true },
  { key: 'documents', icon: 'FileText', mobile: true },
  { key: 'media', icon: 'Images', mobile: true },
  { key: 'bookings', icon: 'Building2', mobile: true },
  { key: 'announcements', icon: 'Megaphone', mobile: true },
  { key: 'certificates', icon: 'Award', mobile: true },
  { key: 'notifications', icon: 'Bell', mobile: true },
  { key: 'privacy', icon: 'Lock', mobile: true },
  { key: 'reports', icon: 'BarChart3', mobile: false },
  { key: 'hr', icon: 'ClipboardCheck', mobile: false },
];

export default async function FeaturesPage() {
  const t = await getTranslations('marketing.features');
  const tc = await getTranslations('marketing.common');
  const tn = await getTranslations('marketing.nav');
  const tm = await getTranslations('modules');
  return (
    <>
      <Section>
        <SectionHeading as="h1" title={t('title')} sub={t('sub')} />
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {MODULES.map((m) => (
            <li
              key={m.key}
              id={m.key}
              className="flex flex-col gap-3 rounded-lg bg-surface-raised p-5 vm-elevated-1"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md p-2 vm-tint-primary">
                  <Icon name={m.icon} />
                </span>
                <Chip tone={m.mobile ? 'success' : 'muted'} size="sm">
                  {m.mobile ? t('mobileToo') : t('webOnly')}
                </Chip>
              </div>
              <h2 className="text-h3 font-semibold">{tm(`${m.key}.title`)}</h2>
              <p className="text-small text-text-muted">{tm(`${m.key}.body`)}</p>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand title={tc('ctaTitle')} body={tc('ctaBody')} cta={tn('getStarted')} />
    </>
  );
}
