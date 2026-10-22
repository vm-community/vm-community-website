'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

interface InfiniteListProps {
  children: ReactNode;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  /** Also load when the sentinel scrolls into view (the button stays for keyboard users). */
  auto?: boolean;
  className?: string;
}

export function InfiniteList({
  children,
  hasMore,
  loadingMore,
  onLoadMore,
  auto = true,
  className,
}: InfiniteListProps) {
  const t = useTranslations('components.list');
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auto || !hasMore || loadingMore || !sentinel.current) return;
    const el = sentinel.current;
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) onLoadMore();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [auto, hasMore, loadingMore, onLoadMore]);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {children}
      <div ref={sentinel} className="flex justify-center py-2">
        {hasMore ? (
          <Button variant="secondary" onClick={onLoadMore} loading={loadingMore}>
            {loadingMore ? t('loadingMore') : t('loadMore')}
          </Button>
        ) : (
          <p className="text-caption text-text-muted">{t('allLoaded')}</p>
        )}
      </div>
    </div>
  );
}
