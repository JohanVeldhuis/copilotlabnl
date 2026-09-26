import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const originalPath = '/informatie/2024/06/16/wat-is-een-goed-prompt-copy.html';
const pages = ['/', '/verhalen/een-goede-prompt/', originalPath, '/videos/TmdXWvRIGu0/', '/verhalen/', '/zoeken/'];

test('all original URLs are actual files and served without folder redirects', async ({ request }) => {
  const stories: { status: string; url: string }[] = JSON.parse(await readFile('.generated/stories.json', 'utf8'));
  for (const story of stories.filter((story) => story.status === 'archived')) {
    expect((await stat(path.join('dist', story.url))).isFile()).toBeTruthy();
    const response = await request.get(story.url, { maxRedirects: 0 });
    expect(response.status(), story.url).toBe(200);
    expect(await response.text()).toContain('Uit het archief');
  }
});

test('homepage features only refreshed stories and links to the archive', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-featured] [data-editorial-status="archived"]')).toHaveCount(0);
  await expect(page.locator('[data-featured] [data-editorial-status="refreshed"]')).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Het archief blijft open.' })).toHaveAttribute('href', '/posts/');
});

test('homepage transfer and first-party script budgets remain bounded', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const transfer = await page.evaluate(() =>
    [...performance.getEntriesByType('navigation'), ...performance.getEntriesByType('resource')]
      .reduce((sum, entry) => sum + (entry as PerformanceResourceTiming).transferSize, 0));
  expect(transfer).toBeGreaterThan(0);
  expect(transfer).toBeLessThanOrEqual(800 * 1024);
  const scripts = (await readdir('dist/_astro')).filter((file) => file.endsWith('.js'));
  const compressed = await Promise.all(scripts.map(async (file) => gzipSync(await readFile(path.join('dist/_astro', file))).length));
  expect(compressed.reduce((total, bytes) => total + bytes, 0)).toBeLessThanOrEqual(50 * 1024);
});

test('original prompts and all four video facades render with historical context', async ({ page }) => {
  await page.goto(originalPath);
  await expect(page.locator('[data-video]')).toHaveCount(4);
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.getByText('Uit het archief · 2024', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Lees de redactioneel vernieuwde uitleg →' })).toHaveAttribute('href', '/verhalen/een-goede-prompt/');
  await expect(page.locator('#de-componenten')).toBeVisible();
});

test('video does not contact third parties before activation and keeps a recovery link', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4329')) external.push(request.url());
  });
  await page.goto('/videos/TmdXWvRIGu0/');
  await page.waitForLoadState('networkidle');
  expect(external).toEqual([]);
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.route('https://www.youtube-nocookie.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Test player</title>' }));
  await page.getByRole('button', { name: /Speel video/ }).click();
  await expect(page.locator('iframe')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/TmdXWvRIGu0?autoplay=0');
  await expect(page.getByRole('link', { name: 'Open deze video op YouTube ↗' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=TmdXWvRIGu0');
});

test('search finds current and archived content and has an empty state', async ({ page }) => {
  await page.goto('/zoeken/');
  const input = page.getByRole('textbox');
  await input.fill('prompt');
  await expect(page.locator('.pagefind-ui__result').first()).toBeVisible();
  await expect(page.locator('.pagefind-ui__result-link').first()).toHaveAttribute('href', /^\//);
  await input.fill('zzznietbestaandonderwerpzzz');
  await expect(page.getByText(/Geen resultaten voor/)).toBeVisible();
});

test('clipboard failure is explicit and prompt text stays selectable', async ({ page }) => {
  await page.goto('/verhalen/een-goede-prompt/');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Test denial')) } });
  });
  await page.getByRole('button', { name: 'Kopieer tekst', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Kopiëren mislukt — selecteer de tekst' })).toBeVisible();
  await expect(page.locator('pre code').first()).toContainText('Help me een werkoverleg');
});

test('reading and direct video links work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4329${originalPath}`);
  await expect(page.locator('h1')).toContainText('prompt');
  await expect(page.getByRole('button', { name: /Speel video/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Open deze video op YouTube ↗' })).toHaveCount(4);
  await context.close();
});

test('representative templates have no serious accessibility violations or overflow', async ({ page }) => {
  for (const url of pages) {
    await page.goto(url);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.filter((issue) => ['critical', 'serious'].includes(issue.impact || '')), url).toEqual([]);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${url} at ${width}px`).toBeTruthy();
    }
  }
});

test('all generated internal links, images and fragment targets resolve', async ({ request }) => {
  async function walk(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
    return nested.flat();
  }
  const files = (await walk('dist')).filter((file) => file.endsWith('.html'));
  const targets = new Set<string>();
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    for (const [, value] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) targets.add(value.replace(/&amp;/g, '&'));
  }
  for (const target of targets) {
    const url = new URL(target, 'http://127.0.0.1:4329');
    const response = await request.get(url.pathname + url.search);
    expect(response.status(), target).toBe(200);
    if (url.hash) {
      const html = await response.text();
      expect(html, target).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`);
    }
  }
});
