'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Pill shape with a trailing arrow (marketing CTA style). */
  pill?: boolean;
  arrow?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Icon-only button: the label becomes the accessible name. */
  iconOnly?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none transition-colors vm-target disabled:opacity-50 aria-disabled:opacity-50 aria-disabled:pointer-events-none';
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'vm-border bg-surface-raised text-text vm-hover-surface',
  ghost: 'text-text vm-hover-surface',
  danger: 'bg-danger text-on-primary hover:opacity-90',
  link: 'text-primary underline-offset-4 hover:underline',
};
const sizes: Record<ButtonSize, string> = {
  sm: 'text-small px-3 py-1',
  md: 'text-body px-4 py-2',
  lg: 'text-body px-5 py-3',
};

export function buttonClasses(p: BaseProps): string {
  return cn(
    base,
    variants[p.variant ?? 'primary'],
    sizes[p.size ?? 'md'],
    p.pill ? 'rounded-full' : 'rounded-md',
    p.iconOnly && 'px-2',
    p.fullWidth && 'w-full',
    p.className,
  );
}

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    pill,
    arrow,
    loading,
    icon,
    trailingIcon,
    iconOnly,
    fullWidth,
    className,
    children,
    type = 'button',
    disabled,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, pill, iconOnly, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 className="vm-icon animate-spin" aria-hidden /> : icon}
      {iconOnly ? <span className="vm-sr-only">{children}</span> : children}
      {trailingIcon}
      {arrow && <ArrowRight className="vm-icon" aria-hidden />}
    </button>
  );
});

type ButtonLinkProps = BaseProps & { href: string; external?: boolean; ariaLabel?: string };

export function ButtonLink({
  href,
  external,
  ariaLabel,
  variant,
  size,
  pill,
  arrow,
  icon,
  trailingIcon,
  iconOnly,
  fullWidth,
  className,
  children,
}: ButtonLinkProps) {
  const cls = buttonClasses({ variant, size, pill, iconOnly, fullWidth, className });
  const inner = (
    <>
      {icon}
      {iconOnly ? <span className="vm-sr-only">{children}</span> : children}
      {trailingIcon}
      {arrow && <ArrowRight className="vm-icon" aria-hidden />}
    </>
  );
  if (external) {
    return (
      <a
        href={href}
        className={cls}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {inner}
    </Link>
  );
}
