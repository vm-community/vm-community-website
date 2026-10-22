import { Check } from 'lucide-react';
import { MiniTree } from './MiniTree';
import { Scaled } from './Scaled';
import { Chip } from '@/components/vm/Chip';
import { cn } from '@/lib/cn';
import { FAMILY_COLOUR } from './treeEdges';
import { HERO_COPY, MINI_SIZE, PHONE_SIZE } from '@/content/miniTreeSample';

/** Hero illustration for /for/family-associations: a real mini tree with floating approval and kinship cards. */
export function FamilyHero() {
  const c = HERO_COPY;
  return (
    <Scaled designWidth={640} designHeight={580} initialScale={0.9}>
      <div className="relative" style={{ width: 640, height: 580 }}>
        <div
          className="absolute overflow-hidden rounded-lg bg-surface-raised vm-elevated-3"
          style={{ left: 20, top: 20, width: 600 }}
        >
          <div className="flex items-center justify-between bg-surface px-4 py-3 vm-border-b">
            <span className="flex items-center gap-2 text-small font-semibold">
              <span aria-hidden className="size-2 rounded-full bg-primary" />
              {c.panelTitle}
            </span>
            <span
              className="flex gap-1 rounded-md bg-bg p-1 vm-border text-small font-medium"
              aria-hidden
            >
              <span className="rounded-sm bg-surface px-3 py-1 text-primary">{c.views[0]}</span>
              <span className="px-3 py-1 text-text-muted">{c.views[1]}</span>
            </span>
          </div>
          <div style={{ margin: 20, marginBottom: 0, height: MINI_SIZE.h + 10 }}>
            <MiniTree />
          </div>
          <div className="flex items-center gap-4 px-5 pb-4 pt-3 text-caption text-text-muted">
            {c.legend.map((l) => (
              <span key={l.key} className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-2 rounded-sm"
                  style={{ background: FAMILY_COLOUR[l.key] }}
                />
                {l.label}
              </span>
            ))}
            <span className="ms-auto">{c.sample}</span>
          </div>
        </div>

        <div
          className="absolute flex flex-col gap-3 rounded-lg bg-surface-raised p-4 vm-elevated-3"
          style={{ left: 372, top: 392, width: 268 }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-small font-semibold">{c.approval.title}</span>
            <Chip tone="warning" size="sm">
              {c.approval.status}
            </Chip>
          </div>
          <p className="text-small text-text-muted">{c.approval.body}</p>
          <div className="flex gap-2" aria-hidden>
            <span className="rounded-md bg-primary px-4 py-2 text-small font-medium text-on-primary">
              {c.approval.approve}
            </span>
            <span className="rounded-md px-4 py-2 text-small font-medium vm-border">
              {c.approval.decline}
            </span>
          </div>
        </div>

        <div
          className="absolute flex flex-col gap-1 rounded-lg bg-surface-raised p-4 vm-elevated-3"
          style={{ left: 0, top: 420, width: 292 }}
        >
          <span className="text-caption font-semibold uppercase tracking-wide text-text-muted">
            {c.kinship.label}
          </span>
          <span className="text-body font-semibold">{c.kinship.answer}</span>
          <span className="text-small text-text-muted">{c.kinship.path}</span>
        </div>
      </div>
    </Scaled>
  );
}

/** Phone-width hero illustration: a compact tree card and a kinship answer. */
export function FamilyHeroCompact({ className }: { className?: string }) {
  const c = HERO_COPY;
  return (
    <div className={cn('overflow-hidden rounded-lg bg-surface-raised vm-elevated-2', className)}>
      <div className="flex items-center justify-between bg-surface px-4 py-3 vm-border-b text-small font-semibold">
        <span>{c.panelTitle}</span>
        <span className="font-medium text-text-muted">{c.sample}</span>
      </div>
      <div className="p-4">
        <Scaled designWidth={PHONE_SIZE.w} designHeight={PHONE_SIZE.h + 8} initialScale={0.9}>
          <MiniTree variant="phone" />
        </Scaled>
      </div>
      <div className="m-4 mt-0 rounded-md bg-bg p-3 vm-border">
        <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">
          {c.phoneKinship.label}
        </p>
        <p className="mt-1 text-body font-semibold">{c.phoneKinship.answer}</p>
        <p className="mt-1 text-small text-text-muted">{c.phoneKinship.path}</p>
      </div>
    </div>
  );
}

export function HeroPoints() {
  return (
    <ul className="flex flex-col gap-3 text-small text-text-muted">
      {HERO_COPY.points.map((p) => (
        <li key={p} className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-5 items-center justify-center rounded-full vm-tint-primary"
          >
            <Check className="vm-icon-sm" />
          </span>
          {p}
        </li>
      ))}
    </ul>
  );
}
