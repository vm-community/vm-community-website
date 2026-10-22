'use client';

import { ImagePlus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState, type DragEvent } from 'react';
import { cn } from '@/lib/cn';
import { formatBytes } from '@/lib/format/numbers';
import { IMAGE_EXTENSIONS, IMAGE_MAX_BYTES, validateImageFile } from '@/lib/files/validate';
import { useFieldContext } from './Field';
import { Button } from './Button';

export interface PickedImage {
  file: File;
  previewUrl: string;
}

interface DropZoneProps {
  value: PickedImage | null;
  onChange: (picked: PickedImage | null) => void;
  onError?: (message: string) => void;
  maxBytes?: number;
  disabled?: boolean;
  className?: string;
}

/** Image drop zone: validates extension AND magic bytes, enforces the size cap, shows a preview. */
export function DropZone({
  value,
  onChange,
  onError,
  maxBytes = IMAGE_MAX_BYTES,
  disabled,
  className,
}: DropZoneProps) {
  const t = useTranslations('components.dropzone');
  const tv = useTranslations('validation');
  const field = useFieldContext();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (value) URL.revokeObjectURL(value.previewUrl);
    },
    [value],
  );

  async function handle(file: File | undefined) {
    if (!file) return;
    const result = await validateImageFile(file, maxBytes);
    if (!result.ok) {
      const msg =
        result.reason === 'extension'
          ? tv('fileType', { types: IMAGE_EXTENSIONS.join(', ') })
          : result.reason === 'size'
            ? tv('fileTooLarge', { max: formatBytes(maxBytes) })
            : tv('fileMagic', { type: result.kind ?? '' });
      setLocalError(msg);
      onError?.(msg);
      return;
    }
    setLocalError(null);
    onChange({ file, previewUrl: URL.createObjectURL(file) });
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setOver(false);
    if (disabled) return;
    void handle(e.dataTransfer.files[0]);
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg p-5 text-center vm-border-dashed',
          over && 'vm-tint-primary',
          disabled && 'opacity-60',
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.previewUrl}
              alt={t('preview', { name: value.file.name })}
              className="max-h-preview rounded-md object-contain"
            />
            <p className="text-caption text-text-muted">
              {value.file.name} · {formatBytes(value.file.size)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                {t('replace')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<X className="vm-icon" aria-hidden />}
                onClick={() => onChange(null)}
                disabled={disabled}
              >
                {t('remove')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="rounded-full p-3 vm-tint-primary" aria-hidden>
              <ImagePlus className="vm-icon-lg" />
            </span>
            <p className="text-small">{t('prompt')}</p>
            <p className="text-caption text-text-muted">
              {t('hint', { max: formatBytes(maxBytes) })}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              {t('choose')}
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          id={field?.id ?? id}
          type="file"
          accept={IMAGE_EXTENSIONS.map((e) => `.${e}`).join(',')}
          className="vm-sr-only"
          aria-describedby={field?.describedBy}
          disabled={disabled}
          onChange={(e) => {
            void handle(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {localError && (
        <p role="alert" className="text-caption text-danger">
          {localError}
        </p>
      )}
    </div>
  );
}
