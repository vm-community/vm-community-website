'use client';

import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'secondary';

const toneClass: Record<Tone, string> = {
  primary: 'vm-tint-primary',
  success: 'vm-tint-success',
  warning: 'vm-tint-warning',
  danger: 'vm-tint-danger',
  info: 'vm-tint-info',
  muted: 'vm-tint-muted',
  secondary: 'vm-tint-secondary',
};

interface ChipProps {
  tone?: Tone;
  icon?: ReactNode;
  outline?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  children: ReactNode;
}

export function Chip({
  tone = 'muted',
  icon,
  outline,
  size = 'md',
  className,
  children,
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm font-medium whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0 text-caption' : 'px-2 py-1 text-caption',
        outline ? 'vm-border text-text-muted' : toneClass[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** Status → tone mapping (§2.2). Unknown statuses render muted with their raw text. */
export function statusTone(status: string): Tone {
  switch (status) {
    case 'ACTIVE':
    case 'PUBLISHED':
    case 'CONFIRMED':
    case 'RECEIVED':
    case 'ISSUED':
    case 'APPROVED':
    case 'ATTENDED':
    case 'FULFILLED':
    case 'CONVERTED':
    case 'RESOLVED':
    case 'CURRENT':
      return 'success';
    case 'PENDING':
    case 'INVITED':
    case 'SUBMITTED':
    case 'OPEN':
      return 'warning';
    case 'SUSPENDED':
    case 'DECLINED':
    case 'REJECTED':
    case 'CANCELLED':
    case 'REVOKED':
    case 'NO_SHOW':
    case 'DELETED':
      return 'danger';
    case 'UNDER_REVIEW':
    case 'IN_PROGRESS':
    case 'VISITED':
    case 'REGISTERED':
      return 'info';
    case 'INACTIVE':
    case 'ARCHIVED':
    case 'DRAFT':
    case 'COMPLETED':
    case 'ENDED':
    case 'WIDOWED':
    case 'DIVORCED':
    case 'ANNULLED':
    case 'CLOSED':
    default:
      return 'muted';
  }
}

export function StatusChip({ status, className }: { status: string; className?: string }) {
  const t = useTranslations('status');
  const label = t.has(status) ? t(status) : status;
  return (
    <Chip tone={statusTone(status)} className={className}>
      <span className="vm-sr-only">{t.has(status) ? '' : ''}</span>
      {label}
    </Chip>
  );
}

export function RoleBadge({ role, className }: { role: string; className?: string }) {
  const t = useTranslations('components');
  return (
    <Chip tone="primary" className={className}>
      <span className="vm-sr-only">{t('roleBadge', { role })}</span>
      <span aria-hidden>{role}</span>
    </Chip>
  );
}

export function PrivateBadge({ className }: { className?: string }) {
  const t = useTranslations('components');
  return (
    <Chip tone="muted" icon={<Lock className="vm-icon-sm" aria-hidden />} className={className}>
      {t('privateBadge')}
    </Chip>
  );
}
