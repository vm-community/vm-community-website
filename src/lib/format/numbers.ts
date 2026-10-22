export function formatNumber(
  value: number,
  locale = 'en-IN',
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(value: number, currency = 'INR', locale = 'en-IN'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${formatNumber(value, locale, { maximumFractionDigits: 2 })}`;
  }
}

export function formatCompact(value: number, locale = 'en-IN'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatPercent(fraction: number, locale = 'en-IN', digits = 0): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: digits }).format(
    fraction,
  );
}

export function formatBytes(bytes: number, locale = 'en-IN'): string {
  const units: Intl.NumberFormatOptions['unit'][] = ['byte', 'kilobyte', 'megabyte', 'gigabyte'];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: units[idx],
    maximumFractionDigits: idx === 0 ? 0 : 1,
  }).format(value);
}

/** Ordinal category for ICU selectordinal ("1st", "2nd") when the catalog needs it precomputed. */
export function ordinalCategory(n: number, locale = 'en'): Intl.LDMLPluralRule {
  return new Intl.PluralRules(locale, { type: 'ordinal' }).select(n);
}
