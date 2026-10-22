# VIBEMIND COMMUNITY — WEBSITE BUILD PROMPT (v2, SELF-CONTAINED)

A product of **Vibe Mind AI Solutions** — https://vibemindsolutions.ai
Knowledge snapshot: the `feature/community-news-feed` branch of the `vm-community-backend` and `vm-community-mobile` repositories, read on 2026-10-22.

## HOW TO USE THIS FILE (for the human)

1. `mkdir vm-community-web && cd vm-community-web`
2. Save this file there as `PROMPT.md`.
3. Start Claude CLI in that folder and send exactly this one line:
   `Read PROMPT.md completely, then execute it phase by phase. You have no repo access and need none: everything required is inside the file. Verify your work in a real browser at every phase.`

Everything below this line is the instruction set for the CLI agent.

---

# 0. YOUR MISSION AND THE ONE BIG CONSTRAINT

You are a principal full-stack engineer and product designer. Build **`vm-community-web`**: a production-quality, multi-page, responsive website and web application for the **VibeMind Community platform**, a white-label platform for **any kind of community**: churches, mosques, temples and gurdwaras, clubs, family associations, alumni groups, housing societies, charities and more. It is the web companion of an existing Flutter mobile app (whose first shipped vertical is *church*) and talks to an existing Frappe backend.

**The public landing page and the marketing site are GENERIC and vertical-neutral.** They must speak to every community type, never read as a church-only product, and offer dedicated landing pages per community type (§8.1). The signed-in app adapts its vocabulary, enabled modules and iconography to the community's type through a **vertical preset** system (§1.1).

**Hard constraint: you have NO access to the backend repository, the mobile repository, the docs repository, the database or Keycloak.** Do not try to clone, fetch or look for them. Everything you need is in this file: the exact design tokens, the verified API contract (every endpoint, its scope and parameters), the data model, the roles and permissions, the authentication flow, and a specification for the missing Family Tree service. Treat this file as the single source of truth.

Because the real backend is unreachable from your sandbox, the application must run in **two data modes**, switched by one environment variable:

- **`NEXT_PUBLIC_DATA_MODE=mock` (default, what you build, run and verify):** a complete in-browser mock backend implements this file's API contract, including the new Family Tree API (§7), with realistic seed data and real permission checks. The whole website is fully functional offline in this mode.
- **`NEXT_PUBLIC_DATA_MODE=live`:** the same UI, through the same typed API client, talks to the real backend via a server-side proxy (BFF) with Keycloak login. You build it and unit-test it against recorded fixtures, but you **cannot verify it end to end**. Say so plainly in your reports. Never claim live mode was verified.

The UI code must never know which mode it is in. It only talks to an `ApiClient` interface (§3.3).

The **flagship feature is a full Family Tree**: individual people connected by typed relationships, families connected to other families (for example by marriage), a person who belongs to several families, relatives who are not community members, deceased ancestors, adoption, step and guardian relations, and a kinship calculator. The current backend only has a flat family roster (see §6.2), so the Family Tree API in §7 is a **proposed contract that the real backend does not have yet**. You implement it fully in the mock backend, and the UI degrades gracefully to a "household view" when a live backend lacks it (§7.9).

## 0.1 Non-negotiables

1. **Look and feel must match the mobile app exactly**: same tokens, same light and dark themes, same tone (§2).
2. **Nothing is a dead end.** Every control works, or says plainly why it cannot ("You need the *Family: edit* permission"). Every list and page has loading, empty, error and permission-denied states.
3. **Permissions are enforced in the UI by scope** (§5.3), always showing why something is unavailable, and the mock backend also enforces them like the real server (returning `AUTH_SCOPE_DENIED` 403).
4. **Forms validate before they act**, client-side with Zod, with the same limits the server enforces. An empty or malformed form never reaches the network layer. Server validation errors (422) map back to the form fields.
5. **No hardcoded user-facing strings** (all copy in message catalogs, English first, structure ready for more locales and RTL). **No raw colour, spacing or radius literals** outside the token files (enforced by lint).
6. **Accessibility is WCAG 2.2 AA.** Full keyboard operation, visible focus, screen-reader names, reduced-motion respected, 44 px minimum targets on touch (the mobile app uses 48 px for feed controls, so use 48 px on phone widths).
7. **Privacy by design.** Respect each person's `visibility` (PUBLIC, MEMBERS, STAFF, PRIVATE). Never put personal data in URLs or query strings. Private files are never stored by the browser (`Cache-Control: private, no-store`).
8. **Be honest.** At the end of each phase report what is verified (with evidence), what is not, and what you assumed. Where this file says "inferred" or "proposed", you must not present it as verified.
9. Use git: initialise the repo, work on a `develop` branch, commit per logical step with short conventional messages. **Never add a `Co-Authored-By` trailer.**

## 0.2 How to work

- Create and maintain a task list for the phases in §11. Finish and verify each phase before the next.
- **Verify in a real browser.** Use the preinstalled Chromium with Playwright (do not run `playwright install`; `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` is set; launch with `executablePath: '/opt/pw-browsers/chromium'` if needed). Take screenshots at **375, 768 and 1440 px in both light and dark themes** for every page you build, **look at them**, and fix what is wrong before moving on. A page is not done until you have looked at it.
- Research and pin the latest stable version of every dependency at build time (check the npm registry; do not assume versions).
- Prefer small, composable, well-named modules. No giant files. No dead code. No `any` in TypeScript.

---

# 1. PRODUCT CONTEXT

**VibeMind Community** is a multi-tenant, white-label platform. Each *community* (a church, mosque, club, family association, …) is a separate tenant: its own site, its own data, its own accent colour. A person (one login) can belong to several communities, of different types. The platform architecture ships **one app per vertical** (a "flavor"); the first and only vertical shipped today is **church** (`VibeMind Church`). The other verticals below are **product direction that this website must support through configuration**, not features the backend has yet (see §1.1 for how to treat that honestly).

Sample communities (use these in mock mode; the first three exist in the real dev environment, the rest are demo-only):

| Slug | Name | Type | Accent |
|---|---|---|---|
| `grace` | Grace Community | church | `#4F46E5` |
| `harbor` | Harbor Fellowship | church | `#0284C7` |
| `pala` | St. George Parish | church | `#0D9488` |
| `noor` | Al-Noor Masjid | mosque | `#047857` |
| `riverside` | Riverside Sports Club | club | `#C2410C` |
| `kin` | Mathew–Thomas Family Association | family association | `#7C3AED` |

For the church vertical, the enabled modules in the app are **members, events, giving, community, me**. The mobile app also contains: announcements, audit, bookings, certificates, dashboard, documents, employees, facilities, families, feed, groups, guests, media, ministry (prayer, rosters, serving, attendance), moderation, notifications, positions, privacy, profile, reports, roles, settings, users.

## 1.1 Vertical presets — one product, many community types

A **vertical preset** is a typed configuration object (`src/lib/verticals/<key>.ts`) that adapts the product to a community type **without forking code**. Implement a `VerticalPreset` interface and these presets: `church`, `mosque`, `temple` (Hindu temple / gurdwara / monastery share one neutral "place of worship" base), `club` (sports, social, hobby), `family-association`, `alumni`, `society` (housing/residents), `charity`, and a neutral **`generic`** fallback.

```ts
interface VerticalPreset {
  key: string;                                  // 'church' | 'mosque' | 'club' | 'family-association' | ...
  marketing: { name: string; slug: string; tagline: string; heroImageVariant: string; testimonialsKey: string };
  accentDefault: string;                        // resolved through tokens at runtime, contrast-checked
  enabledModules: Array<'members'|'families'|'events'|'giving'|'community'|'groups'|'prayer'|'ministry'|'documents'|'media'|'bookings'|'announcements'|'tree'|'certificates'|'hr'>;
  vocabulary: Record<VocabKey, { singular: string; plural: string }>;  // all UI nouns
  defaultRoles: Record<'member'|'staff'|'leader'|'finance'|'admin', string>; // display names only
  iconOverrides?: Partial<Record<IconKey, string>>;
  features: { familyTree: boolean; prayerOrReflection: boolean; ritualCalendar: boolean };
}
```

**Vocabulary (`VocabKey`) must cover at least:** `community`, `member`, `guest`, `family`, `household`, `leader` (the pastoral/religious/club-officer role), `giving`, `fund`, `prayerRequest`, `service` (worship service / prayer / meeting / training session), `ministry`/`team`, `group`, `announcement`, `event`, `facility`, `certificate`, `positions`. Examples of the mapping the preset system must support:

| Key | church | mosque | club | family association |
|---|---|---|---|---|
| community | church, parish, fellowship | masjid, community | club | association, family circle |
| member | member | member | member | member |
| leader | pastor / priest | imam / committee | coach / officer | patriarch / elder / convener |
| giving | giving, tithes, offerings | donations, zakat, sadaqah | dues, sponsorship | contributions, levy |
| prayerRequest | prayer request | dua request | (feature off) | (feature off, or "good news and support") |
| service | service, mass | prayer, Jumu'ah, class | session, match, training | gathering, reunion |
| ministry/team | ministry team | committee / volunteer team | squad, committee | branch, committee |
| certificate | baptism, marriage certificate | nikah certificate | membership card | family membership certificate |
| family | family, household | family, household | (optional) | **core concept: families and their links** |

Everything user-visible in the app is looked up through `t('vocab.member.singular')`-style helpers that resolve the preset first, then the message catalog. **No component may hardcode "church", "pastor", "prayer", "tithe", "parish" or any faith-specific noun**; those live only inside preset vocabularies and the church marketing page. The signed-in community's preset is derived from its `community_type` (mock mode: a field on the community; live mode: a proposed community setting, see the assumptions log, default `church` because only that vertical exists today). **Faith-neutral and respectful by default:** the `generic`, `club`, `family-association`, `alumni`, `society` and `charity` presets contain nothing religious. Religious presets use only widely accepted terminology and never mix traditions in one community. Calendar rituals (for example prayer times, festival dates) are **out of scope for v1** and must be listed as an optional later module in the roadmap, not faked.

**Be honest about backend reality:** the real backend today knows one vertical (church) and has no `community_type` field. The website treats `community_type` as an assumption (log it in `docs/ASSUMPTIONS.md`), defaults to `church` in live mode when absent, and everything else works unchanged because presets change **labels, enabled navigation and illustrations only, never API behaviour**.

**Roles** (seeded, one role per user per community): **Guest, Member, Staff, Facility Manager, Accountant, Priest, Tenant Admin**. Their scope sets are in §5.2. The website must show the right areas to the right role, automatically, from the caller's scope list.

**Voice and tone:** warm, clear, respectful, plain English. Sentence case. No jargon ("Tenant" is never shown to end users; say "community"). Errors say what happened and what to do. Sensitive areas (prayer or support requests, bereavement, deceased relatives in the tree) use gentle wording and never celebratory animation. The marketing site speaks to *any* community: lead with "your community", never with a single faith or club type.

---

# 2. DESIGN SYSTEM — EXACT, NON-NEGOTIABLE

These values come from the mobile app's `vm_ui` token layer (STD-01). **Do not round or approximate.** Create `src/styles/tokens.css` with exactly this content, plus a typed mirror in `src/styles/tokens.ts`.

```css
/* tokens.css — the ONLY place raw colour/size literals may live */
:root {
  color-scheme: light;

  /* colour — light */
  --vm-color-primary: #4F46E5;
  --vm-color-primary-hover: #4338CA;
  --vm-color-secondary: #7C3AED;
  --vm-color-bg: #FFFFFF;
  --vm-color-surface: #F8FAFC;
  --vm-color-surface-raised: #FFFFFF;
  --vm-color-border: #E2E8F0;
  --vm-color-text: #0F172A;
  --vm-color-text-muted: #64748B;
  --vm-color-success: #16A34A;
  --vm-color-warning: #D97706;
  --vm-color-danger: #DC2626;
  --vm-color-info: #0284C7;
  --vm-color-on-primary: #FFFFFF;
  --vm-color-scrim: rgba(0, 0, 0, 0.70);   /* over photos; theme-independent */
  --vm-color-on-scrim: #FFFFFF;
  --vm-gradient-brand: linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%);

  /* spacing (4px base). ONLY these 8 steps are legal */
  --vm-space-1: 4px;  --vm-space-2: 8px;  --vm-space-3: 12px; --vm-space-4: 16px;
  --vm-space-5: 24px; --vm-space-6: 32px; --vm-space-7: 48px; --vm-space-8: 64px;
  --vm-gutter-mobile: var(--vm-space-4);   /* <= 600px  */
  --vm-gutter-tablet: var(--vm-space-5);   /* 600-840px */
  --vm-gutter-desktop: var(--vm-space-6);  /* > 840px   */

  /* radius */
  --vm-radius-sm: 6px;    /* inputs, chips */
  --vm-radius-md: 8px;    /* buttons, cards */
  --vm-radius-lg: 12px;   /* modals, feature cards */
  --vm-radius-full: 9999px; /* avatars, pills */

  /* elevation (light: shadows; dark: borders + surface steps instead) */
  --vm-elevation-1: 0 1px 2px rgba(15, 23, 42, 0.08);
  --vm-elevation-2: 0 4px 12px rgba(15, 23, 42, 0.10);   /* popover, dropdown */
  --vm-elevation-3: 0 8px 24px rgba(15, 23, 42, 0.14);   /* modal */

  /* typography: Inter, weights 400/500/600/700, line-height 1.5 body / 1.25 headings */
  --vm-font: 'Inter', -apple-system, Roboto, sans-serif;
  --vm-type-display: 2.25rem;  /* 36 landing hero  */
  --vm-type-h1: 1.5rem;        /* 24 page titles   */
  --vm-type-h2: 1.25rem;       /* 20 section titles*/
  --vm-type-h3: 1.125rem;      /* 18 card titles   */
  --vm-type-body: 1rem;        /* 16 default       */
  --vm-type-small: 0.875rem;   /* 14 secondary, table cells */
  --vm-type-caption: 0.75rem;  /* 12 badges, timestamps */
  --vm-lh-body: 1.5;
  --vm-lh-heading: 1.25;

  /* motion (assumption: not in the verified source; keep subtle) */
  --vm-motion-fast: 120ms; --vm-motion-base: 200ms; --vm-motion-slow: 320ms;
  --vm-ease: cubic-bezier(0.2, 0, 0, 1);

  /* focus ring */
  --vm-focus-ring: 0 0 0 3px color-mix(in srgb, var(--vm-color-primary) 45%, transparent);
}

[data-theme="dark"] {
  color-scheme: dark;
  --vm-color-primary: #818CF8;
  --vm-color-primary-hover: #A5B4FC;
  --vm-color-secondary: #A78BFA;
  --vm-color-bg: #0F172A;
  --vm-color-surface: #1E293B;
  --vm-color-surface-raised: #334155;
  --vm-color-border: #334155;
  --vm-color-text: #F1F5F9;
  --vm-color-text-muted: #94A3B8;
  --vm-color-success: #4ADE80;
  --vm-color-warning: #FBBF24;
  --vm-color-danger: #F87171;
  --vm-color-info: #38BDF8;
  --vm-color-on-primary: #0F172A;
  --vm-elevation-1: none; --vm-elevation-2: none; --vm-elevation-3: none; /* use borders + surface steps */
}
/* Follow the OS when the user has not chosen: same dark block under
   @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ...dark values... } } */
```

