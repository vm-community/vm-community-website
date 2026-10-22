import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import {
  describeScope,
  errorMessageKey,
  fieldErrorKeys,
  isRetryable,
  showsTraceId,
} from './errors';
import { API_ERROR_CODES, ApiError } from './types';

describe('ApiError', () => {
  it('parses the verified error envelope', () => {
    const e = ApiError.fromBody(422, {
      error: {
        code: 'VALIDATION_TOO_LONG',
        message: 'server text',
        trace_id: 'trc-1',
        details: { first_name: 'VALIDATION_TOO_LONG' },
      },
    });
    expect(e.code).toBe('VALIDATION_TOO_LONG');
    expect(e.status).toBe(422);
    expect(e.traceId).toBe('trc-1');
    expect(e.details).toEqual({ first_name: 'VALIDATION_TOO_LONG' });
    expect(e.isValidation).toBe(true);
  });

  it('maps unknown codes to INTERNAL and malformed bodies to BAD_RESPONSE', () => {
    expect(ApiError.fromBody(500, { error: { code: 'WEIRD' } }).code).toBe('INTERNAL');
    expect(ApiError.fromBody(502, '<html>').code).toBe('BAD_RESPONSE');
  });

  it('has a catalog message for every code', () => {
    const errors = en.errors as Record<string, string>;
    for (const code of API_ERROR_CODES) {
      const key = errorMessageKey({ code }).replace('errors.', '');
      expect(errors[key], code).toBeTruthy();
    }
  });

  it('maps 422 details to field message keys', () => {
    expect(fieldErrorKeys({ email: 'VALIDATION_INVALID_EMAIL', name: 'weird reason' })).toEqual({
      email: 'errors.validationInvalidEmail',
      name: 'errors.validationInvalid',
    });
    expect(fieldErrorKeys(undefined)).toEqual({});
  });

  it('decides retry and trace visibility', () => {
    expect(isRetryable({ code: 'NETWORK' })).toBe(true);
    expect(isRetryable({ code: 'AUTH_SCOPE_DENIED' })).toBe(false);
    expect(showsTraceId({ code: 'INTERNAL', traceId: 'x' })).toBe(true);
    expect(showsTraceId({ code: 'NOT_FOUND', traceId: 'x' })).toBe(false);
    expect(showsTraceId({ code: 'INTERNAL', traceId: undefined })).toBe(false);
  });

  it('describes scopes for explanations', () => {
    expect(describeScope('family.edit')).toEqual({ domain: 'family', verb: 'edit' });
    expect(describeScope('moderation.rule.manage')).toEqual({
      domain: 'moderation',
      verb: 'rule.manage',
    });
  });
});
