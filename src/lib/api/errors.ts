import type { ApiError, ApiErrorCode } from './types';

/**
 * Maps error codes to message-catalog keys (`errors.<key>`). The client owns all wording; the
 * server's `message` is never shown. Field-level 422 details map onto form fields separately.
 */
const MESSAGE_KEY_BY_CODE: Record<ApiErrorCode, string> = {
  AUTH_NO_MEMBERSHIP: 'noMembership',
  AUTH_SCOPE_DENIED: 'scopeDenied',
  AUTH_FORBIDDEN: 'forbidden',
  AUTH_TOKEN_INVALID: 'sessionExpired',
  AUTH_EXCHANGE_DENIED: 'exchangeDenied',
  NOT_FOUND: 'notFound',
  CONFLICT_DUPLICATE: 'conflictDuplicate',
  CONFLICT_VERSION: 'conflictVersion',
  RECORD_IN_USE: 'recordInUse',
  DUPLICATE_MEMBER: 'duplicateMember',
  RATE_LIMITED: 'rateLimited',
  VALIDATION_REQUIRED_FIELD: 'validationRequired',
  VALIDATION_INVALID: 'validationInvalid',
  VALIDATION_INVALID_ENUM: 'validationInvalidEnum',
  VALIDATION_INVALID_EMAIL: 'validationInvalidEmail',
  VALIDATION_TOO_LONG: 'validationTooLong',
  VALIDATION_INVALID_CHARS: 'validationInvalidChars',
  VALIDATION_ERROR: 'validationError',
  INTERNAL: 'internal',
  NETWORK: 'network',
  ABORTED: 'aborted',
  BAD_RESPONSE: 'badResponse',
};

export function errorMessageKey(error: Pick<ApiError, 'code'>): string {
  return `errors.${MESSAGE_KEY_BY_CODE[error.code]}`;
}

/** Field reasons from a 422 `details` map, converted to catalog keys where the reason is a code. */
export function fieldErrorKeys(
  details: Record<string, string> | undefined,
): Record<string, string> {
  if (!details) return {};
  const out: Record<string, string> = {};
  for (const [field, reason] of Object.entries(details)) {
    const asCode = reason.toUpperCase().replace(/[^A-Z_]/g, '');
    out[field] =
      asCode in MESSAGE_KEY_BY_CODE
        ? `errors.${MESSAGE_KEY_BY_CODE[asCode as ApiErrorCode]}`
        : 'errors.validationInvalid';
  }
  return out;
}

/** Errors that merit a Retry control (transient or unexpected). */
export function isRetryable(error: Pick<ApiError, 'code'>): boolean {
  return (
    error.code === 'NETWORK' ||
    error.code === 'INTERNAL' ||
    error.code === 'BAD_RESPONSE' ||
    error.code === 'RATE_LIMITED'
  );
}

/** Errors where showing the trace id ("Copy details") is useful. */
export function showsTraceId(error: Pick<ApiError, 'code' | 'traceId'>): boolean {
  return Boolean(error.traceId) && (error.code === 'INTERNAL' || error.code === 'BAD_RESPONSE');
}

/** Pretty scope name for "You need the Family: edit permission" explanations. */
export function describeScope(scope: string): { domain: string; verb: string } {
  const [domain = scope, ...rest] = scope.split('.');
  return { domain, verb: rest.join('.') || 'access' };
}
