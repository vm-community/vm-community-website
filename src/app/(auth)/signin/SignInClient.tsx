'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ButtonLink, Button } from '@/components/vm/Button';
import { Card } from '@/components/vm/Card';
import { RadioGroup } from '@/components/vm/Checkbox';
import { Field } from '@/components/vm/Field';
import { Wordmark } from '@/components/vm/Logo';
import { Select } from '@/components/vm/Select';
import { ThemeToggle } from '@/components/vm/ThemeToggle';
import { isMockMode } from '@/lib/api/client';
import { ROLE_KEYS, type RoleKey } from '@/lib/auth/scopes';
import { useSession } from '@/lib/auth/SessionProvider';
import { appPath } from '@/lib/nav';
import { COMMUNITY_DIRECTORY } from '@/lib/communities';

/**
 * Sign-in. Mock mode: persona + community picker, no password. Live mode: hands off to the BFF
 * OIDC login (built in Phase 6; not verifiable here).
 */
export function SignInClient() {
  const t = useTranslations('signin');
  const tn = useTranslations('nav');
  const tr = useTranslations('roles');
  const router = useRouter();
  const params = useSearchParams();
  const { session, hydrated, signIn } = useSession();
  const [community, setCommunity] = useState(
    () => params.get('community') ?? COMMUNITY_DIRECTORY[0]?.slug ?? '',
  );
  const [role, setRole] = useState<RoleKey>('member');
  const next = params.get('next');

  useEffect(() => {
    if (hydrated && session.communitySlug && session.role && !params.get('community')) {
      router.replace(appPath(session.communitySlug));
    }
  }, [hydrated, session, router, params]);

  function submit() {
    if (!community) return;
    signIn(community, role);
    router.push(next?.startsWith('/') ? next : appPath(community));
  }

  const mock = isMockMode();

  return (
    <main id="main" className="flex min-h-dvh flex-col md:flex-row">
      <section
        className="vm-gradient-brand relative hidden flex-1 flex-col justify-between p-8 text-on-scrim md:flex"
        aria-hidden
      >
        <Wordmark className="text-on-scrim [&_span]:text-on-scrim" />
        <p className="max-w-prose text-h2 font-semibold">{t('subtitle')}</p>
      </section>
      <section className="vm-gutter flex flex-1 flex-col justify-center gap-6 py-8">
        <div className="flex items-center justify-between gap-3 md:hidden">
          <Wordmark />
          <ThemeToggle compact />
        </div>
        <Card feature className="mx-auto w-full max-w-prose">
          <h1 className="text-h1 font-semibold">{mock ? t('mockTitle') : t('title')}</h1>
          <p className="mt-1 text-small text-text-muted">
            {mock ? t('mockSubtitle') : t('subtitle')}
          </p>
          {mock ? (
            <form
              className="mt-5 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <Field label={t('community')} required>
                <Select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  placeholder={false}
                  options={COMMUNITY_DIRECTORY.map((c) => ({ value: c.slug, label: c.name }))}
                />
              </Field>
              <Field label={t('persona')} asGroup required>
                <RadioGroup
                  name="persona"
                  value={role}
                  onChange={(v) => setRole(v as RoleKey)}
                  options={ROLE_KEYS.map((r) => ({
                    value: r,
                    label: tr(r, { leader: 'Leader' }),
                    description: t(`personaDescription.${r}`),
                  }))}
                />
              </Field>
              <Button type="submit" pill arrow disabled={!community}>
                {t('continue')}
              </Button>
            </form>
          ) : (
            <div className="mt-5 flex flex-col gap-3">
              <ButtonLink
                href={`/api/auth/login${community ? `?community=${encodeURIComponent(community)}` : ''}`}
                pill
                arrow
                external={false}
              >
                {t('liveButton')}
              </ButtonLink>
              <p className="text-caption text-text-muted">{t('liveHelp')}</p>
              <Link href="/forgot-password" className="text-small text-primary hover:underline">
                {t('forgot')}
              </Link>
            </div>
          )}
        </Card>
        <p className="text-center text-small">
          <Link href="/" className="text-text-muted hover:underline">
            {t('backHome')}
          </Link>
          <span className="mx-2 text-text-muted" aria-hidden>
            ·
          </span>
          <Link href="/get-started" className="text-primary hover:underline">
            {tn('getStarted')}
          </Link>
        </p>
      </section>
    </main>
  );
}
