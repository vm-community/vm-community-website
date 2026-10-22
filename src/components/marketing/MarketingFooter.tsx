import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LogoGlyph, Wordmark } from '@/components/vm/Logo';
import type { SolutionLink } from './MarketingHeader';

const PARENT_URL = 'https://vibemindsolutions.ai';

export function MarketingFooter({ solutions }: { solutions: SolutionLink[] }) {
  const t = useTranslations('marketing.nav');
  const tc = useTranslations('marketing.common');
  const tv = useTranslations('verticals');
  const tb = useTranslations('brand');
  const columns: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
    {
      title: t('solutions'),
      links: [
        { href: '/for', label: t('allTypes') },
        ...solutions.map((s) => ({ href: s.href, label: tv(`${s.key}.name`) })),
      ],
    },
    {
      title: t('product'),
      links: [
        { href: '/mobile', label: t('mobile') },
        { href: '/web', label: t('web') },
        { href: '/features', label: t('features') },
        { href: '/family-tree', label: t('familyTree') },
        { href: '/trust', label: t('trust') },
        { href: '/communities', label: t('communities') },
      ],
    },
    {
      title: t('company'),
      links: [
        { href: '/about', label: t('about') },
        { href: '/contact', label: t('contact') },
        { href: '/get-started', label: t('getStarted') },
        { href: '/signin', label: t('signIn') },
      ],
    },
    {
      title: t('legal'),
      links: [
        { href: '/privacy-policy', label: t('privacy') },
        { href: '/terms', label: t('terms') },
        { href: '/cookies', label: t('cookies') },
      ],
    },
  ];
  return (
    <footer aria-label={t('footerLabel')} className="mt-8 bg-surface vm-border-t">
      <div className="vm-gutter mx-auto grid max-w-content gap-6 py-7 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-3 lg:col-span-1">
          <Wordmark />
          <p className="text-small text-text-muted">{tb('name')}</p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2">
            <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">
              {col.title}
            </p>
            <ul className="flex flex-col gap-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="rounded-sm text-small text-text-muted hover:text-text hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="vm-gutter mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 py-4 text-caption text-text-muted vm-border-t">
        <a
          href={PARENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm hover:text-text"
        >
          <LogoGlyph size={16} />
          {tc('poweredBy')}
        </a>
        <span>{tb('parentName')}</span>
      </div>
    </footer>
  );
}
