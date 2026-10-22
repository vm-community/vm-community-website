'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SegmentedProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
  /** Icon-only on phones (labels stay for assistive tech). */
  iconOnlyOnPhone?: boolean;
}

/** Segmented control / segmented choice, implemented as a radiogroup. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
  size = 'md',
  iconOnlyOnPhone,
}: SegmentedProps<T>) {
  const t = useTranslations('components.segmented');
  return (
    <div
      role="radiogroup"
      aria-label={label ?? t('label')}
      className={cn(
        'inline-flex max-w-full overflow-x-auto rounded-md vm-border bg-surface p-1',
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-sm font-medium transition-colors',
              size === 'sm' ? 'min-h-6 px-2 text-caption' : 'vm-target px-3 text-small',
              active
                ? 'bg-surface-raised text-primary vm-elevated-1'
                : 'text-text-muted hover:text-text',
              o.disabled && 'opacity-50',
            )}
          >
            {o.icon}
            <span className={cn(iconOnlyOnPhone && o.icon && 'max-sm:vm-sr-only')}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
