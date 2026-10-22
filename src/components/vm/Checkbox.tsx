'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: string;
  description?: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, ...rest },
  ref,
) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 vm-target',
        rest.disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="mt-1 size-5 shrink-0 accent-primary"
        {...rest}
      />
      <span className="text-small">
        <span className="block font-medium">{label}</span>
        {description && <span className="block text-text-muted">{description}</span>}
      </span>
    </label>
  );
});

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
  inline?: boolean;
}

/** Radio group; place inside <Field asGroup> for the legend and error. */
export function RadioGroup({ name, value, onChange, options, className, inline }: RadioGroupProps) {
  return (
    <div className={cn('flex gap-2', inline ? 'flex-row flex-wrap' : 'flex-col', className)}>
      {options.map((o) => {
        const id = `${name}-${o.value}`;
        return (
          <label
            key={o.value}
            htmlFor={id}
            className={cn(
              'flex cursor-pointer items-start gap-3 vm-target',
              o.disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              disabled={o.disabled}
              onChange={() => onChange(o.value)}
              className="mt-1 size-5 shrink-0 accent-primary"
            />
            <span className="text-small">
              <span className="block font-medium">{o.label}</span>
              {o.description && <span className="block text-text-muted">{o.description}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}
