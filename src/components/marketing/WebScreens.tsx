import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar } from '@/components/vm/Avatar';
import { Chip, StatusChip } from '@/components/vm/Chip';
import { StatCard } from '@/components/vm/StatCard';
import { TreeMotif } from './NetworkMotif';
import {
  sampleApprovals,
  sampleDashboard,
  sampleDocuments,
  sampleLedger,
  sampleMembers,
  sampleRoles,
} from '@/content/samples';
import { formatCurrency } from '@/lib/format/numbers';
import type { WebTask } from '@/content/types';

/* Illustrative web screens built from real components with sample data (labelled by the frame). */

function MiniTable({ rows, columns }: { rows: Array<Record<string, string>>; columns: string[] }) {
  return (
    <div className="overflow-hidden rounded-md vm-border text-caption">
      <div
        className="grid bg-surface px-2 py-1 font-semibold uppercase tracking-wide text-text-muted"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          className="grid items-center px-2 py-1 vm-border-t"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((c) => (
            <span key={c} className="truncate">
              {c === 'Status' ? <StatusChip status={r[c] ?? ''} /> : r[c]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function WebScreen({ kind }: { kind: WebTask['screen'] }) {
  const tm = useTranslations('modules');
  switch (kind) {
    case 'dashboard':
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {sampleDashboard.stats.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              delta={{ text: s.delta, direction: s.direction }}
              sparkline={s.spark}
              gradient
              className="p-3"
            />
          ))}
        </div>
      );
    case 'members':
      return (
        <MiniTable
          columns={['Name', 'Status', 'City']}
          rows={sampleMembers.map((m) => ({ Name: m.name, Status: m.status, City: m.city }))}
        />
      );
    case 'events':
      return (
        <ul className="flex flex-col gap-1 text-caption">
          {[
            'Sunday gathering · weekly',
            'Volunteers meeting · monthly',
            'Community picnic · 14 Jun',
          ].map((e, i) => (
            <li
              key={e}
              className="flex items-center justify-between rounded-sm bg-surface px-2 py-1"
            >
              <span>{e}</span>
              <StatusChip status={i === 2 ? 'DRAFT' : 'PUBLISHED'} />
            </li>
          ))}
        </ul>
      );
    case 'ledger':
      return (
        <MiniTable
          columns={['Donor', 'Fund', 'Amount', 'Status']}
          rows={sampleLedger.map((l) => ({
            Donor: l.donor,
            Fund: l.fund,
            Amount: formatCurrency(l.amount),
            Status: l.status,
          }))}
        />
      );
    case 'approvals':
      return (
        <ul className="flex flex-col gap-1 text-caption">
          {sampleApprovals.map((a) => (
            <li key={a.excerpt} className="flex items-center gap-2 rounded-sm bg-surface px-2 py-1">
              <Avatar name={a.author} size="sm" decorative />
              <span className="min-w-0 flex-1 truncate">{a.excerpt}</span>
              <StatusChip status={a.status} />
            </li>
          ))}
        </ul>
      );
    case 'documents':
      return (
        <ul className="flex flex-col gap-1 text-caption">
          {sampleDocuments.map((d) => (
            <li
              key={d.title}
              className="flex items-center justify-between rounded-sm bg-surface px-2 py-1"
            >
              <span className="truncate">{d.title}</span>
              <span className="flex gap-1">
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
        <ul className="flex flex-col gap-1 text-caption">
          {sampleRoles.map((r) => (
            <li
              key={r.role}
              className="flex items-center justify-between rounded-sm bg-surface px-2 py-1"
            >
              <span className="inline-flex items-center gap-1 font-medium">
                <Users className="vm-icon-sm" aria-hidden />
                {r.role}
              </span>
              <span className="text-text-muted">{r.scopes}</span>
            </li>
          ))}
        </ul>
      );
    case 'tree':
    default:
      return (
        <div className="text-primary">
          <TreeMotif />
          <p className="text-center text-caption text-text-muted">{tm('tree.title')}</p>
        </div>
      );
  }
}
