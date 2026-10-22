'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { THEME_MODES, type ThemeMode } from '@/lib/theme/theme';
import { useTheme } from '@/lib/theme/ThemeProvider';

const icons: Record<ThemeMode, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };

/** Segmented light / dark / system control (radiogroup), persisted via ThemeProvider. */
export function ThemeToggle({ className, compact }: { className?: string; compact?: boolean }) {
  const t = useTranslations('theme');
  const { mode, setMode } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label={t('label')}
      className={cn('inline-flex rounded-full vm-border bg-surface p-1', className)}
    >
      {THEME_MODES.map((m) => {
        const Icon = icons[m];
        const active = m === mode;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t(m)}
            title={t(m)}
            onClick={() => setMode(m)}
            className={cn(
              'inline-flex items-center justify-center gap-1 rounded-full px-2 py-1 text-caption font-medium transition-colors',
              compact ? 'min-h-6' : 'vm-target',
              active
                ? 'bg-surface-raised text-primary vm-elevated-1'
                : 'text-text-muted hover:text-text',
            )}
          >
            <Icon className="vm-icon-sm" aria-hidden />
            {!compact && <span className="hidden sm:inline">{t(m)}</span>}
          </button>
        );
      })}
    </div>
  );
}
