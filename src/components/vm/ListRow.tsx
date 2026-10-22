import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ListRowProps {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

/** List row: avatar, title, subtitle, meta, trailing actions. Clickable as a link or button. */
export function ListRow({
  leading,
  title,
  subtitle,
  meta,
  trailing,
  href,
  onClick,
  selected,
  className,
}: ListRowProps) {
  const body = (
    <>
      {leading && <span className="shrink-0">{leading}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-text">{title}</span>
        {subtitle && <span className="block truncate text-small text-text-muted">{subtitle}</span>}
        {meta && (
          <span className="mt-1 flex flex-wrap items-center gap-2 text-caption text-text-muted">
            {meta}
          </span>
        )}
      </span>
    </>
  );
  const cls = cn(
    'flex w-full items-center gap-3 px-4 py-3 text-start vm-target',
    selected && 'vm-tint-primary',
    className,
  );
  const interactiveCls = cn(cls, 'rounded-md transition-colors vm-hover-surface');
  return (
    <li className="flex items-center gap-2">
      {href ? (
        <Link href={href} className={interactiveCls}>
          {body}
        </Link>
      ) : onClick ? (
        <button type="button" onClick={onClick} className={interactiveCls}>
          {body}
        </button>
      ) : (
        <div className={cls}>{body}</div>
      )}
      {trailing && <span className="flex shrink-0 items-center gap-1 pe-2">{trailing}</span>}
    </li>
  );
}

export function List({
  children,
  className,
  divided = true,
}: {
  children: ReactNode;
  className?: string;
  divided?: boolean;
}) {
  return (
    <ul className={cn('flex flex-col', divided && '[&>li+li]:vm-border-t', className)}>
      {children}
    </ul>
  );
}
