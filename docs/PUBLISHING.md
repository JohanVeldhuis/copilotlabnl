# Publishing Copilot Lab

GitHub Pages publishes the Astro site from `dist`. A push to `main` runs the production workflow; pull requests run validation without publishing.

## Local commands

Use Node 22.12 or newer, with the committed npm lockfile:

```powershell
npm ci
npm run check
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

Open <http://127.0.0.1:4321/>. VS Code also provides **Build Copilot Lab** and **Preview Copilot Lab** tasks.

The build validates source content, generates SVGs and a PNG social image locally, builds Astro, and indexes articles with Pagefind. No image API, AI model call or external metadata request occurs during a normal build. Installing npm dependencies initially requires internet access.

For browser tests:

```powershell
npx playwright install chromium
npm run test:browser
```

The browser runner starts and stops its own preview on port 4329. Run the build first. `npm run validate` runs type checks, unit tests, build and browser tests together.

`npm run dev` is useful for layout work. Use the **built preview** to test search and generated routes. Content metadata is generated at startup: after editing Markdown, rerun `npm run prepare:content` or restart the dev task. Ordinary Astro/CSS changes hot-reload.

## New article

Create a Markdown file in [src/content/articles](../src/content/articles/), using a lowercase hyphenated filename. The filename becomes `/artikelen/{filename-without-extension}/`.

```yaml
---
title: "Your reviewed title"
description: "A concise description of what the reader will learn."
published: "2026-10-01T10:00:00+02:00"
topic: "prompting"
art: "workflow"
status: "published"
draft: true
---
```

Write the Dutch body underneath. An article is included only when `draft` is `false` and `published` is not in the future. Because the site is static, run the deployment workflow after the publication time to make a scheduled article available. Keep `draft: true` to hide an article regardless of its date.

The current topic is `prompting`. To add another category, add its slug and public label once in [src/lib/topics.ts](../src/lib/topics.ts), then use that slug in an article's `topic` field. Topic navigation, validation, pages and sitemap entries are generated from this registry.

Available cover compositions are `prompt`, `dialogue`, `data` and `workflow`.

Fenced code blocks get a copy button; text remains selectable if the Clipboard API is denied. Use headings, lists and descriptive link text. Do not put sensitive customer, tenant or personal data in examples.

## Images and identity

[scripts/artwork.mjs](../scripts/artwork.mjs) creates the original artwork using fixed local SVG compositions and Sharp rasterization. Generated files live under ignored build directories, so never hand-edit them.

The current checkpoint uses shared topic compositions and one branded social image, rather than a unique illustration and social title card for every article. A final per-article art pass can follow design approval.

The initials avatar is deliberate until Johan approves a current photograph. The existing biography's job title was not copied as a current claim.

## Production and rollback

Before merging, review the preview, article copy, biography and privacy text.

The workflow builds from the committed lockfile and uploads `dist` as the Pages artifact. After deployment, smoke-test the homepage, both article URLs, search, RSS, sitemap and the 404 page on the custom domain.
