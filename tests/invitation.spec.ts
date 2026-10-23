import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function openSite(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Перейти до запрошення', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.hero-title')).toHaveCSS('opacity', '1');
}

test('invitation opens with keyboard, focus is contained, and replay works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Відкрити запрошення', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Перейти до запрошення', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Відкрити запрошення', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('button', { name: 'Відкрити запрошення ще раз' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`responsive composition at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 768 ? 1000 : 844 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `output/qa/intro-${width}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button', { name: 'Перейти до запрошення', exact: true }).click();
    await expect(page.locator('.hero-title')).toHaveCSS('opacity', '1');
    await expect(page.locator('.hero-art img')).toHaveCSS('opacity', '1');
    expect((await page.locator('.header-cta').boundingBox())!.height).toBeLessThanOrEqual(48);
    await page.screenshot({ path: `output/qa/hero-${width}.png` });
    for (const selector of [
      '#story',
      '#prediction',
      '#details',
      '#schedule',
      '#rsvp',
      '.closing',
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
    }
    await expect(page.locator('.story-letter')).toHaveCSS('opacity', '1');
    await expect(page.locator('.closing-art')).toHaveCSS('opacity', '1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const overlaps = await page.evaluate(() => {
      const heading = document.querySelector('.hero-title')!.getBoundingClientRect();
      const description = document.querySelector('.hero-description')!.getBoundingClientRect();
      return heading.bottom > description.top;
    });
    expect(overlaps).toBe(false);
    for (const card of await page.locator('.prediction-card').all()) {
      const text = await card.locator('.choice-name').boundingBox();
      const box = await card.boundingBox();
      expect(text!.x).toBeGreaterThanOrEqual(box!.x);
      expect(text!.x + text!.width).toBeLessThanOrEqual(box!.x + box!.width + 1);
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `output/qa/full-${width}.png`, fullPage: true });
  });
}

