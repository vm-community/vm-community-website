'use client';

import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

interface ExpandableTextProps {
  text: string;
  /** Characters shown before collapsing. */
  limit?: number;
  className?: string;
}

export function ExpandableText({ text, limit = 280, className }: ExpandableTextProps) {
  const t = useTranslations('components.expandable');
  const id = useId();
  const [open, setOpen] = useState(false);
  const needsClamp = text.length > limit;
  const shown = !needsClamp || open ? text : `${text.slice(0, limit).trimEnd()}…`;
  return (
    <div className={cn('text-body', className)}>
      <p id={id} className="whitespace-pre-wrap">
        {shown}
      </p>
      {needsClamp && (
        <button
          type="button"
          className="mt-1 text-small font-medium text-primary hover:underline"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? t('less') : t('more')}
        </button>
      )}
    </div>
  );
}
