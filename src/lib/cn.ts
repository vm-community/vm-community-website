/** Tiny className joiner (no runtime dependency). Accepts `cond && 'class'` short-circuits. */
export function cn(
  ...parts: ReadonlyArray<string | number | bigint | boolean | null | undefined>
): string {
  return parts.filter((p): p is string => typeof p === 'string' && p.length > 0).join(' ');
}
