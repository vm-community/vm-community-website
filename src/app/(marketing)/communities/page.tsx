import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Section, SectionHeading } from '@/components/marketing/Sections';
import { Chip } from '@/components/vm/Chip';
import { EmptyState } from '@/components/vm/States';
import { COMMUNITY_DIRECTORY, accentHexFor } from '@/lib/communities';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing.communities');
  return { title: t('title'), description: t('sub'), alternates: { canonical: '/communities' } };
}

export default async function CommunitiesPage() {
  const t = await getTranslations('marketing.communities');
  const tv = await getTranslations('verticals');
  return (
    <Section>
      <SectionHeading as="h1" title={t('title')} sub={t('sub')} />
      {COMMUNITY_DIRECTORY.length === 0 ? (
        <EmptyState title={t('empty')} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {COMMUNITY_DIRECTORY.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/signin?community=${encodeURIComponent(c.slug)}`}
                className="flex h-full flex-col gap-3 overflow-hidden rounded-lg bg-surface-raised p-5 vm-elevated-1 transition-colors vm-hover-surface"
              >
                <span
                  aria-hidden
                  className="-mx-5 -mt-5 h-2"
                  style={{ background: accentHexFor(c) }}
                />
                <span className="flex items-center justify-between gap-2">
                  <span className="text-h3 font-semibold">{c.name}</span>
                  <Chip tone="primary" size="sm">
                    {tv(`${c.type}.name`)}
                  </Chip>
                </span>
                <span className="text-small text-text-muted">{c.tagline}</span>
                <span className="mt-auto text-small font-medium text-primary">{t('enter')}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
