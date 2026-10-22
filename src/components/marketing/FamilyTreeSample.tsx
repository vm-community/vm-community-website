'use client';

import { useTranslations } from 'next-intl';
import { useState, type CSSProperties } from 'react';
import { Avatar } from '@/components/vm/Avatar';
import { Chip } from '@/components/vm/Chip';
import { cn } from '@/lib/cn';
import {
  CARD,
  FAMILY_NAMES,
  SAMPLE_EDGES,
  SAMPLE_LABELS,
  SAMPLE_LINKS,
  SAMPLE_PEOPLE,
  SAMPLE_STATS,
  TREE_SIZE,
  type Edge,
  type FamilyKey,
  type SamplePerson,
} from '@/content/familyTreeSample';
import { Scaled } from './Scaled';

const FAMILY_COLOUR: Record<FamilyKey, string> = {
  mathew: 'var(--vm-color-primary)',
  thomas: 'var(--vm-color-info)',
  varghese: 'var(--vm-color-warning)',
  none: 'var(--vm-color-text-muted)',
  private: 'var(--vm-color-text-muted)',
};
const LINE = 'var(--vm-color-text-muted)';
const RULE = 'var(--vm-layout-border-strong)';

function edgeStyle(e: Edge): CSSProperties {
  const horizontal = e.dir === 'h';
  const base: CSSProperties = {
    position: 'absolute',
    left: e.x - (horizontal ? 0 : 1),
    top: e.y - (horizontal ? 1 : 0),
  };
  const length = e.to - (horizontal ? e.x : e.y);
  if (e.kind === 'bridge') {
    return {
      ...base,
      top: e.y - 3,
      width: length,
      height: 6,
      borderRadius: 9999,
      backgroundImage: 'var(--vm-gradient-brand)',
    };
  }
  if (e.kind === 'solid') {
    return horizontal
      ? { ...base, width: length, height: 2, background: LINE }
      : { ...base, width: 2, height: length, background: LINE };
  }
  const style = e.kind === 'dash' ? 'dashed' : 'dotted';
  const colour = e.kind === 'dot' ? 'var(--vm-color-secondary)' : LINE;
  return horizontal
    ? { ...base, width: length, height: 0, borderTop: `${RULE} ${style} ${colour}` }
    : { ...base, width: 0, height: length, borderLeft: `${RULE} ${style} ${colour}` };
}

function Node({
  p,
  selected,
  onSelect,
}: {
  p: SamplePerson;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'absolute flex flex-col justify-center gap-1 rounded-md bg-surface-raised px-3 text-start text-text',
        selected ? 'vm-border-primary' : 'vm-border',
      )}
      style={{
        left: p.x,
        top: p.y,
        width: CARD.w,
        height: CARD.h,
        borderInlineStartWidth: 4,
        borderInlineStartColor: FAMILY_COLOUR[p.family],
        boxShadow: selected ? 'var(--vm-focus-ring)' : undefined,
      }}
    >
      <span className="text-small font-semibold leading-heading">{p.name}</span>
      <span className="text-caption text-text-muted">
        {[p.life, p.tag].filter(Boolean).join(' · ') || ' '}
      </span>
    </button>
  );
}

