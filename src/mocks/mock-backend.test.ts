import { beforeAll, describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/types';
import { mockCall, mockEndpoints, type MockSession } from './index';
import { ensureDb } from './core/store';

const admin: MockSession = { communitySlug: 'grace', role: 'tenant_admin' };
const guest: MockSession = { communitySlug: 'grace', role: 'guest' };
const noor: MockSession = { communitySlug: 'noor', role: 'member' };

async function expectError(p: Promise<unknown>, code: string): Promise<ApiError> {
  try {
    await p;
  } catch (e) {
    expect(e).toBeInstanceOf(ApiError);
    expect((e as ApiError).code).toBe(code);
    return e as ApiError;
  }
  throw new Error(`expected ${code}`);
}

describe('mock backend skeleton', () => {
  beforeAll(async () => {
    await ensureDb(new Date(2026, 9, 22));
  });

  it('registers the Phase 0 endpoints', () => {
    const fns = mockEndpoints();
    for (const fn of [
      'auth.me',
      'auth.my_sites',
      'auth.exchange_site',
      'settings.get_public_settings',
      'meta.field_contracts',
      'notifications.unread_count',
    ])
      expect(fns).toContain(fn);
  });

  it('auth.me returns the verified shape with the role closure', async () => {
    const me = (await mockCall('auth.me', {}, admin)) as {
      email: string;
      tenant: string;
      community: string;
      role: string;
      scopes: string[];
    };
    expect(me.tenant).toBe('grace');
    expect(me.community).toBe('Grace Community');
    expect(me.role).toBe('Tenant Admin');
    expect(me.email).toBe('tenant.admin@grace.demo');
    expect(me.scopes).toContain('family.read');
    expect(me.scopes).toContain('audit.read_dpdp');
  });

  it('rejects anonymous callers and unknown functions', async () => {
    await expectError(
      mockCall('auth.me', {}, { communitySlug: null, role: null }),
      'AUTH_TOKEN_INVALID',
    );
    await expectError(mockCall('nope.nothing', {}, admin), 'NOT_FOUND');
  });

  it('enforces scopes with AUTH_SCOPE_DENIED naming the scope', async () => {
    const e = await expectError(
      mockCall('settings.get_settings', { category: 'appearance' }, guest),
      'AUTH_SCOPE_DENIED',
    );
    expect(e.scope).toBe('settings.read');
  });

  it('serves public settings per community including community_type and accent', async () => {
    const grace = (await mockCall('settings.get_public_settings', {}, guest)) as Record<
      string,
      unknown
    >;
    expect(grace.community_type).toBe('church');
    expect(grace.accent_color).toBe('#4F46E5');
    const masjid = (await mockCall('settings.get_public_settings', {}, noor)) as Record<
      string,
      unknown
    >;
    expect(masjid.community_type).toBe('mosque');
    expect(masjid.community_name).toBe('Al-Noor Masjid');
  });

  it('validates mutations with details keyed by field', async () => {
    const e = await expectError(
      mockCall('auth.password_reset', { email: 'not-an-email' }, guest),
      'VALIDATION_INVALID_EMAIL',
    );
    expect(e.details).toEqual({ email: 'VALIDATION_INVALID_EMAIL' });
    await expectError(mockCall('auth.password_reset', {}, guest), 'VALIDATION_REQUIRED_FIELD');
  });

  it('is idempotent on request_id for mutations', async () => {
    const args = { category: 'appearance', changes: { tagline: 'Hello' }, request_id: 'req-1' };
    const first = (await mockCall('settings.update_settings', args, admin)) as {
      doc: { settings: Record<string, unknown> };
    };
    const again = (await mockCall(
      'settings.update_settings',
      { ...args, changes: { tagline: 'Changed' } },
      admin,
    )) as typeof first;
    expect(again).toBe(first);
    expect(again.doc.settings.tagline).toBe('Hello');
  });

  it('isolates communities: each has its own users and settings', async () => {
    const sites = (await mockCall('auth.my_sites', {}, admin)) as {
      sites: Array<{ slug: string; detail_available: boolean; name: string | null }>;
    };
    expect(sites.sites).toHaveLength(6);
    expect(sites.sites.find((s) => s.slug === 'grace')?.detail_available).toBe(true);
    expect(sites.sites.find((s) => s.slug === 'noor')?.detail_available).toBe(false);
    expect(sites.sites.find((s) => s.slug === 'noor')?.name).toBeNull();
  });

  it('paginates with the verified envelope and clamps page_length to 100', async () => {
    const page = (await mockCall('notifications.search', { page: 1, page_length: 500 }, admin)) as {
      content: unknown[];
      total: number;
      page: number;
      page_length: number;
    };
    expect(page.page).toBe(1);
    expect(page.page_length).toBe(100);
    expect(Array.isArray(page.content)).toBe(true);
  });
});
