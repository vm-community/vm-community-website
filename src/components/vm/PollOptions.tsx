'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format/numbers';
import { Button } from './Button';

export interface PollOptionView {
  id: string;
  label: string;
  votes: number;
}

interface PollOptionsProps {
  options: PollOptionView[];
  totalVotes: number;
  myVote: string | null;
  closed?: boolean;
  canVote: boolean;
  onVote?: (optionId: string) => void;
  /** Results failed to load: show a retry instead of bars. */
  resultsError?: boolean;
  onRetryResults?: () => void;
  busy?: boolean;
  className?: string;
}

/** Single-choice poll: options as buttons before voting, result bars after (or when closed). */
export function PollOptions({
  options,
  totalVotes,
  myVote,
  closed,
  canVote,
  onVote,
  resultsError,
  onRetryResults,
  busy,
  className,
}: PollOptionsProps) {
  const t = useTranslations('components.poll');
  const showResults = Boolean(myVote) || closed || !canVote;
  if (showResults && resultsError) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-2 rounded-md p-3 vm-tint-danger',
          className,
        )}
        role="alert"
      >
        <span className="text-small">{t('resultsFailed')}</span>
        {onRetryResults && (
          <Button size="sm" variant="secondary" onClick={onRetryResults}>
            {t('results')}
          </Button>
        )}
      </div>
    );
  }
  return (
    <div
      className={cn('flex flex-col gap-2', className)}
      role={showResults ? 'list' : 'group'}
      aria-busy={busy || undefined}
    >
      {options.map((o) => {
        const share = totalVotes > 0 ? o.votes / totalVotes : 0;
        const mine = myVote === o.id;
        if (showResults) {
          return (
            <div
              key={o.id}
              role="listitem"
              className="relative overflow-hidden rounded-sm vm-border px-3 py-2 text-small"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute inset-y-0 start-0',
                  mine ? 'vm-tint-primary' : 'vm-tint-muted',
                )}
                style={{ inlineSize: `${Math.round(share * 100)}%` }}
              />
              <span className="relative flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2">
                  {mine && <Check className="vm-icon-sm text-primary" aria-hidden />}
                  {o.label}
                  {mine && <span className="vm-sr-only">{t('voted')}</span>}
                </span>
                <span className="vm-tabular text-text-muted">{formatPercent(share)}</span>
              </span>
            </div>
          );
        }
        return (
          <button
            key={o.id}
            type="button"
            disabled={busy}
            onClick={() => onVote?.(o.id)}
            className="rounded-sm vm-border px-3 text-start text-small transition-colors vm-hover-surface vm-target"
          >
            {o.label}
          </button>
        );
      })}
      <p className="text-caption text-text-muted">
        {closed ? t('closed') : t('votes', { count: totalVotes })}
      </p>
    </div>
  );
}
