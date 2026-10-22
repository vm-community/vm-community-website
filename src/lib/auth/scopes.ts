/**
 * Scope catalog, implication closure (D-26) and the seeded role matrix (§5).
 * Pure, dependency-free; unit-tested in scopes.test.ts.
 */

export const SCOPE_CATALOG = [
  'member.read',
  'member.create',
  'member.edit',
  'member.delete',
  'member.export',
  'member.convert',
  'member.note',
  'person.resolve',
  'family.read',
  'family.create',
  'family.edit',
  'family.delete',
  'guest.read',
  'guest.create',
  'guest.edit',
  'guest.delete',
  'guest.convert',
  'position.read',
  'position.create',
  'position.edit',
  'position.delete',
  'position.assign',
  'serving.respond',
  'employee.read',
  'employee.create',
  'employee.edit',
  'employee.delete',
  'employee.export',
  'employee.convert',
  'employee.compensation',
  'user.read',
  'user.create',
  'user.edit',
  'user.delete',
  'role.read',
  'role.create',
  'role.edit',
  'role.delete',
  'membership.manage',
  'facility.read',
  'facility.create',
  'facility.edit',
  'facility.delete',
  'booking.read_own',
  'booking.read_all',
  'booking.request',
  'booking.edit',
  'booking.approve',
  'booking.cancel',
  'event.read',
  'event.create',
  'event.edit',
  'event.delete',
  'event.publish',
  'series.read',
  'series.create',
  'series.edit',
  'series.delete',
  'series.generate',
  'registration.rsvp',
  'registration.read',
  'registration.manage',
  'fund.read',
  'fund.create',
  'fund.edit',
  'fund.delete',
  'contribution.read_own',
  'contribution.give',
  'contribution.read',
  'contribution.create',
  'contribution.edit',
  'contribution.delete',
  'contribution.process',
  'receipt.read',
  'receipt.generate',
  'statement.read',
  'announcement.read',
  'announcement.create',
  'announcement.edit',
  'announcement.delete',
  'announcement.publish',
  'announcement.pin',
  'document.read',
  'document.create',
  'document.edit',
  'document.delete',
  'document.publish',
  'document.share',
  'media.read',
  'media.create',
  'media.edit',
  'media.delete',
  'moderation.read',
  'moderation.act',
  'moderation.flag',
  'moderation.rule.manage',
  'certificate.read',
  'certificate.read_own',
  'certificate.create',
  'certificate.edit',
  'certificate.delete',
  'certificate.issue',
  'certificate.revoke',
  'certificate.template.manage',
  'post.read',
  'post.create',
  'post.edit',
  'post.delete',
  'post.publish',
  'post.moderate',
  'comment.write',
  'reaction.write',
  'group.read',
  'group.create',
  'group.edit',
  'group.delete',
  'group.manage',
  'group.join',
  'profile.read_own',
  'profile.write_own',
  'settings.read',
  'settings.write',
  'settings.read_public',
  'org.read',
  'org.write',
  'notification.read_own',
  'notification.send',
  'notification.settings',
  'dashboard.view',
  'report.view',
  'report.export',
  'consent.read_own',
  'consent.manage',
  'dsar.request_own',
  'dsar.process',
  'privacy.breach.manage',
  'audit.read',
  'audit.read_sensitive',
  'audit.read_dpdp',
  'ministry.read',
  'ministry.create',
  'ministry.edit',
  'ministry.delete',
  'roster.manage',
  'roster.respond',
  'attendance.record',
  'prayer.read',
  'prayer.create',
  'prayer.pray',
  'prayer.manage',
  'feed.read',
  'content.share',
  // control plane only; never granted to community roles
  'tenant.read',
  'tenant.create',
  'tenant.edit',
  'tenant.suspend',
  'tenant.delete',
  'platform.metrics',
] as const;

export type Scope = (typeof SCOPE_CATALOG)[number];
const CATALOG_SET: ReadonlySet<string> = new Set(SCOPE_CATALOG);
export function isScope(value: string): value is Scope {
  return CATALOG_SET.has(value);
}

/** Domains where the CRUD ladder delete ⇒ edit ⇒ create ⇒ read applies. */
const CRUD_DOMAINS = [
  'member',
  'family',
  'guest',
  'position',
  'employee',
  'user',
  'role',
  'facility',
  'event',
  'series',
  'fund',
  'contribution',
  'announcement',
  'document',
  'media',
  'certificate',
  'post',
  'group',
  'ministry',
] as const;

