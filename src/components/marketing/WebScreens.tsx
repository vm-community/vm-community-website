import {
  Bell,
  Building2,
  CalendarDays,
  FileText,
  HandCoins,
  Home,
  Newspaper,
  Search,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { Avatar } from '@/components/vm/Avatar';
import { Chip, StatusChip } from '@/components/vm/Chip';
import { StatCard } from '@/components/vm/StatCard';
import { LogoGlyph } from '@/components/vm/Logo';
import {
  sampleActivity,
  sampleApprovals,
  sampleCommunity,
  sampleDashboard,
  sampleDocuments,
  sampleEvents,
  sampleLedger,
  sampleMembers,
  sampleRoles,
  sampleUpcoming,
  sampleWebNav,
  sampleWebScreens,
} from '@/content/samples';
import type { WebTask } from '@/content/types';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format/numbers';
import { TreeMotif } from './NetworkMotif';
import { Scaled } from './Scaled';

/* Illustrative web-app screens: a real app shell (sidebar, top bar, page header) rendered at its
   design size and scaled into the browser frame, so type and spacing keep real proportions. */

const DESIGN = { w: 1040, h: 640 } as const;

const NAV_ICONS: Record<(typeof sampleWebNav)[number], LucideIcon> = {
  Home,
  Community: Newspaper,
  Events: CalendarDays,
  Families: Building2,
  Members: Users,
  Giving: HandCoins,
  Documents: FileText,
};

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'flex min-w-0 flex-col gap-3 rounded-lg bg-surface-raised p-5 vm-elevated-1',
        className,
      )}
    >
      <h3 className="text-h3 font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function DateBlock({ day, month }: { day: string; month: string }) {
  return (
    <span
      className="flex size-avatar-md shrink-0 flex-col items-center justify-center rounded-md vm-tint-primary leading-none"
      aria-hidden
    >
      <span className="text-h3 font-bold">{day}</span>
      <span className="text-caption font-medium uppercase">{month}</span>
    </span>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface-raised vm-elevated-1">
      <table className="w-full text-small">
        <thead className="bg-surface text-caption font-semibold uppercase tracking-wide text-text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-5 py-3 text-start">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="vm-border-t">
              {cells.map((c, j) => (
                <td key={j} className="px-5 py-3 align-middle">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Screen({ kind }: { kind: WebTask['screen'] }) {
  switch (kind) {
    case 'dashboard':
      return (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-4 gap-4">
            {sampleDashboard.stats.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                delta={{ text: s.delta, direction: s.direction }}
                sparkline={s.spark}
                gradient
              />
            ))}
          </div>
          <div className="vm-split-3-2 gap-4">
            <Panel title="Upcoming events">
              <ul className="flex flex-col gap-3">
                {sampleUpcoming.map((e) => (
                  <li key={e.title} className="flex items-center gap-3">
                    <DateBlock day={e.day} month={e.month} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{e.title}</span>
                      <span className="block text-caption text-text-muted">{e.meta}</span>
                    </span>
                    <Chip tone="muted" size="sm">
                      {e.going} going
                    </Chip>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Recent activity">
              <ul className="flex flex-col gap-3 text-small">
                {sampleActivity.slice(0, 3).map((a) => (
                  <li key={a} className="flex items-start gap-2 text-text-muted">
                    <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                    {a}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      );
    case 'members':
      return (
        <Table
          head={['Name', 'Status', 'Household', 'City']}
          rows={sampleMembers.map((m) => [
            <span key="n" className="flex items-center gap-3">
              <Avatar name={m.name} size="sm" decorative />
              <span className="font-medium">{m.name}</span>
            </span>,
            <StatusChip key="s" status={m.status} />,
            m.household,
            m.city,
          ])}
        />
      );
    case 'events':
      return (
        <ul className="flex flex-col gap-3">
          {sampleEvents.map((e) => (
            <li
              key={e.title}
              className="flex items-center gap-4 rounded-lg bg-surface-raised p-4 vm-elevated-1"
            >
              <DateBlock day={e.day} month={e.month} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{e.title}</span>
                <span className="block text-small text-text-muted">{e.meta}</span>
              </span>
              <span className="text-small text-text-muted vm-tabular">{e.going}</span>
              <StatusChip status={e.status} />
            </li>
          ))}
        </ul>
      );
    case 'ledger':
      return (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Received this month"
              value={formatCurrency(9000)}
              delta={{ text: '+12%', direction: 'up' }}
              gradient
            />
            <StatCard label="Pending" value={formatCurrency(5000)} />
            <StatCard label="Funds" value="4" />
          </div>
          <Table
            head={['Donor', 'Fund', 'Amount', 'Status']}
            rows={sampleLedger.map((l) => [
              l.donor,
              l.fund,
              <span key="a" className="vm-tabular">
                {formatCurrency(l.amount)}
              </span>,
              <StatusChip key="s" status={l.status} />,
            ])}
          />
        </div>
      );
    case 'approvals':
      return (
        <ul className="flex flex-col gap-3">
          {sampleApprovals.map((a) => (
            <li
              key={a.excerpt}
              className="flex items-center gap-4 rounded-lg bg-surface-raised p-4 vm-elevated-1"
            >
              <Avatar name={a.author} decorative />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{a.author}</span>
                <span className="block truncate text-small text-text-muted">{a.excerpt}</span>
              </span>
              <StatusChip status={a.status} />
              <span className="rounded-full bg-primary px-4 py-1 text-small font-medium text-on-primary">
                Approve
              </span>
              <span className="rounded-full px-4 py-1 text-small font-medium vm-border">
                Decline
              </span>
            </li>
          ))}
        </ul>
      );
    case 'documents':
      return (
        <ul className="grid grid-cols-3 gap-4">
          {sampleDocuments.map((d) => (
            <li
              key={d.title}
              className="flex flex-col gap-3 rounded-lg bg-surface-raised p-5 vm-elevated-1"
            >
              <span className="w-fit rounded-md p-2 vm-tint-info" aria-hidden>
                <FileText className="vm-icon" />
              </span>
              <span className="font-semibold">{d.title}</span>
              <span className="flex gap-2">
                <Chip size="sm">{d.category}</Chip>
                <Chip size="sm" tone="info">
                  {d.version}
                </Chip>
              </span>
            </li>
          ))}
        </ul>
      );
    case 'roles':
      return (
        <ul className="flex flex-col gap-3">
          {sampleRoles.map((r) => (
            <li
              key={r.role}
              className="flex items-center gap-4 rounded-lg bg-surface-raised p-4 vm-elevated-1"
            >
              <span className="rounded-md p-2 vm-tint-primary" aria-hidden>
                <UsersRound className="vm-icon" />
              </span>
              <span className="w-40 font-semibold">{r.role}</span>
              <span className="flex-1 text-small text-text-muted">{r.scopes}</span>
            </li>
          ))}
        </ul>
      );
    case 'tree':
    default:
      return (
        <div className="flex items-center justify-center rounded-lg bg-surface-raised p-5 text-primary vm-elevated-1">
          <TreeMotif className="max-w-prose" />
        </div>
      );
  }
}

/** A complete web-app screen (shell + page) at design size, scaled to fit the frame. */
export function WebScreen({ kind }: { kind: WebTask['screen'] }) {
  const meta = sampleWebScreens[kind];
  return (
    <Scaled designWidth={DESIGN.w} designHeight={DESIGN.h} initialScale={0.5}>
      <div className="flex bg-bg text-text" style={{ width: DESIGN.w, height: DESIGN.h }}>
        <nav
          aria-hidden
          className="flex w-sidebar shrink-0 flex-col gap-1 bg-surface p-4 vm-border-e"
        >
          <span className="mb-4 flex items-center gap-2 px-2 font-semibold">
            <LogoGlyph /> VibeMind
          </span>
          {sampleWebNav.map((n) => {
            const I = NAV_ICONS[n];
            return (
              <span
                key={n}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-small font-medium',
                  n === meta.nav ? 'vm-tint-primary' : 'text-text-muted',
                )}
              >
                <I className="vm-icon" /> {n}
              </span>
            );
          })}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <div aria-hidden className="flex h-topbar shrink-0 items-center gap-3 px-6 vm-border-b">
            <span className="flex items-center gap-2 font-semibold">
              {sampleCommunity.name}
              <Chip tone="muted" size="sm">
                Admin
              </Chip>
            </span>
            <span className="ms-auto flex w-56 items-center gap-2 rounded-md px-3 py-2 text-small text-text-muted vm-border">
              <Search className="vm-icon-sm" /> Search
            </span>
            <Bell className="vm-icon text-text-muted" />
            <Avatar name={sampleCommunity.user} size="sm" decorative />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-h1 font-semibold">{meta.title}</h4>
                <p className="text-small text-text-muted">{meta.sub}</p>
              </div>
              <span className="rounded-full bg-primary px-5 py-2 text-small font-medium text-on-primary">
                {meta.action}
              </span>
            </div>
            <Screen kind={kind} />
          </div>
        </div>
      </div>
    </Scaled>
  );
}
