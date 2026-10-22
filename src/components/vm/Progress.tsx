import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

export function ProgressBar({
  value,
  label,
  tone = 'primary',
  className,
}: {
  value: number;
  label?: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}) {
  const t = useTranslations('components.progress');
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const fill = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }[tone];
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label ?? t('label', { value: pct })}
      className={cn('h-2 w-full overflow-hidden rounded-full vm-tint-muted', className)}
    >
      <div
        className={cn('h-full rounded-full vm-transition-all', fill)}
        style={{ inlineSize: `${pct}%` }}
      />
    </div>
  );
}

export function Spinner({ className, label }: { className?: string; label?: string }) {
  const t = useTranslations('common');
  return (
    <span role="status" className={cn('inline-flex items-center gap-2 text-text-muted', className)}>
      <Loader2 className="vm-icon animate-spin" aria-hidden />
      <span className="vm-sr-only">{label ?? t('loadingLabel')}</span>
    </span>
  );
}
