/**
 * The single date/time formatting utility (§2.2). Every date in the product goes through it.
 * Honours the person's `date_format` and `time_format` preferences.
 */
export type DateFormatPref = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY';
export type TimeFormatPref = '12H' | '24H';

export interface DatePrefs {
  locale: string;
  dateFormat: DateFormatPref;
  timeFormat: TimeFormatPref;
  timeZone?: string;
}

export const DEFAULT_DATE_PREFS: DatePrefs = {
  locale: 'en-IN',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12H',
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_DATETIME = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/;

/** Parses the server's `YYYY-MM-DD` / `YYYY-MM-DD HH:MM:SS` (site time) into a local Date. */
export function parseServerDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const dt = ISO_DATETIME.exec(value);
  if (dt) {
    const [, y, m, d, hh, mm, ss] = dt;
    return new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss ?? '0'));
  }
  const dd = ISO_DATE.exec(value);
  if (dd) {
    const [, y, m, d] = dd;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function formatDate(
  value: string | Date | null | undefined,
  prefs: DatePrefs = DEFAULT_DATE_PREFS,
): string {
  const d = parseServerDate(value);
  if (!d) return '';
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  switch (prefs.dateFormat) {
    case 'MM/DD/YYYY':
      return `${pad(m)}/${pad(day)}/${y}`;
    case 'YYYY-MM-DD':
      return `${y}-${pad(m)}-${pad(day)}`;
    case 'DD MMM YYYY':
      return new Intl.DateTimeFormat(prefs.locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: prefs.timeZone,
      }).format(d);
    case 'DD/MM/YYYY':
    default:
      return `${pad(day)}/${pad(m)}/${y}`;
  }
}

export function formatTime(
  value: string | Date | null | undefined,
  prefs: DatePrefs = DEFAULT_DATE_PREFS,
): string {
  const d = parseServerDate(value);
  if (!d) return '';
  return new Intl.DateTimeFormat(prefs.locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: prefs.timeFormat === '12H',
    timeZone: prefs.timeZone,
  }).format(d);
}

export function formatDateTime(
  value: string | Date | null | undefined,
  prefs: DatePrefs = DEFAULT_DATE_PREFS,
): string {
  const d = parseServerDate(value);
  if (!d) return '';
  return `${formatDate(d, prefs)} · ${formatTime(d, prefs)}`;
}

/** Long, human month-day form for headings ("12 March 2026" style per locale). */
export function formatDateLong(
  value: string | Date | null | undefined,
  prefs: DatePrefs = DEFAULT_DATE_PREFS,
): string {
  const d = parseServerDate(value);
  if (!d) return '';
  return new Intl.DateTimeFormat(prefs.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: prefs.timeZone,
  }).format(d);
}

export function formatMonthYear(
  value: string | Date | null | undefined,
  prefs: DatePrefs = DEFAULT_DATE_PREFS,
): string {
  const d = parseServerDate(value);
  if (!d) return '';
  return new Intl.DateTimeFormat(prefs.locale, {
    month: 'short',
    year: 'numeric',
    timeZone: prefs.timeZone,
  }).format(d);
}

export function formatWeekday(
  value: string | Date | null | undefined,
  prefs: DatePrefs = DEFAULT_DATE_PREFS,
): string {
  const d = parseServerDate(value);
  if (!d) return '';
  return new Intl.DateTimeFormat(prefs.locale, {
    weekday: 'short',
    timeZone: prefs.timeZone,
  }).format(d);
}

/** Relative time ("3 hours ago", "in 2 days") with a cut-over to an absolute date past 7 days. */
export function formatRelative(
  value: string | Date | null | undefined,
  prefs: DatePrefs = DEFAULT_DATE_PREFS,
  now: Date = new Date(),
): string {
  const d = parseServerDate(value);
  if (!d) return '';
  const diffMs = d.getTime() - now.getTime();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat(prefs.locale, { numeric: 'auto' });
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (abs < minute) return rtf.format(0, 'second');
  if (abs < hour) return rtf.format(Math.round(diffMs / minute), 'minute');
  if (abs < day) return rtf.format(Math.round(diffMs / hour), 'hour');
  if (abs < 7 * day) return rtf.format(Math.round(diffMs / day), 'day');
  return formatDate(d, prefs);
}

/** Life span "1952 – 2019" or "b. 1990" for tree node cards. Years only: dates may be partial. */
export function formatLifeSpan(
  birth: string | null | undefined,
  death: string | null | undefined,
  deceased: boolean,
): string {
  const by = birth ? parseServerDate(birth)?.getFullYear() : undefined;
  const dy = death ? parseServerDate(death)?.getFullYear() : undefined;
  if (by && dy) return `${by} – ${dy}`;
  if (by && deceased) return `${by} – `;
  if (by) return `b. ${by}`;
  if (dy) return `d. ${dy}`;
  return '';
}

export function toServerDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toServerDateTime(d: Date): string {
  return `${toServerDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function ageAt(birth: string | null | undefined, at: Date = new Date()): number | null {
  const b = parseServerDate(birth);
  if (!b) return null;
  let age = at.getFullYear() - b.getFullYear();
  const m = at.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < b.getDate())) age -= 1;
  return age;
}
