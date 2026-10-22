'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { initialsOf, stableHash } from '@/lib/format/names';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClass: Record<AvatarSize, string> = {
  sm: 'size-avatar-sm text-caption',
  md: 'size-avatar-md text-small',
  lg: 'size-avatar-lg text-h3',
  xl: 'size-avatar-xl text-h1',
};

/** Initials tint derived deterministically from the name, using only token colours via color-mix. */
const TINTS = [
  'vm-tint-primary',
  'vm-tint-secondary',
  'vm-tint-info',
  'vm-tint-success',
  'vm-tint-warning',
] as const;
export function avatarTint(name: string): string {
  return TINTS[stableHash(name) % TINTS.length] ?? 'vm-tint-primary';
}

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  /** Masked (private) persons show a neutral mark instead of initials. */
  masked?: boolean;
  deceased?: boolean;
  className?: string;
  /** When the avatar is purely decorative next to a visible name. */
  decorative?: boolean;
}

/** Resolves site-relative private file paths through the file proxy (live) or returns as-is. */
export function resolveImageUrl(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http')) return src;
  return src;
}

export function Avatar({
  name,
  src,
  size = 'md',
  masked,
  deceased,
  className,
  decorative,
}: AvatarProps) {
  const t = useTranslations('components.avatar');
  const [broken, setBroken] = useState(false);
  const url = masked ? null : resolveImageUrl(src);
  const label = decorative ? undefined : t('of', { name });
  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-semibold',
        sizeClass[size],
        masked || deceased ? 'vm-tint-muted' : avatarTint(name),
        deceased && 'grayscale',
        className,
      )}
      role={decorative ? undefined : 'img'}
      aria-label={label}
      aria-hidden={decorative || undefined}
    >
      {url && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="size-full object-cover" onError={() => setBroken(true)} />
      ) : masked ? (
        <span aria-hidden>·</span>
      ) : (
        <span aria-hidden>{initialsOf(name)}</span>
      )}
    </span>
  );
}

interface ParticipantStackProps {
  people: Array<{ name: string; src?: string | null; masked?: boolean }>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function ParticipantStack({
  people,
  max = 4,
  size = 'sm',
  className,
}: ParticipantStackProps) {
  const t = useTranslations('components.avatar');
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <span
      className={cn('inline-flex items-center', className)}
      aria-label={t('stackLabel', { count: people.length })}
      role="group"
    >
      {shown.map((p, i) => (
        <span
          key={`${p.name}-${i}`}
          className={cn('rounded-full ring-2 ring-bg', i > 0 && '-ms-2')}
        >
          <Avatar name={p.name} src={p.src} masked={p.masked} size={size} decorative />
        </span>
      ))}
      {rest > 0 && (
        <span
          className={cn(
            '-ms-2 inline-flex items-center justify-center rounded-full vm-tint-muted ring-2 ring-bg font-medium',
            sizeClass[size],
          )}
        >
          {t('stackMore', { count: rest })}
        </span>
      )}
    </span>
  );
}
