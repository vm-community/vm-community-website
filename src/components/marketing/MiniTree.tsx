import {
  MINI_CARD,
  MINI_EDGES,
  MINI_LABEL,
  MINI_PEOPLE,
  MINI_SIZE,
  PHONE_EDGES,
  PHONE_LABEL,
  PHONE_PEOPLE,
  PHONE_SIZE,
  type MiniPerson,
} from '@/content/miniTreeSample';
import type { Edge } from '@/content/familyTreeSample';
import { cn } from '@/lib/cn';
import { FAMILY_COLOUR, edgeStyle } from './treeEdges';

interface Variant {
  size: { w: number; h: number };
  people: MiniPerson[];
  edges: Edge[];
  label: { x: number; y: number; text: string };
}

const VARIANTS: Record<'full' | 'phone', Variant> = {
  full: { size: MINI_SIZE, people: MINI_PEOPLE, edges: MINI_EDGES, label: MINI_LABEL },
  phone: { size: PHONE_SIZE, people: PHONE_PEOPLE, edges: PHONE_EDGES, label: PHONE_LABEL },
};

/** Static compact family tree (decorative illustration of the product, fictional people). */
export function MiniTree({
  variant = 'full',
  highlightFocus,
}: {
  variant?: 'full' | 'phone';
  highlightFocus?: boolean;
}) {
  const v = VARIANTS[variant];
  return (
    <div aria-hidden className="relative" style={{ width: v.size.w, height: v.size.h }}>
      {v.edges.map((e, i) => (
        <div key={i} style={edgeStyle(e)} />
      ))}
      {v.people.map((p) => (
        <div
          key={p.name}
          className={cn(
            'absolute flex flex-col justify-center rounded-md px-2 vm-border',
            'bg-surface-raised text-text',
          )}
          style={{
            left: p.x,
            top: p.y,
            width: MINI_CARD.w,
            height: MINI_CARD.h,
            borderInlineStartWidth: 4,
            borderInlineStartColor: FAMILY_COLOUR[p.family],
            boxShadow: highlightFocus && p.focus ? 'var(--vm-focus-ring)' : undefined,
          }}
        >
          <span className="text-small font-semibold leading-heading">{p.name}</span>
          <span className="text-caption text-text-muted">{p.life}</span>
        </div>
      ))}
      <span
        className="absolute inline-flex h-6 items-center whitespace-nowrap rounded-sm px-2 text-caption font-medium vm-tint-success"
        style={{ left: v.label.x, top: v.label.y }}
      >
        {v.label.text}
      </span>
    </div>
  );
}
