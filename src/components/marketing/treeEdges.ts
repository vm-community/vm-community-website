import type { CSSProperties } from 'react';
import type { Edge, FamilyKey } from '@/content/familyTreeSample';

export const FAMILY_COLOUR: Record<FamilyKey, string> = {
  mathew: 'var(--vm-color-primary)',
  thomas: 'var(--vm-color-info)',
  varghese: 'var(--vm-color-warning)',
  none: 'var(--vm-color-text-muted)',
  private: 'var(--vm-color-text-muted)',
};

export const LINE = 'var(--vm-color-text-muted)';
export const RULE = 'var(--vm-layout-border-strong)';

/** Absolutely positioned style for one tree edge (horizontal or vertical, solid/dashed/dotted/bridge). */
export function edgeStyle(e: Edge): CSSProperties {
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
