'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';
import { resolveImageUrl } from './Avatar';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  className?: string;
}

/** Media grid with a lightbox (scrim token). Keyboard: Esc closes, arrows navigate. */
export function Gallery({ images, className }: GalleryProps) {
  const t = useTranslations('components.gallery');
  const [index, setIndex] = useState<number | null>(null);
  const total = images.length;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + total) % total)),
    [total],
  );
  const next = useCallback(() => setIndex((i) => (i === null ? null : (i + 1) % total)), [total]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, close, prev, next]);

  const current = index !== null ? images[index] : undefined;
  const cols =
    total === 1 ? 'grid-cols-1' : total === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3';

  return (
    <>
      <ul className={cn('grid gap-2', cols, className)}>
        {images.slice(0, 6).map((img, i) => (
          <li key={`${img.src}-${i}`} className="relative">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t('open', { index: i + 1, total })}
              className="block w-full overflow-hidden rounded-md vm-border focus-visible:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(img.src) ?? img.src}
                alt={img.alt}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              {i === 5 && total > 6 && (
                <span
                  className="absolute inset-0 flex items-center justify-center bg-scrim text-h2 font-semibold text-on-scrim"
                  aria-hidden
                >
                  +{total - 6}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {current &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('counter', { index: (index ?? 0) + 1, total })}
            className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4"
          >
            <button
              type="button"
              onClick={close}
              aria-label={t('close')}
              className="absolute end-4 top-4 rounded-full p-2 text-on-scrim hover:opacity-80 vm-target"
            >
              <X className="vm-icon-lg" aria-hidden />
            </button>
            {total > 1 && (
              <button
                type="button"
                onClick={prev}
                aria-label={t('prev')}
                className="absolute start-2 rounded-full p-2 text-on-scrim hover:opacity-80 vm-target"
              >
                <ChevronLeft className="vm-icon-lg rtl:rotate-180" aria-hidden />
              </button>
            )}
            <figure className="flex max-h-full max-w-full flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(current.src) ?? current.src}
                alt={current.alt}
                className="vm-max-h-lightbox max-w-full rounded-md object-contain"
              />
              <figcaption className="text-small text-on-scrim">
                {current.caption ? `${current.caption} · ` : ''}
                {t('counter', { index: (index ?? 0) + 1, total })}
              </figcaption>
            </figure>
            {total > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label={t('next')}
                className="absolute end-2 rounded-full p-2 text-on-scrim hover:opacity-80 vm-target"
              >
                <ChevronRight className="vm-icon-lg rtl:rotate-180" aria-hidden />
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
