import type { CommunityRecord } from '../communities';
import { Rng, seedFromString } from '../core/rng';
import type { CommunityData } from '../model/types';
import { seedPersonas } from './personas';

/** Bump when the seed shape changes so persisted demo data is regenerated. */
export const SEED_VERSION = 1;

export type SeedExtension = (
  data: CommunityData,
  community: CommunityRecord,
  rng: Rng,
  now: Date,
) => void;
const extensions: SeedExtension[] = [];

/** Later phases register their own seeders (families, events, ...) without touching this file. */
export function registerSeedExtension(ext: SeedExtension): void {
  extensions.push(ext);
}

export function buildCommunityData(community: CommunityRecord, now: Date): CommunityData {
  const rng = new Rng(seedFromString(`vm-community:${community.slug}`));
  const { users, persons } = seedPersonas(community, rng.fork('personas'), now);
  const data: CommunityData = {
    slug: community.slug,
    seedVersion: SEED_VERSION,
    users,
    persons,
    settings: {
      appearance: {
        community_name: community.name,
        accent_color: community.accent,
        community_type: community.community_type,
        logo_url: null,
        tagline: community.tagline,
      },
      general: {
        currency: community.currency,
        locale: community.locale,
        timezone: community.timezone,
        city: community.city,
        country: community.country,
      },
      tree: { max_concurrent_spouses: 1, remembrance_enabled: true },
    },
    audit: [],
    notifications: [],
    idempotency: {},
    collections: {},
  };
  for (const ext of extensions) ext(data, community, rng.fork(ext.name || 'ext'), now);
  return data;
}
