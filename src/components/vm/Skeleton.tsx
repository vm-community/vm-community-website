import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

export function Skeleton({ className, inline }: { className?: string; inline?: boolean }) {
  return (
    <span aria-hidden className={cn('vm-skeleton', inline ? 'inline-block' : 'block', className)} />
  );
}

/** A labelled region of skeleton rows for list/page loading states. */
export function SkeletonList({ rows = 4, className }: { rows?: number; className?: string }) {
  const t = useTranslations('components.skeleton');
  return (
    <div role="status" aria-label={t('label')} className={cn('flex flex-col gap-3', className)}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-avatar-md rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  const t = useTranslations('components.skeleton');
  return (
    <div
      role="status"
      aria-label={t('label')}
      className={cn('rounded-md bg-surface-raised p-5 vm-elevated-1', className)}
    >
      <Skeleton className="mb-3 h-5 w-1/3" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
