#!/usr/bin/env node
/**
 * Builds in live mode into a separate dist dir and asserts no mock-backend code is in the bundle.
 * Looks for the MOCK_BACKEND_MARKER string and the sample persona email domain.
 */
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), '.next-live-check');
rmSync(dist, { recursive: true, force: true });
execSync('npx next build', {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_DATA_MODE: 'live',
    NEXT_DIST_DIR: '.next-live-check',
    SESSION_SECRET: 'x'.repeat(40),
  },
});

const NEEDLES = ['__VM_MOCK_BACKEND__', '@grace.demo', 'vm-community-mock'];
function walk(dir, out) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.js')) out.push(p);
  }
  return out;
}
const files = walk(join(dist, 'static'), []);
let hits = 0;
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const n of NEEDLES)
    if (text.includes(n)) {
      hits += 1;
      console.error(`mock code leaked into live bundle: ${f} contains "${n}"`);
    }
}
rmSync(dist, { recursive: true, force: true });
if (hits > 0) process.exit(1);
console.log(`live isolation: ${files.length} client chunks scanned, no mock code found.`);
