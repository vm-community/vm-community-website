'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ScaledProps {
  /** Logical size the content is designed at, in CSS px. */
  designWidth: number;
  designHeight: number;
  /** Scale used before measuring (server render and first paint). */
  initialScale?: number;
  /** Below this scale the content stops shrinking and the box scrolls sideways instead. */
  minScale?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Renders children at a fixed design size and scales them to the container width, so mock app
 * screens keep real proportions (real text sizes, real spacing) at any frame size.
 * Height follows the aspect ratio, so there is no layout shift when the scale is measured.
 */
export function Scaled({
  designWidth,
  designHeight,
  initialScale = 0.5,
  minScale = 0,
  className,
  children,
}: ScaledProps) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const update = () => setScale(Math.max(minScale, el.clientWidth / designWidth));
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, [designWidth, minScale]);

  const scrolls = minScale > 0 && scale <= minScale;
  return (
    <div
      ref={outer}
      className={cn('relative w-full', scrolls ? 'overflow-x-auto' : 'overflow-hidden', className)}
      style={{
        aspectRatio: scrolls ? undefined : `${designWidth} / ${designHeight}`,
        height: scrolls ? designHeight * scale : undefined,
      }}
    >
      <div style={{ width: designWidth * scale, height: designHeight * scale }}>
        <div
          style={{
            width: designWidth,
            height: designHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
