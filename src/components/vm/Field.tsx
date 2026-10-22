'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldContextValue {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}
const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optionalLabel?: boolean;
  className?: string;
  children: ReactNode;
  /** For fieldsets (radio groups, checkbox groups). */
  asGroup?: boolean;
}

/** Field wrapper: label, hint, inline error (aria-describedby / aria-invalid wired to the control). */
export function Field({
  label,
  hint,
  error,
  required,
  optionalLabel,
  className,
  children,
  asGroup,
}: FieldProps) {
  const t = useTranslations('common');
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const labelNode = (
    <>
      {label}
      {required && (
        <span aria-hidden className="ms-1 text-danger">
          *
        </span>
      )}
      {optionalLabel && !required && (
        <span className="ms-1 text-caption text-text-muted">({t('optional')})</span>
      )}
    </>
  );
  const inner = (
    <>
      {hint && (
        <p id={hintId} className="text-caption text-text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="inline-flex items-center gap-1 text-caption text-danger"
        >
          <AlertTriangle className="vm-icon-sm" aria-hidden />
          {error}
        </p>
      )}
    </>
  );
  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error) }}>
      {asGroup ? (
        <fieldset
          className={cn('flex flex-col gap-1', className)}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
        >
          <legend className="text-small font-medium">{labelNode}</legend>
          {inner}
        </fieldset>
      ) : (
        <div className={cn('flex flex-col gap-1', className)}>
          <label htmlFor={id} className="text-small font-medium">
            {labelNode}
          </label>
          {inner}
        </div>
      )}
    </FieldContext.Provider>
  );
}

/** Summary shown at the top of a form after a failed submit; links to the first invalid field. */
export function FormErrorSummary({
  errors,
  className,
}: {
  errors: Array<{ field: string; message: string }>;
  className?: string;
}) {
  const t = useTranslations('errors');
  if (errors.length === 0) return null;
  return (
    <div role="alert" className={cn('rounded-md p-4 vm-tint-danger', className)} tabIndex={-1}>
      <p className="font-semibold">{t('formSummary', { count: errors.length })}</p>
      <ul className="mt-1 list-disc ps-5 text-small">
        {errors.map((e) => (
          <li key={e.field}>{e.message}</li>
        ))}
      </ul>
    </div>
  );
}

export const controlClass =
  'w-full rounded-sm vm-border bg-bg px-3 text-body text-text placeholder:text-text-muted vm-target focus-visible:vm-border-primary disabled:opacity-60 aria-invalid:border-danger';
