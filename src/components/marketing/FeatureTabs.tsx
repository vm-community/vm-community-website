'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Tabs } from '@/components/vm/Tabs';
import { BrowserFrame } from './DeviceFrames';
import { WebScreen } from './WebScreens';
import type { WebTask } from '@/content/types';

const TABS: Array<{
  key: string;
  modules: Array<
    | 'members'
    | 'families'
    | 'events'
    | 'community'
    | 'giving'
    | 'groups'
    | 'ministry'
    | 'documents'
    | 'media'
    | 'bookings'
    | 'certificates'
  >;
  screen: WebTask['screen'];
}> = [
  { key: 'people', modules: ['members', 'families'], screen: 'members' },
  { key: 'events', modules: ['events'], screen: 'events' },
  { key: 'feed', modules: ['community'], screen: 'approvals' },
  { key: 'giving', modules: ['giving'], screen: 'ledger' },
  { key: 'teams', modules: ['groups', 'ministry'], screen: 'roles' },
  { key: 'docs', modules: ['documents', 'media'], screen: 'documents' },
  { key: 'bookings', modules: ['bookings'], screen: 'dashboard' },
  { key: 'certificates', modules: ['certificates'], screen: 'documents' },
];

/** Home-page feature tabs: each tab shows an illustrative composition and the module bullets. */
export function FeatureTabs() {
  const t = useTranslations('marketing.featureTabs');
  const tm = useTranslations('modules');
  const [tab, setTab] = useState('people');
  const current = TABS.find((x) => x.key === tab) ?? TABS[0];
  if (!current) return null;
  return (
    <Tabs items={TABS.map((x) => ({ key: x.key, label: t(x.key) }))} value={tab} onChange={setTab}>
      <div className="grid items-start gap-5 md:grid-cols-2">
        <BrowserFrame>
          <WebScreen kind={current.screen} />
        </BrowserFrame>
        <ul className="flex flex-col gap-3">
          {current.modules.map((m) => (
            <li key={m} className="rounded-md bg-surface-raised p-4 vm-elevated-1">
              <p className="font-semibold">{tm(`${m}.title`)}</p>
              <p className="text-small text-text-muted">{tm(`${m}.body`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </Tabs>
  );
}
