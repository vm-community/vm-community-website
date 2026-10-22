import { CircleCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PhoneShell } from './Shell';

const MENU = ['Profile', 'Privacy and preferences', 'Notifications', 'Your communities', 'Help'];

const ORGS: { name: string; type: string; accent: string; tint: string; current: boolean }[] = [
  {
    name: 'Grace Community',
    type: 'community',
    accent: 'bg-primary',
    tint: 'vm-tint-primary',
    current: true,
  },
  {
    name: 'Riverside Sports Club',
    type: 'club',
    accent: 'bg-success',
    tint: 'vm-tint-success',
    current: false,
  },
  {
    name: 'Mathew-Thomas Family Association',
    type: 'family association',
    accent: 'bg-secondary',
    tint: 'vm-tint-secondary',
    current: false,
  },
];

export function CommunitiesScreen() {
  return (
    <PhoneShell active={4} title="Your communities">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-avatar-md flex-none items-center justify-center rounded-full text-small font-semibold vm-tint-primary"
        >
          AM
        </span>
        <div className="flex flex-col">
          <span className="text-small font-semibold">Anna Mathew</span>
          <span className="text-caption text-text-muted">Member since 2019</span>
        </div>
      </div>
      <div className="flex flex-col overflow-hidden rounded-lg vm-border bg-surface-raised vm-elevated-1">
        {MENU.map((label, i) => (
          <div
            key={label}
            className={cn(
              'flex items-center justify-between px-4 text-small',
              i > 0 && 'vm-border-t',
            )}
            style={{ minHeight: 52 }}
          >
            <span>{label}</span>
            <ChevronRight aria-hidden className="vm-icon-sm text-text-muted" />
          </div>
        ))}
      </div>

      <div aria-hidden className="absolute inset-0 bg-scrim" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 rounded-t-lg vm-border-t bg-surface-raised px-5 pb-5 pt-2 vm-elevated-3">
        <span
          aria-hidden
          className="self-center rounded-full bg-border"
          style={{ width: 36, height: 4 }}
        />
        <h2 className="mt-1 text-h3 font-semibold">Switch community</h2>

        <div className="flex flex-col gap-2">
          {ORGS.map((o) => (
            <div
              key={o.name}
              className={cn(
                'flex items-center gap-3 rounded-lg py-2 pe-4 ps-3',
                o.current ? 'border-2 border-primary bg-surface' : 'vm-border bg-bg',
              )}
              style={{ minHeight: 64 }}
            >
              <span
                aria-hidden
                className={cn('flex-none rounded-full', o.accent)}
                style={{ width: 4, height: 40 }}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className={cn('text-small font-semibold', o.current && 'text-text')}>
                  {o.name}
                </span>
                <span className="flex items-center gap-2 text-caption text-text-muted">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 font-semibold',
                      o.tint,
                    )}
                    style={{ height: 22 }}
                  >
                    {o.type}
                  </span>
                  Member
                </span>
              </div>
              <CircleCheck
                className={cn('vm-icon flex-none text-primary', !o.current && 'opacity-0')}
                aria-label={o.current ? 'Current community' : undefined}
                aria-hidden={o.current ? undefined : true}
              />
            </div>
          ))}
        </div>

        <p className="text-center text-caption text-text-muted">
          One login for every community you belong to.
        </p>

        <span
          aria-hidden
          className="flex min-h-target items-center justify-center rounded-full vm-border text-small font-semibold"
        >
          Find a community
        </span>
      </div>
    </PhoneShell>
  );
}
