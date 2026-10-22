import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/vm/Button';
import { Wordmark } from '@/components/vm/Logo';

export default async function NotFound() {
  const t = await getTranslations('errors');
  return (
    <main
      id="main"
      className="vm-gutter mx-auto flex min-h-dvh max-w-content flex-col items-center justify-center gap-4 text-center"
    >
      <Wordmark />
      <h1 className="text-h1 font-semibold">{t('pageTitle404')}</h1>
      <p className="max-w-prose text-text-muted">{t('pageBody404')}</p>
      <ButtonLink href="/" pill arrow>
        {t('goHome')}
      </ButtonLink>
    </main>
  );
}