test('prediction persists, can change, and never fabricates global votes', async ({ page }) => {
  await openSite(page);
  await page.getByRole('button', { name: /Хлопчик/ }).click();
  await expect(
    page.getByText('Ваш прогноз збережено! Скоро дізнаємося, хто мав рацію.'),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Хлопчик/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: /Дівчинка/ }).click();
  await expect(page.getByRole('button', { name: /Хлопчик/ })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await page.reload();
  await expect(page.getByRole('button', { name: /Дівчинка/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('#prediction')).not.toContainText('%');
});

test('balloon flight rises, handles repeat choices, and stops when motion is reduced', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openSite(page);
  const boy = page.getByRole('button', { name: /Хлопчик/ });
  const girl = page.getByRole('button', { name: /Дівчинка/ });
  await boy.click();
  const flying = page.locator('.balloon-flight-art');
  await expect(page.locator('.balloon-flight')).toHaveAttribute('data-team', 'boy');
  const start = (await flying.boundingBox())!;
  await expect.poll(async () => (await flying.boundingBox())!.y).toBeLessThan(start.y - 40);

  await girl.click();
  await expect(page.locator('.balloon-flight')).toHaveCount(1);
  await expect(page.locator('.balloon-flight')).toHaveAttribute('data-team', 'girl');
  await boy.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await expect(page.locator('.balloon-flight')).toHaveCount(1);
  await expect(page.locator('.balloon-flight')).toHaveAttribute('data-team', 'boy');
  await expect(boy).toHaveAttribute('aria-pressed', 'true');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.balloon-flight')).toHaveCount(0);
  await expect(boy.locator('.balloon')).toHaveCSS('opacity', '1');
  await girl.click();
  await expect(page.locator('.balloon-flight')).toHaveCount(0);
  await expect(girl).toHaveAttribute('aria-pressed', 'true');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await girl.click();
  await expect(page.locator('.balloon-flight')).toHaveCount(1);
  await expect(page.locator('.balloon-flight')).toHaveCount(0);
  await expect(girl.locator('.balloon')).toHaveCSS('opacity', '1');
  await page.reload();
  await expect(girl).toHaveAttribute('aria-pressed', 'true');
});

test('RSVP validates, saves, reloads, and edits yes to no', async ({ page }) => {
  await openSite(page);
  await page.getByRole('button', { name: 'Зберегти мою відповідь', exact: true }).click();
  await expect(page.getByText('Оберіть, чи зможете ви бути з нами.')).toBeVisible();
  await expect(page.getByText('Введіть своє ім’я — щонайменше 2 символи.')).toBeVisible();
  await page.getByLabel('Так, із радістю!').check();
  await page.getByLabel('Ваше ім’я').fill('  Євгенія  ');
  await page.getByLabel('Кілька теплих слів').fill('Нехай щастя буде безмежним!');
  await page.getByRole('button', { name: 'Зберегти мою відповідь', exact: true }).click();
  await expect(page.locator('.rsvp-success')).toContainText('Євгенія!');
  await expect(page.locator('.rsvp-success')).toContainText('До зустрічі');
  await page.reload();
  await expect(page.locator('.rsvp-success')).toContainText('Нехай щастя буде безмежним!');
  await page.getByRole('button', { name: 'Змінити відповідь' }).click();
  await expect(page.getByLabel('Ваше ім’я')).toHaveValue('Євгенія');
  await page.getByLabel('На жаль, не зможу').check();
  await page.getByRole('button', { name: 'Зберегти зміни' }).click();
  await expect(page.locator('.rsvp-success')).toContainText('Дякуємо вам');
  await expect(page.locator('.local-notice')).toContainText('не надсилається організаторам');
  await page.screenshot({ path: 'output/qa/rsvp-saved.png', fullPage: false });
});

test('calendar download is valid UTF-8 ICS, UTC time, escaped and folded', async ({ page }) => {
  await openSite(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Додати в календар' }).click();
  const download = await downloadPromise;
  const file = await download.path();
  expect(download.suggestedFilename()).toBe('malenkyi-sekret.ics');
  const content = await readFile(file!, 'utf8');
  expect(content).toContain('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n');
  expect(content).toContain('DTSTART:20270612T120000Z\r\n');
  expect(content).toContain('DTEND:20270612T153000Z\r\n');
  expect(content).toMatch(/UID:[^\r\n]+/);
  expect(content).toContain('END:VEVENT\r\nEND:VCALENDAR\r\n');
  expect(content.split('\r\n').every((line) => Buffer.byteLength(line, 'utf8') <= 75)).toBe(true);
  expect(content.replace(/\r\n /g, '')).toContain('Маленький секрет — наше особливе свято');
  expect(content.replace(/\r\n /g, '')).toContain(
    'LOCATION:Forrest Club\\, Київ\\, просп. Литовський\\, 20а',
  );
  await expect(page.getByRole('link', { name: 'Прокласти маршрут' })).toHaveAttribute(
    'href',
    'https://maps.app.goo.gl/oD5vNiK7MRuttKxy8',
  );
  await expect(page.getByRole('link', { name: 'Сайт ресторану' })).toHaveAttribute(
    'href',
    'https://forrestclub.com.ua/',
  );
});

test('touch menu, navigation, prediction and form work on a mobile viewport', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5186');
  await page.getByRole('button', { name: 'Відкрити запрошення', exact: true }).tap();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Відкрити меню' }).tap();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('link', { name: 'Ваш прогноз', exact: true }).tap();
  await expect(page.getByRole('navigation')).not.toBeVisible();
  await page.getByRole('button', { name: /Дівчинка/ }).tap();
  await expect(page.getByRole('button', { name: /Дівчинка/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.locator('#rsvp').scrollIntoViewIfNeeded();
  await page.getByLabel('Так, із радістю!').check();
  await page.getByLabel('Ваше ім’я').fill('Ілля');
  await page.getByRole('button', { name: 'Зберегти мою відповідь', exact: true }).tap();
  await expect(page.locator('.rsvp-success')).toContainText('Ілля!');
  await context.close();
});

test('reduced motion supports instant opening and keeps all content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Відкрити запрошення', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
  expect(
    await page.evaluate(
      () => document.querySelector('.journey-ribbon path')?.getAttribute('style') ?? '',
    ),
  ).not.toContain('stroke-dashoffset');
  await expect(page.locator('.story-letter')).toHaveCSS('opacity', '1');
  await expect(page.locator('.closing-art')).toHaveCSS('opacity', '1');
});

test('blocked storage and malformed saved data fail gracefully', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('little-secret-december-2026:rsvp:v1', '{bad json');
    localStorage.setItem('little-secret-december-2026:prediction:v1', '{"bad":true}');
    Storage.prototype.setItem = () => {
      throw new DOMException('Blocked', 'SecurityError');
    };
  });
  await openSite(page);
  await page.getByRole('button', { name: /Хлопчик/ }).click();
  await expect(page.locator('.prediction-feedback')).toContainText('Браузер не дозволив зберегти');
  await page.getByLabel('Так, із радістю!').check();
  await page.getByLabel('Ваше ім’я').fill('Олена');
  await page.getByRole('button', { name: 'Зберегти мою відповідь', exact: true }).click();
  await expect(page.locator('.storage-warning')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('countdown ticks and has a finished state without negative values', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.setFixedTime(new Date('2027-06-12T11:59:58Z'));
  await openSite(page);
  await expect(page.getByRole('timer')).toContainText('02');
  await page.clock.setFixedTime(new Date('2027-06-12T12:00:01Z'));
  await expect(page.locator('.countdown-finished')).toHaveText('Наш особливий день настав ♡');
});

test('mobile menu closes with Escape and returns keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openSite(page);
  await page.getByRole('button', { name: 'Відкрити меню' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Відкрити меню' })).toBeFocused();
  await expect(page.getByRole('navigation')).not.toBeVisible();
});

test('short landscape invitation remains usable', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Відкрити запрошення', exact: true }),
  ).toBeInViewport();
  await expect(
    page.getByRole('button', { name: 'Перейти до запрошення', exact: true }),
  ).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('Ukrainian glyphs load in both local typefaces', async ({ page }) => {
  await openSite(page);
  const fonts = await page.evaluate(async () => {
    const faces = [
      '400 16px "Cormorant Garamond"',
      'italic 400 16px "Cormorant Garamond"',
      '400 16px "Manrope Variable"',
    ];
    await Promise.all(faces.map((face) => document.fonts.load(face, 'Ґґ Єє Іі Її')));
    return faces.map((face) => document.fonts.check(face, 'Ґґ Єє Іі Її'));
  });
  expect(fonts).toEqual([true, true, true]);
});

test('accessibility audit for invitation, page, and saved form', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const intro = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(intro.violations).toEqual([]);
  await page.getByRole('button', { name: 'Перейти до запрошення', exact: true }).click();
  const all = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  await test.info().attach('axe-main', {
    body: JSON.stringify(all.violations, null, 2),
    contentType: 'application/json',
  });
  expect(all.violations).toEqual([]);
  await page.getByLabel('Так, із радістю!').check();
  await page.getByLabel('Ваше ім’я').fill('Ґеннадій');
  await page.getByRole('button', { name: 'Зберегти мою відповідь', exact: true }).click();
  const saved = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(saved.violations).toEqual([]);
});