Rules:

- **Theme switching:** follow `prefers-color-scheme` by default, with a manual toggle (light / dark / system) persisted in `localStorage` (wrapped in try/catch), applied by a tiny inline script **before first paint** so there is no flash of the wrong theme.
- **Brand gradient** (violet → indigo → blue, 135°) is used only on hero surfaces, the sign-in screen and stat-card accents. **Never behind body text.** Same stops in both themes.
- **Gutters:** 16 px phone (≤600), 24 px tablet (600–840), 32 px desktop (>840). Cards padding 24 (`space-5`). Section gaps: 24 mobile, 32 desktop. Page blocks 48. Hero rhythm 64.
- **Radius use:** inputs and chips 6, buttons and cards 8, modals and feature cards 12, avatars and pills full.
- **Dark mode** prefers 1 px borders and `surface` → `surface-raised` steps over shadows.
- **Per-community accent:** each community has its own accent (table in §1). After a community is chosen, override `--vm-color-primary` (and a derived hover via `color-mix(in srgb, <accent> 85%, black)` in light, `... 85%, white` in dark) at runtime on `<html>`. Check WCAG AA contrast of `on-primary` against the accent automatically. If it fails, keep the default indigo. The accent colours `#0284C7` and `#0D9488` are mid-tone, so verify both themes. In dark mode lighten the accent (mix 25% white) before use.
- **Fonts:** self-host Inter (variable, latin + latin-ext) from `public/fonts`; use `font-display: swap`; preload the regular and semibold files. Fall back to the stack above.
- **Icons:** one icon set (lucide-react), 20 px default, 1.75 stroke, `aria-hidden` unless the icon is the only content of a control.

## 2.1 Parent-brand cues (from vibemindsolutions.ai)

Clean white canvas; a soft indigo-to-blue radial glow behind heroes; a subtle **connected-nodes network motif** (dots joined by hairlines) — reuse it as the family-tree hero artwork; **pill-shaped primary CTAs with a trailing arrow** and an outlined secondary pill; rounded cards; generous whitespace; Inter; a "Powered by Vibe Mind" footer mark linking to https://vibemindsolutions.ai. The official logo is not available to you: create a clean, original text wordmark "VibeMind Community" with a small original network-nodes glyph as an inline SVG component, and put a clearly named placeholder at `public/brand/README.md` saying "replace `Logo.tsx` with the official logo asset". Do not imitate the parent logo.

## 2.2 Components (build as `src/components/vm/*`, each with every state, both themes)

Mirror the mobile `vm_ui` vocabulary and names. Required set:

- **App shell**: left sidebar ≥ 841 px (collapsible, icons + labels, active item uses primary tint), bottom navigation bar on phones (5 destinations max: Home, Community, Events, Family, Me) with a "More" sheet for the rest, top bar with community switcher, search, notifications bell with unread count, theme toggle, avatar menu. Skip link, landmarks.
- **Page header** (title h1, subtitle, breadcrumb, primary action, secondary actions in a menu), **stat card / metric tile** (value, label, delta, optional gradient accent bar, optional sparkline), **insight card**, **quick action** tile.
- **Card**, **list row** (avatar, title, subtitle, meta, trailing actions), **table** (sticky header, sortable, responsive: collapses to cards under 600 px), **pagination** and **infinite list** ("Load more" button reachable by keyboard).
- **Form kit**: text, textarea with counter, select, combobox/person picker (async, debounced), date field, switch, toggle field, segmented control / segmented choice, checkbox, radio, file/image drop zone (validates extension **and** magic bytes, 10 MB display-image cap, shows preview), stepper (wizard) with step timeline. Inline validation under each field; summary at top on submit failure.
- **Feedback**: toast, banner, inline alert, empty state (illustration + one primary action), error state (message + trace id "copy details" + Retry), permission-denied state, skeletons, progress.
- **Overlays**: dialog (desktop) that becomes a **draggable bottom sheet on phones**, popover/menu, tooltip, confirm dialog with a "danger tile" variant for destructive actions.
- **Chips and badges**: status chips (ACTIVE success, PENDING warning, INACTIVE and ARCHIVED muted, SUSPENDED danger, DECLINED/REJECTED danger, PUBLISHED success, DRAFT muted, UNDER_REVIEW info), role badge, "Private" badge.
- **Avatar** (photo or initials; initials background derived deterministically from the name using only token colours via `color-mix`), **participant stack** (overlapping avatars + "+N").
- **Expandable text** ("Read more"), **reaction bar**, **comment thread**, **poll options** (with results bars), **attachment tile**, **image gallery/lightbox** (scrim token), **tabs**, **breadcrumbs**, **tag input**.
- **Date/time**: one `formatDate` / `formatDateTime` / `formatRelative` utility honouring the person's `date_format` and `time_format` preferences (Person fields, default `DD/MM/YYYY`-style per locale and 12H/24H). **Every date in the product goes through it.**
- **Scope guard**: `<Can scope="family.edit" fallback="hide|disable|explain">`; `useCan()` hook. `explain` renders a disabled control with a tooltip naming the missing permission in plain words.
- A **`/design-system`** page (not linked, `noindex`) shows every token and component in both themes. It is also your visual regression surface.

---

# 3. TECH STACK AND PROJECT STRUCTURE

Pin latest stable versions; verify at install time.

- **Next.js (App Router) + React + TypeScript (strict)**. Public marketing pages are server-rendered / static with full metadata. The authenticated app (`/app/**`) is a client-rendered shell (data via the `ApiClient`), so it behaves identically in mock and live modes.
- **Tailwind CSS** configured *only* from the token variables (theme extension maps `colors.primary → var(--vm-color-primary)` etc.; no arbitrary values; no default palette). Alternatively CSS Modules over tokens. Pick one and enforce with lint.
- **next-intl** (message catalogs in `src/messages/en.json`; ICU plurals; logical CSS properties so RTL works).
- **TanStack Query** (cache, optimistic updates, infinite queries with the opaque cursor), **Zod** (every response and every form), **React Hook Form** with the Zod resolver.
- **Tree rendering:** a custom SVG/canvas renderer on `d3-zoom` / `d3-selection` **or** `@xyflow/react`, with **`elkjs`** (or `d3-dag`) layout in a **Web Worker**. Prototype in Phase 3 on the 2,000-person synthetic set and choose the one that keeps 60 fps pan/zoom; record the decision in `docs/ADR-tree-renderer.md`.
- **Mock backend:** plain TypeScript, in-memory store hydrated from a deterministic seed generator and persisted to IndexedDB so edits survive reloads; a "Reset demo data" action in the dev toolbar.
- **Testing:** Vitest + Testing Library (behavioural), Playwright (E2E + screenshots at 375/768/1440, both themes), `@axe-core/playwright` (a11y).
- **Lint/format:** ESLint (flat config) with custom rules **banning hex/rgb literals, raw px spacing, and string literals in JSX outside `tokens.*`/`messages`**, and a rule banning `fetch` outside `src/lib/api`. Prettier. `tsc --noEmit`.
- **Gates script** `scripts/ci_gates.sh`: typecheck, lint, unit tests, build, Playwright smoke + axe, bundle-size budget.
- **Packaging:** `Dockerfile` (multi-stage, non-root), `.env.example`, `README.md` (run, modes, personas, how to switch to live), `docs/` (ADRs, assumptions log, API contract, runbook).

## 3.1 Folder layout

```
vm-community-web/
  PROMPT.md
  src/
    app/
      (marketing)/            # public pages: generic home + /for/<vertical> landing pages (§8.1)
      (auth)/signin, community-picker
      app/                    # authenticated shell + all app pages (see §8)
      api/                    # BFF route handlers (live mode only): auth/*, bff/[...path], files
      design-system/
    components/vm/            # design-system components
    features/<area>/          # families, tree, members, feed, events, giving, ... (UI + hooks)
    lib/
      api/                    # ApiClient interface, live client, error mapping, zod schemas
      auth/                   # session, scopes (closure), roles, Can/useCan
      format/                 # dates, numbers, currency, names
      verticals/              # VerticalPreset objects + vocabulary resolver (§1.1)
      kinship/                # relationship calculator (pure, unit-tested)
      tree/                   # graph model, layout worker, validation, gedcom
    mocks/                    # mock backend, seed generators (never imported by live build paths)
    messages/en.json
    styles/tokens.css, tokens.ts, globals.css
  public/fonts, public/brand
  scripts/ci_gates.sh
  docs/
```

## 3.2 Environment

```
NEXT_PUBLIC_DATA_MODE=mock                # mock | live
# live mode only:
VM_API_BASE_URL=https://<public-vertical-host>      # one public address per vertical
KEYCLOAK_ISSUER=https://<keycloak>/auth/realms/<vertical-realm>
KEYCLOAK_CLIENT_ID=vibemind-web           # proposed; must be registered in Keycloak (mobile uses `vibemind-mobile`)
SESSION_SECRET=<32+ random bytes>
APP_ORIGIN=https://<web-origin>
```

Never commit secrets; ship `.env.example` only.

## 3.3 ApiClient (the seam between UI and backend)

```ts
interface ApiClient {
  call<T>(fn: string, args?: Record<string, unknown>, opts?: { method?: 'GET'|'POST'; requestId?: string; signal?: AbortSignal }): Promise<T>;
}
// fn is "<module>.<function>", e.g. "families.search". 
// Live: GET (reads) or POST JSON (mutations) -> /api/bff/vm_community.api.<module>.<function>
// Mock: dispatches to src/mocks/handlers/<module>.ts with the SAME argument names.
```

On top of it, generate small typed modules per area (`families.search(...)`, …) with Zod-validated results. Every create-type call passes a fresh UUID **`request_id`** (the server caches the first result for 24 h per user and endpoint, so a retry never creates a duplicate).

---

# 4. AUTHENTICATION, SESSIONS, TENANCY

## 4.1 Mock mode

- A **sign-in page** with a *persona picker* (Tenant Admin, Staff, Priest/Leader, Accountant, Facility Manager, Member, Guest) plus a *community picker* over the six sample communities (§1). No password. The session lives in `localStorage` (try/catch, with an in-memory fallback).
- A **dev toolbar** (visible only in mock mode, bottom-left, collapsible): switch persona and community live, reset demo data, toggle the Family Tree API on/off (to test the household-view fallback of §7.9), toggle latency simulation (0 / 300 ms / 1.5 s) and random failure injection. A visible "Demo data" ribbon is shown in the shell.
- Role → scopes comes from the seed matrix in §5.2 through the implication closure in §5.1. `auth.me` returns the same shape as the real endpoint.

## 4.2 Live mode (build it, test with fixtures, do not claim verified)

The browser never holds tokens. Next.js route handlers form a **BFF**:

