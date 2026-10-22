'use client';

import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { ButtonLink } from '@/components/vm/Button';
import { Wordmark } from '@/components/vm/Logo';
import { ThemeToggle } from '@/components/vm/ThemeToggle';
import { cn } from '@/lib/cn';
import type { VerticalKey } from '@/lib/verticals';

export interface SolutionLink {
  key: VerticalKey;
  href: string;
}

const NAV: Array<{ key: 'mobile' | 'web' | 'features' | 'familyTree' | 'trust'; href: string }> = [
  { key: 'mobile', href: '/mobile' },
  { key: 'web', href: '/web' },
  { key: 'features', href: '/features' },
  { key: 'familyTree', href: '/family-tree' },
  { key: 'trust', href: '/trust' },
];

/** Marketing header: wordmark, Solutions menu, links, theme toggle, Sign in (outline) and Get started (filled, arrow). */
export function MarketingHeader({ solutions }: { solutions: SolutionLink[] }) {
  const t = useTranslations('marketing.nav');
  const tv = useTranslations('verticals');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solOpen, setSolOpen] = useState(false);
  const solRef = useRef<HTMLDivElement>(null);
  const solId = useId();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!solRef.current?.contains(e.target as Node)) setSolOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSolOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const linkCls = (href: string) =>
    cn(
      'rounded-md px-3 py-2 text-small font-medium transition-colors vm-hover-surface',
      pathname === href ? 'text-primary' : 'text-text-muted hover:text-text',
    );

  const solutionsList = (
    <ul className="grid gap-1 sm:grid-cols-2">
      <li className="sm:col-span-2">
        <Link
          href="/for"
          className="block rounded-md px-3 py-2 text-small font-semibold vm-hover-surface"
          onClick={() => {
            setSolOpen(false);
            setOpen(false);
          }}
        >
          {t('allTypes')}
        </Link>
      </li>
      {solutions.map((s) => (
        <li key={s.key}>
          <Link
            href={s.href}
            className="block rounded-md px-3 py-2 text-small vm-hover-surface"
            onClick={() => {
              setSolOpen(false);
              setOpen(false);
            }}
          >
            <span className="block font-medium">{tv(`${s.key}.name`)}</span>
            <span className="block text-caption text-text-muted">{tv(`${s.key}.promise`)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header
      aria-label={t('headerLabel')}
      className="sticky top-0 z-30 bg-bg/90 backdrop-blur vm-border-b"
    >
      <div className="vm-gutter mx-auto flex h-topbar max-w-content items-center gap-2">
        <Link href="/" className="rounded-sm">
          <Wordmark />
        </Link>
        <nav aria-label={t('solutionsLabel')} className="ms-4 hidden items-center gap-1 lg:flex">
          <div ref={solRef} className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={solOpen}
              aria-controls={solId}
              onClick={() => setSolOpen((o) => !o)}
              className={cn(linkCls('/for'), 'inline-flex items-center gap-1')}
            >
              {t('solutions')}
              <ChevronDown
                className={cn('vm-icon-sm transition-transform', solOpen && 'rotate-180')}
                aria-hidden
              />
            </button>
            {solOpen && (
              <div
                id={solId}
                className="absolute start-0 z-40 mt-1 w-max max-w-content rounded-lg bg-surface-raised p-2 vm-elevated-2"
              >
                {solutionsList}
              </div>
            )}
          </div>
          {NAV.map((n) => (
            <Link key={n.key} href={n.href} className={linkCls(n.href)}>
              {t(n.key)}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <ThemeToggle compact className="max-sm:hidden" />
          <ButtonLink href="/signin" pill variant="secondary" size="sm" className="max-sm:hidden">
            {t('signIn')}
          </ButtonLink>
          <ButtonLink href="/get-started" pill arrow size="sm">
            {t('getStarted')}
          </ButtonLink>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? t('menu') : t('menu')}
            onClick={() => setOpen((o) => !o)}
            className="rounded-md p-2 vm-hover-surface vm-target lg:hidden"
          >
            {open ? (
              <X className="vm-icon" aria-hidden />
            ) : (
              <MenuIcon className="vm-icon" aria-hidden />
            )}
          </button>
        </div>
      </div>
      {open && (
        <nav
          aria-label={t('menu')}
          className="vm-gutter mx-auto flex max-w-content flex-col gap-3 py-4 vm-border-t lg:hidden"
        >
          <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">
            {t('solutions')}
          </p>
          {solutionsList}
          <ul className="flex flex-col gap-1 vm-border-t pt-3">
            {NAV.map((n) => (
              <li key={n.key}>
                <Link
                  href={n.href}
                  className={cn(linkCls(n.href), 'block')}
                  onClick={() => setOpen(false)}
                >
                  {t(n.key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3 vm-border-t pt-3">
            <ThemeToggle compact />
            <ButtonLink href="/signin" pill variant="secondary" size="sm">
              {t('signIn')}
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
