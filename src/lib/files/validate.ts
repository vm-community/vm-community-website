/** Upload validation: extension AND magic bytes, with the 10 MB display-image cap (§4.4). */
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export type ImageKind = 'jpeg' | 'png' | 'webp' | 'gif';

const EXT_TO_KIND: Record<string, ImageKind> = {
  jpg: 'jpeg',
  jpeg: 'jpeg',
  png: 'png',
  webp: 'webp',
  gif: 'gif',
};
export const IMAGE_EXTENSIONS = Object.keys(EXT_TO_KIND);

export function kindFromExtension(filename: string): ImageKind | null {
  const ext = filename.toLowerCase().split('.').pop() ?? '';
  return EXT_TO_KIND[ext] ?? null;
}

/** Detects the image kind from the first bytes (JPEG, PNG, WebP, GIF). */
export function kindFromMagic(bytes: Uint8Array): ImageKind | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return 'png';
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38)
    return 'gif';
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return 'webp';
  return null;
}

export type ImageValidation =
  | { ok: true; kind: ImageKind }
  | { ok: false; reason: 'extension' | 'magic' | 'size'; kind?: ImageKind | null };

export async function validateImageFile(
  file: File,
  maxBytes = IMAGE_MAX_BYTES,
): Promise<ImageValidation> {
  const byExt = kindFromExtension(file.name);
  if (!byExt) return { ok: false, reason: 'extension' };
  if (file.size > maxBytes) return { ok: false, reason: 'size', kind: byExt };
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const byMagic = kindFromMagic(head);
  if (byMagic !== byExt) return { ok: false, reason: 'magic', kind: byExt };
  return { ok: true, kind: byExt };
}

/** Base64 payload for `content` uploads (data-URI prefix is tolerated by the server; we strip it). */
export async function fileToBase64(file: File): Promise<string> {
  const buf = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < buf.length; i += chunk) {
    binary += String.fromCharCode(...buf.subarray(i, i + chunk));
  }
  return btoa(binary);
}
