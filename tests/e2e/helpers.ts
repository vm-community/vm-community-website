import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export const WIDTHS = [375, 768, 1440] as const;
export const THEMES = ['light', 'dark'] as const;

export async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.addInitScript((t) => {
    window.localStorage.setItem('vm.theme', t);
  }, theme);
}

export async function screenshotMatrix(
  page: Page,
  path: string,
  name: string,
  theme: 'light' | 'dark',
  width: number,
): Promise<void> {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path, { waitUntil: 'load' });
  await page.locator('h1').first().waitFor({ state: 'visible' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  // Chromium cannot capture taller than 16384 px in one image
  await page.screenshot({
    path: `screenshots/${name}-${theme}-${width}.png`,
    fullPage: true,
    clip: { x: 0, y: 0, width, height: Math.min(height, 16000) },
  });
}

export async function expectNoSeriousAxe(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(
    serious,
    JSON.stringify(
      serious.map((v) => ({
        id: v.id,
        help: v.help,
        nodes: v.nodes.slice(0, 3).map((n) => n.target),
      })),
      null,
      2,
    ),
  ).toEqual([]);
}

/** Collects console errors and page errors for the duration of a test. */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}
