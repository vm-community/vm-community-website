'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

interface PaginationProps {
  page: number;
  pageLength: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function pageWindow(page: number, pages: number): Array<number | 'gap'> {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set<number>([1, pages, page - 1, page, page + 1]);
  const sorted = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push('gap');
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({ page, pageLength, total, onPageChange, className }: PaginationProps) {
  const t = useTranslations('components.pagination');
  const tc = useTranslations('common');
  const pages = Math.max(1, Math.ceil(total / pageLength));
  if (pages <= 1) return null;
  return (
    <nav
      aria-label={t('label')}
      className={cn('flex flex-wrap items-center justify-between gap-2', className)}
    >
      <p className="text-small text-text-muted">{tc('pageOf', { page, total: pages })}</p>
      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            className="vm-target rounded-md px-2 vm-hover-surface disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label={t('prev')}
          >
            <ChevronLeft className="vm-icon rtl:rotate-180" aria-hidden />
          </button>
        </li>
        {pageWindow(page, pages).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-text-muted">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                aria-current={p === page ? 'page' : undefined}
                aria-label={p === page ? t('current', { page: p }) : t('page', { page: p })}
                onClick={() => onPageChange(p)}
                className={cn(
                  'vm-target rounded-md px-3 text-small vm-tabular',
                  p === page ? 'bg-primary text-on-primary' : 'vm-hover-surface',
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className="vm-target rounded-md px-2 vm-hover-surface disabled:opacity-40"
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
            aria-label={t('next')}
          >
            <ChevronRight className="vm-icon rtl:rotate-180" aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  );
}
