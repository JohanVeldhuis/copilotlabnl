# Working on Copilot Lab

The Astro rebuild is a local review candidate. The existing GitHub Pages workflow still publishes Jekyll; do not assume that merging the rebuild deploys Astro. Production cutover requires separate approval.

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

The build validates source content, generates SVGs and a PNG social image locally, builds Astro, and indexes stories/videos with Pagefind. No image API, AI model call or external metadata request occurs during a normal build. Installing npm dependencies initially requires internet access.

For browser tests:

```powershell
npx playwright install chromium
npm run test:browser
```

The browser runner starts and stops its own preview on port 4329. Run the build first. `npm run validate` runs type checks, unit tests, build and browser tests together.

`npm run dev` is useful for layout work. Use the **built preview** to test search and exact legacy `.html` paths. Content metadata is generated at startup: after editing Markdown, rerun `npm run prepare:content` or restart the dev task. Ordinary Astro/CSS changes hot-reload.

## New story

Create a Markdown file in [src/content/stories](../src/content/stories/), using a lowercase hyphenated filename. The filename becomes `/verhalen/{filename-without-extension}/`.

```yaml
---
title: "Your reviewed title"
description: "A concise description of what the reader will learn."
published: "2026-10-01T10:00:00+02:00"
topic: "copilot"
art: "workflow"
status: "published"
draft: true
---
```

Write the Dutch body underneath. Set `draft: false` only when the content is ready for the public build. The publication date is an editorial field, not a scheduling mechanism; a future date alone does not hide an article.

Available topics: `prompting`, `informatie`, `copilot`, `excel`, `word`. Available cover compositions: `prompt`, `dialogue`, `data`, `workflow`. Add a new topic consistently to the schema and the display-label map before using it.

New stories do not need a legacy article. Only a `status: refreshed` edition requires `originalUrl`; keep its original unchanged and explain exactly what has been refreshed. Never describe an editorial rewrite as a product test.

Fenced code blocks get a copy button; text remains selectable if the Clipboard API is denied. Use headings, lists and descriptive link text. Do not put sensitive customer, tenant or personal data in examples.

## New video

Create a Markdown file in [src/content/videos](../src/content/videos/). Use metadata from the actual video, not a guessed title, date or duration.

```yaml
---
youtubeId: "ACTUAL_11_CHARACTER_ID"
title: "The verified video title"
description: "An accurate description."
topic: "copilot"
art: "data"
draft: true
---
```

The example ID above is intentionally invalid: replace it with the actual 11-character YouTube ID. The build rejects invalid/duplicate IDs. The optional `published` field can contain a verified ISO date. Add reviewed notes or a transcript as Markdown below the metadata; do not invent a transcript.

The detail URL is `/videos/{youtubeId}/`. A video can stand alone. To include it at a specific position in a story, place this marker between paragraphs:

```html
<!-- video:ACTUAL_ID -->
```

Replace `ACTUAL_ID` with the same valid ID. Published stories cannot reference missing or draft videos. Related-story links on the video page are derived from these references, including multiple videos in one story.

Only the explicit play button loads the YouTube iframe. First-party posters and direct YouTube links work without third-party requests on page load. Direct links remain usable without JavaScript.

## Archive policy

- [_posts](../_posts/) remains the original source of the 11 historical articles.
- Every original article has an archive notice, original publication date and preserved URL.
- The homepage selects only non-archived stories. Historical videos are not presented as newly recorded content.
- Two reviewed editorial rewrites are separate editions, with reciprocal links to the originals.
- Original video IDs and positions remain associated with the historical material.
- No original article has been removed or overwritten.

## Images and identity

[scripts/artwork.mjs](../scripts/artwork.mjs) creates the original artwork using fixed local SVG compositions and Sharp rasterization. Generated files live under ignored build directories, so never hand-edit them.

The current checkpoint uses shared topic compositions and one branded social image, rather than a unique illustration and social title card for every article. A final per-article art pass can follow design approval.

The initials avatar is deliberate until Johan approves a current photograph. The existing biography's job title was not copied as a current claim.

## Before production

Review the preview, refreshed copy, biography and privacy text. Verify current video availability and metadata. Complete the remaining release gates in [REBUILD-PLAN.md](../REBUILD-PLAN.md), including production performance and the real hosting/domain configuration.

Only then replace the deployment workflow with the approved Astro cutover. Preserve a known-good Jekyll revision/artifact for rollback; do not delete the old sources before approval.
