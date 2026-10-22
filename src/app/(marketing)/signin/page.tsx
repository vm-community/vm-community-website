import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Section } from '@/components/marketing/Sections';
import { ButtonLink } from '@/components/vm/Button';
import { COMMUNITY_DIRECTORY } from '@/lib/communities';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.signin');
  return { title: t('title'), robots: { index: false } };
}

/** The signed-in app is a separate product surface; this page hands visitors over when a URL is configured. */
export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ community?: string }>;
}) {
  const t = await getTranslations('marketing.signin');
  const community: string | undefined = process.env.GITHUB_PAGES
    ? undefined
    : (await searchParams)?.community;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const known = COMMUNITY_DIRECTORY.find((c) => c.slug === community);
  const target = appUrl ? `${appUrl.replace(/\/$/, '')}${known ? `/c/${known.slug}` : ''}` : null;
  return (
    <Section>
      <div className="mx-auto flex max-w-prose flex-col gap-4">
        <h1 className="text-display font-bold">{t('title')}</h1>
        {known && <p className="text-body font-medium">{known.name}</p>}
        <p className="text-body text-text-muted">{target ? t('body') : t('bodyNoApp')}</p>
        <div className="flex flex-wrap gap-3">
          {target && (
            <ButtonLink href={target} pill arrow>
              {t('continue')}
            </ButtonLink>
          )}
          <ButtonLink href="/get-started" pill variant="secondary">
            {t('talk')}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
