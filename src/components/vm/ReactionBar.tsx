'use client';

import { Heart, PartyPopper, ThumbsUp, HandHeart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

export const REACTION_TYPES = ['LIKE', 'LOVE', 'PRAY', 'CELEBRATE'] as const;
export type ReactionType = (typeof REACTION_TYPES)[number];

export interface ReactionSummary {
  by_type: Partial<Record<string, number>>;
  total: number;
  my_reaction: string | null;
}

interface ReactionBarProps {
  summary: ReactionSummary;
  onReact?: (type: ReactionType) => void;
  canReact: boolean;
  /** Vertical wording for the "support" reaction label (e.g. "I prayed"). */
  supportLabel?: string;
  className?: string;
  compact?: boolean;
}

const icons: Record<ReactionType, typeof Heart> = {
  LIKE: ThumbsUp,
  LOVE: Heart,
  PRAY: HandHeart,
  CELEBRATE: PartyPopper,
};

/** Reaction bar: add, switch or toggle off. The caller does the optimistic update + rollback. */
export function ReactionBar({
  summary,
  onReact,
  canReact,
  supportLabel,
  className,
  compact,
}: ReactionBarProps) {
  const t = useTranslations('components.reactions');
  const labelFor = (type: ReactionType) =>
    type === 'PRAY' && supportLabel
      ? supportLabel
      : t(type.toLowerCase() as 'like' | 'love' | 'pray' | 'celebrate');
  return (
    <div
      className={cn('flex flex-wrap items-center gap-1', className)}
      role="group"
      aria-label={t('label')}
    >
      {REACTION_TYPES.map((type) => {
        const Icon = icons[type];
        const count = summary.by_type[type] ?? 0;
        const mine = summary.my_reaction === type;
        if (!canReact && count === 0) return null;
        return (
          <button
            key={type}
            type="button"
            aria-pressed={mine}
            disabled={!canReact}
            onClick={() => onReact?.(type)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 text-small transition-colors vm-target',
              mine ? 'vm-tint-primary' : 'text-text-muted vm-hover-surface',
              !canReact && 'cursor-default',
            )}
          >
            <Icon className="vm-icon-sm" aria-hidden />
            <span className={compact ? 'vm-sr-only' : 'max-sm:vm-sr-only'}>{labelFor(type)}</span>
            {count > 0 && <span className="vm-tabular">{count}</span>}
          </button>
        );
      })}
      <span className="vm-sr-only" aria-live="polite">
        {t('count', { count: summary.total })}
      </span>
    </div>
  );
}
