import {
  Bell,
  CalendarDays,
  Clock,
  Home,
  MapPin,
  Network,
  Newspaper,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Avatar, ParticipantStack } from '@/components/vm/Avatar';
import { Chip, StatusChip } from '@/components/vm/Chip';
import { PollOptions } from '@/components/vm/PollOptions';
import { ReactionBar } from '@/components/vm/ReactionBar';
import {
  sampleCommunity,
  sampleEvent,
  sampleFeed,
  sampleHousehold,
  samplePhone,
  sampleStatement,
} from '@/content/samples';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';
import { formatCurrency } from '@/lib/format/numbers';
import { Scaled } from './Scaled';

/* Illustrative phone screens: a real app layout (status bar, app bar, content, bottom tabs)
   rendered at phone size (360 x 760) and scaled into the frame, so text keeps real proportions. */

export const PHONE_DESIGN = { w: 360, h: 760 } as const;

const TAB_ICONS: LucideIcon[] = [Home, Newspaper, CalendarDays, Network, UserRound];

function Shell({
  active,
  title,
  children,
}: {
  active: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex flex-col bg-bg text-text"
      style={{ width: PHONE_DESIGN.w, height: PHONE_DESIGN.h }}
    >
      <div
        aria-hidden
        className="flex items-center justify-between px-5 pt-3 text-caption font-semibold"
      >
        <span>9:41</span>
        <span className="h-2 w-6 rounded-full bg-text" />
      </div>
      <div aria-hidden className="flex items-center gap-3 px-5 pb-2 pt-3">
        <span className="min-w-0 flex-1">
          <span className="block text-caption text-text-muted">{sampleCommunity.name}</span>
          <span className="block text-h2 font-semibold">{title}</span>
        </span>
        <span className="relative rounded-full p-2 vm-border">
          <Bell className="vm-icon" />
          <span className="absolute end-1 top-1 size-2 rounded-full bg-danger" />
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-5 pb-3">{children}</div>
      <nav aria-hidden className="flex vm-border-t bg-surface-raised px-2 pb-4 pt-2">
        {samplePhone.tabs.map((label, i) => {
          const I = TAB_ICONS[i] ?? Home;
          return (
            <span
              key={label}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-md py-1 text-caption font-medium',
                i === active ? 'text-primary' : 'text-text-muted',
              )}
            >
              <I className="vm-icon" />
              {label}
            </span>
          );
        })}
      </nav>
    </div>
  );
}

export function FeedScreen() {
  return (
    <Shell active={1} title="Community">
      {sampleFeed.slice(0, 3).map((p) => (
        <article
          key={p.id}
          className="flex flex-col gap-2 rounded-lg bg-surface-raised p-4 vm-elevated-1"
        >
          <div className="flex items-center gap-3">
            <Avatar name={p.author} size="sm" decorative />
            <span className="flex-1 text-small font-semibold">{p.author}</span>
            <span className="text-caption text-text-muted">{p.time}</span>
          </div>
          {p.text && <p className="text-small leading-body">{p.text}</p>}
          {p.poll && (
            <div className="flex flex-col gap-2">
              <p className="text-small font-medium">{p.poll.question}</p>
              <PollOptions
                options={p.poll.options.map(([label, votes], i) => ({
                  id: String(i),
                  label,
                  votes,
                }))}
                totalVotes={p.poll.options.reduce((a, [, v]) => a + v, 0)}
                myVote="0"
                canVote={false}
              />
            </div>
          )}
          {p.reactions && (
            <ReactionBar
              compact
              canReact={false}
              summary={{
                by_type: p.reactions,
                total: Object.values(p.reactions).reduce((a, b) => a + b, 0),
                my_reaction: null,
              }}
            />
          )}
        </article>
      ))}
    </Shell>
  );
}

