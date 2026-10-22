import { readSession } from '@/lib/auth/session';
import type { mockCall as MockCall } from '@/mocks';
import { ApiError, type ApiCallOptions, type ApiClient } from '../types';

interface Backend {
  mockCall: typeof MockCall;
}

/**
 * Mock ApiClient: dispatches to the in-browser backend with the same argument names. The backend
 * module is loaded lazily and only when the build is a mock build, so a live build never
 * includes src/mocks (the dynamic import sits behind a compile-time env branch).
 */
function loadBackend(): Promise<Backend> {
  if (process.env.NEXT_PUBLIC_DATA_MODE === 'live') {
    return Promise.reject(new ApiError('INTERNAL'));
  }
  return import('@/mocks');
}

export function createMockClient(): ApiClient {
  let backend: Promise<Backend> | null = null;
  return {
    async call<T>(
      fn: string,
      args: Record<string, unknown> = {},
      opts: ApiCallOptions = {},
    ): Promise<T> {
      backend ??= loadBackend();
      const { mockCall } = await backend;
      const session = readSession();
      const body = opts.requestId ? { ...args, request_id: opts.requestId } : args;
      return (await mockCall(
        fn,
        body,
        { communitySlug: session.communitySlug, role: session.role },
        opts.signal,
      )) as T;
    },
  };
}
