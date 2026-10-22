import { Heart, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PhoneShell } from './Shell';

const FILTERS = ['All', 'General fund', 'Building project', 'Welfare fund'];

const ROWS = [
  {
    fund: 'General fund',
    meta: '5 Jan  ·  UPI',
    amt: '₹2,500',
    status: 'Received',
    tint: 'vm-tint-primary',
  },
  {
    fund: 'Building project',
    meta: '2 Feb  ·  Bank',
    amt: '₹5,000',
    status: 'Received',
    tint: 'vm-tint-info',
  },
  {
    fund: 'General fund',
    meta: '1 Mar  ·  UPI',
    amt: '₹2,500',
    status: 'Received',
    tint: 'vm-tint-primary',
  },
  {
    fund: 'Welfare fund',
    meta: '6 Apr  ·  Cash',
    amt: '₹1,500',
    status: 'Pending',
    tint: 'vm-tint-warning',
  },
];

export function GivingScreen() {
  return (
    <PhoneShell active={4} title="Giving">
      <div className="flex-none overflow-hidden rounded-lg bg-surface-raised vm-elevated-1">
        <div aria-hidden className="h-1 vm-gradient-brand" />
        <div className="flex flex-col gap-1 p-4">
          <span className="text-caption text-text-muted">Annual statement 2026</span>
          <span className="text-display font-bold vm-tabular">{'₹'}18,500</span>
          <span className="text-caption text-text-muted">4 contributions recorded</span>
        </div>
      </div>

      <div aria-hidden className="flex flex-none flex-wrap gap-2">
        {FILTERS.map((label, i) => (
          <span
            key={label}
            className={cn(
              'inline-flex h-avatar-md items-center whitespace-nowrap rounded-full px-4 text-small font-medium',
              i === 0 ? 'bg-primary text-on-primary' : 'vm-border',
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex-none overflow-hidden rounded-lg bg-surface-raised vm-elevated-1">
        {ROWS.map((r, i) => (
          <div
            key={r.meta}
            className={cn('flex h-16 items-center gap-3 px-4', i > 0 && 'vm-border-t')}
          >
            <span
              aria-hidden
              className={cn(
                'flex size-avatar-md shrink-0 items-center justify-center rounded-full',
                r.tint,
              )}
            >
              <Heart className="vm-icon" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-small font-semibold">{r.fund}</span>
              <span className="text-caption text-text-muted">{r.meta}</span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-small font-semibold vm-tabular">{r.amt}</span>
              <span
                className={cn(
                  'inline-flex h-5 items-center rounded-sm px-2 text-caption font-semibold',
                  r.status === 'Received' ? 'vm-tint-success' : 'vm-tint-warning',
                )}
              >
                {r.status}
              </span>
            </span>
          </div>
        ))}
      </div>

      <p className="flex-none text-caption text-text-muted">
        Records gifts made through your community&rsquo;s own channel. No card details are taken
        here.
      </p>

      <span
        aria-hidden
        className="mt-auto flex min-h-control-touch flex-none items-center justify-center gap-2 rounded-full bg-primary text-body font-semibold text-on-primary"
      >
        <Plus className="vm-icon" />
        Record a contribution
      </span>
    </PhoneShell>
  );
}
