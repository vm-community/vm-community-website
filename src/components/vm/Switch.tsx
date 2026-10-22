'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { cn } from '@/lib/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Hide the visible label but keep it for assistive tech. */
  hideLabel?: boolean;
  disabled?: boolean;
  busy?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  hideLabel,
  disabled,
  busy,
  className,
}: SwitchProps) {
  const t = useTranslations('components.switch');
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex cursor-pointer items-center gap-3 vm-target',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-busy={busy || undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-control shrink-0 rounded-full transition-colors',
          checked ? 'bg-primary' : 'vm-tint-muted',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute top-1 size-4 rounded-full bg-bg vm-transition-all',
            checked ? 'start-5' : 'start-1',
          )}
        />
        <span className="vm-sr-only">{checked ? t('on') : t('off')}</span>
      </button>
      <span className={cn('text-small', hideLabel && 'vm-sr-only')}>{label}</span>
    </label>
  );
}

/** A switch with a title and description row, as used in preference lists (auto-save). */
export function ToggleField({
  title,
  description,
  checked,
  onChange,
  disabled,
  busy,
  className,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (c: boolean) => void;
  disabled?: boolean;
  busy?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between gap-4 py-3', className)}>
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        {description && <p className="text-small text-text-muted">{description}</p>}
      </div>
      <Switch
        label={title}
        hideLabel
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        busy={busy}
      />
    </div>
  );
}
