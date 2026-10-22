import { readSession } from '@/lib/auth/session';
import { ApiError, type ApiCallOptions, type ApiClient } from '../types';

export const BFF_PREFIX = '/api/bff/';
export const COMMUNITY_HEADER = 'x-vm-community';

/** Function names whose default method is POST (mutations); everything else defaults to GET. */
const MUTATION_VERBS =
  /^(create|update|delete|add|remove|set|mark|publish|archive|cancel|complete|approve|reject|request|give|record|upload|react|unreact|share|flag|start|review|toggle|rsvp|respond|assign|remind|invite|resend|activate|grant|withdraw|process|issue|revoke|merge|end|submit|generate|vote|pray|unpray|join|leave|transfer|block|convert|reinvite|register|rotate|unregister|send|export|password|exchange|reset|download|run)/;

export function defaultMethod(fn: string): 'GET' | 'POST' {
  const fnName = fn.split('.').pop() ?? fn;
  return MUTATION_VERBS.test(fnName) ? 'POST' : 'GET';
}

function toQuery(args: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(args)) {
    if (v === undefined || v === null) continue;
    q.set(
      k,
      typeof v === 'string'
        ? v
        : typeof v === 'number' || typeof v === 'boolean'
          ? String(v)
          : JSON.stringify(v),
    );
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

/**
 * Live ApiClient: talks only to the same-origin BFF, which holds the tokens. Not verified end to
 * end against a real backend (see docs/ASSUMPTIONS.md); unit-tested against fixtures.
 */
export function createLiveClient(fetchImpl: typeof fetch = (...a) => fetch(...a)): ApiClient {
  return {
    async call<T>(
      fn: string,
      args: Record<string, unknown> = {},
      opts: ApiCallOptions = {},
    ): Promise<T> {
      const method = opts.method ?? defaultMethod(fn);
      const session = readSession();
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (session.communitySlug) headers[COMMUNITY_HEADER] = session.communitySlug;
      const body = { ...args };
      if (opts.requestId) body.request_id = opts.requestId;
      let res: Response;
      try {
        res =
          method === 'GET'
            ? await fetchImpl(`${BFF_PREFIX}${fn}${toQuery(body)}`, {
                method,
                headers,
                signal: opts.signal,
                credentials: 'same-origin',
              })
            : await fetchImpl(`${BFF_PREFIX}${fn}`, {
                method,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: opts.signal,
                credentials: 'same-origin',
              });
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') throw new ApiError('ABORTED');
        throw new ApiError('NETWORK');
      }
      let json: unknown = null;
      try {
        json = await res.json();
      } catch {
        if (res.ok) throw new ApiError('BAD_RESPONSE', { status: res.status });
      }
      if (!res.ok) throw ApiError.fromBody(res.status, json);
      if (!json || typeof json !== 'object' || !('message' in json))
        throw new ApiError('BAD_RESPONSE', { status: res.status });
      return (json as { message: T }).message;
    },
  };
}
