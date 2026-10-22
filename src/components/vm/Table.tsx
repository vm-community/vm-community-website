'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'start' | 'end';
  /** Hide on the stacked card layout under 600px. */
  hideOnCard?: boolean;
  width?: string;
}

export interface SortState {
  key: string;
  dir: 'asc' | 'desc';
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption: string;
  sort?: SortState;
  onSort?: (next: SortState) => void;
  rowActions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  className?: string;
}

/**
 * Sticky-header sortable table that collapses to cards under 600px (each cell labelled by its
 * column header). Sorting is announced through aria-sort.
 */
export function Table<T>({
  columns,
  rows,
  rowKey,
  caption,
  sort,
  onSort,
  rowActions,
  onRowClick,
  emptyState,
  className,
}: TableProps<T>) {
  const t = useTranslations('components.table');
  const tc = useTranslations('common');

  function toggleSort(key: string) {
    if (!onSort) return;
    if (sort?.key === key) onSort({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    else onSort({ key, dir: 'asc' });
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-md vm-border bg-surface-raised', className)}>
      <table className="w-full border-collapse text-small">
        <caption className="vm-sr-only">{t('caption', { title: caption })}</caption>
        <thead className="sticky top-0 z-10 bg-surface max-sm:hidden">
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              const ariaSort = active
                ? sort.dir === 'asc'
                  ? 'ascending'
                  : 'descending'
                : col.sortable
                  ? 'none'
                  : undefined;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  style={col.width ? { inlineSize: col.width } : undefined}
                  className={cn(
                    'px-4 py-3 text-caption font-semibold uppercase tracking-wide text-text-muted',
                    col.align === 'end' ? 'text-end' : 'text-start',
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 rounded-sm hover:text-text"
                      title={tc('sortable')}
                    >
                      {col.header}
                      {active ? (
                        sort.dir === 'asc' ? (
                          <ArrowUp className="vm-icon-sm" aria-hidden />
                        ) : (
                          <ArrowDown className="vm-icon-sm" aria-hidden />
                        )
                      ) : (
                        <ArrowUpDown className="vm-icon-sm opacity-60" aria-hidden />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
            {rowActions && (
              <th scope="col" className="px-4 py-3 text-end">
                <span className="vm-sr-only">{t('rowActions')}</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="max-sm:block max-sm:p-2">
          {rows.length === 0 && (
            <tr className="max-sm:block">
              <td
                colSpan={columns.length + (rowActions ? 1 : 0)}
                className="px-4 py-6 text-center text-text-muted max-sm:block"
              >
                {emptyState ?? t('empty')}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'vm-border-t max-sm:mb-2 max-sm:block max-sm:rounded-md max-sm:border max-sm:p-3',
                onRowClick && 'cursor-pointer transition-colors vm-hover-surface',
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  data-label={typeof col.header === 'string' ? col.header : undefined}
                  className={cn(
                    'px-4 py-3 align-middle max-sm:flex max-sm:justify-between max-sm:gap-3 max-sm:px-0 max-sm:py-1',
                    col.align === 'end' ? 'text-end' : 'text-start',
                    col.hideOnCard && 'max-sm:hidden',
                  )}
                >
                  {typeof col.header === 'string' && (
                    <span className="text-caption font-semibold text-text-muted sm:hidden">
                      {col.header}
                    </span>
                  )}
                  <span className="min-w-0">{col.cell(row)}</span>
                </td>
              ))}
              {rowActions && (
                <td
                  className="px-4 py-2 text-end max-sm:flex max-sm:justify-end max-sm:px-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {rowActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
