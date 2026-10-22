'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ChevronUp, FlaskConical, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStoredFlag } from '@/lib/hooks/useStoredFlag';
import { Button } from '@/components/vm/Button';
import { Select } from '@/components/vm/Select';
import { Segmented } from '@/components/vm/Segmented';
import { Switch } from '@/components/vm/Switch';
import { useToast } from '@/components/vm/Toast';
import { ROLE_KEYS, type RoleKey } from '@/lib/auth/scopes';
import { useSession } from '@/lib/auth/SessionProvider';
import { cn } from '@/lib/cn';
import { COMMUNITIES } from '@/mocks/communities';
import {
  readMockSettings,
  writeMockSettings,
  type LatencyPreset,
  type MockSettings,
} from '@/mocks/core/settings';
import { resetMockData } from '@/mocks';

const OPEN_KEY = 'vm.devtools.open';

/** Mock-mode-only toolbar (bottom-left, collapsible): persona, community, reset, tree API, latency, failures. */
export function DevToolbar() {
  const t = useTranslations('devtools');
  const tr = useTranslations('roles');
  const tv = useTranslations('devtools');
  const { session, signIn, switchCommunity } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useStoredFlag(OPEN_KEY);
  const [settings, setSettings] = useState<MockSettings>(() => readMockSettings());
  const [resetting, setResetting] = useState(false);
  const toggleOpen = () => setOpen(!open);

  function update(next: Partial<MockSettings>) {
    setSettings(writeMockSettings(next));
    void queryClient.invalidateQueries();
  }

  function setPersona(role: string) {
    if (!(ROLE_KEYS as readonly string[]).includes(role)) return;
    signIn(session.communitySlug ?? COMMUNITIES[0]?.slug ?? 'grace', role as RoleKey);
  }

  function setCommunity(slug: string) {
    if (!session.role) {
      signIn(slug, 'member');
    } else {
      switchCommunity(slug);
    }
    if (window.location.pathname.startsWith('/c/')) router.push(`/c/${slug}/app`);
  }

  async function reset() {
    setResetting(true);
    try {
      await resetMockData();
      await queryClient.invalidateQueries();
      toast({ title: t('resetDone'), tone: 'success' });
    } finally {
      setResetting(false);
    }
  }

  const latencyLabel = (v: LatencyPreset) =>
    v === 0 ? t('latencyNone') : v === 300 ? t('latencyFast') : t('latencySlow');

  return (
    <aside
      aria-label={t('title')}
      className="fixed start-4 z-40 flex flex-col items-start gap-2 max-md:bottom-bottomnav max-md:mb-2 md:bottom-4 print:hidden"
    >
      {open && (
        <div className="flex w-72 vm-toolbar-width flex-col gap-3 rounded-lg bg-surface-raised p-4 text-small vm-elevated-3">
          <label className="flex flex-col gap-1">
            <span className="font-medium">{t('persona')}</span>
            <Select
              value={session.role ?? ''}
              onChange={(e) => setPersona(e.target.value)}
              placeholder={tv('signedOut')}
              options={ROLE_KEYS.map((r) => ({ value: r, label: tr(r, { leader: 'Leader' }) }))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">{t('community')}</span>
            <Select
              value={session.communitySlug ?? ''}
              onChange={(e) => setCommunity(e.target.value)}
              options={COMMUNITIES.map((c) => ({ value: c.slug, label: c.name }))}
            />
          </label>
          <Switch
            label={t('treeApi')}
            checked={settings.treeApi}
            onChange={(v) => update({ treeApi: v })}
          />
          <p className="-mt-2 text-caption text-text-muted">{t('treeApiHelp')}</p>
          <div className="flex flex-col gap-1">
            <span className="font-medium">{t('latency')}</span>
            <Segmented
              size="sm"
              value={String(settings.latencyMs)}
              onChange={(v) => update({ latencyMs: Number(v) as LatencyPreset })}
              options={([0, 300, 1500] as const).map((v) => ({
                value: String(v),
                label: latencyLabel(v),
              }))}
            />
          </div>
          <Switch
            label={t('failures')}
            checked={settings.failureRate > 0}
            onChange={(v) => update({ failureRate: v ? 0.2 : 0 })}
          />
          <p className="-mt-2 text-caption text-text-muted">{t('failuresHelp')}</p>
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="vm-icon" aria-hidden />}
            onClick={() => void reset()}
            loading={resetting}
          >
            {t('reset')}
          </Button>
        </div>
      )}
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label={open ? t('close') : t('open')}
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-3 text-caption font-medium vm-elevated-2 vm-target',
          'bg-surface-raised text-text',
        )}
      >
        <FlaskConical className="vm-icon-sm" aria-hidden />
        <span>{t('title')}</span>
        <ChevronUp
          className={cn('vm-icon-sm transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
    </aside>
  );
}
