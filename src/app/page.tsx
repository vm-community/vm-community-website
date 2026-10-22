import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/vm/Button';
import { Wordmark } from '@/components/vm/Logo';
import { ThemeToggle } from '@/components/vm/ThemeToggle';

/** Phase 0 placeholder home; replaced by the generic marketing home in Phase 1. */
export default async function HomePage() {
  const t = await getTranslations();
  return (
    <main id="main" className="vm-gutter mx-auto flex min-h-dvh max-w-content flex-col gap-6 py-8">
      <header className="flex items-center justify-between gap-3">
        <Wordmark />
        <ThemeToggle compact />
      </header>
      <section className="vm-hero-glow rounded-lg py-8">
        <h1 className="text-display font-bold">{t('brand.name')}</h1>
        <p className="mt-3 max-w-prose text-body text-text-muted">{t('shell.demoDescription')}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/signin" pill arrow>
            {t('nav.signIn')}
          </ButtonLink>
          <ButtonLink href="/design-system" pill variant="secondary">
            {t('common.learnMore')}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
