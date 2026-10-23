import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`every visit and reload starts with a tied envelope at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    // A marker saved by an older version must no longer skip the invitation.
    await page.addInitScript(() => {
      sessionStorage.setItem('little-secret-december-2026:opened', 'yes');
    });
    await page.goto('/#prediction');
    const dialog = page.getByRole('dialog');
    const open = page.getByRole('button', { name: 'Відкрити запрошення', exact: true });
    await expect(dialog).toBeVisible();
    await open.click();
    await expect(dialog).toHaveCount(0);

    await page.reload();
    await expect(dialog).toBeVisible();
    await expect(page.locator('.card-door-left')).toHaveCSS('transform', 'none');
    await expect(page.locator('.satin-loop-blue')).not.toHaveAttribute('transform', /matrix/);
    await expect(open).toBeEnabled();
    await open.click();
    await page.waitForTimeout(350);
    await page.reload();
    await expect(dialog).toBeVisible();
    await expect(page.locator('.card-door-left')).toHaveCSS('transform', 'none');
    await expect(page.locator('.satin-loop-blue')).not.toHaveAttribute('transform', /matrix/);
    await open.click();
    await expect(dialog).toHaveCount(0);

    await page.goto('/');
    await expect(dialog).toBeVisible();
    await expect(open).toBeInViewport();
    await expect(open).toBeEnabled();
  });
}

test('satin bow unties before the doors open; replay and interrupted opening reset', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.satin-bow image').first()).toHaveAttribute('href', '/images/satin-bow.webp');
  const before = await page.locator('.satin-loop-blue').getAttribute('transform');
  await page.getByRole('button', { name: 'Відкрити запрошення', exact: true }).click();
  await page.waitForTimeout(400);
  expect(await page.locator('.satin-loop-blue').getAttribute('transform')).not.toBe(before);
  await expect(page.locator('.card-door-left')).toHaveCSS('transform', 'none');
  await expect(page.locator('.invitation-content > button')).toBeDisabled();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Відкрити запрошення ще раз' }).click();
  await expect(page.locator('.satin-loop-blue')).not.toHaveAttribute('transform', /matrix/);
  await page.getByRole('button', { name: 'Відкрити запрошення', exact: true }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Перейти до запрошення', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.hero-title')).toHaveCSS('opacity', '1');
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`bow and invitation button stay separate at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const bow = await page.locator('.satin-bow').boundingBox();
    const button = await page.locator('.invitation-content > button').boundingBox();
    expect(bow!.y + bow!.height).toBeLessThan(button!.y);
    expect(button!.y + button!.height).toBeLessThanOrEqual(844);
  });
}
