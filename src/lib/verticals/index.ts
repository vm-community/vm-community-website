import { PRESETS } from './presets';
import type { ModuleKey, VerticalKey, VerticalPreset, VocabKey } from './types';
import { VERTICAL_KEYS } from './types';

export type {
  ModuleKey,
  VerticalKey,
  VerticalPreset,
  VocabKey,
  Vocabulary,
  IconKey,
} from './types';
export { MODULE_KEYS, VOCAB_KEYS, VERTICAL_KEYS } from './types';
export { PRESETS } from './presets';

export const DEFAULT_VERTICAL: VerticalKey = 'church';

/** Accepts backend `community_type` values loosely (case, spaces, underscores) and falls back. */
export function resolvePresetKey(value: string | null | undefined): VerticalKey {
  if (!value) return DEFAULT_VERTICAL;
  const normalised = value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-');
  const aliases: Record<string, VerticalKey> = {
    'family-association': 'family-association',
    'family-associations': 'family-association',
    family: 'family-association',
    clubs: 'club',
    societies: 'society',
    'housing-society': 'society',
    charities: 'charity',
    'alumni-group': 'alumni',
    gurdwara: 'temple',
    monastery: 'temple',
    masjid: 'mosque',
    parish: 'church',
    fellowship: 'church',
    none: 'generic',
    other: 'generic',
  };
  if ((VERTICAL_KEYS as readonly string[]).includes(normalised)) return normalised as VerticalKey;
  return aliases[normalised] ?? 'generic';
}

export function getPreset(key: string | null | undefined): VerticalPreset {
  return PRESETS[resolvePresetKey(key)];
}

export type VocabForm = 'singular' | 'plural';

/**
 * Resolves a vocabulary term: locale catalog override (`vocab.<preset>.<key>.<form>`) first,
 * then the preset's own vocabulary, then the base. `capitalise` sentence-cases the first letter.
 */
export function resolveVocab(
  preset: VerticalPreset,
  key: VocabKey,
  form: VocabForm = 'singular',
  catalogLookup?: (path: string) => string | undefined,
): string {
  const fromCatalog = catalogLookup?.(`vocab.${preset.key}.${key}.${form}`);
  if (fromCatalog) return fromCatalog;
  return preset.vocabulary[key][form];
}

export function capitalise(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

export function isModuleEnabled(
  preset: VerticalPreset,
  module: ModuleKey,
  overrides?: Partial<Record<ModuleKey, boolean>>,
): boolean {
  const override = overrides?.[module];
  if (override !== undefined) {
    // Only modules the preset allows (enabled or optional) can be switched on by a setting.
    const allowed =
      preset.enabledModules.includes(module) || (preset.optionalModules ?? []).includes(module);
    return allowed && override;
  }
  return preset.enabledModules.includes(module);
}

/** Words that must never appear on vertical-neutral surfaces (asserted by tests). */
export const FAITH_SPECIFIC_WORDS = [
  'church',
  'parish',
  'pastor',
  'priest',
  'tithe',
  'mass',
  'baptism',
  'clergy',
  'mosque',
  'masjid',
  'imam',
  'zakat',
  'sadaqah',
  'nikah',
  'dua',
  "jumu'ah",
  'temple',
  'gurdwara',
  'monastery',
  'seva',
  'puja',
] as const;
