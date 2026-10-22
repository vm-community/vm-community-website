/** Initials for avatars: up to two letters from the first and last word. */
export function initialsOf(name: string | null | undefined): string {
  if (!name) return '';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toLocaleUpperCase();
}

/** Deterministic small integer from a string (FNV-1a) for picking an avatar tint. */
export function stableHash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function displayName(person: {
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}): string {
  if (person.display_name) return person.display_name;
  return [person.first_name, person.last_name].filter(Boolean).join(' ');
}

/** Joins names for sentences: "Anna, Ben and Carla" using Intl.ListFormat. */
export function joinNames(names: string[], locale = 'en'): string {
  return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(names);
}
