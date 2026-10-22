import { cn } from '@/lib/cn';

/**
 * Connected-nodes network motif (parent-brand cue): dots joined by hairlines. Pure SVG, token
 * colours, decorative. `animated` adds a slow drift that is disabled under reduced motion.
 */
const NODES: Array<[number, number, number]> = [
  [60, 80, 6],
  [180, 40, 4],
  [300, 110, 7],
  [420, 60, 4],
  [540, 130, 5],
  [660, 50, 6],
  [120, 220, 5],
  [260, 260, 4],
  [380, 200, 6],
  [500, 280, 4],
  [620, 230, 5],
  [720, 300, 4],
  [40, 340, 4],
  [200, 380, 6],
  [340, 350, 4],
  [460, 400, 5],
  [580, 370, 4],
  [700, 420, 6],
];
const EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [0, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [2, 8],
  [4, 10],
  [6, 12],
  [12, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [16, 17],
  [8, 14],
  [10, 16],
  [1, 7],
  [5, 11],
];

export function NetworkMotif({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 760 460"
      className={cn('h-auto w-full', className)}
      aria-hidden
      focusable="false"
    >
      <g stroke="currentColor" strokeOpacity="0.25" strokeWidth="1">
        {EDGES.map(([a, b]) => {
          const na = NODES[a];
          const nb = NODES[b];
          if (!na || !nb) return null;
          return <line key={`${a}-${b}`} x1={na[0]} y1={na[1]} x2={nb[0]} y2={nb[1]} />;
        })}
      </g>
      <g fill="currentColor">
        {NODES.map(([x, y, r], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fillOpacity={i % 3 === 0 ? 0.9 : 0.55}
            className={animated ? 'motion-safe:animate-pulse' : undefined}
            style={animated ? { animationDelay: `${(i % 6) * 300}ms` } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}

/** A tiny tree-shaped variant for the family tree sections. */
export function TreeMotif({ className }: { className?: string }) {
  const people: Array<[number, number]> = [
    [200, 40],
    [120, 130],
    [280, 130],
    [60, 220],
    [160, 220],
    [240, 220],
    [330, 220],
    [100, 310],
    [200, 310],
    [300, 310],
  ];
  const links: Array<[number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [3, 7],
    [4, 8],
    [6, 9],
  ];
  return (
    <svg
      viewBox="0 0 400 350"
      className={cn('h-auto w-full', className)}
      aria-hidden
      focusable="false"
    >
      <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5">
        {links.map(([a, b]) => {
          const pa = people[a];
          const pb = people[b];
          if (!pa || !pb) return null;
          return (
            <path
              key={`${a}-${b}`}
              d={`M${pa[0]},${pa[1]} C${pa[0]},${(pa[1] + pb[1]) / 2} ${pb[0]},${(pa[1] + pb[1]) / 2} ${pb[0]},${pb[1]}`}
              fill="none"
            />
          );
        })}
      </g>
      <g fill="currentColor">
        {people.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={16} fillOpacity={0.12} />
            <circle cx={x} cy={y} r={7} fillOpacity={0.85} />
          </g>
        ))}
      </g>
    </svg>
  );
}
