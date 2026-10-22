import type { Rng } from './rng';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

/** Opaque, Frappe-looking ids ("PER-7k2x9q"). Never parsed or sorted by the UI. */
export function makeId(prefix: string, rng: Rng): string {
  let s = '';
  for (let i = 0; i < 6; i += 1) s += ALPHABET.charAt(rng.int(0, ALPHABET.length - 1));
  return `${prefix}-${s}`;
}

let runtimeCounter = 0;
/** Ids minted at runtime (user actions), distinct from seeded ids. */
export function runtimeId(prefix: string): string {
  runtimeCounter += 1;
  return `${prefix}-${Date.now().toString(36)}${runtimeCounter.toString(36)}`;
}
