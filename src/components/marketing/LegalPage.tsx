import { getTranslations } from 'next-intl/server';
import { InlineAlert } from '@/components/vm/Banner';
import { Section } from './Sections';

/** Legal pages: text clearly marked as placeholder until supplied (gap G4). */
export async function LegalPage({
  titleKey,
}: {
  titleKey: 'privacyTitle' | 'termsTitle' | 'cookiesTitle';
}) {
  const t = await getTranslations('marketing.legal');
  return (
    <Section>
      <div className="mx-auto flex max-w-prose flex-col gap-4">
        <h1 className="text-display font-bold">{t(titleKey)}</h1>
        <InlineAlert tone="warning">{t('placeholder')}</InlineAlert>
      </div>
    </Section>
  );
}
