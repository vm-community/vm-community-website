'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { controlClass, useFieldContext } from './Field';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> {
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

/** Text input. Must be placed inside <Field> which supplies id, description and invalid state. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { leading, trailing, className, type = 'text', ...rest },
  ref,
) {
  const field = useFieldContext();
  return (
    <div className={cn('relative flex items-center', className)}>
      {leading && (
        <span className="pointer-events-none absolute start-3 text-text-muted">{leading}</span>
      )}
      <input
        ref={ref}
        id={field?.id}
        type={type}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        className={cn(controlClass, leading && 'ps-8', trailing && 'pe-8')}
        {...rest}
      />
      {trailing && <span className="absolute end-2 flex items-center">{trailing}</span>}
    </div>
  );
});
