'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { controlClass, useFieldContext } from './Field';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  value,
  onChange,
  maxTags = 20,
  maxLength = 30,
  disabled,
  placeholder,
  className,
}: TagInputProps) {
  const t = useTranslations('components.tagInput');
  const field = useFieldContext();
  const [draft, setDraft] = useState('');

  function commit() {
    const tag = draft.trim().replace(/[<>]/g, '').slice(0, maxLength);
    if (!tag || value.includes(tag) || value.length >= maxTags) return;
    onChange([...value, tag]);
    setDraft('');
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      className={cn(
        controlClass,
        'flex h-auto min-h-control flex-wrap items-center gap-1 py-1',
        disabled && 'opacity-60',
        className,
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-sm px-2 py-0 text-small vm-tint-primary"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              aria-label={t('remove', { tag })}
              onClick={() => onChange(value.filter((v) => v !== tag))}
              className="rounded-sm p-1 hover:opacity-80"
            >
              <X className="vm-icon-sm" aria-hidden />
            </button>
          )}
        </span>
      ))}
      <input
        id={field?.id}
        type="text"
        value={draft}
        disabled={disabled || value.length >= maxTags}
        maxLength={maxLength}
        placeholder={placeholder ?? t('placeholder')}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        className="min-w-control-touch flex-1 bg-transparent py-1 outline-none placeholder:text-text-muted"
      />
    </div>
  );
}
