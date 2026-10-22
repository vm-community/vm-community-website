'use client';

import { ChevronDown, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { controlClass, useFieldContext } from './Field';
import { Spinner } from './Progress';

export interface ComboOption {
  value: string;
  label: string;
  description?: string;
  leading?: ReactNode;
}

interface ComboboxProps {
  value: ComboOption | null;
  onChange: (option: ComboOption | null) => void;
  /** Async loader; debounced. */
  loadOptions: (query: string) => Promise<ComboOption[]>;
  placeholder?: string;
  disabled?: boolean;
  debounceMs?: number;
  minChars?: number;
}

/** Async combobox / person picker (ARIA 1.2 combobox pattern with a listbox popup). */
export function Combobox({
  value,
  onChange,
  loadOptions,
  placeholder,
  disabled,
  debounceMs = 250,
  minChars = 1,
}: ComboboxProps) {
  const t = useTranslations('components.combobox');
  const field = useFieldContext();
  const id = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ComboOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const tooShort = query.trim().length < minChars;
  useEffect(() => {
    if (!open || tooShort) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      loadOptions(query.trim())
        .then((opts) => {
          if (!cancelled) {
            setOptions(opts);
            setActive(opts.length > 0 ? 0 : -1);
          }
        })
        .catch(() => {
          if (!cancelled) setOptions([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, debounceMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open, tooShort, loadOptions, debounceMs]);
  const visible = tooShort ? [] : options;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function select(opt: ComboOption) {
    onChange(opt);
    setQuery('');
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, visible.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      const opt = visible[active];
      if (open && opt) {
        e.preventDefault();
        select(opt);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Backspace' && query === '' && value) {
      onChange(null);
    }
  }

  const listId = `${id}-list`;
  return (
    <div ref={rootRef} className="relative">
      <div className={cn(controlClass, 'flex items-center gap-2 pe-2', disabled && 'opacity-60')}>
        {value && (
          <span className="inline-flex max-w-full items-center gap-1 rounded-sm px-2 py-0 text-small vm-tint-primary">
            {value.leading}
            <span className="truncate">{value.label}</span>
            {!disabled && (
              <button
                type="button"
                aria-label={t('clear')}
                onClick={() => onChange(null)}
                className="rounded-sm p-1 hover:opacity-80"
              >
                <X className="vm-icon-sm" aria-hidden />
              </button>
            )}
          </span>
        )}
        <input
          ref={inputRef}
          id={field?.id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 && open ? `${id}-opt-${active}` : undefined}
          aria-describedby={field?.describedBy}
          aria-invalid={field?.invalid || undefined}
          disabled={disabled}
          value={query}
          placeholder={value ? undefined : placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-muted"
          autoComplete="off"
        />
        {loading ? (
          <Spinner />
        ) : (
          <button
            type="button"
            tabIndex={-1}
            aria-label={t('open')}
            onClick={() => {
              setOpen((o) => !o);
              inputRef.current?.focus();
            }}
            className="rounded-sm p-1 text-text-muted"
          >
            <ChevronDown className="vm-icon" aria-hidden />
          </button>
        )}
      </div>
      <ul
        id={listId}
        role="listbox"
        hidden={!open}
        className="absolute z-40 mt-1 max-h-popover w-full overflow-auto rounded-md bg-surface-raised p-1 vm-elevated-2"
      >
        {open && !loading && visible.length === 0 && (
          <li className="px-3 py-2 text-small text-text-muted" aria-disabled>
            {tooShort ? (placeholder ?? t('noOptions')) : t('noOptions')}
          </li>
        )}
        {visible.map((opt, i) => (
          <li
            key={opt.value}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => select(opt)}
            onMouseEnter={() => setActive(i)}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-small',
              i === active && 'vm-tint-primary',
            )}
          >
            {opt.leading}
            <span className="min-w-0">
              <span className="block truncate">{opt.label}</span>
              {opt.description && (
                <span className="block truncate text-caption text-text-muted">
                  {opt.description}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
