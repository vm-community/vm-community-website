import { Bell, CalendarDays, Home, Network, Newspaper } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar, ParticipantStack } from '@/components/vm/Avatar';
import { Chip, StatusChip } from '@/components/vm/Chip';
import { PollOptions } from '@/components/vm/PollOptions';
import { ReactionBar } from '@/components/vm/ReactionBar';
import { sampleEvent, sampleFeed, sampleHousehold, sampleStatement } from '@/content/samples';
import { formatCurrency } from '@/lib/format/numbers';
import { formatDate } from '@/lib/format/dates';

/* Illustrative phone screens built from real components with sample data (labelled by the frame). */

function BottomBar({ active }: { active: 'home' | 'feed' | 'events' | 'family' | 'me' }) {
  const t = useTranslations('nav');
  const items = [
    { k: 'home', I: Home, l: t('home') },
    { k: 'feed', I: Newspaper, l: t('community') },
    { k: 'events', I: CalendarDays, l: t('events') },
    { k: 'family', I: Network, l: t('family') },
    { k: 'me', I: Bell, l: t('me') },
  ] as const;
  return (
    <div className="mt-auto flex justify-between pt-2 vm-border-t" aria-hidden>
      {items.map(({ k, I, l }) => (
        <span
          key={k}
          className={`flex flex-col items-center gap-1 text-caption ${k === active ? 'text-primary' : 'text-text-muted'}`}
        >
          <I className="vm-icon-sm" />
          {l}
        </span>
      ))}
    </div>
  );
}

export function FeedScreen() {
  const t = useTranslations('nav');
  return (
    <div className="flex h-full flex-col gap-2 text-small">
      <p className="text-h3 font-semibold">{t('community')}</p>
      {sampleFeed.map((p) => (
        <div key={p.id} className="rounded-md bg-surface p-2 vm-border">
          <div className="flex items-center gap-2">
            <Avatar name={p.author} size="sm" decorative />
            <span className="font-medium">{p.author}</span>
            <span className="ms-auto text-caption text-text-muted">{p.time}</span>
          </div>
          {p.text && <p className="mt-1 text-caption">{p.text}</p>}
          {p.poll && (
            <div className="mt-1">
              <p className="text-caption font-medium">{p.poll.question}</p>
              <PollOptions
                options={p.poll.options.map(([label, votes], i) => ({
                  id: String(i),
                  label,
                  votes,
                }))}
                totalVotes={p.poll.options.reduce((a, [, v]) => a + v, 0)}
                myVote="0"
                canVote={false}
                className="mt-1"
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
              className="mt-1"
            />
          )}
        </div>
      ))}
      <BottomBar active="feed" />
    </div>
  );
}

export function EventScreen() {
  const t = useTranslations('nav');
  const tv = useTranslations('scopes.verb');
  const e = sampleEvent;
  return (
    <div className="flex h-full flex-col gap-2 text-small">
      <p className="text-h3 font-semibold">{t('events')}</p>
      <div className="rounded-md vm-gradient-brand p-3 text-on-scrim">
        <p className="text-h2 font-bold">{e.date.day}</p>
        <p className="text-caption">{e.date.month}</p>
      </div>
      <p className="text-body font-semibold">{e.title}</p>
      <p className="text-caption text-text-muted">
        {e.time} · {e.venue}
      </p>
      <div className="flex items-center gap-2">
        <ParticipantStack people={e.going.map((name) => ({ name }))} />
        <span className="text-caption text-text-muted vm-tabular">
          {e.registered}/{e.capacity}
        </span>
      </div>
      <span
        className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-small font-medium text-on-primary"
        aria-hidden
      >
        {tv('rsvp')}
      </span>
      <BottomBar active="events" />
    </div>
  );
}

export function GivingScreen() {
  const t = useTranslations('nav');
  const s = sampleStatement;
  return (
    <div className="flex h-full flex-col gap-2 text-small">
      <p className="text-h3 font-semibold">{t('giving')}</p>
      <div className="relative overflow-hidden rounded-md bg-surface p-3 vm-border">
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 vm-gradient-brand" />
        <p className="text-caption text-text-muted">{s.year}</p>
        <p className="text-h2 font-semibold vm-tabular">{formatCurrency(s.total)}</p>
      </div>
      <ul className="flex flex-col gap-1">
        {s.rows.map((r) => (
          <li
            key={r.date}
            className="flex items-center justify-between rounded-sm bg-surface px-2 py-1 text-caption"
          >
            <span>
              <span className="block font-medium">{r.fund}</span>
              <span className="text-text-muted">
                {formatDate(r.date)} · {r.method}
              </span>
            </span>
            <span className="vm-tabular">{formatCurrency(r.amount)}</span>
          </li>
        ))}
      </ul>
      <StatusChip status="RECEIVED" className="self-start" />
      <BottomBar active="me" />
    </div>
  );
}

export function FamilyScreen() {
  const t = useTranslations('nav');
  const h = sampleHousehold;
  return (
    <div className="flex h-full flex-col gap-2 text-small">
      <p className="text-h3 font-semibold">{t('family')}</p>
      <p className="font-medium">{h.family}</p>
      <ul className="flex flex-col gap-1">
        {h.members.map((m) => (
          <li key={m.name} className="flex items-center gap-2 rounded-sm bg-surface px-2 py-1">
            <Avatar name={m.name} size="sm" decorative />
            <span className="min-w-0 flex-1 truncate">{m.name}</span>
            <Chip size="sm">{m.label}</Chip>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1">
        {h.linked.map((l) => (
          <Chip
            key={l}
            tone="primary"
            size="sm"
            icon={<Network className="vm-icon-sm" aria-hidden />}
          >
            {l}
          </Chip>
        ))}
      </div>
      <BottomBar active="family" />
    </div>
  );
}

export function PhoneScreen({ kind }: { kind: 'feed' | 'event' | 'giving' | 'family' }) {
  switch (kind) {
    case 'feed':
      return <FeedScreen />;
    case 'event':
      return <EventScreen />;
    case 'giving':
      return <GivingScreen />;
    case 'family':
    default:
      return <FamilyScreen />;
  }
}