/** Explicit verb implications (§5.1). Never derived: feed.read, reaction.write, comment.write, content.share. */
const VERB_IMPLICATIONS: Record<string, readonly string[]> = {
  'member.export': ['member.read'],
  'member.convert': ['member.read'],
  'member.note': ['member.read'],
  'guest.convert': ['guest.read'],
  'position.assign': ['position.read'],
  'employee.export': ['employee.read'],
  'employee.convert': ['employee.read'],
  'employee.compensation': ['employee.read'],
  'booking.request': ['booking.read_own'],
  'booking.cancel': ['booking.read_own'],
  'booking.approve': ['booking.read_all'],
  'booking.edit': ['booking.read_all'],
  'event.publish': ['event.read'],
  'series.generate': ['series.read'],
  'registration.manage': ['registration.read'],
  'contribution.give': ['contribution.read_own'],
  'contribution.process': ['contribution.read'],
  'receipt.generate': ['receipt.read'],
  'announcement.publish': ['announcement.read'],
  'announcement.pin': ['announcement.read'],
  'document.publish': ['document.read'],
  'document.share': ['document.read'],
  'moderation.act': ['moderation.read'],
  'certificate.issue': ['certificate.read'],
  'certificate.revoke': ['certificate.read'],
  'certificate.template.manage': ['certificate.read'],
  'post.publish': ['post.read'],
  'post.moderate': ['post.read'],
  'group.manage': ['group.read'],
  'group.join': ['group.read'],
  'ministry.create': ['ministry.read'],
  'ministry.edit': ['ministry.read'],
  'ministry.delete': ['ministry.read'],
  'roster.manage': ['ministry.read'],
  'attendance.record': ['ministry.read'],
  'prayer.create': ['prayer.read'],
  'prayer.pray': ['prayer.read'],
  'prayer.manage': ['prayer.read'],
};

const LADDER = ['read', 'create', 'edit', 'delete'] as const;

function impliedBy(scope: string): string[] {
  const out: string[] = [];
  const dot = scope.indexOf('.');
  if (dot > 0) {
    const domain = scope.slice(0, dot);
    const verb = scope.slice(dot + 1);
    if ((CRUD_DOMAINS as readonly string[]).includes(domain)) {
      const idx = LADDER.indexOf(verb as (typeof LADDER)[number]);
      if (idx > 0) {
        for (let i = 0; i < idx; i += 1) out.push(`${domain}.${LADDER[i]}`);
      }
    }
  }
  const verbs = VERB_IMPLICATIONS[scope];
  if (verbs) out.push(...verbs);
  return out;
}

/** Expands a scope list to its full implication closure. Unknown scopes are kept as-is. */
export function expandClosure(scopes: Iterable<string>): Set<string> {
  const result = new Set<string>();
  const stack: string[] = [...scopes];
  while (stack.length > 0) {
    const s = stack.pop();
    if (s === undefined || result.has(s)) continue;
    result.add(s);
    for (const implied of impliedBy(s)) if (!result.has(implied)) stack.push(implied);
  }
  return result;
}

export const ROLE_KEYS = [
  'guest',
  'member',
  'staff',
  'facility_manager',
  'accountant',
  'priest',
  'tenant_admin',
] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

/** Server-side role names exactly as the backend seeds them (auth.me returns these). */
export const ROLE_NAMES: Record<RoleKey, string> = {
  guest: 'Guest',
  member: 'Member',
  staff: 'Staff',
  facility_manager: 'Facility Manager',
  accountant: 'Accountant',
  priest: 'Priest',
  tenant_admin: 'Tenant Admin',
};

export function roleKeyFromName(name: string): RoleKey | undefined {
  return ROLE_KEYS.find((k) => ROLE_NAMES[k] === name);
}

/** `X.*` = every catalog scope starting with `X.` except the explicit carve-outs. */
const CARVE_OUTS = new Set(['employee.compensation', 'notification.read_own']);
function domainAll(domain: string): string[] {
  return SCOPE_CATALOG.filter((s) => s.startsWith(`${domain}.`) && !CARVE_OUTS.has(s));
}

const STAFF_SELF_SERVICE = [
  'profile.read_own',
  'profile.write_own',
  'notification.read_own',
  'notification.settings',
  'consent.read_own',
  'dsar.request_own',
  'roster.respond',
  'serving.respond',
  'settings.read_public',
  'feed.read',
];

