import { expect, test } from '@playwright/test';
import {
  THEMES,
  WIDTHS,
  collectErrors,
  expectNoSeriousAxe,
  screenshotMatrix,
  setTheme,
} from './helpers';

const TYPE_SLUGS = [
  'church',
  'mosque',
  'temple',
  'clubs',
  'family-associations',
  'alumni',
  'societies',
  'charities',
];
const ROUTES = [
  '/',
  '/for',
  ...TYPE_SLUGS.map((s) => `/for/${s}`),
  '/mobile',
  '/web',
  '/features',
  '/family-tree',
  '/trust',
  '/communities',
  '/get-started',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/cookies',
  '/maintenance',
];

const FAITH_WORDS = [
  'parish',
  'pastor',
  'priest',
  'tithe',
  'baptism',
  'clergy',
  'masjid',
  'imam',
  'zakat',
  'sadaqah',
  'nikah',
  'dua',
  'gurdwara',
  'monastery',
  'seva',
  'puja',
];

test('home page is vertical-neutral (no faith-specific words in the HTML, nouns only in the type list)', async ({
  page,
}) => {
  await page.goto('/');
  const text = (await page.locator('body').innerText()).toLowerCase();
  const words = new Set(text.match(/[a-z']+/g) ?? []);
  for (const w of FAITH_WORDS) expect(words.has(w), `home contains "${w}"`).toBe(false);
});

test('non-faith marketing pages contain no faith-specific words', async ({ page }) => {
  for (const route of [
    '/mobile',
    '/web',
    '/features',
    '/family-tree',
    '/trust',
    '/get-started',
    '/for/clubs',
    '/for/alumni',
  ]) {
    await page.goto(route);
    const text = (await page.locator('body').innerText()).toLowerCase();
    const words = new Set(text.match(/[a-z']+/g) ?? []);
    for (const w of [...FAITH_WORDS, 'church', 'mosque', 'temple']) {
      // The header "Solutions" menu and footer legitimately list every type name (plural); singular faith nouns must not appear in the body.
      if (['church', 'mosque', 'temple'].includes(w) && route.startsWith('/for/')) continue;
      expect(words.has(w), `${route} contains "${w}"`).toBe(false);
    }
  }
});

for (const slug of TYPE_SLUGS) {
  test(`/for/${slug} shows both the web and the phone benefit blocks in its own vocabulary`, async ({
    page,
  }) => {
    await page.goto(`/for/${slug}`);
    await expect(
      page.getByRole('heading', { name: /On the web — for leaders and administrators/ }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /On your phone — for every member/ }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /Web vs mobile at a glance/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /A day in the life/ })).toBeVisible();
    await expect(page.locator('figure').first()).toBeVisible();
  });
}

test('get-started form validates before anything is sent', async ({ page }) => {
  await page.goto('/get-started');
  await page.getByRole('button', { name: /^Send/ }).click();
  await expect(page.getByRole('alert').first()).toBeVisible();
  await page.getByLabel(/Community name/).fill('Riverside Sports Club');
  await page.getByLabel(/Your email/).fill('officer@example.com');
  await page.getByRole('button', { name: /^Send/ }).click();
  await expect(page.getByText(/Thank you/)).toBeVisible();
});

test('sitemap and robots are served', async ({ request }) => {
  const sm = await request.get('/sitemap.xml');
  expect(sm.ok()).toBe(true);
  expect(await sm.text()).toContain('/for/family-associations');
  const rb = await request.get('/robots.txt');
  expect(await rb.text()).toContain('Disallow: /c/');
});

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    test(`marketing screenshots (${theme}, ${width})`, async ({ page }) => {
      test.setTimeout(180_000);
      await setTheme(page, theme);
      const errors = collectErrors(page);
      for (const route of ROUTES) {
        const name = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-');
        await screenshotMatrix(page, route, `mk-${name}`, theme, width);
        if (width === 1440) await expectNoSeriousAxe(page);
      }
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
}
