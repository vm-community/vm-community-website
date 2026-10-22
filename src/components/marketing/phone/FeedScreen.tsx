import { Check, Heart, MessageCircle, Pin, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PhoneShell } from './Shell';

const FILTERS = ['All', 'Posts', 'Polls', 'Events'];

function Initials({ text, tint }: { text: string; tint: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-avatar-md shrink-0 items-center justify-center rounded-full text-small font-semibold',
        tint,
      )}
    >
      {text}
    </span>
  );
}

const CARD = 'flex flex-none flex-col rounded-lg bg-surface-raised p-4 vm-elevated-1';

export function FeedScreen() {
  return (
    <PhoneShell active={1} title="Community">
      <div aria-hidden className="flex flex-none gap-2">
        {FILTERS.map((label, i) => (
          <span
            key={label}
            className={cn(
              'inline-flex h-avatar-md items-center rounded-full px-4 text-small font-medium',
              i === 0 ? 'bg-primary text-on-primary' : 'vm-border',
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <article className={cn(CARD, 'gap-3')}>
        <div className="flex items-center gap-3">
          <Initials text="AM" tint="vm-tint-primary" />
          <span className="flex flex-col">
            <span className="text-small font-semibold">Anna Mathew</span>
            <span className="text-caption text-text-muted">2 h</span>
          </span>
        </div>
        <p className="text-small leading-body">
          Harvest gathering this Saturday at 5 pm. Bring the family and a dish to share.
        </p>
        <div aria-hidden className="flex items-center gap-2">
          <span className="inline-flex h-6 items-center gap-2 rounded-full px-3 text-caption font-semibold vm-tint-info">
            <ThumbsUp className="vm-icon-sm" />
            12
          </span>
          <span className="inline-flex h-6 items-center gap-2 rounded-full px-3 text-caption font-semibold vm-tint-danger">
            <Heart className="vm-icon-sm" />4
          </span>
          <span className="ms-auto inline-flex items-center gap-2 text-caption text-text-muted">
            <MessageCircle className="vm-icon-sm" />3
          </span>
        </div>
      </article>

      <article className={cn(CARD, 'gap-3')}>
        <div className="flex items-center gap-3">
          <Initials text="BT" tint="vm-tint-info" />
          <span className="flex flex-col">
            <span className="text-small font-semibold">Ben Thomas</span>
            <span className="text-caption text-text-muted">5 h</span>
          </span>
        </div>
        <p className="text-small font-medium leading-body">
          Which evening works for the volunteers&rsquo; meeting?
        </p>
        <div aria-hidden className="flex flex-col gap-2">
          <div className="relative flex h-control items-center gap-2 overflow-hidden rounded-md bg-bg px-3 text-small vm-border-primary">
            <span className="absolute inset-y-0 start-0 vm-tint-primary" style={{ width: '62%' }} />
            <Check className="vm-icon-sm relative text-primary" />
            <span className="relative font-semibold">Tuesday</span>
            <span className="relative ms-auto font-semibold">62%</span>
          </div>
          <div className="relative flex h-control items-center gap-2 overflow-hidden rounded-md bg-bg px-3 text-small vm-border">
            <span className="absolute inset-y-0 start-0 vm-tint-muted" style={{ width: '38%' }} />
            <span className="relative">Thursday</span>
            <span className="relative ms-auto font-semibold">38%</span>
          </div>
        </div>
        <span className="text-caption text-text-muted">13 votes</span>
      </article>

      <article className={cn(CARD, 'gap-2')}>
        <span className="inline-flex items-center gap-1 self-start rounded-sm px-2 text-caption font-semibold vm-tint-warning">
          <Pin className="vm-icon-sm" aria-hidden />
          Pinned
        </span>
        <span className="text-body font-semibold">Hall closed on 14 June</span>
        <span className="text-small text-text-muted">
          The hall is closed for floor repairs. Services move to the side room.
        </span>
      </article>
    </PhoneShell>
  );
}
