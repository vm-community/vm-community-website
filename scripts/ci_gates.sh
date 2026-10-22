#!/usr/bin/env bash
# CI gates: typecheck, lint, unit tests, build, Playwright smoke + axe, bundle-size budget.
set -euo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n\033[1;34m==> %s\033[0m\n' "$1"; }

step "Typecheck"
npx tsc --noEmit

step "Lint (ESLint + CSS token scan)"
npm run lint

step "Format check"
npx prettier --check . >/dev/null

step "Unit tests"
npx vitest run

step "Build (mock mode)"
NEXT_PUBLIC_DATA_MODE=mock npx next build

step "Bundle budget (marketing routes < 150 kB gzipped JS)"
node scripts/check_bundle_budget.mjs

step "Playwright smoke + axe"
npx playwright test --project=chromium

step "Live-build isolation check (no mock code in a live bundle)"
node scripts/check_live_isolation.mjs

printf '\n\033[1;32mAll gates green.\033[0m\n'
