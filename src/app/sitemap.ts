import type { MetadataRoute } from 'next';
import { VERTICAL_CONTENT, forPath } from '@/content/verticals';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    '/',
    '/for',
    '/mobile',
    '/web',
    '/features',
    '/family-tree',
    '/trust',
    '/communities',
    '/get-started',
    '/about',
    '/contact',
  ];
  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE}${r}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: r === '/' ? 1 : 0.7,
    })),
    ...VERTICAL_CONTENT.map((c) => ({
      url: `${SITE}${forPath(c)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
