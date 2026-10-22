import { ChevronDown } from 'lucide-react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { PhoneShell } from './Shell';

const VISIBILITY = ['Public', 'Members', 'Staff', 'Private'];
const FIELDS: { label: string; value: string; tint: string }[] = [
  { label: 'Phone', value: 'Staff', tint: 'vm-tint-warning' },
  { label: 'Email', value: 'Members', tint: 'vm-tint-info' },
  { label: 'Birthday', value: 'Private', tint: 'vm-tint-primary' },
];
const CONSENTS: { label: string; note: string; on: boolean }[] = [
  { label: 'Directory listing', note: 'Show me in the community directory.', on: true },
  { label: 'Photo sharing', note: 'Allow photos that include me.', on: true },
  { label: 'Community messages', note: 'Receive messages from the community.', on: false },
];
const FORMATS = [
  { label: 'Date format', value: 'DD/MM/YYYY' },
  { label: 'Time', value: '12-hour' },
];
const THEMES = ['Light', 'Dark', 'System'];

function Segmented({
  items,
  selected,
  style,
}: {
  items: string[];
  selected: number;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className="flex gap-1 rounded-full vm-border bg-bg p-1"
      style={{ height: 40, ...style }}
    >
      {items.map((label, i) => (
        <span
          key={label}
          className={cn(
            'flex min-w-0 flex-1 items-center justify-center rounded-full text-caption font-semibold',
            i === selected ? 'bg-primary text-on-primary' : 'text-text-muted',
          )}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

const card = 'flex flex-none flex-col rounded-lg vm-border bg-surface-raised vm-elevated-1';

export function PrivacyScreen() {
  return (
    <PhoneShell active={4} title="Privacy and preferences">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3" style={{ height: 40 }}>
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

        <div className={cn(card, 'gap-2 px-4 pb-2 pt-3')}>
          <span className="text-small font-semibold">Who can see my details</span>
          <Segmented items={VISIBILITY} selected={1} />
          <div className="flex flex-col">
            {FIELDS.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between vm-border-t"
                style={{ height: 32 }}
              >
                <span className="text-small">{f.label}</span>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-3 text-caption font-semibold',
                    f.tint,
                  )}
                  style={{ height: 22 }}
                >
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(card, 'gap-1 px-4 pt-3')}>
          <span className="text-small font-semibold">Consent</span>
          <div className="flex flex-col">
            {CONSENTS.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between gap-3 py-1 vm-border-t"
                style={{ minHeight: 46 }}
              >
                <div className="flex flex-col">
                  <span className="text-small font-medium">{s.label}</span>
                  <span className="text-caption text-text-muted">{s.note}</span>
                </div>
                <span
                  aria-hidden
                  className={cn(
                    'flex flex-none items-center rounded-full',
                    s.on ? 'justify-end bg-primary' : 'justify-start bg-text-muted',
                  )}
                  style={{ width: 44, height: 26, padding: 3 }}
                >
                  <span className="rounded-full bg-bg" style={{ width: 20, height: 20 }} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(card, 'gap-1 px-4 pt-3')}>
          <span className="text-small font-semibold">Date and time</span>
          <div className="flex flex-col">
            {FORMATS.map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between vm-border-t"
                style={{ height: 44 }}
              >
                <span className="text-small">{d.label}</span>
                <span className="inline-flex items-center gap-1 text-small font-medium">
                  {d.value}
                  <ChevronDown aria-hidden className="vm-icon-sm text-text-muted" />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(card, 'flex-row items-center justify-between gap-3 py-2 pe-2 ps-4')}>
          <span className="text-small font-semibold">Appearance</span>
          <Segmented items={THEMES} selected={2} style={{ width: 208 }} />
        </div>

        <span
          aria-hidden
          className="inline-flex min-h-target flex-none items-center self-center px-5 text-small font-semibold text-primary underline underline-offset-4"
        >
          Request my data
        </span>
      </div>
    </PhoneShell>
  );
}
