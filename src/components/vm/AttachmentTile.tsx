'use client';

import { Download, FileText, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { formatBytes } from '@/lib/format/numbers';

interface AttachmentTileProps {
  name: string;
  sizeBytes?: number;
  caption?: string;
  href?: string;
  onRemove?: () => void;
  className?: string;
}

export function AttachmentTile({
  name,
  sizeBytes,
  caption,
  href,
  onRemove,
  className,
}: AttachmentTileProps) {
  const t = useTranslations('components.attachment');
  return (
    <div className={cn('flex items-center gap-3 rounded-md vm-border bg-surface p-3', className)}>
      <span className="rounded-sm p-2 vm-tint-info" aria-hidden>
        <FileText className="vm-icon" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-small font-medium">{name}</p>
        <p className="truncate text-caption text-text-muted">
          {[caption, sizeBytes !== undefined ? formatBytes(sizeBytes) : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
      {href && (
        <a
          href={href}
          download
          className="rounded-sm p-2 vm-hover-surface"
          aria-label={t('download', { name })}
        >
          <Download className="vm-icon" aria-hidden />
        </a>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-sm p-2 vm-hover-surface"
          aria-label={t('remove', { name })}
        >
          <X className="vm-icon" aria-hidden />
        </button>
      )}
    </div>
  );
}
