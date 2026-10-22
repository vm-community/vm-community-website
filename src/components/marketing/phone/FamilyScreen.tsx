import { Link2, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PhoneShell } from './Shell';

const MEMBERS = [
  { name: 'Thomas Mathew', ini: 'TM', rel: 'Father', tint: 'vm-tint-primary' },
  { name: 'Leah Thomas', ini: 'LT', rel: 'Mother', tint: 'vm-tint-info' },
  { name: 'Anna Mathew', ini: 'AM', rel: 'Daughter', tint: 'vm-tint-warning' },
  { name: 'Ben Mathew', ini: 'BM', rel: 'Son', tint: 'vm-tint-success' },
];

const LINKS = [
  { title: 'Thomas family', sub: 'Marriage alliance', status: 'Active', tint: 'vm-tint-info' },
  { title: 'Varghese family', sub: 'Marriage alliance', status: 'Active', tint: 'vm-tint-warning' },
  {
    title: 'Thomas to Varghese',
    sub: 'Awaiting approval',
    status: 'Pending',
    tint: 'vm-tint-warning',
  },
];

const PANEL = 'flex-none overflow-hidden rounded-lg bg-surface-raised vm-elevated-1';

export function FamilyScreen() {
  return (
    <PhoneShell active={3} title="Family">
      <div aria-hidden className="flex flex-none gap-1 rounded-lg bg-surface p-1 vm-border">
        <span className="flex min-h-control flex-1 items-center justify-center rounded-md bg-surface-raised text-small font-semibold text-primary vm-elevated-1">
          Household
        </span>
        <span className="flex min-h-control flex-1 items-center justify-center rounded-md text-small font-semibold text-text-muted">
          Tree
        </span>
      </div>

      <div className={PANEL}>
        <div className="flex h-14 items-center justify-between bg-surface px-4 vm-border-b">
          <span className="text-body font-semibold">Mathew family</span>
          <span className="inline-flex h-5 items-center rounded-sm px-2 text-caption font-semibold vm-tint-primary">
            Primary
          </span>
        </div>
        {MEMBERS.map((m) => (
          <div key={m.name} className="flex h-14 items-center gap-3 px-4 vm-border-t">
            <span
              aria-hidden
              className={cn(
                'flex size-avatar-md shrink-0 items-center justify-center rounded-full text-caption font-semibold',
                m.tint,
              )}
            >
              {m.ini}
            </span>
            <span className="min-w-0 flex-1 text-small font-medium">{m.name}</span>
            <span className="inline-flex h-5 items-center rounded-sm px-2 text-caption font-medium text-text-muted vm-border">
              {m.rel}
            </span>
          </div>
        ))}
      </div>

      <span className="flex-none text-caption font-semibold uppercase tracking-wide text-text-muted">
        Linked families
      </span>
      <div className={cn(PANEL, '-mt-1')}>
        {LINKS.map((l, i) => (
          <div
            key={l.title}
            className={cn('flex h-16 items-center gap-3 px-4', i > 0 && 'vm-border-t')}
          >
            <span
              aria-hidden
              className={cn(
                'flex size-avatar-md shrink-0 items-center justify-center rounded-full',
                l.tint,
              )}
            >
              <Link2 className="vm-icon-sm" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-small font-semibold">{l.title}</span>
              <span className="text-caption text-text-muted">{l.sub}</span>
            </span>
            <span
              className={cn(
                'inline-flex h-5 shrink-0 items-center rounded-sm px-2 text-caption font-semibold',
                l.status === 'Active' ? 'vm-tint-success' : 'vm-tint-warning',
              )}
            >
              {l.status}
            </span>
          </div>
        ))}
      </div>

      <span
        aria-hidden
        className="mt-auto flex min-h-control-touch flex-none items-center justify-center gap-2 rounded-full vm-border-primary text-body font-semibold text-primary"
      >
        <Plus className="vm-icon" />
        Add relative
      </span>
    </PhoneShell>
  );
}
