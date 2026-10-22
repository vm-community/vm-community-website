export const LOCALES = ['en', 'en-XA'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const RTL_LOCALES: readonly string[] = ['ar', 'he', 'fa', 'ur'];

export type Messages = Record<string, unknown>;

/**
 * Pseudo-locale (en-XA): every message is wrapped and vowels accented so hard-coded or clipped
 * strings are obvious in tests and screenshots. Values that are ICU placeholders stay intact.
 */
export function pseudoLocalise(value: string): string {
  const map: Record<string, string> = {
    a: 'å',
    e: 'é',
    i: 'ï',
    o: 'ø',
    u: 'ü',
    A: 'Å',
    E: 'É',
    I: 'Ï',
    O: 'Ø',
    U: 'Ü',
  };
  let depth = 0;
  let out = '';
  for (const ch of value) {
    if (ch === '{') depth += 1;
    if (ch === '}') depth = Math.max(0, depth - 1);
    out += depth === 0 ? (map[ch] ?? ch) : ch;
  }
  return `[${out} ·]`;
}

function pseudoDeep(input: unknown): unknown {
  if (typeof input === 'string') return pseudoLocalise(input);
  if (Array.isArray(input)) return input.map(pseudoDeep);
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) out[k] = pseudoDeep(v);
    return out;
  }
  return input;
}

export async function loadMessages(locale: string): Promise<Messages> {
  const en = (await import('../messages/en.json')).default as Messages;
  if (locale === 'en-XA') return pseudoDeep(en) as Messages;
  return en;
}

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.includes(locale.split('-')[0] ?? locale);
}
