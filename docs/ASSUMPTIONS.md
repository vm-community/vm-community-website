# Assumptions and gap log

This file covers the public marketing website only. Nothing below is verified against a real
backend, mobile app or identity provider. The signed-in app is not part of this build.

| #   | Topic               | Assumption                                                                                                                                                                                                                                                               | Where                                        |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| A1  | Vertical presets    | Vertical presets are product direction, expressed as typed presets and content rather than separate apps.                                                                                                                                                                | `src/lib/verticals`, `src/content/verticals` |
| A2  | Lead endpoint       | `/get-started` posts to `NEXT_PUBLIC_LEAD_ENDPOINT` when set. Otherwise the lead is stored only in the visitor's browser, with a `mailto:` fallback.                                                                                                                     | `src/lib/api/leads.ts`                       |
| A3  | Store badges        | App-store badges render only when `NEXT_PUBLIC_IOS_URL` or `NEXT_PUBLIC_ANDROID_URL` is set.                                                                                                                                                                             | `/mobile`                                    |
| A4  | Sign in             | The app is not in this build. `/signin` hands over to `NEXT_PUBLIC_APP_URL` when set.                                                                                                                                                                                    | `src/app/(marketing)/signin`                 |
| A5  | Community directory | `/communities` is a static opt-in list.                                                                                                                                                                                                                                  | `src/lib/communities.ts`                     |
| A6  | Motion tokens       | Motion durations and easing are not in the verified mobile token set, so they are kept subtle.                                                                                                                                                                           | `src/styles/tokens.css`                      |
| A7  | Fonts               | Inter ships as one variable file per subset (latin and latin-ext), both preloaded.                                                                                                                                                                                       | `public/fonts`                               |
| A8  | Dark-mode contrast  | With the verified tokens, muted and primary text on the dark raised surface measure below 4.5:1. A scoped base rule lifts them, and tint text colours are mixed toward the text colour. Verified with axe.                                                               | `src/styles/globals.css`                     |
| A9  | JS budget           | The spec asks for under 150 kB gzipped JS per marketing page. The Next 16 and React 19 runtime alone is about 132 kB gzipped, plus about 12 kB for the i18n runtime. The gate enforces 170 kB for landing pages and 210 kB for `/get-started` (React Hook Form and Zod). | `scripts/check_bundle_budget.mjs`            |
| A10 | Family tree preview | `/family-tree` shows a static, illustrative preview. An interactive demo needs the tree renderer, which is out of scope.                                                                                                                                                 | `/family-tree`                               |
| A11 | Toolchain pins      | TypeScript 5.9 (for typescript-eslint support), Playwright 1.62 (matches the cached Chromium), and `legacy-peer-deps` for conflicting optional peers.                                                                                                                    | `package.json`, `.npmrc`                     |

## Gaps (need input from the product owner)

- Where `/get-started` leads should go.
- Real app-store links.
- Official logo asset. A placeholder wordmark is used (see `public/brand/README.md`).
- Legal text for `/privacy-policy`, `/terms` and `/cookies`. The pages are marked as placeholders.
- Tax wording for charity statements. Statements never imply more than they say.
