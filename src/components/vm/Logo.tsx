import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

/**
 * Original text wordmark + network-nodes glyph. Placeholder until the official logo asset is
 * supplied (see public/brand/README.md). Does not imitate the parent brand's logo.
 */
export function LogoGlyph({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient
          id="vm-logo-grad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="var(--vm-color-secondary)" />
          <stop offset="1" stopColor="var(--vm-color-primary)" />
        </linearGradient>
      </defs>
      <g stroke="url(#vm-logo-grad)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 10 L16 16 L23 9" />
        <path d="M16 16 L16 25" />
        <path d="M16 16 L7 21" />
        <path d="M16 16 L25 22" />
      </g>
      <g fill="url(#vm-logo-grad)">
        <circle cx="16" cy="16" r="3.2" />
        <circle cx="9" cy="10" r="2.2" />
        <circle cx="23" cy="9" r="2.2" />
        <circle cx="16" cy="25" r="2.2" />
        <circle cx="7" cy="21" r="2.2" />
        <circle cx="25" cy="22" r="2.2" />
      </g>
    </svg>
  );
}

export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const t = useTranslations('brand');
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-semibold tracking-tight text-text',
        className,
      )}
    >
      <LogoGlyph />
      <span className={cn(compact && 'vm-sr-only')}>
        {t('shortName')}
        <span className="font-normal text-text-muted">
          {' '}
          {t('name').replace(t('shortName'), '').trim()}
        </span>
      </span>
    </span>
  );
}
