import type { RoleKey } from './scopes';

/**
 * Client-side session pointer. In mock mode it names the persona and community; in live mode the
 * real session is an HttpOnly cookie and only the chosen community slug is kept here.
 */
export interface ClientSession {
  communitySlug: string | null;
  /** Mock mode only: the persona currently signed in. */
  role: RoleKey | null;
}

export const SESSION_STORAGE_KEY = 'vm.session';
export const EMPTY_SESSION: ClientSession = { communitySlug: null, role: null };

let memory: ClientSession = EMPTY_SESSION;
const listeners = new Set<(s: ClientSession) => void>();

export function readSession(): ClientSession {
  if (typeof window === 'undefined') return memory;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return memory;
    const parsed = JSON.parse(raw) as Partial<ClientSession>;
    memory = {
      communitySlug: typeof parsed.communitySlug === 'string' ? parsed.communitySlug : null,
      role: typeof parsed.role === 'string' ? parsed.role : null,
    };
  } catch {
    /* in-memory fallback */
  }
  return memory;
}

export function writeSession(next: ClientSession): ClientSession {
  memory = next;
  try {
    if (next.communitySlug === null && next.role === null)
      localStorage.removeItem(SESSION_STORAGE_KEY);
    else localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* in-memory fallback */
  }
  for (const l of listeners) l(memory);
  return memory;
}

export function subscribeSession(listener: (s: ClientSession) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSessionSnapshot(): ClientSession {
  return memory;
}

export function clearSession(): void {
  writeSession(EMPTY_SESSION);
}
