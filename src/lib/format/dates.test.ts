import { describe, expect, it } from 'vitest';
import {
  ageAt,
  formatDate,
  formatDateTime,
  formatLifeSpan,
  formatRelative,
  formatTime,
  parseServerDate,
  toServerDate,
  toServerDateTime,
  type DatePrefs,
} from './dates';

const dmy: DatePrefs = { locale: 'en-IN', dateFormat: 'DD/MM/YYYY', timeFormat: '12H' };
const mdy: DatePrefs = { locale: 'en-US', dateFormat: 'MM/DD/YYYY', timeFormat: '24H' };

describe('dates', () => {
  it('parses server date and datetime formats as local time', () => {
    const d = parseServerDate('2026-03-09');
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(2);
    expect(d?.getDate()).toBe(9);
    const dt = parseServerDate('2026-03-09 14:05:30');
    expect(dt?.getHours()).toBe(14);
    expect(dt?.getMinutes()).toBe(5);
    expect(parseServerDate('')).toBeNull();
    expect(parseServerDate('nonsense')).toBeNull();
  });

  it('honours the date_format preference', () => {
    expect(formatDate('2026-03-09', dmy)).toBe('09/03/2026');
    expect(formatDate('2026-03-09', mdy)).toBe('03/09/2026');
    expect(formatDate('2026-03-09', { ...dmy, dateFormat: 'YYYY-MM-DD' })).toBe('2026-03-09');
    expect(formatDate('2026-03-09', { ...dmy, dateFormat: 'DD MMM YYYY' })).toMatch(/09 Mar 2026/);
  });

  it('honours the time_format preference', () => {
    expect(formatTime('2026-03-09 14:05:00', dmy).toLowerCase()).toMatch(/2:05\s?pm/);
    expect(formatTime('2026-03-09 14:05:00', mdy)).toMatch(/14:05/);
    expect(formatDateTime('2026-03-09 14:05:00', mdy)).toBe('03/09/2026 · 14:05');
  });

  it('formats relative time and falls back to an absolute date after a week', () => {
    const now = new Date(2026, 2, 9, 12, 0, 0);
    expect(formatRelative('2026-03-09 11:30:00', dmy, now)).toMatch(/30 minutes ago/);
    expect(formatRelative('2026-03-10 12:00:00', dmy, now)).toMatch(/tomorrow/);
    expect(formatRelative('2026-02-01', dmy, now)).toBe('01/02/2026');
  });

  it('formats life spans gently', () => {
    expect(formatLifeSpan('1952-01-01', '2019-06-01', true)).toBe('1952 – 2019');
    expect(formatLifeSpan('1990-01-01', undefined, false)).toBe('b. 1990');
    expect(formatLifeSpan('1990-01-01', undefined, true)).toBe('1990 – ');
    expect(formatLifeSpan(undefined, undefined, false)).toBe('');
  });

  it('round-trips server formats and computes ages', () => {
    const d = new Date(2026, 0, 5, 9, 7, 3);
    expect(toServerDate(d)).toBe('2026-01-05');
    expect(toServerDateTime(d)).toBe('2026-01-05 09:07:03');
    expect(ageAt('2000-06-15', new Date(2026, 5, 14))).toBe(25);
    expect(ageAt('2000-06-15', new Date(2026, 5, 15))).toBe(26);
    expect(ageAt(undefined)).toBeNull();
  });
});
