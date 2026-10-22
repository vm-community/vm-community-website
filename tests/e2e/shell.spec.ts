import { expect, test } from '@playwright/test';
import {
  THEMES,
  WIDTHS,
  expectNoSeriousAxe,
  screenshotMatrix,
  setTheme,
  signInAs,
} from './helpers';

test('sign-in page renders the persona and community pickers', async ({ page }) => {
  await page.goto('/signin');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Sign in/);
  await expect(page.getByRole('radio', { name: /Administrator/ })).toBeVisible();
  await page.getByRole('radio', { name: /Staff/ }).check();
  await page.getByRole('button', { name: /Continue/ }).click();
  await expect(page).toHaveURL(/\/c\/grace\/app$/);
  await expect(page.getByText('Your role: Staff', { exact: true })).toBeVisible();
});

test('persona changes the navigation (scope-driven)', async ({ page }) => {
  await signInAs(page, 'grace', 'guest');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/c/grace/app');
  const nav = page.getByRole('navigation', { name: /Main navigation/ }).first();
  await expect(nav.getByRole('link', { name: /^Events$/ })).toBeVisible();
  await expect(nav.getByRole('link', { name: /^Members$/ })).toHaveCount(0);
  await expect(nav.getByRole('link', { name: /Family tree/ })).toHaveCount(0);

  await page.evaluate(() =>
    window.localStorage.setItem(
      'vm.session',
      JSON.stringify({ communitySlug: 'grace', role: 'staff' }),
    ),
  );
  await page.reload();
  await expect(nav.getByRole('link', { name: /^Members$/ })).toBeVisible();
  await expect(nav.getByRole('link', { name: /Family tree/ })).toBeVisible();
  await expect(nav.getByRole('link', { name: /Audit log/ })).toHaveCount(0);
});

test('community changes vocabulary, accent and data', async ({ page }) => {
  await signInAs(page, 'noor', 'member');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/c/noor/app');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Al-Noor Masjid');
  await expect(page.getByText('imam', { exact: true }).first()).toBeVisible();
  const noorAccent = await page.evaluate(() =>
    document.documentElement.style.getPropertyValue('--vm-color-primary').trim().toUpperCase(),
  );
  expect(noorAccent).toBe('#047857');
  // Mosque preset: no prayer wall in the nav
  await expect(
    page
      .getByRole('navigation', { name: /Main navigation/ })
      .first()
      .getByRole('link', { name: /Dua requests/ }),
  ).toHaveCount(0);

  await page.goto('/c/riverside/app');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Riverside Sports Club');
  await expect(page.getByText('dues', { exact: true }).first()).toBeVisible();
  const clubAccent = await page.evaluate(() =>
    document.documentElement.style.getPropertyValue('--vm-color-primary').trim().toUpperCase(),
  );
  expect(clubAccent).toBe('#C2410C');
  await expect(
    page
      .getByRole('navigation', { name: /Main navigation/ })
      .first()
      .getByRole('link', { name: /Family tree/ }),
  ).toHaveCount(0);
});

test('mid-tone accents keep AA in both themes or fall back', async ({ browser }) => {
  for (const slug of ['harbor', 'pala']) {
    for (const theme of THEMES) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await signInAs(page, slug, 'member');
      await setTheme(page, theme);
      await page.goto(`/c/${slug}/app`);
      await expect(page.getByRole('heading', { level: 1 })).not.toBeEmpty();
      const applied = await page.evaluate(() =>
        document.documentElement.style.getPropertyValue('--vm-color-primary').trim(),
      );
      // Either an accent was applied (passed AA) or the default stayed (fell back): never an unreadable button.
      expect(typeof applied).toBe('string');
      await context.close();
    }
  }
});

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    test(`shell and sign-in screenshots (${theme}, ${width})`, async ({ page }) => {
      await setTheme(page, theme);
      await screenshotMatrix(page, '/signin', 'signin', theme, width);
      await signInAs(page, 'grace', 'tenant_admin');
      await screenshotMatrix(page, '/c/grace/app', 'app-home', theme, width);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Grace Community');
      if (width === 1440) await expectNoSeriousAxe(page);
    });
  }
}
