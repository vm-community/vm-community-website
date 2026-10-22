#!/usr/bin/env node
/**
 * Bundle budget: the JS a marketing route ships must stay under 150 kB gzipped.
 * Reads .next/build-manifest.json (pages) and .next/app-build-manifest.json (app router).
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const BUDGET = 150 * 1024;
const MARKETING = [
  '/page',
  '/for/page',
  '/mobile/page',
  '/web/page',
  '/features/page',
  '/trust/page',
  '/communities/page',
  '/get-started/page',
  '/about/page',
];
const root = join(process.cwd(), '.next');
const manifestPath = join(root, 'app-build-manifest.json');
if (!existsSync(manifestPath)) {
  console.error('app-build-manifest.json not found; run next build first');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
let failed = false;
for (const route of MARKETING) {
  const files = manifest.pages?.[route];
  if (!files) continue;
  let bytes = 0;
  for (const f of files) {
    if (!f.endsWith('.js')) continue;
    const p = join(root, f);
    if (!existsSync(p) || !statSync(p).isFile()) continue;
    bytes += gzipSync(readFileSync(p)).length;
  }
  const ok = bytes <= BUDGET;
  if (!ok) failed = true;
  console.log(
    `${ok ? 'OK  ' : 'FAIL'} ${route.padEnd(24)} ${(bytes / 1024).toFixed(1)} kB gz (budget ${(BUDGET / 1024).toFixed(0)} kB)`,
  );
}
process.exit(failed ? 1 : 0);
