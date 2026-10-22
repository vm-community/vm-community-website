import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Feature cards use the larger radius (12); default cards 8. */
  feature?: boolean;
  padded?: boolean;
  interactive?: boolean;
  children: ReactNode;
}

export function Card({
  as: Tag = 'div',
  feature,
  padded = true,
  interactive,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        'bg-surface-raised text-text vm-elevated-1',
        feature ? 'rounded-lg' : 'rounded-md',
        padded && 'p-5',
        interactive && 'transition-colors vm-hover-surface focus-visible:outline-none',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h3 className="text-h3 font-semibold">{title}</h3>
        {subtitle && <p className="mt-1 text-small text-text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