1. `GET /api/auth/login` → OIDC Authorization Code + **PKCE** against `KEYCLOAK_ISSUER` (one realm per *vertical*, not per community). `GET /api/auth/callback` exchanges the code, stores tokens **server-side** in an encrypted, **HttpOnly, Secure, SameSite=Lax** session cookie (use `iron-session` or `jose`), refreshes silently; **only a missing or rejected refresh token signs the person out** (a transport fault or one community refusing a re-bind must not).
2. After login call `auth.my_sites` (token only; not scope-gated). It returns `{ sites: [{ slug, name, role, membership_status, detail_available }] }`, derived from the signed `groups` claim (`/sites/<slug>`). Only the site serving the request has `name`/`role`; siblings have `detail_available: false` and are filled by calling `auth.me` against that site. Exactly one site → auto-select; several → show the **community picker**; none → "You are not a member of any community yet" with the contact path.
3. `auth.exchange_site(slug)` performs a server-side RFC 8693 token exchange and returns `{ access_token, expires_in }`, a token **bound to that community**. Keep one per community in the server session. Switching community = exchange again (cached until expiry).
4. `ALL /api/bff/<module>.<function>` proxies to `${VM_API_BASE_URL}/api/method/vm_community.api.<module>.<function>` with `Authorization: Bearer <community token>`, forwarding JSON bodies and query strings, stripping hop-by-hop headers, enforcing an allow-list of `<module>.<function>` names (generated from §6), and **never** exposing the token to the browser.
5. **Image/file proxy:** profile, family, guest, group and event photos are **private files**. A browser `<img>` cannot send a bearer token, so `GET /api/files?u=<site-relative-path>` fetches with the token, allow-lists paths (`/private/files/**`, `/files/**`), streams the bytes and answers `Cache-Control: private, no-store`. The `Avatar`/`Image` component resolves site-relative URLs through this proxy.
6. **Password reset** is public: `auth.password_reset(email)` (POST, rate-limited per IP) always answers "If that address has an account, we've emailed a link", never revealing whether it exists. A Keycloak page does the actual reset; the site never sees a password.
7. CSP, `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, no inline scripts except the nonce'd theme bootstrap.

## 4.3 Version gate and registry

`app.version_status(platform, app_version, build_number, flavor, site)` is a public pre-auth endpoint used by mobile builds; the website does not need it.

## 4.4 Calling convention (verified)

- URL: `/api/method/vm_community.api.<module>.<function>`. Reads use GET with query params; mutations use POST with a JSON body.
- **Success** body: `{ "message": <data> }`. List endpoints return `{ content: [...], total, page, page_length }` (`page` ≥ 1, default `page_length` 20, **max 100**). Mutations return `{ doc: <record>, message: "<localised text>" }`.
- **Error** body (HTTP 4xx/5xx): `{ "error": { "code": "<CODE>", "message": "<generic English>", "trace_id": "<id>", "details"?: { "<field>": "<reason>" } } }`. The client **owns all user-facing wording**: map `code` to a translated message; never show the server's `message` directly. Show `trace_id` behind a "Copy details" control on unexpected errors.
- **Codes:** `AUTH_NO_MEMBERSHIP` (403), `AUTH_SCOPE_DENIED` (403), `AUTH_FORBIDDEN` (403), `AUTH_TOKEN_INVALID` (401), `AUTH_EXCHANGE_DENIED` (403), `NOT_FOUND` (404), `CONFLICT_DUPLICATE` (409), `CONFLICT_VERSION` (409, someone else changed it: refresh and retry), `RECORD_IN_USE` (409), `DUPLICATE_MEMBER` (409), `RATE_LIMITED` (429, for example content sharing is capped at 30 per hour per person), `VALIDATION_REQUIRED_FIELD`, `VALIDATION_INVALID`, `VALIDATION_INVALID_ENUM`, `VALIDATION_INVALID_EMAIL`, `VALIDATION_TOO_LONG`, `VALIDATION_INVALID_CHARS` (all 422, with `details` keyed by field), `VALIDATION_ERROR` (400), `INTERNAL` (500).
- **Idempotency:** creates accept `request_id` (client UUID); the first result is cached 24 h per user and endpoint, and a duplicate returns the original.
- **Optimistic locking:** some updates take `doc_version`; a stale one gives `CONFLICT_VERSION`.
- **Soft delete everywhere** (`is_deleted`); deletes can be blocked with `RECORD_IN_USE` (409).
- **Enums are UPPER_SNAKE.** Dates are `YYYY-MM-DD`; datetimes `YYYY-MM-DD HH:MM:SS` (site time).
- **Sorting:** `sort_by="<field> asc|desc"` from a server allow-list; unknown values fall back silently.
- **Text governance (STD-07):** length caps and rejection of HTML/script/control characters are enforced server-side; mirror caps client-side (`maxLength`) and reject `<` `>` script-like input in single-line fields with a friendly message.
- **Uploads:** `content` is **base64** (a data-URI prefix is tolerated) with a `filename`; server checks extension **and** magic bytes; display images capped at **10 MB**; the server re-encodes images and mints the stored filename.
- **IDs are opaque strings** (never parse, sort or display them; use them only as keys and in URLs).
- **Feed is cursor-based** (opaque keyset cursor); never offset.
- **Never trust the UI for authorisation**; the server is the authority. Hide controls the caller lacks scope for; when the server sends a `viewer` object (§6.3) obey it instead of recomputing.

---

# 5. SCOPES, ROLES AND THE PERMISSION MODEL (verified)

Every endpoint requires exactly one **scope**. A person has one **role** per community; a role has a set of scopes. `auth.me` returns `{ email, full_name, tenant (slug), community (name), role, scopes: string[] }`, and the scope list is already the expanded closure.

## 5.1 Scope catalog (complete) and implication closure

```
member.read member.create member.edit member.delete member.export member.convert member.note person.resolve
family.read family.create family.edit family.delete
guest.read guest.create guest.edit guest.delete guest.convert
position.read position.create position.edit position.delete position.assign
serving.respond
employee.read employee.create employee.edit employee.delete employee.export employee.convert employee.compensation
user.read user.create user.edit user.delete   role.read role.create role.edit role.delete   membership.manage
facility.read facility.create facility.edit facility.delete
booking.read_own booking.read_all booking.request booking.edit booking.approve booking.cancel
event.read event.create event.edit event.delete event.publish
series.read series.create series.edit series.delete series.generate
registration.rsvp registration.read registration.manage
fund.read fund.create fund.edit fund.delete
contribution.read_own contribution.give contribution.read contribution.create contribution.edit contribution.delete contribution.process
receipt.read receipt.generate statement.read
announcement.read announcement.create announcement.edit announcement.delete announcement.publish announcement.pin
document.read document.create document.edit document.delete document.publish document.share
media.read media.create media.edit media.delete
moderation.read moderation.act moderation.flag moderation.rule.manage
certificate.read certificate.read_own certificate.create certificate.edit certificate.delete certificate.issue certificate.revoke certificate.template.manage
post.read post.create post.edit post.delete post.publish post.moderate comment.write reaction.write
group.read group.create group.edit group.delete group.manage group.join
profile.read_own profile.write_own   settings.read settings.write settings.read_public   org.read org.write
notification.read_own notification.send notification.settings
dashboard.view report.view report.export
consent.read_own consent.manage dsar.request_own dsar.process privacy.breach.manage
audit.read audit.read_sensitive audit.read_dpdp
ministry.read ministry.create ministry.edit ministry.delete roster.manage roster.respond attendance.record
prayer.read prayer.create prayer.pray prayer.manage
feed.read content.share
tenant.read tenant.create tenant.edit tenant.suspend tenant.delete platform.metrics   (control plane only; not for this site)
```

**Closure (D-26):** CRUD ladder `delete ⇒ edit ⇒ create ⇒ read` within a domain (for example `family.edit` implies `family.create` and `family.read`). Verb implications: `member.export|convert|note ⇒ member.read`; `guest.convert ⇒ guest.read`; `position.assign ⇒ position.read`; `employee.export|convert|compensation ⇒ employee.read`; `booking.request|cancel ⇒ booking.read_own`; `booking.approve|edit ⇒ booking.read_all`; `event.publish ⇒ event.read`; `series.generate ⇒ series.read`; `registration.manage ⇒ registration.read` (`registration.rsvp` does **not** imply read); `contribution.give ⇒ contribution.read_own`; `contribution.process ⇒ contribution.read`; `receipt.generate ⇒ receipt.read`; `announcement.publish|pin ⇒ announcement.read`; `document.publish|share ⇒ document.read`; `moderation.act ⇒ moderation.read`; `certificate.issue|revoke|template.manage ⇒ certificate.read`; `post.publish|moderate ⇒ post.read`; `group.manage|join ⇒ group.read`; `ministry.create|edit|delete ⇒ ministry.read`; `roster.manage|attendance.record ⇒ ministry.read`; `prayer.create|pray|manage ⇒ prayer.read`. Implement `expandClosure(scopes)` in `src/lib/auth/scopes.ts`, unit-tested. **`feed.read`, `reaction.write`, `comment.write`, `content.share` are never derived; they are only granted explicitly by the role.**

## 5.2 Seeded roles (the matrix the mock backend uses)

`X.*` means every catalog scope starting with `X.`, except the carve-outs `employee.compensation` and `notification.read_own`, which must be listed explicitly.

- **Guest:** event.read, facility.read, document.read, announcement.read, content.share, profile.read_own, consent.read_own, certificate.read_own, feed.read, settings.read_public.
- **Member:** everything in Guest plus profile.write_own, registration.rsvp, booking.request, booking.read_own, booking.cancel, contribution.read_own, contribution.give, media.read, post.read, post.create, post.edit, post.publish, post.delete, comment.write, reaction.write, group.read, group.join, dashboard.view, dsar.request_own, notification.read_own, notification.settings, moderation.flag, roster.respond, serving.respond, prayer.read, prayer.create, prayer.pray.
- **Staff:** profile.read_own/write_own, notification.read_own/settings, consent.read_own, dsar.request_own, roster.respond, serving.respond, settings.read_public, feed.read, member.\*, family.\*, guest.\*, position.\*, event.\*, series.\*, registration.manage, registration.read, announcement.\*, document.\*, media.\*, post.\*, group.manage, ministry.\*, roster.manage, attendance.record, prayer.manage, dashboard.view, report.view.
- **Facility Manager:** the Staff self-service set, facility.\*, booking.\*, person.resolve, dashboard.view, report.view.
- **Accountant:** the Staff self-service set, fund.\*, contribution.\*, receipt.\*, statement.read, person.resolve, dashboard.view, report.view, audit.read, audit.read_sensitive.
- **Priest (religious leader; shown as the preset's `leader` word):** everything in Member plus ministry.\*, roster.manage, attendance.record, prayer.manage, member.read, certificate.read, person.resolve, dashboard.view, report.view.
- **Tenant Admin:** feed.read, member.\*, family.\*, guest.\*, position.\*, employee.\*, user.\*, role.\*, membership.manage, facility.\*, booking.\*, event.\*, series.\*, registration.\*, fund.\*, contribution.\*, receipt.\*, statement.read, announcement.\*, document.\*, media.\*, moderation.\*, certificate.\*, post.\*, group.\*, settings.\*, org.\*, notification.\*, dashboard.view, report.view, consent.manage, dsar.process, ministry.\*, roster.manage, roster.respond, serving.respond, attendance.record, prayer.manage, person.resolve, profile.read_own, profile.write_own, reaction.write, comment.write, content.share, employee.compensation, notification.read_own, report.export, privacy.breach.manage, audit.read, audit.read_sensitive, audit.read_dpdp.

**Navigation visibility rule:** a nav item shows when the caller holds that area's `*.read` (or its documented own-scope), and the community's preset enables the module. Example: Giving shows for `contribution.give` / `contribution.read_own` (my giving) and `contribution.read` (the ledger).

---

# 6. THE VERIFIED API CATALOG

Format: `scope · module.function(params) — note`. Params in brackets have defaults/are optional. **This is the complete list of existing endpoints** (335 whitelisted, every one scoped). Build typed wrappers only for what the pages in §8 need, but keep this list as the allow-list for the BFF.

## 6.1 Identity and tenancy

- *(token only)* `auth.me()` → `{email, full_name, tenant, community, role, scopes[]}`
- *(token only)* `auth.my_sites()` → `{sites:[{slug,name,role,membership_status,detail_available}]}`
- *(token only)* `auth.exchange_site(slug)` → `{access_token, expires_in}`
- *(public, rate-limited)* `auth.password_reset(email)` (POST)
- *(authenticated)* `meta.field_contracts()` → `{field_contracts, api_contracts}`: the server's own validation rules per field (required, maxLength, format, enum). **In live mode fetch this once and drive form validation from it; in mock mode ship a static copy that matches your Zod schemas.**
- `settings.read_public · settings.get_public_settings()` (appearance/branding keys any role may read; use it for the community's accent, name, logo and `community_type` if present)
- `settings.read · settings.get_categories()`, `get_settings(category)`, `get_audit([category, setting_key, page, page_length])`; `settings.write · settings.update_settings(category, changes[, note])`, `reset_setting(key[, note])`

## 6.2 People and families (as they exist today)

**Person** (a "member"): `name`(opaque id), `email`(unique), `username`, `first_name`, `last_name`, `display_name`, `phone_number`, `profile_image_url`, `bio`, `date_of_birth`, `gender` (`MALE|FEMALE|OTHER|PREFER_NOT_TO_SAY`), `occupation`, `interests[]`, `skills[]`, `member_number`, `membership_type`, `membership_start_date`, `membership_end_date`, `status` (`ACTIVE|INACTIVE|PENDING|SUSPENDED|ARCHIVED|DELETED`), `custom_fields`, `linked_user`, `street_address`, `city`, `state`, `postal_code`, `country`, `visibility` (`PUBLIC|MEMBERS|STAFF|PRIVATE`), `visibility_overrides`, `date_format`, `time_format` (display prefs), `is_deleted`, `doc_version`.

**VM Family:** `name`(opaque), `family_name`, `status` (`ACTIVE|INACTIVE|PENDING|ARCHIVED`), `head_of_family` (Person), `address_line1/2`, `city`, `state`, `postal_code`, `country`, `home_phone`, `notes`, `profile_image_url`, `creation`, `modified`.

**VM Family Member** (standalone join row): `family`, `person`, `relationship` (`FATHER|MOTHER|SON|DAUGHTER|SPOUSE|SIBLING|GRANDPARENT|GRANDCHILD|OTHER`, a *label of that person inside that family*), `is_primary`. **Invariant:** a person is primary in at most one family across all families; may belong to several; cannot be in the same family twice (`DUPLICATE_MEMBER` 409).

- `family.read · families.search([query, status, city, state, has_primary, page, page_length, sort_by])` → rows `{name, family_name, status, city, member_count}`; sort_by ∈ family_name, status, city, modified, creation
- `family.read · families.get(name)` → full family + `members:[{name, person, relationship, is_primary, display_name, email}]` (primary first)
- `family.read · families.list_for_person(person)` → `{content:[{family, family_name, relationship, is_primary}], total}`
- `family.read · families.statistics()` → `{total, active, individuals, avg_size}`
- `family.create · families.create(**fields)` (POST, `request_id`); `family.edit · families.update(name, **fields)`; `family.edit · families.update_profile_image(name, filename, content)`; `family.delete · families.delete(name)` (soft; cascades to roster rows)
- `family.edit · families.add_member(family, person, [relationship, is_primary])`, `set_primary(family, person)`, `update_member(family, person, relationship)`, `remove_member(family, person)` → each returns `{doc:{name, members:[...]}, message}`
- `member.read · members.search([query, status, page, page_length, sort_by, membership_type, gender, visibility, has_user, join_date_from, join_date_to])`, `get(name)`, `statistics()`, `notes(person)` (`member.note`), `add_note(person, note)`, `export(...)` (`member.export`, CSV)
- `member.create · members.create(**fields)`; `member.edit · members.update(name, **fields)`, `update_status(name, status, reason)`, `update_profile_image(...)`; `member.delete · members.delete(name)`
- `profile.read_own · members.get_me()`; `profile.write_own · members.update_me(**fields)`, `update_my_profile_image(filename, content)`; `person.resolve · members.resolve(name)`
- `guest.read · guest.search([query, status, invited_by, converted, invitation_date_from/to, visit_date_from/to, page, page_length, sort_by])`, `get`, `statistics`, `list_invited_by(member)`; `guest.create · create`; `guest.edit · update, update_profile_image, mark_visited, mark_declined, reinvite`; `guest.convert · convert_to_member(name, first_name, last_name, display_name, email, phone_number)`; `guest.delete · delete(name[, force])`. Guest status: `INVITED → VISITED | DECLINED → (reinvite) INVITED`, `CONVERTED` terminal.
- `position.read · position.search/get/list_active/list_members(position[, include_ended])/list_by_member(member)`; `position.create · create(position_name, description, display_order)`; `position.edit · update`; `position.delete · delete`; `position.assign · assign_member(position, member, start_date, end_date, notes)`, `remove_member(position, member[, end_date])`; `profile.read_own · position.my_positions()`

## 6.3 Community feed, posts, engagement (new on the branch)

- `feed.read · community_feed.search([types, cursor, limit=20, media_only, group, groups_only])` → `{content:[FeedItem], next_cursor?}` (opaque keyset cursor, ordered once on the server: pinned first, then `sort_at` desc). **FeedItem** = `{type, id, sort_at, pinned, author:{...name,image}, engagement:{reactions:{by_type,total,my_reaction}, comment_count, share_count, ...}, viewer:{...}, payload:{...source feature's own payload}}`. Types: posts, polls, announcements, prayer requests, events (events are upcoming-only). *Exact `type` strings are inferred as `post|poll|announcement|prayer|event`; accept unknown types by rendering a safe generic card.*
- **`viewer` object** (every key present, booleans; a False control is **hidden**, never disabled): `can_edit, can_delete, can_publish, can_react, can_comment, can_share, can_flag, can_pray, can_rsvp, can_archive, can_pin, can_feature, can_reply, can_submit, can_withdraw, can_approve, can_reject`. Posts, announcements and comments carry the server's viewer; events and prayers do not yet, so derive their controls from scopes.
- Posts: `post.read · posts.search([group, type, page, page_length, sort_by])`, `posts.get(name)`, `posts.share(name)`, `posts.poll_results(post)`; `post.create · posts.create(**fields)` (draft), `my_drafts([type, status, q, page, ...])` (statuses `DRAFT|UNDER_REVIEW|REJECTED|PUBLISHED`), `posts.publish(name)`; `post.edit · posts.update`, `archive`, `add_attachment(name, filename, content, caption)`, `remove_attachment(name, attachment)`; `post.delete · posts.delete`; `post.moderate · posts.set_pinned(name, pinned)`, `set_featured(name, featured)`; `post.read · posts.set_group_pinned`; `reaction.write · posts.vote(post, option)` (single-choice poll vote). A published post is not editable in place.
- **Approval workflow (D-54):** `post.read · content_workflow.policy(content_type[, group])` (does new content publish directly or go to review?), `review_queue([content_type, group, page, page_length])`, `review_count([content_type])`, `approve(content_type, name[, revision])`, `reject(content_type, name[, revision, reason])`, `history(content_type, name)`; `post.create · submit(content_type, name)`, `withdraw(content_type, name)`.
- Comments (polymorphic): `feed.read · comments.search(content_type, content_id[, page, page_length=50, sort_by])`; `comment.write · comments.create(content_type, content_id, content[, parent_comment])` (one-level replies), `update(name, content)`, `delete(name)`; `post.moderate · comments.moderate(name, action)`. `content_type` ∈ `post|comment|announcement` (the friendly key, never the doctype name). A comment is visible if not deleted and either `APPROVED`, or your own and not `REJECTED`; moderators see everything not deleted.
- Reactions (polymorphic): `reaction.write · reactions.react(content_type, content_id, type)` (add, switch, or toggle off), `unreact(content_type, content_id)`; `feed.read · reactions.counts(content_type, content_id)` → `{by_type, total, my_reaction}`. Reaction summaries for a feed page arrive inside the feed items; **never call counts per card.**
- Sharing: `content.share · content_share.share(content_type, content_id)` → new aggregate count (not de-duplicated; limited to 30 per hour per person → `RATE_LIMITED`); `share_count(...)`.
- Flagging/moderation: `moderation.flag · moderation.flag_content(content_type, content_id, reason, description)` (flaggable kinds include events and prayers); `moderation.read · list_flags([status, severity, page, page_length])`, `get_flag`, `statistics`; `moderation.act · start_review(name)`, `review_flag(name, decision, action, review_notes)` (decision `APPROVE|REJECT|RESOLVE`); `moderation.rule.manage · list_rules/create_rule/update_rule/toggle_rule/delete_rule`.
- Announcements: `announcement.read · announcements.search([status, category, page, page_length, sort_by, mine, group_ref])`, `get(name)`, `announcement_statistics()`; `.create · create`; `.edit · update`; `.publish · publish(name)`, `archive(name)`; `.pin · set_pinned(name, pinned)`; `.delete · delete(name)`. Announcements carry denormalised `author name/image`, `comments_enabled`, reactions.
- Groups: `group.read · groups.search([privacy, mine, q, page, ...])` (SECRET groups hidden from non-members), `get`, `my_groups`, `is_member`, `statistics`, `members(name[, status, page, ...])`, `pending(name)`; `group.create · create`; `group.join · join, leave, set_my_notifications`; manager verbs (all under `group.read` + in-group manager check): `update, archive, update_images(name, filename, content, target), add_member, approve, reject, block, remove_member, set_role (ADMIN|MODERATOR|MEMBER), transfer_ownership, delete`; `group.manage · platform_statistics()`.
- Prayer / support requests (preset-dependent feature): `prayer.read · prayer.list_shared([answered, query, page, ...])`, `get(id)`; `prayer.create · create(body, visibility, is_anonymous)` (visibility default `PRIVATE_TO_CLERGY`; other value `SHARED`), `my`, `delete(id)`; `prayer.pray · pray(id)`, `unpray(id)`; `prayer.manage · pastor_queue([status, visibility, answered, ...])`, `mark_answered(id, answered_note)`. Anonymous requests never expose the requester.

## 6.4 Events and serving

- `event.read · events.search([query, status, visibility, facility, group_ref, series, date_from, date_to, page, page_length, sort_by, collapse_series=1, one_time_only=0])`, `get(name)`, `get_public([date_from, date_to, page, page_length])`, `get_my_events([..., status])`, `statistics()`, `upcoming_pipeline([weeks=4])`, `attendance_summary(name)`, `rsvp_velocity(name)`, `report([date_from, date_to, series, limit])`; `registration.read · events.get_registration_statistics(event)`
- `event.create · events.create(**fields)` (starts DRAFT); `event.edit · update, update_cover_image, add_attachment(name, filename, content, caption), remove_attachment(name, attachment)`; `event.publish · publish, cancel(name, reason), complete`; `event.delete · delete` (drafts with no registrations only). Event status `DRAFT|PUBLISHED|CANCELLED|COMPLETED`; visibility includes `PUBLIC`, `PRIVATE`. A PRIVATE event is hidden from dashboards and sessions for non-entitled callers.
- Sessions: `event.read · sessions.list_for_event(event)`; `event.edit · sessions.create(event, label, start_datetime, end_datetime, capacity)`, `sessions.delete(name)`
- Series: `series.read · series.search/get(name[, include_upcoming_events, include_exceptions])/list_exceptions(event_series)`; `series.create · create`; `series.edit · update(name, apply_to_future, **fields)`, `add_exception(event_series, exception_date, exception_type, reason, rescheduled_datetime, modified_location, modified_capacity, notify_attendees)`, `remove_exception(name)`; `series.generate · generate_occurrences(name)`; `series.delete · delete`
- Registrations: `registration.rsvp · registrations.rsvp(event, [person, guest, guest_count, notes, session])`, `my_registrations([upcoming])`, `get_my_registration(event)`, `cancel_registration(event, reason)`; `registration.read · list(event[, status, page, ...])`, `attendance_history(person[, limit, start])`, `attendance_gaps([cutoff_days=90, min_prior_attendance=1, limit=50])` (pastoral "absent members" signal; staff only); `registration.manage · manage(name, action, reason)` (actions `check_in → ATTENDED`, `no_show → NO_SHOW`, …)
- Attendance: `attendance.record · attendance.record(occurrence, mode=HEADCOUNT, headcount, notes, doc_version)`, `add_entry(occurrence, user, source)`, `get(occurrence)`
- Ministry teams / rosters / serving: `ministry.read · ministry.search/get`; `ministry.create · create`; `ministry.edit · update(name[, doc_version], **fields), add_member(team, user, role=MEMBER), remove_member(team, user)`; `ministry.delete · delete`; `ministry.read · roster.search([team, occurrence, user, status, date_from, date_to, ...])`; `roster.manage · roster.assign(team, occurrence, user, role)`, `remind(id|occurrence)`, `remove(id)`; `roster.respond · roster.respond(id, response, decline_reason)`, `roster.my([status, when, upcoming, ...])`; serving roles for events: `position.read · serving.roles_for_event(event)`, `position.create · create_role(event, role_name, needed_count)`, `position.assign · serving.assign(serving_role, person)`, `serving.respond · serving.respond(assignment, status, decline_reason)`, `serving.my(...)`, `position.delete · serving.remove(assignment)`

## 6.5 Giving (the preset renames it: donations, dues, contributions…)

- `fund.read · funds.search([query, is_active, ...])`, `funds.get(name)`, `funds.statistics(name)`; `contribution.give · funds.list_active(...)` (giver's fund picker); `fund.create · create`; `fund.edit · update`; `fund.delete · delete` (blocked while contributions exist)
- `contribution.give · contributions.give(fund, amount, [method=UPI, reference_no, contribution_date, currency=INR, notes])` — a member **self-records** a gift (donor forced to self; status PENDING). **The website must never take card or bank details**; it records a gift the person made through the community's own channel (UPI/cash/bank reference) and says so clearly. `contribution.read_own · list_mine`, `my_statement(year)`; `contribution.read · search([fund, status, donor, date_from, date_to, ...])`, `statistics`, `giving_trends`; `contribution.create · record(donor, fund, amount, method=CASH, reference_no, contribution_date, currency, notes)`, `search_donors(query)`; `contribution.process · mark_received(name)`, `cancel(name, reason)`; `statement.read · statement(person, year)`. Status flow `PENDING → RECEIVED` (or `CANCELLED`). Methods include `CASH`, `UPI`, bank/cheque-type values (accept unknown values gracefully). Default currency `INR`; format with `Intl.NumberFormat` from the community's currency.

## 6.6 Documents, media

- Documents: `document.read · documents.search([category, q, ...])`, `recent_documents`, `popular_documents`, `document_statistics`, `get(name)` (counts a view), `download(name[, token])`, `list_categories()`, `resolve_share_link(token)`; `document.create · upload_document(filename, content, title, description, category, tags, is_public, downloadable)`; `document.edit · update_document, upload_new_version(name, filename, content), create_category(category_name, description, color, parent_category), update_category, delete_category, revoke_share_link(name)`; `document.publish · publish, archive`; `document.share · create_share_link(name, expiry_hours)`; `document.delete · delete_document`
- Media: `media.read · media.search_albums, get_album, search_media([album, media_type=IMAGE|VIDEO, ...]), get_media, download_media`; `media.create · create_album(album_name, description, visibility=MEMBERS), upload_media(album, filename, content, title, description, tags, photo_consent_confirmed, contains_minor)` (**the UI must ask for photo consent and minor flag**); `media.edit · update_album, update_media`; `media.delete · delete_album(name[, move_items_to_root]), delete_media`

## 6.7 Facilities, bookings, certificates

- `facility.read · facilities.search([query, facility_type, status, min_capacity, ...])`, `get(name)` (with weekly hours), `statistics`, `availability(name, date_from, date_to)` (busy windows); `facility.create · get_defaults(), create`; `facility.edit · update, set_facility_status, update_profile_image`; `facility.delete · delete`
- `booking.read_own · bookings.search([query, facility, status, person, event, date_from, date_to, ...])`, `get(name)`; `booking.request · request(facility, start_datetime, end_datetime, purpose, attendee_count, booked_by_person)` (auto-CONFIRMED when the facility needs no approval, else PENDING); `booking.approve · approve, decline(name, reason), mark_no_show`; `booking.cancel · cancel(name, cancellation_reason)`; `booking.edit · update(...)` (PENDING only); `report.view · statistics`. Status `PENDING|CONFIRMED|REJECTED|CANCELLED|NO_SHOW`.
- Certificates (baptism/marriage/membership/etc.; types come from templates): `certificate.read_own · certificates.search/get(id)/render_html(id)` (members see only their own ISSUED/REVOKED); `certificate.read · statistics, numbering_integrity, list_templates, get_template`; `certificate.create · create`; `certificate.edit · update(id, doc_version, **fields)`; `certificate.issue · issue(id, doc_version)`; `certificate.revoke · revoke(id, revoke_reason, doc_version)`; `certificate.delete · delete` (DRAFT only); `certificate.template.manage · create_template, update_template, delete_template`. Flow `DRAFT → ISSUED → REVOKED`, ISSUED/REVOKED immutable.

## 6.8 Notifications, privacy, dashboard, reports, audit, admin

- Notifications: `notification.read_own · notifications.search([unread_only, topic, ...])`, `unread_count()`, `mark_read(name)`, `mark_all_read()`, `delete_notification(name)`, `list_topics()`; `notification.settings · get_preferences(), update_preference(topic, email_enabled, push_enabled, in_app_enabled), update_preferences(rows), register_device/rotate_device/unregister_device/list_devices` (mobile push; the website ignores device calls in v1); `notification.send · send(target_user|audience, topic, title, body, deep_link_route, source_doctype, source_doc), push_status()`. Optimistic auto-save on preference toggles (no Save button).
- Privacy: `consent.read_own · my_consents(), grant_consent(purpose), withdraw_consent(purpose)` (withdrawing is as easy as granting); `consent.manage · consent_register(...)`; `dsar.request_own · request_dsar(request_type, details), my_dsars, dsar_get_own, dsar_download, dsar_cancel` (request types include EXPORT/ACCESS/ERASURE; cancel only while SUBMITTED); `dsar.process · list_dsars([status, request_type, overdue, query, sort, ...]), dsar_get, dsar_verify_identity, process_dsar(name, action, resolution_notes, internal_notes)`; `privacy.breach.manage · create_breach, list_breaches, get_breach, update_breach_status`
- Dashboard (`dashboard.view`): `get_summary()` (stat cards composed by the caller's scopes: omit, never zero), `get_my_summary()`, `get_membership_growth([months≤24])`, `get_monthly_donations([months])`, `get_age_distribution()`, `get_upcoming_events([limit≤10])`, `get_recent_activity([page, page_length])`, `get_preferences()`, `update_preferences(auto_refresh_enabled, auto_refresh_interval_seconds, layout_json)`
- Reports: `report.view · reports.catalog()`, `run(report_key, **params)`; `report.export · export(report_key, **params)` (CSV)
- Audit: `audit.read · audit.search([entity_doctype, entity_id, actor, event_type, trace_id, date_from, date_to, category, page, page_length])`, `get(name)` (redacted per the caller's `audit.read_sensitive` / `audit.read_dpdp`)
- Users and roles: `user.read · membership.search([query, role, status, ...]), get(name)`; `membership.manage · invite(email, role, linked_person, linked_employee, first_name, last_name), resend_link, set_role(name, role), activate, remove`; `role.read · role.search/get/list_scopes([domain])`; `role.create · create(role_name, description, scopes, role_type=CUSTOM)`; `role.edit · update(name, description, scopes)` (system roles immutable); `role.delete · delete` (not system roles, not in use)
- HR (admin): `employee.read · employee.search/get/stats/upcoming_end_dates/span_of_control`, `hr_catalog.department_*` and `job_title_*` (search/get/options/create/update/set_active/delete), `employee.create/edit/delete/export/convert/compensation` (compensation fields appear only with `employee.compensation`; list rows never include compensation); `report.view · employee.tenure_distribution, data_completeness`

**Reminder:** the endpoints above are the *entire* existing surface. There is **no** person-to-person relationship endpoint, no family-to-family link, no kinship or tree endpoint, no `community_type` field. Those are specified in §7 and §1.1 as proposals.

---

# 7. THE FAMILY TREE — FULL SPECIFICATION (flagship)

## 7.1 What exists vs what is missing

Today the backend has only a **flat family roster** (§6.2): a family has members; each member carries a *label* inside that family; a person can be in several families but **primary in one**. Missing for a real tree: person-to-person edges (who is whose parent), generations, family-to-family links, marriage lifecycle, adoption/step/guardian/foster, relatives who are not members (deceased ancestors, spouses outside the community, children without accounts), tree-shaped reads, a kinship calculator, duplicate merge, export.

You implement the **Family Tree API v1 (proposed)** below completely in the mock backend, build the full UI on it, and also build the **household-view fallback** (§7.9) so the site still works against today's backend. In live mode the Tree API is called only if feature detection says it exists (§7.9). Write `docs/TREE-API-CONTRACT.md` from this section so the real backend team can implement it.

## 7.2 Concepts

- **Person** = a node (member **or** non-member relative, living or deceased).
- **Relationship** = a typed, dated link between two persons. Parent→child edges define generations; spouse/partner edges define **unions**.
- **Union node** = a couple (or a single parent) from which children descend. This is the standard way to lay out multiple marriages and half-siblings correctly.
- **Family (VM Family)** = a household or lineage grouping of persons (existing entity). A person may belong to several families (for example the family they were born into and the one they married into), with exactly one **primary** (existing invariant, keep it).
- **Family Link** = a typed link between **two families** (marriage alliance, extended kin, adoption, guardianship). It is **derived** automatically when a person-level relationship connects members of two different families, and can also be **created manually**; it goes through an **approval workflow** (§7.7).
- **Vertical wording:** "family" and "tree" are labelled through the vertical preset (for example "Family tree" in a family association, "Households" elsewhere). The Tree is **enabled by default for `family-association`, `church`, `mosque`, `temple`, `society`**, and **optional** (off by default) for `club`, `alumni`, `charity`, controllable in settings.

## 7.3 Data contract (TypeScript, Zod-validate all of it)

```ts
type Gender = 'MALE'|'FEMALE'|'OTHER'|'PREFER_NOT_TO_SAY';
interface TreePerson {
  id: string;                         // opaque
  display_name: string;               // 'Private member' when masked
  first_name?: string; last_name?: string; maiden_name?: string;
  gender?: Gender;
  date_of_birth?: string; date_of_death?: string; birth_place?: string;
  is_deceased: boolean;
  is_community_member: boolean;       // false = relative without a login/membership
  photo_url?: string;                 // site-relative; resolved via the file proxy
  status: 'ACTIVE'|'INACTIVE'|'PENDING'|'SUSPENDED'|'ARCHIVED';
  family_ids: string[]; primary_family_id?: string;
  masked: boolean;                    // server hid identity for this viewer; keeps structure only
  doc_version: number;
}
type RelationType =
  | 'PARENT_OF' | 'ADOPTIVE_PARENT_OF' | 'STEP_PARENT_OF' | 'FOSTER_PARENT_OF' | 'GUARDIAN_OF'  // person_a is the parent/guardian of person_b
  | 'SPOUSE_OF' | 'PARTNER_OF' | 'SIBLING_OF';  // symmetric; SIBLING_OF only for explicit/half/unknown-parent cases
type UnionStatus = 'CURRENT'|'ENDED'|'WIDOWED'|'DIVORCED'|'ANNULLED';
interface Relationship {
  id: string; type: RelationType; person_a: string; person_b: string;
  parent_role?: 'MOTHER'|'FATHER'|'OTHER';        // for *_PARENT_OF
  status: UnionStatus;                            // meaningful for SPOUSE_OF/PARTNER_OF; CURRENT otherwise
  start_date?: string; end_date?: string;
  is_verified: boolean; source?: string; doc_version: number;
}
interface Union { id: string; partners: [string, string?]; status: UnionStatus; start_date?: string; end_date?: string;
                  children: Array<{ person: string; kind: 'BIOLOGICAL'|'ADOPTIVE'|'STEP'|'FOSTER'|'GUARDIAN' }>; }  // derived, never stored
type FamilyLinkType = 'MARRIAGE_ALLIANCE'|'KINSHIP'|'ADOPTION'|'GUARDIANSHIP'|'OTHER';
interface FamilyLink {
  id: string; family_a: string; family_b: string; link_type: FamilyLinkType;
  origin: 'DERIVED'|'MANUAL'; via_relationship?: string;
  status: 'PENDING'|'ACTIVE'|'REJECTED'|'ENDED';
  requested_by: string; approvals: { a?: { by: string; at: string }; b?: { by: string; at: string } };
  start_date?: string; end_date?: string; notes?: string; doc_version: number;
}
interface TreePayload {                  // response of tree.get
  focus: string; view: TreeView; nodes: TreePerson[]; relationships: Relationship[];
  unions: Union[]; families: Array<{ id: string; family_name: string; status: string; photo_url?: string; head_of_family?: string }>;
  family_links: FamilyLink[]; truncated: boolean; cursor?: string;
}
type TreeView = 'DESCENDANTS'|'ANCESTORS'|'HOURGLASS'|'FULL';
```

**Direction semantics (document once, enforce everywhere):** for `*_PARENT_OF` and `GUARDIAN_OF`, `person_a` is the parent/guardian and `person_b` the child. `SPOUSE_OF`, `PARTNER_OF`, `SIBLING_OF` are symmetric and stored with the lexicographically smaller id as `person_a`. **Siblings are derived** from shared parents; an explicit `SIBLING_OF` exists only for half/step/unknown-parent cases.

**Person additions** needed beyond today's `Person`: `is_deceased`, `date_of_death`, `birth_place`, `maiden_name`, `is_community_member`. Non-member relatives are minimal Person-like records without login, email, membership or number (record the choice "extend Person vs lightweight Relative record" in `docs/ASSUMPTIONS.md`; the UI is identical).

## 7.4 Endpoints (proposed; `family.*` scopes reused, no new scope assumed)

All follow §4.4 conventions (envelope, `request_id`, errors, soft delete, audit). Scopes in brackets.

- `[family.read] tree.get(focus_person, [view=HOURGLASS, depth_up=3, depth_down=3, include_spouses=1, include_other_families=1, as_of_date, family])` → `TreePayload`. **Server applies privacy masking** (§7.10). `family` limits to one family cluster.
- `[family.read] tree.expand(person, direction='UP'|'DOWN'|'SIDE', depth=1)` → `TreePayload` fragment (lazy load a branch).
- `[family.read] tree.path(person_a, person_b)` → `{ found, path:[{person, edge}], code:{kind, degree?, removed?, via:'BLOOD'|'MARRIAGE'|'ADOPTIVE'|'STEP'|'FOSTER'|'GUARDIAN', half?:boolean} }` (label rendered client-side, §7.6).
- `[family.read] tree.stats([family|person])` → `{people, members, relatives, deceased, generations, families, links_active, links_pending, oldest_ancestor, longest_line, births_this_month:[...], anniversaries_this_month:[...]}`
- `[family.edit] relationship.create(type, person_a, person_b, [parent_role, status, start_date, end_date, source])`, `relationship.update(id, doc_version, **fields)`, `relationship.end(id, status, end_date)` (end a union: divorced/widowed/annulled), `relationship.delete(id)` (soft). Server validates the guardrails (§7.5) and, on a relationship between members of two different families, **creates a derived PENDING `FamilyLink` idempotently**.
- `[family.edit] person.create_relative(first_name, last_name, [gender, date_of_birth, date_of_death, is_deceased, birth_place, maiden_name, family, relationship_to, relation_type])` → creates a non-member relative (optionally with the relationship and family membership in one call).
- `[family.read] person.search_duplicates([person])` → `[{a, b, score, reasons[]}]`; `[family.edit] person.merge(keep, remove, field_choices)` → re-points every relationship, family membership, note and link to `keep`; soft-deletes `remove`; audited.
- `[family.read] family_link.list([family, status, link_type, page, page_length])`, `family_link.graph()` → `{ families:[…], links:[FamilyLink] }` (nodes = families); `[family.edit] family_link.request(family_a, family_b, link_type, [start_date, notes])`, `approve(id)`, `reject(id, reason)`, `end(id, end_date)`.
- `[family.read] tree.export(format='GEDCOM'|'JSON', [focus_person, family, depth])` → `{ filename, content }` (audited; masked persons exported as private).
- Existing `families.get` is extended **additively** with `linked_families` and `relatives` (non-member persons not in the roster). Existing endpoints never change behaviour.

## 7.5 Guardrails (client validates for UX; mock/server enforces; every rule has a unit test)

1. No self-relationship. 2. No duplicate edge (same type and pair). 3. **No cycles** in parent→child (a person cannot be their own ancestor). 4. A parent must be older than the child: **error** if the parent's birth is on or after the child's; **warning** if the gap is under 12 years or over 60. 5. At most **one CURRENT** spouse per person by default (community setting `tree.max_concurrent_spouses`, default 1); an ENDED/WIDOWED union may precede a new one. 6. An ended union needs an end date ≥ start date. 7. A union cannot end after a partner's date of death unless status is WIDOWED. 8. `FamilyLink` cannot target the same family twice and not duplicate an ACTIVE/PENDING link of the same type. 9. Cannot delete a person who has relationships without confirming a cascade summary ("also removes 3 relationships").  10. A masked person's identity can never be inferred from error messages.

## 7.6 Kinship calculator (pure TypeScript in `src/lib/kinship`, exhaustively unit-tested)

Input: the relationship graph and two person ids. Output: `{ found, path, code }` and a **localised label**.

Algorithm:
1. Build a **blood-parent** graph from `PARENT_OF` only. Adoptive/step/foster/guardian edges are a separate "social parent" graph; `SPOUSE_OF`/`PARTNER_OF` are marriage edges.
2. For persons A and B compute ancestor maps `{ancestor → minimum generation distance}` (A itself at 0). Common ancestors = intersection. Pick those minimising `dA + dB`. If none, try again allowing social-parent edges (set `via` accordingly); if still none, try marriage hops (a spouse's blood relative → in-law; the spouses of those relatives → co-in-law).
3. With nearest common ancestor distances `dA`, `dB`: `dA=0` → B is a (great-)\*descendant of A (child, grandchild, great-grandchild…); `dB=0` → ancestor (parent, grandparent, great-…); `dA=dB=1` → sibling (**half** if they share exactly one parent; **step** via social parents); `(dA,dB)=(1,2)` → A is aunt/uncle of B (and B nephew/niece); `(1,n)` generalises to great-aunt etc.; otherwise **cousins**: degree `k = min(dA,dB) − 1`, removed `r = |dA − dB|` ("second cousin once removed").
4. Marriage: if the path crosses a SPOUSE_OF edge once at the start or end, prefix `in-law` (spouse's parent → parent-in-law; sibling's spouse → sibling-in-law; spouse's sibling → sibling-in-law; child's spouse → child-in-law); `co-` relations for the spouses of in-laws are labelled "co-parent-in-law" only when both are parents of a married couple, otherwise "related by marriage".
5. **Labels:** `code` → ICU message in the catalog (`kinship.sibling`, `kinship.cousin` with `{degree, removed}` plurals/ordinals, `kinship.in_law.<base>`). Use gendered terms (mother/father, aunt/uncle) **only** when `gender` is MALE/FEMALE; otherwise neutral ("parent", "parent's sibling"). Never assume gender from a name.
6. The calculator is used by the "How are we related?" tool, the person panel, and the relationship-wizard preview. The mock `tree.path` calls the same module.

Required unit tests (at least): parent, grandparent, great-grandchild, full sibling, half-sibling, step-sibling, aunt/uncle/niece/nephew, great-aunt, first cousin, second cousin once removed, parent-in-law, sibling-in-law, adoptive parent, guardian, unrelated, masked intermediate person, cyclic data rejected, performance on 5,000 persons < 50 ms.

## 7.7 Family-link approval workflow

Creating a marriage (or any cross-family relationship) → a derived **PENDING** link is created. The UI shows "Awaiting approval from the **Thomas family**" naming the approvers (head of family or any `family.edit` holder of that family). Approvers get an in-app notification and an **inbox card** (`/app/tree/links`) with **Approve / Decline / Ask a question** (the question opens a message composer via notifications; in mock mode it creates a notification). **Declined links keep the person-level relationship but remove the family-level bridge**, with a plain explanation to the requester. Active links can be **ended** with an end date (for example after a divorce) which fades the bridge to dashed and keeps history. A link is `ACTIVE` once both sides approved (the requesting side's approval counts at request time if the requester has `family.edit` over that family).

## 7.8 Tree UI requirements

**Canvas:** smooth pan and zoom (wheel, pinch, drag, keyboard +/−/0), minimap, fit-to-screen, centre-on-person, "reset view". Focus person highlighted. Selection → side panel (desktop) or draggable bottom sheet (phone).

**Views** (segmented control, state in the URL: `?view=hourglass&focus=<id>&family=<id>&density=compact`):
- **Hourglass** (default): ancestors above, descendants below, spouses beside.
- **Descendants**, **Ancestors / pedigree**, **Full forest** (every connected component, paged by component), **Family clusters** (each family drawn as a labelled, tinted container holding its members; **cross-family relationships drawn as bridge edges between containers**; a person in two families appears **once** in their primary cluster and as a **ghost node** (dashed outline, "also in Thomas family") in the second, linked by a dotted connector), **Fan chart** (ancestors, radial SVG, up to 6 generations), **Timeline** (generations as rows by birth year, scrollable).
- **List view** (`?view=list`): a fully keyboard- and screen-reader-navigable nested list of the same data. This is the accessible alternative; make it first-class, not an afterthought.

**Layout:** union-node layout. Persons and unions are graph nodes; edges: partner → union → child. Use ELK layered (direction DOWN) in a Web Worker with generation partitioning; keep partners adjacent, order siblings by birth date, place multiple unions of one person on alternating sides. Clusters are drawn as background rounded rectangles computed from member node bounds (not enforced by layout); in cluster mode run layout per cluster and place clusters with a second pass to minimise bridge-edge crossings. Acceptance: the showcase seed (§9) renders with no overlapping nodes, no edge passing through a node, siblings ordered, at all three widths.

**Node card** (token-styled): avatar or initials, display name, life span ("1952 – 2019" via the date formatter), badges: primary family, head of family, deceased (muted, never illegible), "Not a member" (outline), "Private" (masked), a small dot for incomplete data. Three density levels (dot, compact, full).

**Edge styles + legend:** parent→child solid; spouse/partner as a short horizontal bar to the union node; **ended union** dashed with end-date tooltip; **adoptive/foster/guardian** dotted in `secondary`; **step** thin dashed; **family bridge** heavier, brand gradient, labelled ("Marriage alliance · 2018"), pending bridges are hollow with a clock icon. Always include a legend.

**Person panel:** summary, relationships grouped (parents, spouses/partners with status, children, siblings, step/adoptive/guardian), families (primary marked), key dates, notes (if `member.note`), actions: **Open profile**, **Focus tree here**, **How are we related?**, **Add relative**, **Edit**, **End union**, **Remove link**, **Report issue** (flag). Controls follow scopes.

**Search and filters:** search by name (debounced, highlights, dims the rest); filters: family, generation range, living/deceased, member/non-member, branch (paternal/maternal of the focus person), link status.

**How are we related?** pick any two people (person pickers) → the kinship path is drawn on the tree (path highlighted, others dimmed) plus a plain-language label and the path as a readable sentence ("Anna → mother of → Ben → spouse of → Carla").

**Cross-family explorer** `/app/tree/families`: a graph where each node is a family (size by member count, tint by status) and each edge a link (style by type/status). Filters by type and status; click a family → its tree cluster; click a link → details with approvals, history and "End link".

**Add-relative wizard** (stepper): 1 relation type (with plain-language descriptions and a mini diagram) → 2 choose an existing person (async picker) **or** create a new relative (member invite is a separate flow; relatives need no email) → 3 family (existing, new, or "same as them") → 4 dates and status → 5 review with a **live preview of the change on the tree** and a list of warnings → save. Validation per §7.5. After saving, animate focus to the new node (respect reduced motion).

**Duplicates and merge** `/app/tree/duplicates`: ranked suggestions (similar names, same DOB, shared parents) → side-by-side compare with per-field choice → confirm with a summary of what moves → merge. Undo within the session via a toast (re-creates from the audit snapshot in mock mode).

**Export and share:** PNG, SVG, PDF poster (print stylesheet with paper sizes and legend), **GEDCOM 5.5.1** (`INDI`, `FAM` with `HUSB/WIFE/CHIL/MARR/DIV`, `BIRT/DEAT`, `FAMC` with `PEDI adopted|foster|…` for non-biological children, private persons exported as "Private"), and JSON. Include a client-side GEDCOM generator and its tests. *Shareable read-only link:* only if the backend supports share links for the tree; otherwise log a gap and hide the control.

**Stats strip:** people, generations, families, active links, pending links, oldest ancestor, longest line, living/deceased, births and anniversaries this month (with a gentle "Remembering" list for death anniversaries, opt-in per community).

**Performance:** virtualise off-viewport nodes, memoise layout, compute in a Web Worker, lazy-expand branches by depth (`tree.expand`), target **5,000 people at 60 fps** pan/zoom. Provide a synthetic 2,000- and 5,000-person generator in `src/mocks/synthetic.ts` (dev only) and a Playwright performance check.

**First-run empty state:** an illustrated "Start your family tree: add yourself, then your parents, spouse and children" flow that uses the add-relative wizard.

## 7.9 Household-view fallback (works with today's backend)

Feature detection: in live mode call `tree.stats` once; a `NOT_FOUND`/404 on the method (or a flag from the config) means **the Tree API is unavailable** → set `treeApi=false` for the session. In that case `/app/tree` renders a **Household view** built only from existing endpoints (`families.search`, `families.get`, `families.list_for_person`): families as cards, each with its roster arranged in **rows by relationship label** (`GRANDPARENT` → `FATHER/MOTHER/SPOUSE` → `SON/DAUGHTER/SIBLING` → `GRANDCHILD`, `OTHER` last), the primary family marked, and members who belong to several families shown with a "Also in …" chip that jumps to the other family. A banner explains "The full family tree needs the Family Tree service. Ask your administrator to enable it." (shown only to users with `family.edit`; others see a neutral note). All mutation controls that need the Tree API are hidden. The mock dev toolbar can toggle this.

## 7.10 Privacy in the tree

- Honour `Person.visibility` and `visibility_overrides`. A person the viewer may not see is a **masked node**: structure preserved (so the tree stays connected), but name "Private member", no photo, no dates, no contact data, no tooltip details, not searchable, excluded from exports as "Private". Masking happens **server-side in the payload** (mock mirrors it) and the UI must not try to unmask.
- Deceased relatives who are not members: visible to members of the family and staff; `PRIVATE` can be set on a relative too.
- DPDP/DSAR: erasure requests must remove or anonymise the person's relationships (the backend must cover edges, links and relatives; record this in the contract doc).
- Nothing personal in URLs except opaque ids. No analytics without recorded consent.

---

# 8. SITE MAP AND PAGE SPECIFICATIONS

## 8.1 Public marketing site (no login; SSR/SSG; per-page metadata, OpenGraph image via `next/og`, `sitemap.xml`, `robots.txt`, JSON-LD `Organization` + `SoftwareApplication`; Lighthouse performance ≥ 90, accessibility ≥ 95)

**Principle: the landing page is generic.** It speaks to *every* community type and never reads as a church-only product. Community-type pages live under `/for/<type>` and are generated from typed content files (`src/content/verticals/<key>.ts`) plus the vertical presets of §1.1, so adding a new community type means adding **one content file**, not a new page.

**Site map**

| Route | Purpose |
|---|---|
| `/` | Generic home (below) |
| `/for` | "Built for every kind of community" index of community types |
| `/for/church`, `/for/mosque`, `/for/temple` (temples, gurdwaras, monasteries), `/for/clubs`, `/for/family-associations`, `/for/alumni`, `/for/societies` (housing and resident welfare), `/for/charities` | **One landing page per community type** (template below) |
| `/mobile` | The mobile app: benefits, walkthrough, phone mockups |
| `/web` | The web app: benefits for leaders, admins, treasurers; walkthrough |
| `/features` | Every module in detail |
| `/family-tree` | The flagship family tree showcase with an interactive read-only demo |
| `/communities` | Directory of communities that opted in to be listed (registry/static config; honest empty state) |
| `/trust` | Security, privacy, tenant isolation, audit, consent and data requests |
| `/get-started` | Request a demo / set up your community (validated form; where it posts is a gap-log item; in mock mode it stores locally and shows a confirmation) |
| `/about`, `/contact`, `/privacy-policy`, `/terms`, `/cookies` | Standard pages (legal text clearly marked as placeholder until supplied) |
| `/signin` | Community-aware sign-in (§4) |
| `404`, `500`, `maintenance` | Branded states |

There is **no pricing page with invented prices**. `/get-started` says "Talk to us" and explains what to expect. **No fabricated testimonials, customer logos or statistics anywhere.** Where a scenario or screen is shown, label it "Illustrative example", and build "screenshots" by rendering the real design-system components with mock data inside device/browser frames (original CSS frames, no brand imitation). Store badges: do not link to stores you cannot verify; use "Ask us for early access" until real links are supplied via config (`NEXT_PUBLIC_IOS_URL`, `NEXT_PUBLIC_ANDROID_URL`; render the badge only when set).

### 8.1.1 `/` — the generic home page

Header: wordmark, nav (**Solutions ▾** listing every community type, Mobile, Web, Features, Family tree, Trust), theme toggle, **Sign in** (outline pill), **Get started** (filled pill with arrow).

1. **Hero** (brand-gradient glow + network motif): headline "One home for your whole community." Sub: "Members, events, giving, groups and family connections, on the web and in your pocket. For churches, mosques, temples, clubs, associations and more." CTAs: **Get started →** and **Find your community**. Below: a **type selector** of pill chips ("Churches · Mosques · Temples · Clubs · Family associations · Alumni · Societies · Charities"), each linking to its page; the hero art and one headline word rotate subtly through community types (respect `prefers-reduced-motion`: static).
2. **"Built for every kind of community"**: a grid of the type cards (icon, one-line promise, "See how it works →").
3. **Why communities choose VibeMind** (6 benefit cards, vertical-neutral): *Everyone in one place* (members, families, groups, guests); *Never miss a moment* (events, RSVPs, announcements, push notifications); *Contribute with confidence* (record gifts and dues, statements, receipts); *Connect people and families* (directory, household, **family tree**); *You stay in control* (roles and scopes, approvals, moderation, audit trail); *Private by design* (consent, visibility controls, data requests).
4. **Web + mobile, in sync** (two-column device showcase with an original laptop frame and phone frame showing the real components): left "On the web — for running the community" (dashboards, reports, bulk tools, ledger, approvals), right "On your phone — for being part of it" (feed, RSVP, give, prayer or support, family, notifications). A short comparison strip: "Same account, same data, same look, in light and dark."
5. **Feature tabs** (Members & families · Events · Community feed · Giving · Groups & teams · Documents & media · Bookings · Certificates): each tab shows an illustrative component composition and three bullets.
6. **Family tree highlight**: the network-motif tree animation (static under reduced motion), copy about connecting families across a community, link to `/family-tree`.
7. **How it works**: 1 *Set up your community* (name, accent colour, enabled modules) → 2 *Invite your people* → 3 *Run it together* (web for leaders, mobile for everyone).
8. **Trust strip**: separate data per community, role-based access, audit trail, consent and data requests, sign-in through a standards-based identity provider; link to `/trust`. (Claim only what §4–§6 verify.)
9. **FAQ** (accordion, JSON-LD FAQPage): Is it only for churches? (No.) Can one person belong to several communities? (Yes: switch from the app.) Does it take payments? (It *records* gifts and dues a person made through the community's own channel; it does not handle card or bank details.) Is our data separate from other communities? (Yes, each community has its own data and access rules.) Can we use our own colours? (Yes, per-community accent.) Which devices? (Web today; mobile app for Android and iOS, ask us for access.)
10. **Final CTA** band (gradient allowed here: no body text on it other than a short white headline with AA contrast) → **Get started**.
11. **Footer**: columns (Solutions, Product, Company, Legal), community directory link, **"Powered by Vibe Mind"** mark → https://vibemindsolutions.ai.

### 8.1.2 `/for/<type>` — the community-type landing page template

Every page is rendered from `src/content/verticals/<key>.ts` and **must showcase the benefits of using the web app AND the mobile app for that type of community**. The template, in order:

1. **Hero:** type-specific headline and sub (for example "Your mosque, connected." / "Run your club without the spreadsheets." / "Keep every branch of the family close."), primary CTA (**Get started**), secondary CTA ("See the mobile app" → `/mobile`), illustration variant for that type (original inline SVG scene or composition; no stock photos, no religious imagery beyond a neutral, respectful, abstract symbol-free motif), accent colour preview (the preset's accent applied to the hero via tokens).
2. **"Why [type] communities choose VibeMind":** 6–8 benefit cards written in that type's own vocabulary (see briefs below), each tied to a real module.
3. **"On the web — for leaders and administrators"** (benefits block): the tasks admins and officers do on the web for that type, each as a mini-card with an illustrative screenshot built from real components: dashboard and reports, member and household management, event and series planning, giving/dues ledger and statements, announcements and approvals, documents and media library, roles and audit, family tree administration. Include a short "Saves you …" line per card (qualitative; no invented numbers).
4. **"On your phone — for every member"** (benefits block): the same community in a pocket: community feed, event RSVP and reminders, push notifications, giving record and statement, household and family view, directory (respecting privacy), groups and teams, support/prayer requests where the preset enables them, certificates and documents, dark mode, switch between communities. Show **2–3 phone frames** with real-component screens (feed, event with RSVP, giving statement). Only claim mobile capabilities listed in this file.
5. **Web vs mobile at a glance:** a two-column table "Best on the web" vs "Best on mobile", per persona (Member, Leader/Officer, Treasurer, Administrator).
6. **A day in the life** (three short illustrative scenarios, labelled "Illustrative example"): a Member, a Leader, a Treasurer or Admin, each moving between web and mobile in that type's vocabulary.
7. **Modules you get for [type]** (the preset's `enabledModules` as a visual checklist; modules not in the preset are omitted; optional ones marked "Optional").
8. **Family connections** block when `features.familyTree` is true (always for family associations): the tree/household story in that type's terms, linking to `/family-tree`.
9. **Privacy and control** block (consent, visibility, roles, audit) in plain words.
10. **FAQ specific to the type** (3–5 items) + **CTA band**.
11. **Related types** row.

**Content briefs per type** (write the real copy from these; keep faith-specific terms inside their own page; vocabulary in §1.1 applies):

- **Church** — benefits: *Know your flock* (members, households, guests and follow-up); *Services and events* (series, RSVP, serving rosters); *Giving and statements* (funds, tithes and offerings recorded, annual statements); *Prayer wall* (shared and private-to-clergy requests, answered marks); *Care and certificates* (pastoral signals such as absence reports for staff, baptism and marriage certificates); *Ministries and volunteers* (teams, rosters, accept/decline from the phone). Web emphasis: pastoral dashboard, ledger and reconciliation, series planning. Mobile emphasis: feed, prayer, RSVP, giving, serving invites.
- **Mosque** — benefits: *One notice board* (announcements, events, class and lecture schedules); *Committee and volunteers* (teams, rosters); *Donations and zakat/sadaqah records* (funds, receipts, statements; the product records contributions made through the community's own channels); *Education programmes* (events/series with registration); *Facilities* (hall and room bookings with approval); *Respectful by design* (privacy controls, gender-neutral defaults, no content assumptions). Do not show prayer-time calculation (out of scope; mention as "roadmap" only if you include a roadmap).
- **Temple / gurdwara / monastery** — benefits: *Festivals and programmes* (events, series, volunteer rosters); *Seva and volunteers*; *Offerings and donations records*; *Announcements and notices*; *Media and archives* (albums, documents); *Families and lineages* (household and family tree). Use the neutral "place of worship" vocabulary base; the page title still names the type.
- **Clubs** (sports, social, hobby) — benefits: *Memberships and dues* (membership types, status, dues recorded and reconciled); *Sessions and fixtures* (events, series, RSVP, attendance); *Squads and committees* (teams, rosters, roles); *Facility bookings* (courts, rooms; availability and approvals); *Club feed and polls* (posts, polls, reactions); *Sponsors and funds*. Prayer/reflection off.
- **Family associations** — benefits: *Every branch, one tree* (**full family tree**, households, cross-family links with approvals); *Reunions and gatherings* (events, RSVP, headcounts); *Contributions and welfare funds* (levies, welfare funds, statements); *Remembering together* (births, anniversaries, a gentle remembrance list); *Elders and conveners* (roles, approvals); *Photos and documents* (albums with consent, shared archives). This is the page that leads with the tree.
- **Alumni groups** — benefits: *Find your batch* (directory with privacy controls, groups per batch/chapter); *Reunions and chapters* (events, RSVP); *Giving back* (funds, drives, statements); *Mentoring and groups*; *Announcements and newsletters*; *Media archive*.
- **Societies (housing/resident welfare)** — benefits: *Residents and households* (members, families, units as households); *Notices and approvals*; *Facilities and bookings* (clubhouse, hall) with approval; *Dues and contributions records*; *Committees and rosters*; *Documents* (bylaws, minutes, with share links and expiry).
- **Charities** — benefits: *Supporters and volunteers*; *Campaigns and funds* (funds with progress, statements for donors); *Events and drives*; *Teams and rosters*; *Transparency* (reports, audit trail, annual statements); *Documents and media*. Never imply tax-receipt validity beyond "statements"; legal wording is a gap-log item.
- **Generic** — the home page copy; the preset used when a community has no type.

### 8.1.3 `/mobile` and `/web`

- **`/mobile`: "Your community in your pocket."** Hero with phone frames; **benefit sections each with a phone screen built from real components:** *Stay in the loop* (community feed, announcements, push notifications), *Never miss an event* (RSVP, reminders), *Give and track* (record a gift, statements), *Be part of a family* (household view, family tree), *Serve and support* (rosters, serving invites accept/decline, prayer or support requests where enabled), *Your identity, your choice* (privacy and consent, date/time preferences, dark mode), *More than one community* (switch between communities). A "What you need" block (sign in with your community account; Android and iOS availability on request). Technical honesty note: do not claim offline mode, in-app payments or features absent from §6.
- **`/web`: "Run your community with clarity."** Sections for leaders, treasurers, administrators: dashboards, reports with CSV export, member and household management, roles and scopes, approvals and moderation, ledger and statements, documents, audit trail, family tree administration (merge, links, export). A comparison "Web and mobile work together" linking to `/mobile`.

### 8.1.4 `/family-tree`, `/features`, `/trust`, `/communities`, `/get-started`

- **`/family-tree`**: hero with the network motif; an **interactive read-only demo tree** (a small fixture of ~30 fictional people across 3 families, clearly labelled "Illustrative sample") using the real tree components with pan/zoom, view switching and the kinship calculator; sections on cross-family links and approvals, privacy masking, deceased and non-member relatives, export (GEDCOM, PDF, image), and "who it's for" (family associations first; also churches, mosques, temples, societies, clubs optional).
- **`/features`**: one section per module with the verified capabilities from §6 (no invented ones).
- **`/trust`**: tenant separation, role/scope model, audit trail, consent and DSAR, uploads re-encoded and validated, identity via a standards-based provider, private files never cached by the browser, rate limiting. Plain language, with a "Report a security issue" mailto from config.
- **`/communities`**: opt-in directory (cards with name, type, accent, "Enter" link into sign-in with that community preselected); empty state if none; in mock mode the six samples.
- **`/get-started`**: form (community name, type select, your role, size band, email, message; validation; honeypot; success state); stored locally in mock mode; endpoint configurable (`NEXT_PUBLIC_LEAD_ENDPOINT`), otherwise `mailto:` fallback from config.

---

## 8.2 The signed-in app (`/app/**`)

Shell per §2.2. Route prefix includes the community in the URL: **`/c/<slug>/app/...`** (so links are shareable and bookmarkable and the community switcher is explicit). The nav is built from `preset.enabledModules` ∩ the caller's scopes. All labels come from the vocabulary resolver. Every page: loading skeleton, empty, error (with trace id and Retry), permission-denied. Mutations are optimistic where safe, with rollback and a toast.

| # | Page | Route (under `/c/<slug>/app`) | Scopes | What it contains |
|---|---|---|---|---|
| 1 | **Home / Dashboard** | `/` | `dashboard.view` | Stat cards from `dashboard.get_summary` (omit what the caller lacks), my summary (`get_my_summary`), upcoming events, recent activity (D-29-safe audit projection), membership growth and giving charts (staff/finance), birthdays and anniversaries from the tree, "my family" snapshot, quick actions (RSVP, give, post, add relative). Auto-refresh preference. |
| 2 | **Community feed** | `/community` | `feed.read` | The combined timeline (see §8.3). |
| 3 | **Family tree** | `/tree`, `/tree/person/[id]`, `/tree/families`, `/tree/links`, `/tree/duplicates`, `/tree/export` | `family.read` (+`family.edit` to change) | §7 in full. |
| 4 | **Families** | `/families`, `/families/[id]` | `family.read` | Search + filters + stat rail (`families.statistics`); detail: photo, address, head, roster with relationship labels and primary markers, linked families (when Tree API), tree preview, notes, add/remove/edit-label members, set primary, delete (confirm, soft). |
| 5 | **Members** | `/members`, `/members/[id]` | `member.read` (own profile via `profile.read_own`) | Directory (filters per §6.2, stat rail, export CSV with `member.export`), profile (identity, contact respecting visibility, **Household widget** from `families.list_for_person`, attendance history with `registration.read`, notes with `member.note`, positions, giving summary for finance roles), create/edit (Zod forms), status change with reason, delete. Visibility badges. |
| 6 | **Guests** | `/guests`, `/guests/[id]` | `guest.read` | Pipeline view (`INVITED → VISITED/DECLINED → CONVERTED`), follow-up actions, convert to member dialog. |
| 7 | **Events** | `/events`, `/events/[id]`, `/events/new`, `/events/series`, `/events/series/[id]` | `event.read` | List (collapsed series by default) + calendar month/week views, filters, stat row, detail (cover, attachments, organisers, sessions with capacity, RSVP block, roster for managers with check-in and no-show, attendance summary), create/edit, publish/cancel/complete, series with exceptions and generate occurrences. Public browse for guests (`get_public`). |
| 8 | **Groups** | `/groups`, `/groups/[id]` | `group.read` | Directory (privacy chips), my groups, detail tabs (About, Discussions feed, Members, Requests for managers), join/leave, manager actions, notification toggle. |
| 9 | **Prayer / support** | `/prayer` | `prayer.read` (feature gated by preset) | Shared wall, "I prayed/stood with" action (wording from vocabulary), my requests, create with visibility and anonymity, staff queue and mark answered. Gentle design; no counters shaming. |
| 10 | **Announcements** | `/announcements` | `announcement.read` | List with statuses and categories, detail with comments and reactions, create/publish/pin/archive. |
| 11 | **Giving** | `/giving` | `contribution.read_own` / `contribution.give` / `contribution.read` | Member: give (record) form, my contributions, my annual statement (print view). Finance: ledger with filters, record on behalf (donor picker), mark received, cancel with reason, funds with progress, trends chart, statements per person. Clear note that the site records, not processes, payments. |
| 12 | **Documents** | `/documents` | `document.read` | Library with categories and search, recent/popular rails, detail with versions and share links (expiry), upload with validation, publish/archive. |
| 13 | **Media** | `/media` | `media.read` | Albums and items, upload requiring **photo-consent** and **contains-minor** confirmation, lightbox, edit/delete. |
| 14 | **Facilities & bookings** | `/facilities`, `/bookings` | `facility.read`, `booking.read_own` | Facility cards with hours and availability calendar, request booking (conflict feedback), my bookings, approvals queue for managers (approve/decline with reason, no-show), statistics. |
| 15 | **Ministry / teams & serving** | `/teams`, `/serving` | `ministry.read`, `roster.respond` | Teams with members and roles, rosters per occurrence, assign/remind/remove for managers, **My serving** with accept/decline (reason) for everyone, attendance recording. |
| 16 | **Certificates** | `/certificates` | `certificate.read_own` / `certificate.read` | Mine (ISSUED/REVOKED, print view via `render_html`); staff register with statuses, create draft → issue → revoke, templates, numbering integrity report. |
| 17 | **Notifications** | `/notifications`, `/notifications/preferences` | `notification.read_own` | Inbox (unread filter, topics, mark read/all, delete), preferences per topic and channel with optimistic auto-save (no Save button). |
| 18 | **Me** | `/me`, `/me/privacy`, `/me/preferences` | `profile.read_own` | Profile view/edit (photo upload with magic-byte check), date/time format and theme/language preferences, **privacy hub**: consents (grant/withdraw), my data requests (export/erasure with status, download when fulfilled, cancel while submitted), visibility settings; my positions; my families and tree entry points. |
| 19 | **Admin** | `/admin/users`, `/admin/roles`, `/admin/positions`, `/admin/moderation`, `/admin/reports`, `/admin/audit`, `/admin/settings`, `/admin/hr`, `/admin/privacy` | per scope | Users and invitations (`membership.*`), roles and scope picker grouped by domain (`role.list_scopes`; system roles read-only), positions and assignments, moderation queue (flags, review decisions, rules), reports catalog/run/export, audit log viewer (filters, redaction per scope, trace id lookup), settings by category (including appearance and the community type), HR catalog and employees (compensation only with scope), DSAR processing and breach register. |

## 8.3 Community feed page (details)

- Source: `community_feed.search` with `types`, `media_only`, `group`/`groups_only`, **opaque cursor**, `limit=20`; infinite scroll plus a keyboard-reachable **Load more**; pull-to-refresh equivalent button. Pinned items first (server-ordered; never re-sort client-side).
- **Type filter chips** (All, Posts, Polls, Events, Announcements, Prayer or support where enabled) and a **Media only** toggle, plus a **Groups** chip (`groups_only`) and a group selector.
- **Cards by kind:** *post/poll* (author, time via formatter, expandable text, media grid with lightbox, YouTube link preview, inline poll with results bars after voting and Retry if results fail, reaction bar, comment count, share), *event* (premium card: cover, date block, venue, participant stack, RSVP button), *announcement* (author, pinned/featured badges, category), *prayer or support request* (body, participant stack, "I prayed"-style action; anonymous requests never show a requester).
- **Interactions:** reactions are **optimistic** with rollback, using the per-page summaries (never a per-card call); threaded comments with one-level replies and moderation states ("Awaiting approval" visible only to the author and moderators); share records a share and copies the link (handle `RATE_LIMITED`); report/flag dialog with reason; pin/feature/archive/delete **only when `viewer.*` allows** (hidden otherwise); edits and deletes refresh the affected lists immediately (invalidate queries; no stale lists).
- **Composers** (sheet on phone, dialog on desktop): *post* (text, up to the server's limits, attachments with magic-byte checks, YouTube URL, group, visibility) and *poll* (question, 2–N options); **drafts** and **My posts** (`my_drafts` by status with filters), **approval workflow**: composer shows `content_workflow.policy` hint ("Your post will be reviewed before it appears"), submit/withdraw, review queue for reviewers (`review_queue`, approve/reject with reason, history). A post that lost attachments is not published; editing keeps staged attachments; a failed load shows an error with Retry, never an empty savable form.
- **Post detail page** at a shareable URL `/community/post/[id]` with comments sorted oldest first, all controls from `viewer`.
- States: loading skeletons, empty ("Nothing here yet. Be the first to post."), error with Retry, **403 state when the caller lacks `feed.read`** (explain, no silent empty list).
- Optional later: a "Family milestones" feed card (births, anniversaries, new links), which would need a registered content kind on the backend; log as a proposal, do not build.

---

# 9. THE MOCK BACKEND AND SEED DATA

Location: `src/mocks/**` only. It is imported **only** by the mock `ApiClient`, never by live code paths (enforce with an ESLint `no-restricted-imports` rule and a bundle check that the live build contains no `src/mocks` code).

## 9.1 Behaviour requirements

- Implements, with the **same function names, argument names, envelopes, pagination, error codes and idempotency** as §4.4 and §6, every endpoint that a page in §8 calls, **plus** the whole Family Tree API of §7.4. Endpoints no page uses may be left unimplemented, returning `NOT_FOUND`.
- **Enforces scopes** per request from the active persona's role (§5.2) → `AUTH_SCOPE_DENIED` 403. Enforces `viewer` flags, row-level rules (members see only their own contributions/registrations/certificates; PRIVATE events hidden; SECRET groups hidden; anonymous prayers never expose the requester; comment visibility rule), soft deletes, `RECORD_IN_USE`, `DUPLICATE_MEMBER`, `CONFLICT_VERSION` on stale `doc_version`, `request_id` idempotency (24 h), server-side validation with `details`, `RATE_LIMITED` on shares (30/hour), the single-primary-family invariant, tree guardrails (§7.5) and privacy masking (§7.10).
- Latency simulation and failure injection controlled from the dev toolbar.
- State persisted in IndexedDB; "Reset demo data" regenerates from the seed. Time-based seeds are relative to "now" so the demo never looks stale.
- Multi-community: each of the six sample communities has its own dataset and `community_type`; switching community changes data, accent, vocabulary and modules.

## 9.2 Seed data (deterministic generator with a fixed RNG seed; **all names fictional**, diverse, respectful; no real people)

**Grace Community** (church; the full showcase; ~140 people):
- Persons with a realistic spread of ages, genders, statuses, visibilities (include 4 `PRIVATE`, 6 `STAFF`), photos as generated initials (no external images), 12 guests across the pipeline, 3 positions.
- **Six interconnected families for the Family Tree**, five generations, hand-authored so that every scenario is present:
  1. a patriarch/matriarch pair (deceased, **non-members**) at the root of Family A, with children and grandchildren;
  2. a **marriage alliance A–B** (current, 2018) and **B–C** (current, 2021), producing PENDING and ACTIVE family links (one pending approval is awaiting the persona "Tenant Admin" so the approval flow can be demoed);
  3. a **divorce** (ENDED union with end date) with a child in each remarriage, creating **half-siblings**;
  4. a **widow/widower remarriage** (WIDOWED → CURRENT) with **step-children**;
  5. an **adoption** (family A → D) and a **guardianship** (D → E);
  6. a person belonging to **two families** (primary in one);
  7. relatives who are **not members** (living spouse outside the community; a child under 5 with no account);
  8. **deceased** members and ancestors (with death dates), including a recent bereavement for the remembrance list;
  9. **masked** persons (PRIVATE) in the middle of a line so the structure stays connected;
  10. a **duplicate pair** (same person entered twice with slightly different names) for the merge demo;
  11. a **cousin-marriage-free** but rich cousin web (first, second, once-removed) for the calculator;
  12. a family with **no tree data yet** (only the flat roster) to demo the first-run state.
- Feed content: ~40 mixed items (posts with and without media, 4 polls, 8 events incl. a series, 6 announcements incl. pinned, 8 prayer requests incl. anonymous), comments (some `APPROVED`, some held for review), reactions, shares; 3 groups of different privacy; 5 drafts in different review states; a review queue with 3 items.
- 15 events across past and future with registrations, 2 series with exceptions; 4 funds; ~60 contributions across statuses and methods; 8 documents in 3 categories; 3 albums (~20 items, generated gradient images or inline SVG placeholders); 4 facilities with hours; 8 bookings; 4 ministry teams with rosters; 10 certificates (mixed statuses); 15 notifications; audit log rows for the above; 3 consents per person.

**The other five communities** (`harbor`, `pala`, `noor`, `riverside`, `kin`): smaller (20–40 people each) but each exercising its preset: `noor` (no prayer wall, "dua request" off, vocabulary mosque), `riverside` (squads, dues, bookings, tree off), `kin` (family association: the **largest and richest tree**, 8 families, 6 generations, 220 people, several pending links), `harbor` and `pala` (church variants, `pala` with the longest lineages).

**Synthetic performance sets** (dev only): `generateTree({people: 2000 | 5000})`.

## 9.3 Fixtures for live mode

Record or hand-write JSON fixtures that match §4.4/§6 shapes and use them in unit tests of the live `ApiClient` (envelope parsing, error mapping, pagination, BFF allow-list, session refresh logic). Include a fixture for each error code.

---

# 10. QUALITY BAR

- **Performance:** LCP < 2.5 s on the marketing pages (mobile profile), CLS < 0.1, JS for marketing pages < 150 kB gzipped (lazy-load the tree and charts), route-level code splitting for the app, images responsive and lazy, fonts preloaded.
- **Accessibility:** axe has zero serious/critical violations on every page in both themes; all flows keyboard-completable; focus management in dialogs/sheets; live regions for toasts; tree has the list alternative; colour never the only signal (status chips carry text/icons).
- **Responsive:** designed intentionally per width (not just shrunk): phone (bottom nav, sheets, card-tables), tablet, desktop (sidebar, dialogs, multi-column).
- **Security:** CSP, no secrets in the client bundle, input sanitisation (no `dangerouslySetInnerHTML` except for server-rendered certificate HTML which must be sanitised with DOMPurify and shown in a sandboxed iframe), upload validation by extension and magic bytes, file proxy allow-list, dependency audit (`npm audit` clean or documented).
- **i18n:** zero literals in JSX (lint), ICU plurals, dates/numbers/currency via `Intl` with the community's locale and the person's date/time preference, logical CSS properties; include a pseudo-locale (`en-XA`) test that proves nothing is hard-coded or clipped.
- **Testing (behavioural, not render-only).** Examples that must exist: an empty add-relative form does not call the API; a user without `family.edit` does not see "Add relative" and gets the explanation on the disabled control elsewhere; a masked person never shows name/photo/date in the DOM; a parent-child cycle is rejected with a friendly message; approving a family link updates both families' views; the feed reaction updates optimistically and rolls back on error; `RATE_LIMITED` on share shows the right message; the community switcher changes vocabulary, accent and data; the household fallback appears when the Tree API toggle is off; every vertical page renders with its own vocabulary and contains both the "On the web" and "On your phone" sections; no marketing page contains faith-specific words except its own vertical page (a lint test scans the built HTML).
- **Visual QA:** Playwright screenshots at 375/768/1440 × light/dark for **every route** (marketing, app, design-system), reviewed by you; fix what you see.

---

# 11. PHASES (finish and verify each before the next; report at the end of each)

**Phase 0 — Foundations (no features yet).** Repo, tooling, lint rules, tokens and themes, fonts, `ApiClient` + Zod + error mapping, vertical-preset system and vocabulary resolver, i18n skeleton, scope closure + `Can`, the mock backend skeleton (sessions, personas, community switching), dev toolbar, `/design-system` page with every component in both themes. Write `docs/ASSUMPTIONS.md` (list every "inferred" or "proposed" item: `community_type`, feed `type` strings, web OIDC client id, relative-person representation, tree scopes, lead endpoint, store links, vertical presets beyond church) and `docs/TREE-API-CONTRACT.md`.
*Acceptance:* typecheck, lint and tests green; design-system page screenshots reviewed in all 6 combinations; switching persona/community changes nav, accent and vocabulary.

**Phase 1 — Public marketing site.** All routes in §8.1 including the **generic home**, `/for` + **all eight community-type pages** (each with the web **and** mobile benefit blocks, per §8.1.2), `/mobile`, `/web`, `/features`, `/family-tree` (with the interactive demo as soon as Phase 3's renderer exists; use a static placeholder until then and note it), `/trust`, `/communities`, `/get-started`, legal, error pages; SEO, sitemap, JSON-LD; Lighthouse and axe.
*Acceptance:* home is vertical-neutral (a test asserts no faith-specific word appears on it); each `/for/<type>` uses its vocabulary and shows both benefit blocks; Lighthouse budgets met; screenshots reviewed.

**Phase 2 — App shell, auth and the everyday pages.** Sign-in and community picker, shell, Dashboard, Members, Families (roster-level), Guests, Events (+series, RSVP), Notifications, Me/Privacy.
*Acceptance:* behavioural tests for each page's permission states; both themes at 3 widths reviewed; forms validate before the network.

**Phase 3 — The Family Tree (flagship).** Renderer prototype and ADR, layout worker, all views, panel, search and filters, add-relative wizard, relationship calculator with tests, family links with approval flow, cross-family explorer, duplicates and merge, export (PNG/SVG/PDF/GEDCOM/JSON), list view, stats, household fallback, privacy masking, performance on 2,000 and 5,000 persons.
*Acceptance:* every guardrail in §7.5 has a failing-then-passing test; kinship tests in §7.6 pass; the showcase seed renders with no overlaps at three widths; 5,000-person pan/zoom meets the budget (record measurements); GEDCOM output re-parses with a GEDCOM parser in a test; list view is fully keyboard navigable.

**Phase 4 — Community and operations.** Community feed (+composers, drafts, approval workflow, post detail), Groups, Prayer/support, Announcements, Giving, Documents, Media, Facilities & bookings, Teams & serving, Certificates.
*Acceptance:* §8.3 behaviours verified; scope-gated controls verified per role; optimistic updates roll back on injected failures.

**Phase 5 — Admin.** Users, roles, positions, moderation, reports, audit, settings (including community type and appearance), HR, privacy operations (DSAR processing, breach register).
*Acceptance:* redaction by audit scope verified; system roles immutable; invites and role changes work in mock mode.

**Phase 6 — Live mode and release.** BFF (login, callback, session, refresh, exchange, proxy with allow-list, file proxy), live `ApiClient` tested against fixtures, Tree-API feature detection and fallback, `Dockerfile`, runbook, final full-site Playwright + axe + Lighthouse run, security pass, README (how to run each mode, personas, how to point live mode at a real backend, what is unverified).
*Acceptance:* live mode builds and passes fixture tests; docs complete; unverified items listed honestly.

---

# 12. HOW TO REPORT, AND WHAT "DONE" MEANS

At the end of every phase send a short report: what you built; the evidence (test output summary, the screenshot set you reviewed, measurements); what is **not verified** (always: live mode against the real backend); new entries in `docs/ASSUMPTIONS.md`; what you will do next. "Code-complete, QA-pending" is a **hold**, not a done.

The project is **done** when: all phases pass their acceptance checks; every route renders correctly at 375/768/1440 in both themes with no axe serious/critical violations; the generic home and all eight community-type pages exist and showcase both web and mobile benefits; the full Family Tree (with cross-family links) works end to end in mock mode; the household fallback works; every console error is fixed; `scripts/ci_gates.sh` is green; and the README tells a newcomer how to run mock mode in two commands and what remains to verify against the real backend.

**Begin with Phase 0 now.** Do not ask me for repository access or for files; if something is genuinely unspecified, choose the most conservative sensible default, record it in `docs/ASSUMPTIONS.md`, and continue.
