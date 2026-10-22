'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

export interface Step {
  key: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
  /** Allows jumping back to completed steps. */
  onStepClick?: (index: number) => void;
  className?: string;
}

/** Wizard step timeline: horizontal on desktop, compact on phones; announces progress. */
export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  const t = useTranslations('components.stepper');
  return (
    <nav
      aria-label={t('step', { current: current + 1, total: steps.length })}
      className={className}
    >
      <ol className="flex items-start gap-2 overflow-x-auto">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = done && Boolean(onStepClick);
          const Marker = (
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full text-caption font-semibold',
                done
                  ? 'bg-primary text-on-primary'
                  : active
                    ? 'vm-border-strong text-primary'
                    : 'vm-border text-text-muted',
              )}
              aria-hidden
            >
              {done ? <Check className="vm-icon-sm" /> : i + 1}
            </span>
          );
          const content = (
            <>
              {Marker}
              <span
                className={cn(
                  'min-w-0 text-small',
                  active ? 'font-semibold text-text' : 'text-text-muted',
                  'max-sm:vm-sr-only',
                )}
              >
                <span className="block truncate">{step.label}</span>
                {step.description && (
                  <span className="block truncate text-caption">{step.description}</span>
                )}
              </span>
            </>
          );
          return (
            <li
              key={step.key}
              className={cn(
                'flex min-w-0 flex-1 items-center gap-2',
                i < steps.length - 1 &&
                  'after:ms-1 after:h-px after:flex-1 after:bg-border after:content-[""]',
              )}
              aria-current={active ? 'step' : undefined}
            >
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(i)}
                  className="flex min-w-0 items-center gap-2 rounded-sm text-start"
                >
                  {content}
                  <span className="vm-sr-only">{t('complete')}</span>
                </button>
              ) : (
                <span className="flex min-w-0 items-center gap-2">
                  {content}
                  {active && <span className="vm-sr-only">{t('current')}</span>}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
