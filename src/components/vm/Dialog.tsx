'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';
import { useHydrated } from '@/lib/hooks/useHydrated';
import { breakpoints } from '@/styles/tokens';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Danger variant tints the header for destructive confirmations. */
  danger?: boolean;
  /** Force sheet or dialog regardless of width (default: sheet under 601px). */
  presentation?: 'auto' | 'dialog' | 'sheet';
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function useIsPhone(): boolean {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoints.phoneMax}px)`);
    const update = () => setPhone(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);
  return phone;
}

/**
 * Modal dialog on desktop that becomes a draggable bottom sheet on phones. Traps focus, restores
 * focus on close, closes on Escape and scrim click, respects reduced motion via tokens.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  danger,
  presentation = 'auto',
  initialFocusRef,
}: DialogProps) {
  const t = useTranslations('components.dialog');
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<Element | null>(null);
  const isPhone = useIsPhone();
  const asSheet = presentation === 'sheet' || (presentation === 'auto' && isPhone);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef<number | null>(null);
  const mounted = useHydrated();

  useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const toFocus =
      initialFocusRef?.current ??
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ??
      panelRef.current;
    toFocus?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      if (lastActive.current instanceof HTMLElement) lastActive.current.focus();
    };
  }, [open, initialFocusRef]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onKeyDown]);

  function onHandlePointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    dragStart.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onHandlePointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (dragStart.current === null) return;
    setDragOffset(Math.max(0, e.clientY - dragStart.current));
  }
  function onHandlePointerUp() {
    if (dragStart.current === null) return;
    const shouldClose = dragOffset > 120;
    dragStart.current = null;
    setDragOffset(0);
    if (shouldClose) onClose();
  }

  if (!open || !mounted) return null;

  const widths = { sm: 'max-w-prose', md: 'max-w-prose md:max-w-content', lg: 'max-w-content' };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="presentation"
    >
      <div className="absolute inset-0 bg-scrim" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-desc` : undefined}
        tabIndex={-1}
        style={asSheet && dragOffset ? { transform: `translateY(${dragOffset}px)` } : undefined}
        className={cn(
          'relative flex w-full flex-col bg-surface-raised text-text vm-elevated-3 vm-max-h-sheet focus:outline-none',
          asSheet ? 'rounded-t-lg' : cn('m-4 rounded-lg', widths[size]),
        )}
      >
        {asSheet && (
          <button
            type="button"
            aria-label={t('dragHandle')}
            className="mx-auto mt-2 h-6 w-full cursor-grab touch-none"
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerUp}
          >
            <span aria-hidden className="mx-auto block h-1 w-8 rounded-full vm-tint-muted" />
          </button>
        )}
        <div
          className={cn(
            'flex items-start justify-between gap-3 px-5 pt-4 pb-3',
            danger && 'vm-tint-danger rounded-t-lg',
          )}
        >
          <div className="min-w-0">
            <h2 id={`${id}-title`} className="text-h2 font-semibold">
              {title}
            </h2>
            {description && (
              <p id={`${id}-desc`} className="mt-1 text-small text-text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="shrink-0 rounded-sm p-1 vm-hover-surface"
          >
            <X className="vm-icon" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 px-5 pt-3 pb-5 vm-border-t">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
