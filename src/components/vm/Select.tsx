'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { controlClass, useFieldContext } from './Field';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'id'> {
  options: SelectOption[];
  placeholder?: string | false;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, className, ...rest },
  ref,
) {
  const t = useTranslations('components.select');
  const field = useFieldContext();
  const ph = placeholder === false ? null : (placeholder ?? t('placeholder'));
  return (
    <div className={cn('relative', className)}>
      <select
        ref={ref}
        id={field?.id}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        className={cn(controlClass, 'appearance-none pe-8')}
        {...rest}
      >
        {ph !== null && <option value="">{ph}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-2 top-1/2 vm-icon -translate-y-1/2 text-text-muted"
        aria-hidden
      />
    </div>
  );
});
