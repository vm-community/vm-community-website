'use client';

import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Chip } from './Chip';

export interface CommentView {
  id: string;
  author: { name: string; image?: string | null; masked?: boolean };
  content: string;
  /** Pre-formatted through the date utility by the caller. */
  timeLabel: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  isMine: boolean;
  deleted?: boolean;
  replies?: CommentView[];
  actions?: ReactNode;
  canReply?: boolean;
}

interface CommentThreadProps {
  comments: CommentView[];
  onReply?: (parentId: string, content: string) => Promise<void> | void;
  onCreate?: (content: string) => Promise<void> | void;
  canWrite: boolean;
  maxLength?: number;
  className?: string;
}

function Composer({
  onSubmit,
  placeholder,
  maxLength,
  autoFocus,
}: {
  onSubmit: (text: string) => Promise<void> | void;
  placeholder: string;
  maxLength: number;
  autoFocus?: boolean;
}) {
  const t = useTranslations('components.comments');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = text.trim().length > 0 && text.length <= maxLength && !/[<>]/.test(text);
  return (
    <form
      className="flex items-end gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!valid) return;
        setBusy(true);
        try {
          await onSubmit(text.trim());
          setText('');
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="flex-1">
        <span className="vm-sr-only">{placeholder}</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={1}
          maxLength={maxLength}
          autoFocus={autoFocus}
          className="w-full resize-none rounded-sm vm-border bg-bg px-3 py-2 text-small placeholder:text-text-muted"
        />
      </label>
      <Button type="submit" size="sm" disabled={!valid} loading={busy}>
        {t('post')}
      </Button>
    </form>
  );
}

function CommentItem({
  c,
  onReply,
  canWrite,
  maxLength,
  depth,
}: {
  c: CommentView;
  onReply?: CommentThreadProps['onReply'];
  canWrite: boolean;
  maxLength: number;
  depth: number;
}) {
  const t = useTranslations('components.comments');
  const [replying, setReplying] = useState(false);
  return (
    <li className={cn('flex gap-3', depth > 0 && 'ms-8')}>
      <Avatar
        name={c.author.name}
        src={c.author.image}
        masked={c.author.masked}
        size="sm"
        decorative
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-small">
          <span className="font-medium">{c.author.name}</span>
          <span className="text-caption text-text-muted">{c.timeLabel}</span>
          {c.status === 'PENDING' && (
            <Chip tone="warning" size="sm">
              {t('awaiting')}
            </Chip>
          )}
          {c.status === 'REJECTED' && (
            <Chip tone="danger" size="sm">
              {t('rejected')}
            </Chip>
          )}
        </div>
        <p
          className={cn(
            'mt-1 whitespace-pre-wrap text-small',
            c.deleted && 'italic text-text-muted',
          )}
        >
          {c.deleted ? t('deleted') : c.content}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {canWrite && depth === 0 && c.canReply !== false && !c.deleted && onReply && (
            <Button
              variant="link"
              size="sm"
              className="px-0"
              onClick={() => setReplying((r) => !r)}
              aria-expanded={replying}
            >
              {t('reply')}
            </Button>
          )}
          {c.actions}
        </div>
        {replying && onReply && (
          <div className="mt-2">
            <Composer
              autoFocus
              placeholder={t('replyTo', { name: c.author.name })}
              maxLength={maxLength}
              onSubmit={async (text) => {
                await onReply(c.id, text);
                setReplying(false);
              }}
            />
          </div>
        )}
        {c.replies && c.replies.length > 0 && (
          <ul className="mt-3 flex flex-col gap-3">
            {c.replies.map((r) => (
              <CommentItem
                key={r.id}
                c={r}
                canWrite={canWrite}
                maxLength={maxLength}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

/** Threaded comments with one-level replies and moderation states (PENDING shown to author/mods only by the caller). */
export function CommentThread({
  comments,
  onReply,
  onCreate,
  canWrite,
  maxLength = 2000,
  className,
}: CommentThreadProps) {
  const t = useTranslations('components.comments');
  return (
    <section className={cn('flex flex-col gap-4', className)} aria-label={t('title')}>
      <p className="text-small font-medium text-text-muted">
        {t('count', { count: comments.length })}
      </p>
      {comments.length > 0 && (
        <ul className="flex flex-col gap-4">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              c={c}
              onReply={onReply}
              canWrite={canWrite}
              maxLength={maxLength}
              depth={0}
            />
          ))}
        </ul>
      )}
      {canWrite && onCreate && (
        <Composer placeholder={t('write')} maxLength={maxLength} onSubmit={onCreate} />
      )}
    </section>
  );
}
