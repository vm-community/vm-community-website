import { describe, expect, it } from 'vitest';
import { fileToBase64, kindFromExtension, kindFromMagic, validateImageFile } from './validate';

const PNG_HEAD = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0, 0, 0];
const JPEG_HEAD = [0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const WEBP_HEAD = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0, 0, 0, 0];

function file(name: string, bytes: number[], extraSize = 0): File {
  const body = new Uint8Array([...bytes, ...new Array<number>(extraSize).fill(0)]);
  return new File([body], name, { type: 'application/octet-stream' });
}

describe('upload validation', () => {
  it('detects kinds by extension and magic bytes', () => {
    expect(kindFromExtension('photo.JPG')).toBe('jpeg');
    expect(kindFromExtension('photo.exe')).toBeNull();
    expect(kindFromMagic(new Uint8Array(PNG_HEAD))).toBe('png');
    expect(kindFromMagic(new Uint8Array(JPEG_HEAD))).toBe('jpeg');
    expect(kindFromMagic(new Uint8Array(WEBP_HEAD))).toBe('webp');
    expect(kindFromMagic(new Uint8Array(16))).toBeNull();
  });

  it('accepts a file whose extension and bytes agree', async () => {
    expect(await validateImageFile(file('a.png', PNG_HEAD))).toEqual({ ok: true, kind: 'png' });
  });

  it('rejects a renamed file (extension says png, bytes say jpeg)', async () => {
    expect(await validateImageFile(file('a.png', JPEG_HEAD))).toEqual({
      ok: false,
      reason: 'magic',
      kind: 'png',
    });
  });

  it('rejects disallowed extensions and oversized files', async () => {
    expect(await validateImageFile(file('a.svg', PNG_HEAD))).toEqual({
      ok: false,
      reason: 'extension',
    });
    expect(await validateImageFile(file('a.png', PNG_HEAD, 64), 32)).toEqual({
      ok: false,
      reason: 'size',
      kind: 'png',
    });
  });

  it('encodes to base64 without a data-URI prefix', async () => {
    expect(await fileToBase64(file('a.png', [0x68, 0x69]))).toBe('aGk=');
  });
});
