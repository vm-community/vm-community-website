import type { VerticalKey } from '@/lib/verticals';

export interface CommunityRecord {
  slug: string;
  name: string;
  community_type: VerticalKey;
  /** Accent hex as the backend's public settings would return it. */
  accent: string;
  currency: string;
  locale: string;
  timezone: string;
  city: string;
  country: string;
  /** Rough target size of the seed (people). */
  seedSize: number;
  /** Whether the community opted in to the public directory. */
  listed: boolean;
  tagline: string;
}

/** The six sample communities (§1). The first three exist in the real dev environment. */
export const COMMUNITIES: readonly CommunityRecord[] = [
  {
    slug: 'grace',
    name: 'Grace Community',
    community_type: 'church',
    accent: '#4F46E5',
    currency: 'INR',
    locale: 'en-IN',
    timezone: 'Asia/Kolkata',
    city: 'Kochi',
    country: 'India',
    seedSize: 140,
    listed: true,
    tagline: 'A welcoming congregation in the heart of the city.',
  },
  {
    slug: 'harbor',
    name: 'Harbor Fellowship',
    community_type: 'church',
    accent: '#0284C7',
    currency: 'INR',
    locale: 'en-IN',
    timezone: 'Asia/Kolkata',
    city: 'Mangaluru',
    country: 'India',
    seedSize: 32,
    listed: true,
    tagline: 'Small fellowship, open doors.',
  },
  {
    slug: 'pala',
    name: 'St. George Parish',
    community_type: 'church',
    accent: '#0D9488',
    currency: 'INR',
    locale: 'en-IN',
    timezone: 'Asia/Kolkata',
    city: 'Pala',
    country: 'India',
    seedSize: 40,
    listed: true,
    tagline: 'Generations of families, one parish.',
  },
  {
    slug: 'noor',
    name: 'Al-Noor Masjid',
    community_type: 'mosque',
    accent: '#047857',
    currency: 'INR',
    locale: 'en-IN',
    timezone: 'Asia/Kolkata',
    city: 'Kozhikode',
    country: 'India',
    seedSize: 36,
    listed: true,
    tagline: 'Education, charity and community.',
  },
  {
    slug: 'riverside',
    name: 'Riverside Sports Club',
    community_type: 'club',
    accent: '#C2410C',
    currency: 'INR',
    locale: 'en-IN',
    timezone: 'Asia/Kolkata',
    city: 'Pune',
    country: 'India',
    seedSize: 40,
    listed: true,
    tagline: 'Squads, fixtures and the clubhouse.',
  },
  {
    slug: 'kin',
    name: 'Mathew–Thomas Family Association',
    community_type: 'family-association',
    accent: '#7C3AED',
    currency: 'INR',
    locale: 'en-IN',
    timezone: 'Asia/Kolkata',
    city: 'Thrissur',
    country: 'India',
    seedSize: 220,
    listed: true,
    tagline: 'Eight branches, six generations, one family.',
  },
];

export function findCommunity(slug: string | null | undefined): CommunityRecord | undefined {
  return COMMUNITIES.find((c) => c.slug === slug);
}
