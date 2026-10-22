#!/usr/bin/env bash
# CI gates for the marketing website: typecheck, lint, unit tests, build,
# bundle-size budget, Playwright (chromium).
set -euo pipefail
cd "$(dirname "$0")/.."

step() { printf '\n\033[1;34m==> %s\033[0m\n' "$1"; }

step "Typecheck"
npx tsc --noEmit

step "Lint"
npm run lint

step "Unit tests"
npx vitest run

step "Build"
npx next build

step "Bundle budget (marketing routes, gzipped JS)"
npx next start -p 3100 &
SERVER_PID=$!
sleep 6
set +e
node scripts/check_bundle_budget.mjs
BUDGET_EXIT=$?
set -e
pkill -P "$SERVER_PID" 2>/dev/null || true
kill "$SERVER_PID" 2>/dev/null || true
wait "$SERVER_PID" 2>/dev/null || true
if [ "$BUDGET_EXIT" -ne 0 ]; then
  exit "$BUDGET_EXIT"
fi

step "Playwright (chromium)"
npx playwright test --project=chromium

printf '\n\033[1;32mAll gates green.\033[0m\n'
