'use client';

import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { Tone } from './Chip';

type AlertTone = Extract<Tone, 'info' | 'success' | 'warning' | 'danger' | 'muted' | 'primary'>;

const icons: Record<AlertTone, ReactNode> = {
  info: <Info className="vm-icon" aria-hidden />,
  success: <CheckCircle2 className="vm-icon" aria-hidden />,
  warning: <AlertTriangle className="vm-icon" aria-hidden />,
  danger: <XCircle className="vm-icon" aria-hidden />,
  muted: <Info className="vm-icon" aria-hidden />,
  primary: <Info className="vm-icon" aria-hidden />,
};
const tints: Record<AlertTone, string> = {
  info: 'vm-tint-info',
  success: 'vm-tint-success',
  warning: 'vm-tint-warning',
  danger: 'vm-tint-danger',
  muted: 'vm-tint-muted',
  primary: 'vm-tint-primary',
};

interface InlineAlertProps {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  className?: string;
}

/** Inline alert inside content; `role=alert` only for danger so screen readers are not spammed. */
export function InlineAlert({
  tone = 'info',
  title,
  children,
  action,
  onClose,
  className,
}: InlineAlertProps) {
  const t = useTranslations('components.banner');
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-md p-4', tints[tone], className)}
    >
      <span className="mt-0 shrink-0">{icons[tone]}</span>
      <div className="min-w-0 flex-1 text-text">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-small">{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="shrink-0 rounded-sm p-1 vm-hover-surface"
          onClick={onClose}
          aria-label={t('close')}
        >
          <X className="vm-icon" aria-hidden />
        </button>
      )}
    </div>
  );
}

/** Full-width page banner (top of a page or the shell). */
export function Banner(props: InlineAlertProps) {
  return <InlineAlert {...props} className={cn('rounded-none', props.className)} />;
}
