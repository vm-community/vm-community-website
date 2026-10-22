import { describe, expect, it } from 'vitest';
import {
  expandClosure,
  ROLE_BASE_SCOPES,
  ROLE_KEYS,
  SCOPE_CATALOG,
  isScope,
  scopesForRole,
} from './scopes';

describe('expandClosure (D-26)', () => {
  it('applies the CRUD ladder within a domain', () => {
    expect([...expandClosure(['family.edit'])].sort()).toEqual([
      'family.create',
      'family.edit',
      'family.read',
    ]);
    expect(expandClosure(['member.delete'])).toEqual(
      new Set(['member.delete', 'member.edit', 'member.create', 'member.read']),
    );
  });

  it('applies verb implications', () => {
    expect(expandClosure(['member.note']).has('member.read')).toBe(true);
    expect(expandClosure(['booking.approve']).has('booking.read_all')).toBe(true);
    expect(expandClosure(['booking.request']).has('booking.read_own')).toBe(true);
    expect(expandClosure(['registration.manage']).has('registration.read')).toBe(true);
    expect(expandClosure(['contribution.give']).has('contribution.read_own')).toBe(true);
    expect(expandClosure(['certificate.template.manage']).has('certificate.read')).toBe(true);
    expect(expandClosure(['roster.manage']).has('ministry.read')).toBe(true);
    expect(expandClosure(['prayer.pray']).has('prayer.read')).toBe(true);
  });

  it('does not derive registration.read from registration.rsvp', () => {
    expect(expandClosure(['registration.rsvp']).has('registration.read')).toBe(false);
  });

  it('never derives feed.read, reaction.write, comment.write or content.share', () => {
    const everythingElse = SCOPE_CATALOG.filter(
      (s) => !['feed.read', 'reaction.write', 'comment.write', 'content.share'].includes(s),
    );
    const closure = expandClosure(everythingElse);
    expect(closure.has('feed.read')).toBe(false);
    expect(closure.has('reaction.write')).toBe(false);
    expect(closure.has('comment.write')).toBe(false);
    expect(closure.has('content.share')).toBe(false);
  });

  it('is idempotent and keeps unknown scopes', () => {
    const once = expandClosure(['family.delete', 'x.y']);
    expect(expandClosure(once)).toEqual(once);
    expect(once.has('x.y')).toBe(true);
  });
});

describe('seeded roles (§5.2)', () => {
  it('every role only contains catalog scopes', () => {
    for (const role of ROLE_KEYS) {
      for (const s of scopesForRole(role)) expect(isScope(s), `${role}: ${s}`).toBe(true);
    }
  });

  it('Guest has the documented minimal set and nothing more', () => {
    expect(scopesForRole('guest')).toEqual(
      [
        'announcement.read',
        'certificate.read_own',
        'consent.read_own',
        'content.share',
        'document.read',
        'event.read',
        'facility.read',
        'feed.read',
        'profile.read_own',
        'settings.read_public',
      ].sort(),
    );
  });

  it('Member can RSVP, give, post and react but cannot read the member directory', () => {
    const s = new Set(scopesForRole('member'));
    for (const must of [
      'registration.rsvp',
      'contribution.give',
      'contribution.read_own',
      'post.create',
      'reaction.write',
      'comment.write',
      'prayer.pray',
      'dashboard.view',
    ])
      expect(s.has(must), must).toBe(true);
    expect(s.has('member.read')).toBe(false);
    expect(s.has('family.read')).toBe(false);
  });

  it('Staff holds family.* and member.* but not fund or audit scopes', () => {
    const s = new Set(scopesForRole('staff'));
    expect(s.has('family.delete')).toBe(true);
    expect(s.has('member.export')).toBe(true);
    expect(s.has('fund.read')).toBe(false);
    expect(s.has('audit.read')).toBe(false);
    expect(s.has('employee.compensation')).toBe(false);
  });

  it('X.* excludes the carve-outs unless listed explicitly', () => {
    const employeeAll = ROLE_BASE_SCOPES.tenant_admin.filter((s) => s.startsWith('employee.'));
    expect(employeeAll.filter((s) => s === 'employee.compensation')).toHaveLength(1);
    const accountant = new Set(scopesForRole('accountant'));
    expect(accountant.has('notification.read_own')).toBe(true); // listed explicitly in the self-service set
    const staffNotif = ROLE_BASE_SCOPES.staff.filter((s) => s === 'notification.read_own');
    expect(staffNotif).toHaveLength(1);
  });

  it('Priest is a Member plus care scopes', () => {
    const member = new Set(scopesForRole('member'));
    const priest = new Set(scopesForRole('priest'));
    for (const s of member) expect(priest.has(s), s).toBe(true);
    for (const s of [
      'ministry.delete',
      'roster.manage',
      'attendance.record',
      'prayer.manage',
      'member.read',
      'certificate.read',
      'person.resolve',
      'report.view',
    ])
      expect(priest.has(s), s).toBe(true);
  });

  it('Tenant Admin holds audit.read_dpdp and employee.compensation, Accountant does not hold dpdp', () => {
    expect(new Set(scopesForRole('tenant_admin')).has('audit.read_dpdp')).toBe(true);
    expect(new Set(scopesForRole('tenant_admin')).has('employee.compensation')).toBe(true);
    expect(new Set(scopesForRole('accountant')).has('audit.read_dpdp')).toBe(false);
    expect(new Set(scopesForRole('accountant')).has('audit.read_sensitive')).toBe(true);
  });

  it('no community role holds control-plane scopes', () => {
    for (const role of ROLE_KEYS) {
      for (const s of scopesForRole(role))
        expect(s.startsWith('tenant.') || s === 'platform.metrics', `${role}: ${s}`).toBe(false);
    }
  });
});
