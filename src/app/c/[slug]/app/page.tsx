'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/vm/Card';
import { Chip } from '@/components/vm/Chip';
import { PageHeader } from '@/components/vm/PageHeader';
import { useMe } from '@/lib/auth/SessionProvider';
import { useVertical } from '@/lib/verticals/VerticalProvider';

/** Phase 0 placeholder for the dashboard (Phase 2 replaces it). Shows the resolved vocabulary and role. */
export default function AppHomePage() {
  const t = useTranslations();
  const me = useMe();
  const { v, preset, communityName } = useVertical();
  const words = (
    [
      'community',
      'member',
      'family',
      'leader',
      'giving',
      'service',
      'ministry',
      'prayerRequest',
      'certificate',
      'tree',
    ] as const
  ).map((k) => ({ k, s: v(k), p: v(k, 'plural') }));
  return (
    <div className="vm-section-gap">
      <PageHeader
        title={communityName}
        subtitle={me.data ? t('shell.roleBadge', { role: me.data.role }) : undefined}
        meta={<Chip tone="primary">{preset.marketing.name}</Chip>}
      />
      <Card>
        <ul className="grid grid-cols-2 gap-2 text-small sm:grid-cols-3 md:grid-cols-5">
          {words.map((w) => (
            <li key={w.k} className="rounded-sm bg-surface p-3">
              <span className="block text-caption text-text-muted">{w.k}</span>
              <span className="block font-medium">{w.s}</span>
              <span className="block text-text-muted">{w.p}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
