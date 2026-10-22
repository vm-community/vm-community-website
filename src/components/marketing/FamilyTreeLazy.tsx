'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/vm/Skeleton';
import { spaceTokens } from '@/styles/tokens';

const FamilyTreeSample = dynamic(
  () => import('./FamilyTreeSample').then((m) => m.FamilyTreeSample),
  {
    ssr: false,
    loading: () => <TreePlaceholder />,
  },
);

function TreePlaceholder() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="vm-h-tree w-full" />
    </div>
  );
}

/** Loads the interactive sample only when it nears the viewport, so landing pages stay light. */
export function FamilyTreeLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: `${spaceTokens[8] * 6}px` },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref}>{visible ? <FamilyTreeSample /> : <TreePlaceholder />}</div>;
}
