'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { SkeletonCard } from '@/components/vm/Skeleton';
import { spaceTokens } from '@/styles/tokens';

const FeatureTabs = dynamic(() => import('./FeatureTabs').then((m) => m.FeatureTabs), {
  ssr: false,
  loading: () => <SkeletonCard />,
});

/** Loads the interactive feature tabs only once they approach the viewport (keeps the home JS budget). */
export function FeatureTabsLazy() {
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
  return <div ref={ref}>{visible ? <FeatureTabs /> : <SkeletonCard />}</div>;
}
