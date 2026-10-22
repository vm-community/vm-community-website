'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState, type ReactNode } from 'react';
import { Button } from './Button';
import { Dialog } from './Dialog';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  body?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Destructive variant with the danger tile. */
  danger?: boolean;
  /** Extra friction: the user must type this word. */
  typeToConfirm?: string;
  /** Cascade summary lines ("also removes 3 relationships"). */
  consequences?: string[];
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel,
  cancelLabel,
  danger,
  typeToConfirm,
  consequences,
  loading,
}: ConfirmDialogProps) {
  const t = useTranslations('components.confirm');
  const [typed, setTyped] = useState('');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const blocked = Boolean(typeToConfirm) && typed.trim() !== typeToConfirm;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      danger={danger}
      initialFocusRef={cancelRef}
      footer={
        <>
          <Button ref={cancelRef} variant="secondary" onClick={onClose}>
            {cancelLabel ?? t('cancel')}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={() => void onConfirm()}
            disabled={blocked}
            loading={loading}
          >
            {confirmLabel ?? t('confirm')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 py-2">
        {danger && (
          <div className="flex items-start gap-3 rounded-md p-3 vm-tint-danger">
            <AlertTriangle className="vm-icon shrink-0" aria-hidden />
            <div className="text-small">{body}</div>
          </div>
        )}
        {!danger && body && <div className="text-small text-text-muted">{body}</div>}
        {consequences && consequences.length > 0 && (
          <ul className="list-disc ps-5 text-small text-text-muted">
            {consequences.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
        {typeToConfirm && (
          <label className="flex flex-col gap-1 text-small">
            <span>{t('typeToConfirm', { word: typeToConfirm })}</span>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="vm-target rounded-sm vm-border bg-bg px-3"
              autoComplete="off"
            />
          </label>
        )}
      </div>
    </Dialog>
  );
}
