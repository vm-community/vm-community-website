import { ApiError, type ApiErrorCode } from '@/lib/api/types';

let traceCounter = 0;
export function newTraceId(): string {
  traceCounter += 1;
  return `mock-${Date.now().toString(36)}-${traceCounter.toString(36)}`;
}

export function fail(
  code: ApiErrorCode,
  extra: { details?: Record<string, string>; scope?: string } = {},
): never {
  throw new ApiError(code, { traceId: newTraceId(), details: extra.details, scope: extra.scope });
}

/** Collects field problems and throws one 422 with `details` keyed by field, like the server. */
export class Validator {
  private readonly details: Record<string, string> = {};
  private firstCode: ApiErrorCode | null = null;

  constructor(private readonly args: Record<string, unknown>) {}

  private note(field: string, code: ApiErrorCode): void {
    if (!(field in this.details)) this.details[field] = code;
    this.firstCode ??= code;
  }

  required(field: string): this {
    const v = this.args[field];
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === ''))
      this.note(field, 'VALIDATION_REQUIRED_FIELD');
    return this;
  }

  maxLength(field: string, max: number): this {
    const v = this.args[field];
    if (typeof v === 'string' && v.length > max) this.note(field, 'VALIDATION_TOO_LONG');
    return this;
  }

  /** STD-07: single-line text rejects angle brackets, script-like and control characters. */
  text(field: string, max: number, opts: { multiline?: boolean } = {}): this {
    const v = this.args[field];
    if (typeof v !== 'string') return this;
    if (v.length > max) this.note(field, 'VALIDATION_TOO_LONG');
    const control = opts.multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/ : /[\u0000-\u001f]/;
    if (control.test(v) || /<\s*\/?\s*[a-z!]/i.test(v) || /javascript:/i.test(v))
      this.note(field, 'VALIDATION_INVALID_CHARS');
    return this;
  }

  email(field: string): this {
    const v = this.args[field];
    if (typeof v === 'string' && v !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      this.note(field, 'VALIDATION_INVALID_EMAIL');
    return this;
  }

  oneOf(field: string, allowed: readonly string[]): this {
    const v = this.args[field];
    if (v !== undefined && v !== null && v !== '' && !(allowed as readonly unknown[]).includes(v))
      this.note(field, 'VALIDATION_INVALID_ENUM');
    return this;
  }

  date(field: string): this {
    const v = this.args[field];
    if (typeof v === 'string' && v !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(v))
      this.note(field, 'VALIDATION_INVALID');
    return this;
  }

  custom(field: string, ok: boolean, code: ApiErrorCode = 'VALIDATION_INVALID'): this {
    if (!ok) this.note(field, code);
    return this;
  }

  throwIfInvalid(): void {
    if (this.firstCode) {
      throw new ApiError(this.firstCode, { traceId: newTraceId(), details: this.details });
    }
  }
}

export function validate(args: Record<string, unknown>): Validator {
  return new Validator(args);
}
