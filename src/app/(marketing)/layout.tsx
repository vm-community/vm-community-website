import type { ReactNode } from 'react';
import { JsonLd } from '@/components/marketing/JsonLd';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';
import { MarketingHeader, type SolutionLink } from '@/components/marketing/MarketingHeader';
import { VERTICAL_CONTENT, forPath } from '@/content/verticals';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const solutions: SolutionLink[] = VERTICAL_CONTENT.map((c) => ({ key: c.key, href: forPath(c) }));
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              name: 'Vibe Mind AI Solutions',
              url: 'https://vibemindsolutions.ai',
            },
            {
              '@type': 'SoftwareApplication',
              name: 'VibeMind Community',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web, Android, iOS',
              url: SITE,
              publisher: { '@type': 'Organization', name: 'Vibe Mind AI Solutions' },
            },
          ],
        }}
      />
      <MarketingHeader solutions={solutions} />
      <main id="main">{children}</main>
      <MarketingFooter solutions={solutions} />
    </>
  );
}
