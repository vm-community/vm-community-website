'use client';

import { useTranslations } from 'next-intl';
import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { controlClass, useFieldContext } from './Field';

interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className' | 'id'
> {
  /** Shows a live counter and marks overflow; pair with maxLength from the server contract. */
  max?: number;
  className?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { max, className, value, rows = 4, ...rest },
  ref,
) {
  const t = useTranslations('common');
  const field = useFieldContext();
  const length = typeof value === 'string' ? value.length : 0;
  const over = max !== undefined && length > max;
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <textarea
        ref={ref}
        id={field?.id}
        rows={rows}
        value={value}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || over || undefined}
        className={cn(controlClass, 'min-h-control-touch resize-y py-2 leading-body')}
        {...rest}
      />
      {max !== undefined && (
        <p
          className={cn(
            'text-end text-caption vm-tabular',
            over ? 'text-danger' : 'text-text-muted',
          )}
          aria-live="polite"
        >
          {over
            ? t('charactersOver', { count: length - max })
            : t('charactersLeft', { count: max - length })}
        </p>
      )}
    </div>
  );
});
