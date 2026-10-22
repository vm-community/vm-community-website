import { ChevronRight, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PhoneShell } from './Shell';

const PEOPLE: Array<[string, string]> = [
  ['AM', 'vm-tint-primary'],
  ['BT', 'vm-tint-info'],
  ['CV', 'vm-tint-warning'],
  ['DK', 'vm-tint-success'],
  ['EJ', 'vm-tint-primary'],
  ['FR', 'vm-tint-info'],
];

const OTHERS = [
  { title: 'Volunteers meeting', day: '21', meta: 'Hall B  ·  18:30', tint: 'vm-tint-info' },
  { title: 'Sunday gathering', day: '28', meta: 'Main hall  ·  09:00', tint: 'vm-tint-warning' },
];

export function EventScreen() {
  return (
    <PhoneShell active={2} title="Events">
      <article className="flex-none overflow-hidden rounded-lg bg-surface-raised vm-elevated-1">
        <div className="relative h-32 vm-gradient-brand">
          <div
            aria-hidden
            className="absolute start-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-md bg-bg text-text"
          >
            <span className="text-caption font-semibold tracking-wide text-primary">JUN</span>
            <span className="text-h2 font-bold">14</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <h2 className="text-h2 font-semibold">Community picnic</h2>
          <div className="flex flex-col gap-2 text-small">
            <span className="flex items-center gap-2">
              <Clock className="vm-icon-sm text-text-muted" aria-hidden />
              10:00 - 14:00
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="vm-icon-sm text-text-muted" aria-hidden />
              Riverside park north lawn
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="flex items-center">
              {PEOPLE.map(([ini, tint], i) => (
                <span
                  key={ini}
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-caption font-semibold ring-2 ring-surface-raised',
                    tint,
                    i > 0 && '-ms-2',
                  )}
                >
                  {ini}
                </span>
              ))}
            </span>
            <span className="text-small font-semibold">86 going</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-caption text-text-muted">
              <span>Capacity</span>
              <span>86 of 120</span>
            </div>
            <div aria-hidden className="h-2 overflow-hidden rounded-full vm-tint-muted">
              <div className="h-full rounded-full vm-gradient-brand" style={{ width: '72%' }} />
            </div>
          </div>
          <span
            aria-hidden
            className="flex min-h-control-touch w-full items-center justify-center rounded-full bg-primary px-4 text-body font-semibold text-on-primary"
          >
            RSVP for you and your household
          </span>
        </div>
      </article>

      <span className="flex-none text-caption font-semibold uppercase tracking-wide text-text-muted">
        Coming up
      </span>
      <div className="-mt-1 flex flex-none flex-col gap-2">
        {OTHERS.map((o) => (
          <div
            key={o.title}
            className="flex h-16 items-center gap-3 rounded-lg bg-surface-raised px-3 vm-elevated-1"
          >
            <span
              aria-hidden
              className={cn(
                'flex size-avatar-md shrink-0 flex-col items-center justify-center rounded-md',
                o.tint,
              )}
            >
              <span className="text-caption font-semibold leading-none">JUN</span>
              <span className="text-body font-bold leading-none">{o.day}</span>
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-small font-semibold">{o.title}</span>
              <span className="text-caption text-text-muted">{o.meta}</span>
            </span>
            <ChevronRight className="vm-icon-sm text-text-muted" aria-hidden />
          </div>
        ))}
      </div>
    </PhoneShell>
  );
}
