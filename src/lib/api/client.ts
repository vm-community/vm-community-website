import type { ApiClient } from './types';
import { createLiveClient } from './live/client';
import { createMockClient } from './mock/client';

export type DataMode = 'mock' | 'live';

export function dataMode(): DataMode {
  return process.env.NEXT_PUBLIC_DATA_MODE === 'live' ? 'live' : 'mock';
}

export function isMockMode(): boolean {
  return dataMode() === 'mock';
}

let singleton: ApiClient | null = null;

/** Picks the implementation from NEXT_PUBLIC_DATA_MODE; the UI never sees which one it got. */
export function getApiClient(): ApiClient {
  singleton ??=
    process.env.NEXT_PUBLIC_DATA_MODE === 'live' ? createLiveClient() : createMockClient();
  return singleton;
}

/** Test seam. */
export function setApiClient(client: ApiClient | null): void {
  singleton = client;
}
