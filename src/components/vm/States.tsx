import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  title?: string;
  body?: string;
  illustration?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, body, illustration, action, className }: EmptyStateProps) {
  const t = useTranslations('components.emptyState');
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 p-7 text-center', className)}
    >
      <div
        className="flex size-avatar-lg items-center justify-center rounded-full vm-tint-primary"
        aria-hidden
      >
        {illustration ?? <Inbox className="vm-icon-lg" />}
      </div>
      <h3 className="text-h3 font-semibold">{title ?? t('title')}</h3>
      {body && <p className="max-w-prose text-small text-text-muted">{body}</p>}
      {action}
    </div>
  );
}
