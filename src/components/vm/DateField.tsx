'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { controlClass, useFieldContext } from './Field';

interface DateFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className' | 'id'
> {
  withTime?: boolean;
  className?: string;
}

/**
 * Native date / datetime-local input (keyboard and screen-reader friendly everywhere). Values are
 * exchanged as `YYYY-MM-DD` / `YYYY-MM-DDTHH:MM`, converted to server format by the caller.
 */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(function DateField(
  { withTime, className, ...rest },
  ref,
) {
  const field = useFieldContext();
  return (
    <input
      ref={ref}
      id={field?.id}
      type={withTime ? 'datetime-local' : 'date'}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      className={cn(controlClass, className)}
      {...rest}
    />
  );
});
