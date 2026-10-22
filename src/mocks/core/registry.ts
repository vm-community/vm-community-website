import type { RoleKey } from '@/lib/auth/scopes';
import type { CommunityRecord } from '../communities';
import type { CommunityData, MockUser } from '../model/types';
import { fail } from './errors';

export interface MockContext {
  community: CommunityRecord;
  data: CommunityData;
  user: MockUser;
  role: RoleKey;
  scopes: ReadonlySet<string>;
  now: Date;
  /** Marks the store dirty so it gets persisted. */
  touch: () => void;
  /** Access another community's data (cross-community reads are never allowed; used by auth.my_sites only). */
  allData: () => Record<string, CommunityData>;
  treeApiEnabled: boolean;
}

export type MockArgs = Record<string, unknown>;
export type MockHandler = (args: MockArgs, ctx: MockContext) => unknown;

export interface HandlerDef {
  /** Required scope, or null for token-only endpoints. */
  scope: string | null;
  handler: MockHandler;
  /** Mutations honour request_id idempotency and bump audit. */
  mutation?: boolean;
  /** Part of the proposed Family Tree API: NOT_FOUND when the toolbar disables the service. */
  treeApi?: boolean;
}

const registry = new Map<string, HandlerDef>();

export function define(fn: string, def: HandlerDef): void {
  if (registry.has(fn)) throw new Error(`mock handler already defined: ${fn}`);
  registry.set(fn, def);
}

export function defineMany(defs: Record<string, HandlerDef>): void {
  for (const [fn, def] of Object.entries(defs)) define(fn, def);
}

export function getHandler(fn: string): HandlerDef | undefined {
  return registry.get(fn);
}

export function listHandlers(): string[] {
  return [...registry.keys()].sort();
}

export function requireScope(ctx: MockContext, scope: string): void {
  if (!ctx.scopes.has(scope)) fail('AUTH_SCOPE_DENIED', { scope });
}

export function hasScope(ctx: MockContext, scope: string): boolean {
  return ctx.scopes.has(scope);
}

/** Standard list envelope with clamped paging (§4.4). */
export function paginate<T>(
  rows: readonly T[],
  args: MockArgs,
): { content: T[]; total: number; page: number; page_length: number } {
  const page = Math.max(1, Number(args.page ?? 1) || 1);
  const pageLength = Math.min(100, Math.max(1, Number(args.page_length ?? 20) || 20));
  const start = (page - 1) * pageLength;
  return {
    content: rows.slice(start, start + pageLength),
    total: rows.length,
    page,
    page_length: pageLength,
  };
}

/** Applies `sort_by="<field> asc|desc"` against an allow-list; unknown values fall back silently. */
export function sortRows<T extends Record<string, unknown>>(
  rows: T[],
  sortBy: unknown,
  allowed: readonly string[],
  fallback: string,
): T[] {
  let field = fallback;
  let dir: 1 | -1 = fallback.endsWith(' desc') ? -1 : 1;
  const fb = fallback.split(' ')[0] ?? fallback;
  field = fb;
  if (typeof sortBy === 'string') {
    const [f, d] = sortBy.trim().split(/\s+/);
    if (f && allowed.includes(f)) {
      field = f;
      dir = d === 'desc' ? -1 : 1;
    }
  }
  return [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    if (av === undefined || av === null) return 1;
    if (bv === undefined || bv === null) return -1;
    return (av < bv ? -1 : 1) * dir;
  });
}

export function mutationResult<T>(doc: T, message: string): { doc: T; message: string } {
  return { doc, message };
}
