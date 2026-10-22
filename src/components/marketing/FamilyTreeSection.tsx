import Link from 'next/link';
import { Chip } from '@/components/vm/Chip';
import { HERO_COPY, MINI_SIZE } from '@/content/miniTreeSample';
import { LINE } from './treeEdges';
import { MiniTree } from './MiniTree';
import { Scaled } from './Scaled';
import { SectionHeading } from './Sections';

const LEGEND_STYLES: Array<React.CSSProperties> = [
  { height: 0, borderTop: `var(--vm-layout-border-strong) solid ${LINE}` },
  { height: 6, borderRadius: 9999, backgroundImage: 'var(--vm-gradient-brand)' },
  { height: 0, borderTop: `var(--vm-layout-border-strong) dashed ${LINE}` },
  { height: 0, borderTop: 'var(--vm-layout-border-strong) dotted var(--vm-color-secondary)' },
];

/** "Every branch, one tree" section: capability points beside a static tree panel (family associations). */
export function FamilyTreeSection({
  title,
  body,
  sampleLabel,
  interactiveHref,
}: {
  title: string;
  body: string;
  sampleLabel: string;
  interactiveHref: string;
}) {
  const c = HERO_COPY;
  return (
    <div className="grid items-start gap-7 lg:grid-cols-5">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <SectionHeading align="start" eyebrow={c.eyebrow} title={title} sub={body} />
        <ul className="flex flex-col gap-5">
          {c.sectionPoints.map((p) => (
            <li key={p.title} className="flex gap-4">
              <span
                aria-hidden
                className="flex size-avatar-md shrink-0 items-center justify-center rounded-md text-small font-bold vm-tint-primary"
              >
                {p.n}
              </span>
              <span>
                <span className="block font-semibold">{p.title}</span>
                <span className="mt-1 block text-small text-text-muted">{p.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-lg bg-surface-raised vm-elevated-2 lg:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface px-5 py-3 vm-border-b">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-small text-text-muted">
            {c.stats.map((s) => (
              <li key={s.l}>
                <strong className="font-semibold text-text">{s.n}</strong> {s.l}
              </li>
            ))}
          </ul>
          <span
            className="flex gap-1 rounded-md bg-bg p-1 vm-border text-small font-medium"
            aria-hidden
          >
            <span className="rounded-sm bg-surface px-3 py-1 text-primary">{c.views[0]}</span>
            <span className="px-3 py-1 text-text-muted">{c.views[1]}</span>
          </span>
        </div>
        <div className="p-5 pb-0">
          <Scaled designWidth={MINI_SIZE.w} designHeight={MINI_SIZE.h + 8} initialScale={0.9}>
            <MiniTree highlightFocus />
          </Scaled>
        </div>
        <div className="m-5 flex items-center gap-4 rounded-md bg-bg p-4 vm-border">
          <span
            aria-hidden
            className="flex size-avatar-md shrink-0 items-center justify-center rounded-full text-small font-semibold vm-tint-primary"
          >
            {c.focus.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{c.focus.title}</span>
            <span className="block text-small text-text-muted">{c.focus.body}</span>
          </span>
          <Link
            href={interactiveHref}
            className="shrink-0 text-small font-medium text-primary hover:underline"
          >
            {c.focus.link}
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 pb-5 text-caption text-text-muted">
          {c.legendEdges.map((label, i) => (
            <span key={label} className="inline-flex items-center gap-2">
              <span aria-hidden className="inline-block w-5" style={LEGEND_STYLES[i]} />
              {label}
            </span>
          ))}
          <Chip tone="muted" size="sm" className="ms-auto">
            {sampleLabel}
          </Chip>
        </div>
      </div>
    </div>
  );
}
