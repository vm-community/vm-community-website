'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/** Rotates one word through community types; static under prefers-reduced-motion. */
export function HeroRotator({ words, className }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), 2800);
    return () => clearInterval(timer);
  }, [reduced, words.length]);

  const word = words[index] ?? words[0] ?? '';
  return (
    <span className={cn('inline-block text-primary transition-opacity', className)} aria-live="off">
      {word}
    </span>
  );
}
