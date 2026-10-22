# vm-community-web

The web companion of the **VibeMind Community** platform (a product of
[Vibe Mind AI Solutions](https://vibemindsolutions.ai)): a public marketing site plus the
signed-in web app for any kind of community. It talks to the existing Frappe backend through a
typed `ApiClient` and ships with a complete in-browser mock backend.

## Run it (mock mode, two commands)

```bash
npm install
npm run dev
```

Open http://localhost:3000. Sign in at `/signin` by picking a community and a persona (no password).
The **Demo controls** button (bottom-left) switches persona and community live, resets demo data,
toggles the Family Tree service (to see the household-view fallback), and simulates latency or
random failures.

### Personas

| Persona          | Role name on the server | What they can do                         |
| ---------------- | ----------------------- | ---------------------------------------- |
| Tenant Admin     | `Tenant Admin`          | Everything in the community              |
| Staff            | `Staff`                 | People, families, events, content, teams |
| Priest / Leader  | `Priest`                | Member + teams, support requests, care   |
| Accountant       | `Accountant`            | Funds, contributions, statements, audit  |
| Facility Manager | `Facility Manager`      | Facilities and bookings                  |
| Member           | `Member`                | Everyday member                          |
| Guest            | `Guest`                 | Visitor with limited access              |

### Sample communities

`grace` (church, the full showcase), `harbor` and `pala` (churches), `noor` (mosque),
`riverside` (sports club), `kin` (family association with the richest tree).

## Modes

| `NEXT_PUBLIC_DATA_MODE` | What happens                                                                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mock` (default)        | In-browser backend (`src/mocks`), seeded deterministically, persisted in IndexedDB. Fully offline.                                                       |
| `live`                  | Same UI through the same `ApiClient`; a Next.js BFF holds the Keycloak tokens and proxies to `VM_API_BASE_URL`. **Not verified against a real backend.** |

Copy `.env.example` to `.env.local` and fill the live-mode variables to point at a real backend.
Live mode is built in Phase 6 and unit-tested against recorded fixtures only.

## Scripts

| Command                                       | Purpose                                                    |
| --------------------------------------------- | ---------------------------------------------------------- |
| `npm run dev` / `npm run build` / `npm start` | Next.js                                                    |
| `npm run typecheck`                           | `tsc --noEmit`                                             |
| `npm run lint`                                | ESLint (custom token / i18n rules) + CSS token scan        |
| `npm test`                                    | Vitest unit + behavioural tests                            |
| `npm run e2e`                                 | Playwright (screenshots at 375/768/1440 × light/dark, axe) |
| `npm run gates`                               | All CI gates (`scripts/ci_gates.sh`)                       |

## Project structure

See `PROMPT.md` §3.1. Highlights: `src/styles/tokens.*` (the only place with raw design literals),
`src/components/vm/*` (design system; `/design-system` shows everything), `src/lib/verticals/*`
(vertical presets and vocabulary), `src/lib/auth/*` (scope closure, `Can`), `src/lib/api/*`
(`ApiClient`, mock and live implementations), `src/mocks/*` (mock backend, never imported by live
code paths).

## Docs

- `docs/ASSUMPTIONS.md` — every inferred or proposed item, and the gap log.
- `docs/TREE-API-CONTRACT.md` — the proposed Family Tree API for the backend team.
- `docs/ADR-*.md` — architecture decisions.

## What is not verified

- Live mode end to end (real backend, Keycloak, token exchange, file proxy).
- Everything listed in `docs/ASSUMPTIONS.md`.
