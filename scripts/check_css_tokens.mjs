#!/usr/bin/env node
/**
 * Scans every .css file outside src/styles/ for raw colour and px literals.
 * tokens.css / globals.css are the only sanctioned homes for those values.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.next', 'out', 'public', 'coverage', 'test-results']);
const ALLOWED = [join('src', 'styles')];

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const FUNC_COLOR = /\b(?:rgba?|hsla?|oklch|oklab)\(/;
const RAW_PX = /(?:^|[^\w-])\d+(?:\.\d+)?px\b/;

function walk(dir, out) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry.endsWith('.css')) out.push(full);
  }
  return out;
}

const files = walk(root, []);
let failures = 0;
for (const file of files) {
  const rel = relative(root, file);
  if (ALLOWED.some((a) => rel.startsWith(a + sep) || rel.startsWith(a + '/'))) continue;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const stripped = line.replace(/\/\*.*?\*\//g, '');
    if (HEX.test(stripped) || FUNC_COLOR.test(stripped) || RAW_PX.test(stripped)) {
      failures += 1;
      console.error(`${rel}:${i + 1}: raw design literal: ${line.trim()}`);
    }
  });
}
if (failures > 0) {
  console.error(`\n${failures} raw design literal(s) found outside src/styles/.`);
  process.exit(1);
}
console.log(`css tokens: ${files.length} file(s) scanned, no raw literals outside src/styles/.`);
