'use client';

import { AlertTriangle, Check, Copy, Inbox, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';
import { errorMessageKey, isRetryable, showsTraceId } from '@/lib/api/errors';
import { isApiError } from '@/lib/api/types';
import { useScopeExplanation } from '@/lib/auth/Can';
import { cn } from '@/lib/cn';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  body?: string;
  illustration?: ReactNode;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  title,
  body,
  illustration,
  action,
  className,
  compact,
}: EmptyStateProps) {
  const t = useTranslations('components.emptyState');
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-2 p-5' : 'gap-3 p-7',
        className,
      )}
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

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

/** Message from the catalog by code (never the server's text), trace id behind "Copy details". */
export function ErrorState({ error, onRetry, className, compact }: ErrorStateProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const apiError = isApiError(error) ? error : null;
  const message = apiError ? t(errorMessageKey(apiError)) : t('errors.internal');
  const retryable = apiError ? isRetryable(apiError) : true;
  const trace = apiError && showsTraceId(apiError) ? apiError.traceId : undefined;

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(`${apiError?.code ?? 'UNKNOWN'} ${trace ?? ''}`.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-2 p-5' : 'gap-3 p-7',
        className,
      )}
    >
      <div
        className="flex size-avatar-lg items-center justify-center rounded-full vm-tint-danger"
        aria-hidden
      >
        <AlertTriangle className="vm-icon-lg" />
      </div>
      <h3 className="text-h3 font-semibold">{t('components.errorState.title')}</h3>
      <p className="max-w-prose text-small text-text-muted">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry && retryable && (
          <Button variant="secondary" onClick={onRetry}>
            {t('components.errorState.retry')}
          </Button>
        )}
        {trace && (
          <Button
            variant="ghost"
            size="sm"
            icon={
              copied ? (
                <Check className="vm-icon" aria-hidden />
              ) : (
                <Copy className="vm-icon" aria-hidden />
              )
            }
            onClick={copyDetails}
          >
            {copied ? t('components.errorState.copied') : t('common.copyDetails')}
          </Button>
        )}
      </div>
      {trace && (
        <p className="text-caption text-text-muted">
          {t('common.traceId')}: <code className="vm-tabular">{trace}</code>
        </p>
      )}
    </div>
  );
}

export function PermissionDeniedState({
  scope,
  className,
  compact,
}: {
  scope?: string;
  className?: string;
  compact?: boolean;
}) {
  const t = useTranslations();
  const explain = useScopeExplanation();
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-2 p-5' : 'gap-3 p-7',
        className,
      )}
    >
      <div
        className="flex size-avatar-lg items-center justify-center rounded-full vm-tint-warning"
        aria-hidden
      >
        <Lock className="vm-icon-lg" />
      </div>
      <h3 className="text-h3 font-semibold">{t('errors.permissionTitle')}</h3>
      <p className="max-w-prose text-small text-text-muted">
        {scope ? explain(scope) : t('errors.permissionBody')}
      </p>
    </div>
  );
}
