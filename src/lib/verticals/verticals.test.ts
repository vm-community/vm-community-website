import { describe, expect, it } from 'vitest';
import {
  FAITH_SPECIFIC_WORDS,
  MODULE_KEYS,
  PRESETS,
  VERTICAL_KEYS,
  VOCAB_KEYS,
  capitalise,
  getPreset,
  isModuleEnabled,
  resolvePresetKey,
  resolveVocab,
} from './index';

describe('vertical presets', () => {
  it('defines every preset with a full vocabulary', () => {
    for (const key of VERTICAL_KEYS) {
      const p = PRESETS[key];
      expect(p.key).toBe(key);
      for (const v of VOCAB_KEYS) {
        expect(p.vocabulary[v].singular, `${key}.${v}`).toBeTruthy();
        expect(p.vocabulary[v].plural, `${key}.${v}`).toBeTruthy();
      }
      for (const m of p.enabledModules) expect(MODULE_KEYS).toContain(m);
    }
  });

  it('faith-neutral presets contain nothing religious', () => {
    for (const key of [
      'generic',
      'club',
      'family-association',
      'alumni',
      'society',
      'charity',
    ] as const) {
      const text = JSON.stringify(PRESETS[key].vocabulary).toLowerCase();
      for (const w of FAITH_SPECIFIC_WORDS)
        expect(text.includes(w), `${key} contains "${w}"`).toBe(false);
      expect(PRESETS[key].features.prayerOrReflection).toBe(false);
      expect(PRESETS[key].enabledModules).not.toContain('prayer');
    }
  });

  it('maps the documented vocabulary examples', () => {
    expect(resolveVocab(PRESETS.church, 'leader')).toBe('pastor');
    expect(resolveVocab(PRESETS.mosque, 'leader')).toBe('imam');
    expect(resolveVocab(PRESETS.club, 'giving')).toBe('dues');
    expect(resolveVocab(PRESETS['family-association'], 'service')).toBe('gathering');
    expect(resolveVocab(PRESETS.mosque, 'prayerRequest')).toBe('dua request');
    expect(resolveVocab(PRESETS.church, 'member', 'plural')).toBe('members');
  });

  it('prefers a catalog override when present', () => {
    const lookup = (path: string) =>
      path === 'vocab.church.member.singular' ? 'parishioner' : undefined;
    expect(resolveVocab(PRESETS.church, 'member', 'singular', lookup)).toBe('parishioner');
    expect(resolveVocab(PRESETS.church, 'member', 'plural', lookup)).toBe('members');
  });

  it('tree is on by default for family-association, church, mosque, temple, society and optional for club, alumni, charity', () => {
    for (const key of ['family-association', 'church', 'mosque', 'temple', 'society'] as const)
      expect(PRESETS[key].enabledModules).toContain('tree');
    for (const key of ['club', 'alumni', 'charity'] as const) {
      expect(PRESETS[key].enabledModules).not.toContain('tree');
      expect(PRESETS[key].optionalModules).toContain('tree');
      expect(isModuleEnabled(PRESETS[key], 'tree')).toBe(false);
      expect(isModuleEnabled(PRESETS[key], 'tree', { tree: true })).toBe(true);
    }
    // a setting cannot switch on a module the preset does not allow at all
    expect(isModuleEnabled(PRESETS.club, 'prayer', { prayer: true })).toBe(false);
  });

  it('resolves community_type loosely and defaults to church', () => {
    expect(resolvePresetKey(undefined)).toBe('church');
    expect(resolvePresetKey('Family Association')).toBe('family-association');
    expect(resolvePresetKey('MOSQUE')).toBe('mosque');
    expect(resolvePresetKey('gurdwara')).toBe('temple');
    expect(resolvePresetKey('something-new')).toBe('generic');
    expect(getPreset('club').key).toBe('club');
  });

  it('capitalises sentence-case', () => {
    expect(capitalise('family tree')).toBe('Family tree');
    expect(capitalise('')).toBe('');
  });
});
