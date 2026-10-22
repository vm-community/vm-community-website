'use client';

import { useTranslations } from 'next-intl';
import { Button, ButtonLink } from '@/components/vm/Button';
import { Wordmark } from '@/components/vm/Logo';

/** Branded 500 state (route error boundary). */
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');
  const tc = useTranslations('common');
  return (
    <main
      id="main"
      className="vm-gutter mx-auto flex min-h-dvh max-w-content flex-col items-center justify-center gap-4 text-center"
    >
      <Wordmark />
      <h1 className="text-h1 font-semibold">{t('pageTitle500')}</h1>
      <p className="max-w-prose text-text-muted">{t('pageBody500')}</p>
      <div className="flex gap-3">
        <Button onClick={reset} pill>
          {tc('retry')}
        </Button>
        <ButtonLink href="/" pill variant="secondary">
          {t('goHome')}
        </ButtonLink>
      </div>
    </main>
  );
}
