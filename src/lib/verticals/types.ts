import type { AccentKey } from '@/styles/tokens';

export const VERTICAL_KEYS = [
  'church',
  'mosque',
  'temple',
  'club',
  'family-association',
  'alumni',
  'society',
  'charity',
  'generic',
] as const;
export type VerticalKey = (typeof VERTICAL_KEYS)[number];

export const MODULE_KEYS = [
  'members',
  'families',
  'events',
  'giving',
  'community',
  'groups',
  'prayer',
  'ministry',
  'documents',
  'media',
  'bookings',
  'announcements',
  'tree',
  'certificates',
  'hr',
] as const;
export type ModuleKey = (typeof MODULE_KEYS)[number];

export const VOCAB_KEYS = [
  'community',
  'member',
  'guest',
  'family',
  'household',
  'leader',
  'giving',
  'fund',
  'contribution',
  'prayerRequest',
  'prayAction',
  'service',
  'ministry',
  'team',
  'group',
  'announcement',
  'event',
  'facility',
  'certificate',
  'positions',
  'tree',
] as const;
export type VocabKey = (typeof VOCAB_KEYS)[number];

export type VocabEntry = { singular: string; plural: string };
export type Vocabulary = Record<VocabKey, VocabEntry>;

export type IconKey = ModuleKey | 'leader' | 'home' | 'me' | 'notifications';

export interface VerticalPreset {
  key: VerticalKey;
  marketing: {
    name: string;
    slug: string;
    tagline: string;
    heroImageVariant: string;
    testimonialsKey: string;
  };
  /** Named accent from the token palette; resolved through tokens at runtime, contrast-checked. */
  accentDefault: AccentKey;
  enabledModules: ModuleKey[];
  /** Modules the preset allows but turns off by default (community setting may enable). */
  optionalModules?: ModuleKey[];
  vocabulary: Vocabulary;
  defaultRoles: Record<'member' | 'staff' | 'leader' | 'finance' | 'admin', string>;
  iconOverrides?: Partial<Record<IconKey, string>>;
  features: { familyTree: boolean; prayerOrReflection: boolean; ritualCalendar: boolean };
}

/** The vertical-neutral base vocabulary every preset starts from. */
export const BASE_VOCABULARY: Vocabulary = {
  community: { singular: 'community', plural: 'communities' },
  member: { singular: 'member', plural: 'members' },
  guest: { singular: 'guest', plural: 'guests' },
  family: { singular: 'family', plural: 'families' },
  household: { singular: 'household', plural: 'households' },
  leader: { singular: 'leader', plural: 'leaders' },
  giving: { singular: 'contribution', plural: 'contributions' },
  fund: { singular: 'fund', plural: 'funds' },
  contribution: { singular: 'contribution', plural: 'contributions' },
  prayerRequest: { singular: 'support request', plural: 'support requests' },
  prayAction: { singular: 'I stood with you', plural: 'stood with you' },
  service: { singular: 'gathering', plural: 'gatherings' },
  ministry: { singular: 'team', plural: 'teams' },
  team: { singular: 'team', plural: 'teams' },
  group: { singular: 'group', plural: 'groups' },
  announcement: { singular: 'announcement', plural: 'announcements' },
  event: { singular: 'event', plural: 'events' },
  facility: { singular: 'facility', plural: 'facilities' },
  certificate: { singular: 'certificate', plural: 'certificates' },
  positions: { singular: 'position', plural: 'positions' },
  tree: { singular: 'family tree', plural: 'family trees' },
};

export function withVocabulary(overrides: Partial<Vocabulary>): Vocabulary {
  return { ...BASE_VOCABULARY, ...overrides };
}
