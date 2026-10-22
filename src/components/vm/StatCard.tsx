import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Card } from './Card';

interface StatCardProps {
  value: ReactNode;
  label: string;
  /** Signed percentage or absolute delta text, e.g. "+12%". */
  delta?: { text: string; direction: 'up' | 'down' | 'flat' };
  /** 0..1 normalised points for a tiny inline sparkline. */
  sparkline?: number[];
  icon?: ReactNode;
  gradient?: boolean;
  className?: string;
}

export function Sparkline({ points, className }: { points: number[]; className?: string }) {
  const t = useTranslations('components.statCard');
  if (points.length < 2) return null;
  const w = 100;
  const h = 32;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = max - min || 1;
  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'}${((i / (points.length - 1)) * w).toFixed(1)},${(h - ((p - min) / span) * (h - 4) - 2).toFixed(1)}`,
    )
    .join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn('h-6 w-full', className)}
      role="img"
      aria-label={t('sparkline')}
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function StatCard({
  value,
  label,
  delta,
  sparkline,
  icon,
  gradient,
  className,
}: StatCardProps) {
  const t = useTranslations('components.statCard');
  const deltaTone =
    delta?.direction === 'up'
      ? 'vm-text-success'
      : delta?.direction === 'down'
        ? 'vm-text-danger'
        : 'text-text-muted';
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {gradient && <span aria-hidden className="absolute inset-x-0 top-0 h-1 vm-gradient-brand" />}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-small text-text-muted">{label}</p>
          <p className="mt-1 text-h1 font-semibold vm-tabular">{value}</p>
        </div>
        {icon && (
          <span className="rounded-md p-2 vm-tint-primary" aria-hidden>
            {icon}
          </span>
        )}
      </div>
      {delta && (
        <p
          className={cn('mt-2 inline-flex items-center gap-1 text-caption font-medium', deltaTone)}
        >
          {delta.direction === 'up' && <ArrowUpRight className="vm-icon-sm" aria-hidden />}
          {delta.direction === 'down' && <ArrowDownRight className="vm-icon-sm" aria-hidden />}
          <span className="vm-sr-only">{t('delta', { value: delta.text })}</span>
          <span aria-hidden>{delta.text}</span>
        </p>
      )}
      {sparkline && (
        <div className="mt-3 text-primary">
          <Sparkline points={sparkline} />
        </div>
      )}
    </Card>
  );
}

export function InsightCard({
  title,
  body,
  icon,
  action,
  tone = 'info',
  className,
}: {
  title: string;
  body: string;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: 'info' | 'warning' | 'success';
  className?: string;
}) {
  const tint = { info: 'vm-tint-info', warning: 'vm-tint-warning', success: 'vm-tint-success' }[
    tone
  ];
  return (
    <Card className={cn('flex gap-3', className)}>
      {icon && (
        <span className={cn('h-fit shrink-0 rounded-md p-2', tint)} aria-hidden>
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-small text-text-muted">{body}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </Card>
  );
}

export function QuickAction({
  label,
  icon,
  onClick,
  href,
  className,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const cls = cn(
    'flex flex-col items-center justify-center gap-2 rounded-md bg-surface-raised p-4 text-small font-medium vm-elevated-1 transition-colors vm-hover-surface vm-target',
    className,
  );
  const inner = (
    <>
      <span className="rounded-full p-2 vm-tint-primary" aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
