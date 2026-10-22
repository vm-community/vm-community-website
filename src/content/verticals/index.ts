import type { VerticalKey } from '@/lib/verticals';
import type { VerticalContent } from '../types';
import { alumni } from './alumni';
import { charity } from './charity';
import { church } from './church';
import { club } from './club';
import { familyAssociation } from './family-association';
import { mosque } from './mosque';
import { society } from './society';
import { temple } from './temple';

/** Ordered list of community-type landing pages (/for/<slug>). */
export const VERTICAL_CONTENT: readonly VerticalContent[] = [
  church,
  mosque,
  temple,
  club,
  familyAssociation,
  alumni,
  society,
  charity,
];

export function contentBySlug(slug: string): VerticalContent | undefined {
  return VERTICAL_CONTENT.find((c) => c.slug === slug);
}

export function contentByKey(key: VerticalKey): VerticalContent | undefined {
  return VERTICAL_CONTENT.find((c) => c.key === key);
}

export function forPath(c: Pick<VerticalContent, 'slug'>): string {
  return `/for/${c.slug}`;
}
