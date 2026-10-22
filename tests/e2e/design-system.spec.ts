import { expect, test } from '@playwright/test';
import {
  THEMES,
  WIDTHS,
  collectErrors,
  expectNoSeriousAxe,
  screenshotMatrix,
  setTheme,
} from './helpers';

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    test(`design system renders (${theme}, ${width})`, async ({ page }) => {
      await setTheme(page, theme);
      const errors = collectErrors(page);
      await screenshotMatrix(page, '/design-system', 'design-system', theme, width);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Design system/);
      const bg = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--vm-color-bg')
          .trim()
          .toUpperCase(),
      );
      const expanded = bg.length === 4 ? `#${bg[1]}${bg[1]}${bg[2]}${bg[2]}${bg[3]}${bg[3]}` : bg;
      expect(expanded).toBe(theme === 'dark' ? '#0F172A' : '#FFFFFF');
      expect(errors, errors.join('\n')).toEqual([]);
      if (width === 1440) await expectNoSeriousAxe(page);
    });
  }
}
