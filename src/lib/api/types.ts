import { z } from 'zod';

/** The seam between UI and backend (§3.3). The UI never knows which implementation it talks to. */
export interface ApiCallOptions {
  method?: 'GET' | 'POST';
  requestId?: string;
  signal?: AbortSignal;
}

export interface ApiClient {
  call<T>(fn: string, args?: Record<string, unknown>, opts?: ApiCallOptions): Promise<T>;
}

export const API_ERROR_CODES = [
  'AUTH_NO_MEMBERSHIP',
  'AUTH_SCOPE_DENIED',
  'AUTH_FORBIDDEN',
  'AUTH_TOKEN_INVALID',
  'AUTH_EXCHANGE_DENIED',
  'NOT_FOUND',
  'CONFLICT_DUPLICATE',
  'CONFLICT_VERSION',
  'RECORD_IN_USE',
  'DUPLICATE_MEMBER',
  'RATE_LIMITED',
  'VALIDATION_REQUIRED_FIELD',
  'VALIDATION_INVALID',
  'VALIDATION_INVALID_ENUM',
  'VALIDATION_INVALID_EMAIL',
  'VALIDATION_TOO_LONG',
  'VALIDATION_INVALID_CHARS',
  'VALIDATION_ERROR',
  'INTERNAL',
  // client-side only
  'NETWORK',
  'ABORTED',
  'BAD_RESPONSE',
] as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export const HTTP_STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  AUTH_NO_MEMBERSHIP: 403,
  AUTH_SCOPE_DENIED: 403,
  AUTH_FORBIDDEN: 403,
  AUTH_TOKEN_INVALID: 401,
  AUTH_EXCHANGE_DENIED: 403,
  NOT_FOUND: 404,
  CONFLICT_DUPLICATE: 409,
  CONFLICT_VERSION: 409,
  RECORD_IN_USE: 409,
  DUPLICATE_MEMBER: 409,
  RATE_LIMITED: 429,
  VALIDATION_REQUIRED_FIELD: 422,
  VALIDATION_INVALID: 422,
  VALIDATION_INVALID_ENUM: 422,
  VALIDATION_INVALID_EMAIL: 422,
  VALIDATION_TOO_LONG: 422,
  VALIDATION_INVALID_CHARS: 422,
  VALIDATION_ERROR: 400,
  INTERNAL: 500,
  NETWORK: 0,
  ABORTED: 0,
  BAD_RESPONSE: 0,
};

export const apiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string().optional(),
    trace_id: z.string().optional(),
    details: z.record(z.string(), z.string()).optional(),
  }),
});
export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>;

/** Typed error thrown by every ApiClient. User-facing wording is owned by the client (errors.ts). */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly traceId: string | undefined;
  readonly details: Record<string, string> | undefined;
  /** The missing scope, when known (AUTH_SCOPE_DENIED). */
  readonly scope: string | undefined;

  constructor(
    code: ApiErrorCode,
    init: {
      status?: number;
      traceId?: string;
      details?: Record<string, string>;
      scope?: string;
      message?: string;
    } = {},
  ) {
    super(init.message ?? code);
    this.name = 'ApiError';
    this.code = code;
    this.status = init.status ?? HTTP_STATUS_BY_CODE[code];
    this.traceId = init.traceId;
    this.details = init.details;
    this.scope = init.scope;
  }

  get isValidation(): boolean {
    return this.status === 422 || this.code === 'VALIDATION_ERROR';
  }

  static fromBody(status: number, body: unknown): ApiError {
    const parsed = apiErrorBodySchema.safeParse(body);
    if (!parsed.success) return new ApiError('BAD_RESPONSE', { status });
    const { code, trace_id, details } = parsed.data.error;
    const known = (API_ERROR_CODES as readonly string[]).includes(code)
      ? (code as ApiErrorCode)
      : 'INTERNAL';
    return new ApiError(known, { status, traceId: trace_id, details });
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

/** Envelope shapes (§4.4). */
export const listEnvelopeSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    content: z.array(item),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    page_length: z.number().int().positive(),
  });

export const cursorEnvelopeSchema = <T extends z.ZodType>(item: T) =>
  z.object({ content: z.array(item), next_cursor: z.string().optional().nullable() });

export const mutationEnvelopeSchema = <T extends z.ZodType>(doc: T) =>
  z.object({ doc, message: z.string().optional() });

export type ListEnvelope<T> = { content: T[]; total: number; page: number; page_length: number };
export type MutationEnvelope<T> = { doc: T; message?: string };

export const PAGE_LENGTH_DEFAULT = 20;
export const PAGE_LENGTH_MAX = 100;

export function newRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    return crypto.randomUUID();
  // Fallback for very old runtimes: RFC4122-ish random id
  const rnd = () =>
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, '0');
  return `${rnd()}${rnd()}-${rnd()}-4${rnd().slice(1)}-${rnd()}-${rnd()}${rnd()}${rnd()}`;
}