const GUEST = [
  'event.read',
  'facility.read',
  'document.read',
  'announcement.read',
  'content.share',
  'profile.read_own',
  'consent.read_own',
  'certificate.read_own',
  'feed.read',
  'settings.read_public',
];

const MEMBER = [
  ...GUEST,
  'profile.write_own',
  'registration.rsvp',
  'booking.request',
  'booking.read_own',
  'booking.cancel',
  'contribution.read_own',
  'contribution.give',
  'media.read',
  'post.read',
  'post.create',
  'post.edit',
  'post.publish',
  'post.delete',
  'comment.write',
  'reaction.write',
  'group.read',
  'group.join',
  'dashboard.view',
  'dsar.request_own',
  'notification.read_own',
  'notification.settings',
  'moderation.flag',
  'roster.respond',
  'serving.respond',
  'prayer.read',
  'prayer.create',
  'prayer.pray',
];

/** The seeded matrix of §5.2, before closure. */
export const ROLE_BASE_SCOPES: Record<RoleKey, readonly string[]> = {
  guest: GUEST,
  member: MEMBER,
  staff: [
    ...STAFF_SELF_SERVICE,
    ...domainAll('member'),
    ...domainAll('family'),
    ...domainAll('guest'),
    ...domainAll('position'),
    ...domainAll('event'),
    ...domainAll('series'),
    'registration.manage',
    'registration.read',
    ...domainAll('announcement'),
    ...domainAll('document'),
    ...domainAll('media'),
    ...domainAll('post'),
    'group.manage',
    ...domainAll('ministry'),
    'roster.manage',
    'attendance.record',
    'prayer.manage',
    'dashboard.view',
    'report.view',
  ],
  facility_manager: [
    ...STAFF_SELF_SERVICE,
    ...domainAll('facility'),
    ...domainAll('booking'),
    'person.resolve',
    'dashboard.view',
    'report.view',
  ],
  accountant: [
    ...STAFF_SELF_SERVICE,
    ...domainAll('fund'),
    ...domainAll('contribution'),
    ...domainAll('receipt'),
    'statement.read',
    'person.resolve',
    'dashboard.view',
    'report.view',
    'audit.read',
    'audit.read_sensitive',
  ],
  priest: [
    ...MEMBER,
    ...domainAll('ministry'),
    'roster.manage',
    'attendance.record',
    'prayer.manage',
    'member.read',
    'certificate.read',
    'person.resolve',
    'dashboard.view',
    'report.view',
  ],
  tenant_admin: [
    'feed.read',
    ...domainAll('member'),
    ...domainAll('family'),
    ...domainAll('guest'),
    ...domainAll('position'),
    ...domainAll('employee'),
    ...domainAll('user'),
    ...domainAll('role'),
    'membership.manage',
    ...domainAll('facility'),
    ...domainAll('booking'),
    ...domainAll('event'),
    ...domainAll('series'),
    ...domainAll('registration'),
    ...domainAll('fund'),
    ...domainAll('contribution'),
    ...domainAll('receipt'),
    'statement.read',
    ...domainAll('announcement'),
    ...domainAll('document'),
    ...domainAll('media'),
    ...domainAll('moderation'),
    ...domainAll('certificate'),
    ...domainAll('post'),
    ...domainAll('group'),
    ...domainAll('settings'),
    ...domainAll('org'),
    ...domainAll('notification'),
    'dashboard.view',
    'report.view',
    'consent.manage',
    'dsar.process',
    ...domainAll('ministry'),
    'roster.manage',
    'roster.respond',
    'serving.respond',
    'attendance.record',
    'prayer.manage',
    'person.resolve',
    'profile.read_own',
    'profile.write_own',
    'reaction.write',
    'comment.write',
    'content.share',
    'employee.compensation',
    'notification.read_own',
    'report.export',
    'privacy.breach.manage',
    'audit.read',
    'audit.read_sensitive',
    'audit.read_dpdp',
  ],
};

/** Final scope list a role holds (closure applied), sorted for stable output. */
export function scopesForRole(role: RoleKey): string[] {
  return [...expandClosure(ROLE_BASE_SCOPES[role])].sort();
}

/** Groups scopes by domain for the role editor UI (`role.list_scopes`). */
export function groupScopesByDomain(scopes: readonly string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const s of scopes) {
    const domain = s.split('.')[0] ?? s;
    (out[domain] ??= []).push(s);
  }
  return out;
}
