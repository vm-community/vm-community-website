import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import { FAITH_SPECIFIC_WORDS, PRESETS } from '@/lib/verticals';
import { VERTICAL_CONTENT } from './verticals';

const FAITH_BY_TRADITION: Record<string, readonly string[]> = {
  church: ['church', 'parish', 'pastor', 'priest', 'tithe', 'mass', 'baptism', 'clergy'],
  mosque: ['mosque', 'masjid', 'imam', 'zakat', 'sadaqah', 'nikah', 'dua', "jumu'ah"],
  temple: ['temple', 'gurdwara', 'monastery', 'seva', 'puja'],
};

function wordsIn(text: string): Set<string> {
  return new Set(text.toLowerCase().match(/[a-z']+/g) ?? []);
}

describe('vertical marketing content', () => {
  it('has eight community types with the documented slugs', () => {
    expect(VERTICAL_CONTENT.map((c) => c.slug)).toEqual([
      'church',
      'mosque',
      'temple',
      'clubs',
      'family-associations',
      'alumni',
      'societies',
      'charities',
    ]);
  });

  it('every page has both benefit blocks and the required sections', () => {
    for (const c of VERTICAL_CONTENT) {
      expect(c.benefits.length, c.key).toBeGreaterThanOrEqual(6);
      expect(c.benefits.length, c.key).toBeLessThanOrEqual(8);
      expect(c.web.tasks.length, c.key).toBe(8);
      expect(c.mobile.benefits.length, c.key).toBeGreaterThanOrEqual(8);
      expect(c.mobile.screens.length, c.key).toBeGreaterThanOrEqual(2);
      expect(c.glance.length, c.key).toBe(4);
      expect(c.scenarios.length, c.key).toBe(3);
      expect(c.faq.length, c.key).toBeGreaterThanOrEqual(3);
      expect(c.faq.length, c.key).toBeLessThanOrEqual(5);
      expect(c.related.length, c.key).toBe(3);
      expect(c.related).not.toContain(c.key);
    }
  });

  it('modules match the preset and family connections only where the tree is enabled', () => {
    for (const c of VERTICAL_CONTENT) {
      const preset = PRESETS[c.key];
      const allowed = new Set([...preset.enabledModules, ...(preset.optionalModules ?? [])]);
      for (const m of c.modules) {
        expect(allowed.has(m.key), `${c.key}: ${m.key}`).toBe(true);
        if (m.optional)
          expect(
            preset.enabledModules.includes(m.key),
            `${c.key}: ${m.key} marked optional but enabled`,
          ).toBe(false);
      }
      expect(Boolean(c.familyConnections), c.key).toBe(preset.features.familyTree);
    }
  });

  it('keeps faith-specific words inside their own tradition only', () => {
    for (const c of VERTICAL_CONTENT) {
      const words = wordsIn(JSON.stringify({ ...c, related: [] }));
      for (const [tradition, list] of Object.entries(FAITH_BY_TRADITION)) {
        if (tradition === c.key) continue;
        for (const w of list) expect(words.has(w), `${c.key} contains "${w}"`).toBe(false);
      }
      if (!['church', 'mosque', 'temple'].includes(c.key)) {
        for (const w of FAITH_SPECIFIC_WORDS)
          expect(words.has(w), `${c.key} contains "${w}"`).toBe(false);
      }
    }
  });

  it('the generic home copy is vertical-neutral', () => {
    const home = JSON.stringify({
      home: en.marketing.home,
      benefits: en.homeBenefits,
      faq: en.homeFaq,
      common: en.marketing.common,
    });
    const words = wordsIn(home);
    // The hero deliberately lists community types ("For churches, mosques, temples, clubs…"); only the plural nouns are allowed.
    const allowedPlurals = new Set(['churches', 'mosques', 'temples']);
    for (const w of FAITH_SPECIFIC_WORDS) {
      if (allowedPlurals.has(w)) continue;
      expect(words.has(w), `home copy contains "${w}"`).toBe(false);
    }
  });
});
