import { Check } from 'lucide-react';
import { PhoneShell } from './Shell';

function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={`text-caption font-semibold uppercase tracking-wide text-text-muted ${className ?? ''}`}
    >
      {children}
    </span>
  );
}

export function ServingScreen() {
  return (
    <PhoneShell active={0} title="Serving and support">
      <SectionLabel>Invitations</SectionLabel>

      <div className="flex flex-col gap-3 rounded-lg vm-border bg-surface-raised p-5 vm-elevated-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-body font-semibold">Welcome team</span>
            <span className="text-small text-text-muted">Sunday gathering, 28 Jun, 08:30</span>
          </div>
          <span className="inline-flex flex-none items-center rounded-full px-3 py-1 text-caption font-semibold vm-tint-warning">
            Invited
          </span>
        </div>
        <span className="text-small">
          <span className="text-text-muted">Role</span>
          <span className="ms-2 font-semibold">Greeter</span>
        </span>
        <div aria-hidden className="flex gap-3">
          <span className="flex min-h-target flex-1 items-center justify-center rounded-full bg-primary text-small font-semibold text-on-primary">
            Accept
          </span>
          <span className="flex min-h-target flex-1 items-center justify-center rounded-full vm-border text-small font-semibold">
            Decline
          </span>
        </div>
      </div>

      <div className="flex min-h-target items-center justify-between gap-3 rounded-lg vm-border bg-surface-raised px-5 py-4 vm-elevated-1">
        <div className="flex flex-col gap-1">
          <span className="text-small font-semibold">Volunteers setup</span>
          <span className="text-caption text-text-muted">21 Jun</span>
        </div>
        <span className="inline-flex flex-none items-center gap-1 rounded-full py-1 pe-3 ps-2 text-caption font-semibold vm-tint-success">
          <Check aria-hidden className="vm-icon-sm" />
          Accepted
        </span>
      </div>

      <SectionLabel className="mt-1">Support requests</SectionLabel>

      <div className="flex flex-col gap-3 rounded-lg vm-border bg-surface-raised p-5 vm-elevated-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-caption text-text-muted">Posted by Anonymous</span>
          <span className="inline-flex flex-none items-center rounded-full px-3 py-1 text-caption font-semibold vm-tint-info">
            Shared with the community
          </span>
        </div>
        <p className="text-body">Please keep the Joseph family in your thoughts this week.</p>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-flex min-h-target flex-none items-center rounded-full vm-border px-5 text-small font-medium"
          >
            I stood with you
          </span>
          <span className="text-caption text-text-muted">14 have responded</span>
        </div>
      </div>

      <p className="rounded-lg bg-surface-raised px-4 py-3 text-caption text-text-muted">
        Requests can be private to leaders, or anonymous.
      </p>
    </PhoneShell>
  );
}
