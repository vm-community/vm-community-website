'use client';

import { MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { buttonClasses, type ButtonVariant } from './Button';

export interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
  /** Visual divider above this item. */
  dividerBefore?: boolean;
}

interface MenuProps {
  items: MenuItem[];
  label?: string;
  trigger?: ReactNode;
  triggerVariant?: ButtonVariant;
  align?: 'start' | 'end';
  className?: string;
}

/** Popover menu with roving focus, typeahead-free; closes on Escape, outside click and selection. */
export function Menu({
  items,
  label,
  trigger,
  triggerVariant = 'ghost',
  align = 'end',
  className,
}: MenuProps) {
  const t = useTranslations('common');
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const enabled = items.filter((i) => !i.disabled);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    const first = listRef.current?.querySelector<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"])',
    );
    first?.focus();
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  function focusIndex(i: number) {
    const nodes = listRef.current?.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"])',
    );
    const node = nodes?.[i];
    node?.focus();
    setActive(i);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      rootRef.current?.querySelector<HTMLElement>('button')?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusIndex((active + 1) % enabled.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusIndex((active - 1 + enabled.length) % enabled.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusIndex(enabled.length - 1);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={trigger ? undefined : (label ?? t('moreActions'))}
        onClick={() => setOpen((o) => !o)}
        className={
          trigger
            ? buttonClasses({ variant: triggerVariant })
            : buttonClasses({ variant: triggerVariant, iconOnly: true })
        }
      >
        {trigger ?? <MoreHorizontal className="vm-icon" aria-hidden />}
      </button>
      {open && (
        <div
          ref={listRef}
          id={`${id}-menu`}
          role="menu"
          aria-label={label ?? t('actions')}
          onKeyDown={onKeyDown}
          className={cn(
            'absolute z-40 mt-1 min-w-menu rounded-md bg-surface-raised p-1 vm-elevated-2',
            align === 'end' ? 'end-0' : 'start-0',
          )}
        >
          {items.map((item) => {
            const cls = cn(
              'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-start text-small vm-hover-surface',
              item.danger && 'text-danger',
              item.disabled && 'opacity-50',
              item.dividerBefore && 'mt-1 vm-border-t pt-2',
            );
            if (item.href && !item.disabled) {
              return (
                <a
                  key={item.key}
                  role="menuitem"
                  href={item.href}
                  className={cls}
                  tabIndex={-1}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </a>
              );
            }
            return (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                tabIndex={-1}
                className={cls}
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Generic popover for non-menu content (filters, pickers). */
export function Popover({
  trigger,
  label,
  children,
  className,
}: {
  trigger: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div ref={rootRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-pop`}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={buttonClasses({ variant: 'secondary' })}
      >
        {trigger}
      </button>
      {open && (
        <div
          id={`${id}-pop`}
          role="dialog"
          aria-label={label}
          className="absolute end-0 z-40 mt-1 min-w-popover rounded-md bg-surface-raised p-4 vm-elevated-2"
        >
          {children}
        </div>
      )}
    </div>
  );
}
