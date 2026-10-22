# vm-community-web

The public website for **VibeMind Community**, a product of
[Vibe Mind AI Solutions](https://vibemindsolutions.ai).

It contains a generic, vertical-neutral home page, one landing page per community type, and
product, trust and sign-up pages. The signed-in app is **not part of this build**.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Docker:

```bash
docker build -t vm-community-web .
docker run --rm -p 3000:3000 vm-community-web
```

## Pages

- `/` home
- `/for` community types index
- `/for/church`, `/for/mosque`, `/for/temple`, `/for/clubs`, `/for/family-associations`, `/for/alumni`, `/for/societies`, `/for/charities`
- `/mobile`, `/web`, `/features`, `/family-tree`, `/trust`, `/communities`
- `/get-started` sign-up
- `/about`, `/contact`
- `/privacy-policy`, `/terms`, `/cookies` (placeholder text, see `docs/ASSUMPTIONS.md`)
- `/signin` hands over to the app when `NEXT_PUBLIC_APP_URL` is set
- `/maintenance`
- `/sitemap.xml`, `/robots.txt`

## Adding a community type

1. Add a file for the new type in `src/content/verticals/`.
2. Register it in `src/content/verticals/index.ts`.

## Scripts

| Command             | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Next.js development server                       |
| `npm run build`     | Production build                                 |
| `npm run typecheck` | `tsc --noEmit`                                   |
| `npm run lint`      | ESLint (token and i18n rules) and CSS token scan |
| `npm test`          | Vitest unit tests                                |
| `npm run e2e`       | Playwright end-to-end tests                      |
| `npm run gates`     | All CI gates (`scripts/ci_gates.sh`)             |

## Configuration

See `.env.example`. All variables are optional. They cover the lead endpoint, contact email,
app-store links and the app URL.

## Design system

- Design tokens live only in `src/styles/tokens.css` and `src/styles/tokens.ts`.
- Tailwind is mapped to those tokens.
- Lint forbids raw colour and size literals, and literal JSX text.
- Copy lives in `src/messages/en.json` and `src/content/`.

## Not done / not verified

See `docs/ASSUMPTIONS.md` for the assumptions log and the open gaps that need product owner input.
