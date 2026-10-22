import type { VerticalKey } from './verticals';
import { accentPalette, type AccentKey } from '@/styles/tokens';

/**
 * Public, opt-in community directory (§8.1 `/communities`). Static config: the real backend has
 * no registry endpoint for this (ASSUMPTIONS). In mock mode the six samples; in live mode this
 * list is what the operator ships (edit here or wire a registry later).
 */
export interface DirectoryEntry {
  slug: string;
  name: string;
  type: VerticalKey;
  accent: AccentKey;
  tagline: string;
}

export const COMMUNITY_DIRECTORY: readonly DirectoryEntry[] = [
  {
    slug: 'grace',
    name: 'Grace Community',
    type: 'church',
    accent: 'indigo',
    tagline: 'A welcoming congregation in the heart of the city.',
  },
  {
    slug: 'harbor',
    name: 'Harbor Fellowship',
    type: 'church',
    accent: 'sky',
    tagline: 'Small fellowship, open doors.',
  },
  {
    slug: 'pala',
    name: 'St. George Parish',
    type: 'church',
    accent: 'teal',
    tagline: 'Generations of families, one parish.',
  },
  {
    slug: 'noor',
    name: 'Al-Noor Masjid',
    type: 'mosque',
    accent: 'emerald',
    tagline: 'Education, charity and community.',
  },
  {
    slug: 'riverside',
    name: 'Riverside Sports Club',
    type: 'club',
    accent: 'orange',
    tagline: 'Squads, fixtures and the clubhouse.',
  },
  {
    slug: 'kin',
    name: 'Mathew–Thomas Family Association',
    type: 'family-association',
    accent: 'violet',
    tagline: 'Eight branches, six generations, one family.',
  },
];

export function accentHexFor(entry: DirectoryEntry): string {
  return accentPalette[entry.accent];
}
