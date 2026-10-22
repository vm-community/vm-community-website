'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}

/**
 * Accessible tooltip: shown on hover and focus, described via aria-describedby. A disabled
 * control inside still receives hover because the wrapper is the hover target.
 */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={id}
    >
      {children}
      <span
        role="tooltip"
        id={id}
        className={cn(
          'pointer-events-none absolute start-1/2 z-50 w-max max-w-prose -translate-x-1/2 rounded-sm bg-text px-2 py-1 text-caption text-bg transition-opacity',
          side === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
          open ? 'opacity-100' : 'opacity-0',
        )}
      >
        {content}
      </span>
    </span>
  );
}
