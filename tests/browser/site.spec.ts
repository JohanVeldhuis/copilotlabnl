import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const articles: { url: string; published: string; draft: boolean }[] = JSON.parse(await readFile('.generated/articles.json', 'utf8'));
const visibleArticles = articles.filter((article) => !article.draft && Date.parse(article.published) <= Date.now());
const futureArticles = articles.filter((article) => !article.draft && Date.parse(article.published) > Date.now());
const pages = ['/', '/artikelen/', '/onderwerpen/prompting/', '/zoeken/', ...visibleArticles.map((article) => article.url)];

test('homepage features only currently published articles', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-featured] article')).toHaveCount(visibleArticles.length);
  await expect(page.getByRole('link', { name: 'Archief' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: "Video's" })).toHaveCount(0);
  await expect(page.getByText('2024')).toHaveCount(0);
});

test('future articles do not have public routes', async ({ request }) => {
  for (const article of futureArticles) {
    expect((await request.get(article.url)).status(), article.url).toBe(404);
  }
});

test('removed archive and video routes return not found', async ({ request }) => {
  for (const url of ['/verhalen/', '/verhalen/een-goede-prompt/', '/posts/', '/videos/', '/informatie/2024/06/16/wat-is-een-goed-prompt-copy.html']) {
    expect((await request.get(url)).status(), url).toBe(404);
  }
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

test('published article pages contain current content', async ({ page }) => {
  await page.goto('/artikelen/een-goede-prompt/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Een goede prompt begint met een helder doel');
  await expect(page.getByText('Archief · 2024')).toHaveCount(0);
});

test('search finds current content and has an empty state', async ({ page }) => {
  await page.goto('/zoeken/');
  const input = page.getByRole('textbox');
  await input.fill('prompt');
  await expect(page.locator('.pagefind-ui__result')).toHaveCount(visibleArticles.length);
  await expect(page.locator('.pagefind-ui__result-link').first()).toHaveAttribute('href', /^\/artikelen\//);
  await input.fill('zzznietbestaandonderwerpzzz');
  await expect(page.getByText(/Geen resultaten voor/)).toBeVisible();
});

test('clipboard failure is explicit and prompt text stays selectable', async ({ page }) => {
  await page.goto('/artikelen/een-goede-prompt/');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Test denial')) } });
  });
  await page.getByRole('button', { name: 'Kopieer tekst', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Kopiëren mislukt — selecteer de tekst' })).toBeVisible();
  await expect(page.locator('pre code').first()).toContainText('Help me een werkoverleg');
});

test('articles work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4329/artikelen/een-goede-prompt/');
  await expect(page.locator('h1')).toContainText('prompt');
  await expect(page.locator('article')).toContainText('Vier onderdelen die richting geven');
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
