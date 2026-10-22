'use client';

import { CheckCircle2, Info, X, XCircle, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';
export interface ToastInput {
  title: string;
  body?: string;
  tone?: ToastTone;
  /** Undo-style action. */
  action?: { label: string; onClick: () => void };
  durationMs?: number;
}
interface ToastItem extends ToastInput {
  id: number;
}

interface ToastContextValue {
  toast: (input: ToastInput) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const tint: Record<ToastTone, string> = {
  info: 'vm-tint-info',
  success: 'vm-tint-success',
  warning: 'vm-tint-warning',
  danger: 'vm-tint-danger',
};
const icon: Record<ToastTone, ReactNode> = {
  info: <Info className="vm-icon" aria-hidden />,
  success: <CheckCircle2 className="vm-icon" aria-hidden />,
  warning: <AlertTriangle className="vm-icon" aria-hidden />,
  danger: <XCircle className="vm-icon" aria-hidden />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const t = useTranslations('components.toast');

  const dismiss = useCallback(
    (id: number) => setItems((prev) => prev.filter((i) => i.id !== id)),
    [],
  );
  const toast = useCallback((input: ToastInput) => {
    counter.current += 1;
    const id = counter.current;
    setItems((prev) => [...prev.slice(-3), { ...input, id }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label={t('region')}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        <div role="status" aria-live="polite" className="contents">
          {items.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const t = useTranslations('components.toast');
  const tone = item.tone ?? 'info';
  useEffect(() => {
    const timer = setTimeout(onDismiss, item.durationMs ?? (item.action ? 8000 : 5000));
    return () => clearTimeout(timer);
  }, [item, onDismiss]);
  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-prose items-start gap-3 rounded-md bg-surface-raised p-4 vm-elevated-2',
      )}
    >
      <span className={cn('rounded-full p-1', tint[tone])}>{icon[tone]}</span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{item.title}</p>
        {item.body && <p className="text-small text-text-muted">{item.body}</p>}
        {item.action && (
          <Button
            variant="link"
            size="sm"
            className="mt-1 px-0"
            onClick={() => {
              item.action?.onClick();
              onDismiss();
            }}
          >
            {item.action.label}
          </Button>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={t('dismiss')}
        className="rounded-sm p-1 vm-hover-surface"
      >
        <X className="vm-icon" aria-hidden />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
