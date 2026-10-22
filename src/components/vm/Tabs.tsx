'use client';

import { useTranslations } from 'next-intl';
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  label?: string;
  className?: string;
  /** Panel content rendered below the tab list, keyed by the active tab. */
  children?: ReactNode;
}

/** WAI-ARIA tabs with roving tabindex and arrow-key navigation (logical start/end aware). */
export function Tabs({ items, value, onChange, label, className, children }: TabsProps) {
  const t = useTranslations('components.tabs');
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.key === value);
    if (idx < 0) return;
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % enabled.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = enabled.length - 1;
    else return;
    e.preventDefault();
    const target = enabled[next];
    if (!target) return;
    onChange(target.key);
    const btn = listRef.current?.querySelector<HTMLButtonElement>(`[data-key="${target.key}"]`);
    btn?.focus();
  }

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label ?? t('label')}
        className="flex gap-1 overflow-x-auto vm-border-b"
        onKeyDown={onKeyDown}
      >
        {items.map((item) => {
          const active = item.key === value;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              data-key={item.key}
              id={`${id}-tab-${item.key}`}
              aria-selected={active}
              aria-controls={`${id}-panel-${item.key}`}
              tabIndex={active ? 0 : -1}
              disabled={item.disabled}
              onClick={() => onChange(item.key)}
              className={cn(
                'vm-target inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 text-small font-medium transition-colors',
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text',
              )}
            >
              {item.icon}
              {item.label}
              {typeof item.count === 'number' && (
                <span
                  className={cn(
                    'rounded-full px-2 text-caption vm-tabular',
                    active ? 'vm-tint-primary' : 'vm-tint-muted',
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {children !== undefined && (
        <div
          role="tabpanel"
          id={`${id}-panel-${value}`}
          aria-labelledby={`${id}-tab-${value}`}
          tabIndex={0}
          className="pt-4"
        >
          {children}
        </div>
      )}
    </div>
  );
}
