import type { ModuleKey } from './verticals';

/**
 * Navigation model (§5.3): an item shows when the preset enables its module AND the caller holds
 * any of its scopes. Labels come from `nav.<labelKey>` or the vocabulary (`vocabKey`).
 */
export interface NavItem {
  key: string;
  path: string;
  module: ModuleKey | null;
  scopes: readonly string[];
  labelKey: string;
  /** When set, the label is the vocabulary word (plural, capitalised) instead of nav.<labelKey>. */
  vocabKey?:
    | 'family'
    | 'tree'
    | 'giving'
    | 'prayerRequest'
    | 'ministry'
    | 'certificate'
    | 'announcement'
    | 'event'
    | 'member'
    | 'guest'
    | 'facility'
    | 'group';
  icon: string;
  /** Bottom-nav slot order on phones (max 5). */
  phoneSlot?: number;
  section: 'main' | 'ops' | 'admin';
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'home',
    path: '',
    module: null,
    scopes: ['dashboard.view', 'profile.read_own'],
    labelKey: 'home',
    icon: 'Home',
    phoneSlot: 1,
    section: 'main',
  },
  {
    key: 'community',
    path: '/community',
    module: 'community',
    scopes: ['feed.read'],
    labelKey: 'community',
    icon: 'Newspaper',
    phoneSlot: 2,
    section: 'main',
  },
  {
    key: 'events',
    path: '/events',
    module: 'events',
    scopes: ['event.read'],
    labelKey: 'events',
    vocabKey: 'event',
    icon: 'CalendarDays',
    phoneSlot: 3,
    section: 'main',
  },
  {
    key: 'tree',
    path: '/tree',
    module: 'tree',
    scopes: ['family.read'],
    labelKey: 'tree',
    vocabKey: 'tree',
    icon: 'Network',
    phoneSlot: 4,
    section: 'main',
  },
  {
    key: 'families',
    path: '/families',
    module: 'families',
    scopes: ['family.read'],
    labelKey: 'families',
    vocabKey: 'family',
    icon: 'HousePlus',
    section: 'main',
  },
  {
    key: 'members',
    path: '/members',
    module: 'members',
    scopes: ['member.read'],
    labelKey: 'members',
    vocabKey: 'member',
    icon: 'Users',
    section: 'main',
  },
  {
    key: 'guests',
    path: '/guests',
    module: 'members',
    scopes: ['guest.read'],
    labelKey: 'guests',
    vocabKey: 'guest',
    icon: 'UserPlus',
    section: 'main',
  },
  {
    key: 'groups',
    path: '/groups',
    module: 'groups',
    scopes: ['group.read'],
    labelKey: 'groups',
    vocabKey: 'group',
    icon: 'UsersRound',
    section: 'main',
  },
  {
    key: 'prayer',
    path: '/prayer',
    module: 'prayer',
    scopes: ['prayer.read'],
    labelKey: 'prayer',
    vocabKey: 'prayerRequest',
    icon: 'HandHeart',
    section: 'main',
  },
  {
    key: 'announcements',
    path: '/announcements',
    module: 'announcements',
    scopes: ['announcement.read'],
    labelKey: 'announcements',
    vocabKey: 'announcement',
    icon: 'Megaphone',
    section: 'main',
  },
  {
    key: 'giving',
    path: '/giving',
    module: 'giving',
    scopes: ['contribution.read_own', 'contribution.give', 'contribution.read'],
    labelKey: 'giving',
    vocabKey: 'giving',
    icon: 'HandCoins',
    section: 'main',
  },
  {
    key: 'documents',
    path: '/documents',
    module: 'documents',
    scopes: ['document.read'],
    labelKey: 'documents',
    icon: 'FileText',
    section: 'ops',
  },
  {
    key: 'media',
    path: '/media',
    module: 'media',
    scopes: ['media.read'],
    labelKey: 'media',
    icon: 'Images',
    section: 'ops',
  },
  {
    key: 'facilities',
    path: '/facilities',
    module: 'bookings',
    scopes: ['facility.read'],
    labelKey: 'facilities',
    vocabKey: 'facility',
    icon: 'Building2',
    section: 'ops',
  },
  {
    key: 'bookings',
    path: '/bookings',
    module: 'bookings',
    scopes: ['booking.read_own', 'booking.read_all'],
    labelKey: 'bookings',
    icon: 'CalendarCheck',
    section: 'ops',
  },
  {
    key: 'teams',
    path: '/teams',
    module: 'ministry',
    scopes: ['ministry.read'],
    labelKey: 'teams',
    vocabKey: 'ministry',
    icon: 'HeartHandshake',
    section: 'ops',
  },
  {
    key: 'serving',
    path: '/serving',
    module: 'ministry',
    scopes: ['roster.respond', 'serving.respond'],
    labelKey: 'serving',
    icon: 'ClipboardCheck',
    section: 'ops',
  },
  {
    key: 'certificates',
    path: '/certificates',
    module: 'certificates',
    scopes: ['certificate.read_own', 'certificate.read'],
    labelKey: 'certificates',
    vocabKey: 'certificate',
    icon: 'Award',
    section: 'ops',
  },
  {
    key: 'notifications',
    path: '/notifications',
    module: null,
    scopes: ['notification.read_own'],
    labelKey: 'notifications',
    icon: 'Bell',
    section: 'ops',
  },
  {
    key: 'me',
    path: '/me',
    module: null,
    scopes: ['profile.read_own'],
    labelKey: 'me',
    icon: 'CircleUser',
    phoneSlot: 5,
    section: 'ops',
  },
  {
    key: 'adminUsers',
    path: '/admin/users',
    module: null,
    scopes: ['user.read', 'membership.manage'],
    labelKey: 'adminUsers',
    icon: 'UserCog',
    section: 'admin',
  },
  {
    key: 'adminRoles',
    path: '/admin/roles',
    module: null,
    scopes: ['role.read'],
    labelKey: 'adminRoles',
    icon: 'ShieldCheck',
    section: 'admin',
  },
  {
    key: 'adminPositions',
    path: '/admin/positions',
    module: null,
    scopes: ['position.read'],
    labelKey: 'adminPositions',
    icon: 'BadgeCheck',
    section: 'admin',
  },
  {
    key: 'adminModeration',
    path: '/admin/moderation',
    module: null,
    scopes: ['moderation.read'],
    labelKey: 'adminModeration',
    icon: 'Flag',
    section: 'admin',
  },
  {
    key: 'adminReports',
    path: '/admin/reports',
    module: null,
    scopes: ['report.view'],
    labelKey: 'adminReports',
    icon: 'BarChart3',
    section: 'admin',
  },
  {
    key: 'adminAudit',
    path: '/admin/audit',
    module: null,
    scopes: ['audit.read'],
    labelKey: 'adminAudit',
    icon: 'ScrollText',
    section: 'admin',
  },
  {
    key: 'adminSettings',
    path: '/admin/settings',
    module: null,
    scopes: ['settings.read'],
    labelKey: 'adminSettings',
    icon: 'Settings',
    section: 'admin',
  },
  {
    key: 'adminHr',
    path: '/admin/hr',
    module: 'hr',
    scopes: ['employee.read'],
    labelKey: 'adminHr',
    icon: 'Briefcase',
    section: 'admin',
  },
  {
    key: 'adminPrivacy',
    path: '/admin/privacy',
    module: null,
    scopes: ['dsar.process', 'consent.manage', 'privacy.breach.manage'],
    labelKey: 'adminPrivacy',
    icon: 'Lock',
    section: 'admin',
  },
];

export function visibleNav(
  scopes: ReadonlySet<string>,
  moduleEnabled: (m: ModuleKey) => boolean,
): NavItem[] {
  return NAV_ITEMS.filter(
    (item) =>
      (item.module === null || moduleEnabled(item.module)) &&
      item.scopes.some((s) => scopes.has(s)),
  );
}

export function appPath(slug: string, path = ''): string {
  return `/c/${slug}/app${path}`;
}