function Legend() {
  const t = useTranslations('marketing.treeDemo');
  const items: Array<{ label: string; style: CSSProperties }> = [
    { label: t('legendParent'), style: { height: 0, borderTop: `${RULE} solid ${LINE}` } },
    { label: t('legendCouple'), style: { height: 0, borderTop: `${RULE} solid ${LINE}` } },
    {
      label: t('legendBridge'),
      style: { height: 6, borderRadius: 9999, backgroundImage: 'var(--vm-gradient-brand)' },
    },
    { label: t('legendEnded'), style: { height: 0, borderTop: `${RULE} dashed ${LINE}` } },
    {
      label: t('legendAdoptive'),
      style: { height: 0, borderTop: `${RULE} dotted var(--vm-color-secondary)` },
    },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md vm-border bg-bg p-3 text-caption text-text-muted">
      <strong className="font-semibold text-text">{t('legend')}</strong>
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block w-5" style={i.style} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

function Panel({ p }: { p: SamplePerson }) {
  const t = useTranslations('marketing.treeDemo');
  const rows: Array<[string, string]> = [
    [t('parents'), p.parents],
    [t('partner'), p.partners],
    [t('children'), p.children],
    [t('families'), p.families],
  ];
  return (
    <aside aria-live="polite" className="flex flex-col gap-4 rounded-lg bg-surface p-5 vm-border">
      <div className="flex items-center gap-3">
        <Avatar name={p.name} masked={p.masked} size="lg" decorative />
        <div className="min-w-0">
          <h3 className="text-h3 font-semibold">{p.name}</h3>
          <p className="text-small text-text-muted">
            {p.life || 'Details private'} · {FAMILY_NAMES[p.family]}
          </p>
        </div>
      </div>
      <div className="rounded-md bg-bg p-3 vm-border">
        <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">
          {t('howRelated')}
        </p>
        <p className="mt-1 text-body font-semibold">{p.relation}</p>
        <p className="mt-1 text-small text-text-muted">{p.path}</p>
      </div>
      <dl className="vm-dl-grid gap-x-4 gap-y-2 text-small">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-text-muted">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-2 vm-border-t pt-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">
          {t('familyLinks')}
        </p>
        {SAMPLE_LINKS.map((l) => (
          <div key={l.title} className="rounded-md bg-bg p-3 vm-border">
            <div className="flex items-center justify-between gap-2">
              <span className="text-small font-semibold">{l.title}</span>
              <Chip size="sm" tone={l.status === 'Active' ? 'success' : 'warning'}>
                {l.status === 'Active' ? t('active') : t('pending')}
              </Chip>
            </div>
            <p className="mt-1 text-caption text-text-muted">{l.meta}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

/** Interactive, read-only sample of the family tree (Tree and List views, kinship panel). */
export function FamilyTreeSample() {
  const t = useTranslations('marketing.treeDemo');
  const [view, setView] = useState<'tree' | 'list'>('tree');
  const [selected, setSelected] = useState('anna');
  const current = SAMPLE_PEOPLE.find((p) => p.id === selected) ?? SAMPLE_PEOPLE[0];
  if (!current) return null;
  const stats: Array<[number, string]> = [
    [SAMPLE_STATS.people, t('people')],
    [SAMPLE_STATS.generations, t('generations')],
    [SAMPLE_STATS.families, t('familiesCount')],
    [SAMPLE_STATS.activeLinks, t('activeLinks')],
    [SAMPLE_STATS.pendingLinks, t('pendingLinks')],
    [SAMPLE_STATS.notMembers, t('notMembers')],
  ];
  const generations = [1, 2, 3, 4];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-small text-text-muted">
          {stats.map(([n, label]) => (
            <li key={label}>
              <strong className="font-semibold text-text vm-tabular">{n}</strong> {label}
            </li>
          ))}
        </ul>
        <div
          role="radiogroup"
          aria-label={t('viewLabel')}
          className="inline-flex rounded-md vm-border bg-surface p-1"
        >
          {(['tree', 'list'] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              onClick={() => setView(v)}
              className={cn(
                'vm-target rounded-sm px-4 text-small font-medium',
                view === v
                  ? 'bg-surface-raised text-primary vm-elevated-1'
                  : 'text-text-muted hover:text-text',
              )}
            >
              {v === 'tree' ? t('viewTree') : t('viewList')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-4 vm-tree-grid">
        <div className="flex min-w-0 flex-col gap-3">
          {view === 'tree' ? (
            <>
              <div className="rounded-lg bg-bg p-3 vm-border">
                <Scaled
                  designWidth={TREE_SIZE.w}
                  designHeight={TREE_SIZE.h}
                  initialScale={0.6}
                  minScale={0.6}
                >
                  <div
                    role="group"
                    aria-label={t('treeLabel')}
                    className="relative"
                    style={{ width: TREE_SIZE.w, height: TREE_SIZE.h }}
                  >
                    {SAMPLE_EDGES.map((e, i) => (
                      <div key={i} aria-hidden style={edgeStyle(e)} />
                    ))}
                    {SAMPLE_LABELS.map((l) => (
                      <span
                        key={l.text}
                        className={cn(
                          'absolute inline-flex h-6 items-center rounded-sm px-2 text-caption font-medium whitespace-nowrap',
                          l.tone === 'ok'
                            ? 'vm-tint-success'
                            : l.tone === 'adoptive'
                              ? 'vm-tint-secondary'
                              : 'vm-tint-muted',
                        )}
                        style={{ left: l.x, top: l.y }}
                      >
                        {l.text}
                      </span>
                    ))}
                    {SAMPLE_PEOPLE.map((p) => (
                      <Node
                        key={p.id}
                        p={p}
                        selected={p.id === selected}
                        onSelect={() => setSelected(p.id)}
                      />
                    ))}
                  </div>
                </Scaled>
              </div>
              <Legend />
            </>
          ) : (
            <div className="rounded-lg bg-bg p-4 vm-border">
              <p className="mb-3 text-small text-text-muted">{t('listHint')}</p>
              {generations.map((g) => (
                <section key={g} aria-label={t('generation', { n: g })} className="mb-3">
                  <h3 className="text-caption font-semibold uppercase tracking-wide text-text-muted">
                    {t('generation', { n: g })}
                  </h3>
                  <ul className="mt-1 flex flex-col">
                    {SAMPLE_PEOPLE.filter((p) => p.generation === g).map((p) => (
                      <li
                        key={p.id}
                        className="vm-border-b"
                        style={{ marginInlineStart: (g - 1) * 16 }}
                      >
                        <button
                          type="button"
                          aria-pressed={p.id === selected}
                          onClick={() => setSelected(p.id)}
                          className={cn(
                            'vm-target flex w-full items-center gap-3 rounded-sm py-1 text-start',
                            p.id === selected && 'vm-tint-primary',
                          )}
                        >
                          <Avatar name={p.name} masked={p.masked} size="sm" decorative />
                          <span className="min-w-0 flex-1">
                            <span className="block text-small font-semibold">{p.name}</span>
                            <span className="block text-caption text-text-muted">
                              {[p.life, p.tag, FAMILY_NAMES[p.family]].filter(Boolean).join(' · ')}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
          <p className="text-caption text-text-muted">
            {t('hint')} {t('about')}
          </p>
        </div>
        <Panel p={current} />
      </div>
    </div>
  );
}
