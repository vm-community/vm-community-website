import { ApiError } from '@/lib/api/types';
import { expandClosure, ROLE_BASE_SCOPES, type RoleKey } from '@/lib/auth/scopes';
import { COMMUNITIES, findCommunity } from './communities';
import { fail, newTraceId } from './core/errors';
import { getHandler, listHandlers, type MockContext } from './core/registry';
import { readMockSettings } from './core/settings';
import { Rng } from './core/rng';
import { ensureDb, getDb, markDirty, resetDb } from './core/store';
import './handlers/auth';
import './handlers/settings';
import './handlers/notifications';

/** Marker string: the live-build bundle check asserts it is absent. */
export const MOCK_BACKEND_MARKER = '__VM_MOCK_BACKEND__';

export interface MockSession {
  communitySlug: string | null;
  role: RoleKey | null;
}

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;
const failureRng = new Rng(7);

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const scopeCache = new Map<RoleKey, ReadonlySet<string>>();
export function scopesFor(role: RoleKey): ReadonlySet<string> {
  let s = scopeCache.get(role);
  if (!s) {
    s = expandClosure(ROLE_BASE_SCOPES[role]);
    scopeCache.set(role, s);
  }
  return s;
}

/**
 * Entry point used by the mock ApiClient. Same function names, argument names, envelopes,
 * pagination, error codes and idempotency as the real backend (§4.4).
 */
export async function mockCall(
  fn: string,
  args: Record<string, unknown>,
  session: MockSession,
  signal?: AbortSignal,
): Promise<unknown> {
  const settings = readMockSettings();
  if (settings.latencyMs > 0) await sleep(settings.latencyMs);
  if (signal?.aborted) throw new ApiError('ABORTED');

  const def = getHandler(fn);
  if (!def) fail('NOT_FOUND');
  if (def.treeApi && !settings.treeApi) fail('NOT_FOUND');

  const community = findCommunity(session.communitySlug);
  if (!community || !session.role)
    throw new ApiError('AUTH_TOKEN_INVALID', { traceId: newTraceId() });

  await ensureDb();
  const db = getDb();
  const data = db.communities[community.slug];
  if (!data) fail('AUTH_NO_MEMBERSHIP');
  const user = data.users.find((u) => u.role === session.role);
  if (!user) fail('AUTH_NO_MEMBERSHIP');

  const scopes = scopesFor(session.role);
  if (def.scope && !scopes.has(def.scope)) fail('AUTH_SCOPE_DENIED', { scope: def.scope });

  if (settings.failureRate > 0 && failureRng.chance(settings.failureRate)) {
    throw new ApiError('INTERNAL', { traceId: newTraceId() });
  }

  const now = new Date();
  const ctx: MockContext = {
    community,
    data,
    user,
    role: session.role,
    scopes,
    now,
    touch: markDirty,
    allData: () => db.communities,
    treeApiEnabled: settings.treeApi,
  };

  const requestId = typeof args.request_id === 'string' ? args.request_id : null;
  if (def.mutation && requestId) {
    const key = `${user.email}|${fn}|${requestId}`;
    const cached = data.idempotency[key];
    if (cached && now.getTime() - new Date(cached.at).getTime() < IDEMPOTENCY_TTL_MS)
      return cached.result;
    const result = await def.handler(args, ctx);
    data.idempotency[key] = { at: now.toISOString(), result };
    markDirty();
    return result;
  }
  return def.handler(args, ctx);
}

export async function resetMockData(): Promise<void> {
  await resetDb();
}

export function mockCommunities(): typeof COMMUNITIES {
  return COMMUNITIES;
}

export function mockEndpoints(): string[] {
  return listHandlers();
}