export function EventScreen() {
  const e = sampleEvent;
  return (
    <Shell active={2} title="Events">
      <article className="flex flex-col overflow-hidden rounded-lg bg-surface-raised vm-elevated-1">
        <div className="flex h-32 items-end p-4 vm-gradient-brand">
          <span
            className="flex flex-col items-center rounded-md bg-bg px-3 py-1 leading-none text-text"
            aria-hidden
          >
            <span className="text-h2 font-bold">{e.date.day}</span>
            <span className="text-caption font-medium uppercase">{e.date.month}</span>
          </span>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <h3 className="text-h3 font-semibold">{e.title}</h3>
          <p className="flex items-center gap-2 text-small text-text-muted">
            <Clock className="vm-icon-sm" aria-hidden /> {e.time}
          </p>
          <p className="flex items-center gap-2 text-small text-text-muted">
            <MapPin className="vm-icon-sm" aria-hidden /> {e.venue}
          </p>
          <div className="flex items-center gap-3">
            <ParticipantStack people={e.going.map((name) => ({ name }))} />
            <span className="text-small text-text-muted vm-tabular">
              {e.registered} {samplePhone.going}
            </span>
          </div>
          <span
            className="flex items-center justify-center rounded-full bg-primary px-4 py-3 text-body font-semibold text-on-primary"
            aria-hidden
          >
            {samplePhone.rsvp}
          </span>
        </div>
      </article>
    </Shell>
  );
}

export function GivingScreen() {
  const s = sampleStatement;
  return (
    <Shell active={4} title="Giving">
      <div className="relative overflow-hidden rounded-lg bg-surface-raised p-4 vm-elevated-1">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 vm-gradient-brand" />
        <p className="text-caption text-text-muted">
          {samplePhone.statementTitle} {s.year}
        </p>
        <p className="text-display font-bold vm-tabular">{formatCurrency(s.total)}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {s.rows.map((r) => (
          <li
            key={r.date}
            className="flex items-center gap-3 rounded-lg bg-surface-raised p-3 vm-elevated-1"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-small font-semibold">{r.fund}</span>
              <span className="block text-caption text-text-muted">
                {formatDate(r.date)} · {r.method}
              </span>
            </span>
            <span className="text-small font-semibold vm-tabular">{formatCurrency(r.amount)}</span>
            <StatusChip status="RECEIVED" />
          </li>
        ))}
      </ul>
      <span
        className="mt-auto flex items-center justify-center rounded-full bg-primary px-4 py-3 text-body font-semibold text-on-primary"
        aria-hidden
      >
        {samplePhone.addGift}
      </span>
    </Shell>
  );
}

export function FamilyScreen() {
  const h = sampleHousehold;
  return (
    <Shell active={3} title="Family">
      <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">
        {samplePhone.household}
      </p>
      <div className="rounded-lg bg-surface-raised p-4 vm-elevated-1">
        <p className="mb-2 text-body font-semibold">{h.family}</p>
        <ul className="flex flex-col gap-2">
          {h.members.map((m) => (
            <li key={m.name} className="flex items-center gap-3">
              <Avatar name={m.name} size="sm" decorative />
              <span className="flex-1 text-small">{m.name}</span>
              <Chip size="sm">{m.label}</Chip>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">
        {samplePhone.linked}
      </p>
      <div className="flex flex-wrap gap-2">
        {h.linked.map((l) => (
          <Chip key={l} tone="primary" icon={<Network className="vm-icon-sm" aria-hidden />}>
            {l}
          </Chip>
        ))}
      </div>
    </Shell>
  );
}

export function PhoneScreen({ kind }: { kind: 'feed' | 'event' | 'giving' | 'family' }) {
  const screen =
    kind === 'feed' ? (
      <FeedScreen />
    ) : kind === 'event' ? (
      <EventScreen />
    ) : kind === 'giving' ? (
      <GivingScreen />
    ) : (
      <FamilyScreen />
    );
  return (
    <Scaled designWidth={PHONE_DESIGN.w} designHeight={PHONE_DESIGN.h} initialScale={0.8}>
      {screen}
    </Scaled>
  );
}
