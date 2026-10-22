import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Original CSS device frames (no brand imitation). Content inside is real components with sample data. */
export function PhoneFrame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const t = useTranslations('marketing.common');
  return (
    <figure className={cn('mx-auto w-full max-w-phone-frame', className)}>
      <div className="overflow-hidden rounded-lg bg-text p-1 vm-elevated-3">
        <div className="overflow-hidden rounded-md bg-bg">{children}</div>
      </div>
      <figcaption className="mt-2 text-center text-caption text-text-muted">
        {label ?? t('illustrative')}
      </figcaption>
    </figure>
  );
}

export function BrowserFrame({
  children,
  className,
  label,
  url,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  url?: string;
}) {
  const t = useTranslations('marketing.common');
  return (
    <figure className={cn('w-full', className)}>
      <div className="overflow-hidden rounded-lg bg-surface-raised vm-elevated-2">
        <div className="flex items-center gap-2 bg-surface px-3 py-2 vm-border-b">
          <span className="flex gap-1" aria-hidden>
            <span className="size-2 rounded-full bg-danger" />
            <span className="size-2 rounded-full bg-warning" />
            <span className="size-2 rounded-full bg-success" />
          </span>
          <span className="ms-2 flex-1 truncate rounded-sm bg-bg px-2 py-0 text-caption text-text-muted vm-border">
            {url ?? 'community.example/app'}
          </span>
        </div>
        <div className="overflow-hidden">{children}</div>
      </div>
      <figcaption className="mt-2 text-caption text-text-muted">
        {label ?? t('illustrative')}
      </figcaption>
    </figure>
  );
}
