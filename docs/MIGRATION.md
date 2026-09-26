# Legacy migration and review checkpoint

## Baseline

Captured from the deployed site on 26 September 2026:

- [Sitemap](baseline/legacy-sitemap.xml): all 11 legacy story paths, category pages, about and archive.
- [RSS](baseline/legacy-feed.xml): 10 published legacy GUIDs using the HTTP hostname.
- [Homepage HTML](baseline/legacy-home.html) and [archive HTML](baseline/legacy-posts.html): current navigation, category fragments and page structure.
- `/page/2/` and `/page/3/` both returned HTTP 200.
- The HTTPS domain responded to these requests. Administrative DNS/Pages settings were not accessed or changed.

Ruby and Bundler are not installed in this environment. No successful local Jekyll build is claimed. The deployed sitemap/feed are the verified routing baseline instead of filename inference.

## Preservation strategy

[prepare-content.mjs](../scripts/prepare-content.mjs) contains an explicit route manifest checked against the captured sitemap. It reads original Markdown without overwriting it and produces ignored JSON for Astro's validated content collections.

Important preserved cases:

- The data-analysis post remains under `/2024/08/14/`, despite its filename starting with 15 August.
- Filenames containing spaces and `copy` retain their actual deployed slug.
- All 13 YouTube placements remain in their original article positions, including four in the prompting article.
- `/posts/#informatie`, `/posts/#Word`, `/posts/#Excel` and `/posts/#Copilot` keep their fragment targets.
- Old category pages remain accessible with a canonical link to the new topic page.
- Old pagination routes remain usable. Their first-page navigation leads to the full historical archive rather than implying the new homepage is a historical page.
- Legacy RSS GUIDs remain unchanged, even though canonical article links use HTTPS.
- Original local assets are copied to the same `/assets/` paths in the new output.

The old article display titles drop an accidental trailing quotation mark where present. The original title is retained in generated metadata, and article prose, prompts and dates are otherwise preserved.

Astro's `build.format: preserve` produces actual `.html` files for the original articles and directory indexes for new pages. Do not switch this to `directory`: that would produce `.html/index.html` folders and break exact URL behavior.

## Editorial decisions applied

- Eleven historical articles and their videos are marked as archive material, not product-tested guidance.
- Two separate foundation articles replace time-bound examples with workplace examples, referencing Microsoft's prompt guidance.
- New editions explicitly say they are editorial rewrites, not fresh product tests.
- Old videos remain with old examples; they are not presented as demonstrations of new prompts.
- Historical video labels are descriptive labels derived from the articles, not verified YouTube titles.

## Validation scope

Automated checks cover preserved content/video order, GUIDs, routes as real files, homepage archive exclusion, privacy before video activation, search/empty states, clipboard failure, no-JavaScript reading, internal links/fragments, responsive overflow and automated accessibility.

The local video activation test substitutes a test player after checking the embed URL. This proves lazy loading and the recovery link, not that YouTube permits every original video to play today.

## Pending approval and release work

- Visual approval of homepage, reading, video and archive templates.
- Johan's review of the rewritten copy and biography; a current approved photo.
- Actual product retesting and current video availability/metadata.
- A new practical walkthrough/video, only when real material is available.
- Per-article art/social card refinement if desired.
- Final Lighthouse measurements, manual assistive-technology review and production hosting/privacy checks.
- Approved deployment workflow switch and real-domain smoke tests.

The live Jekyll workflow remains unchanged. Its configuration excludes new Astro source/build/documentation files to keep a future legacy build from publishing implementation material before cutover. Nothing has been committed, pushed or deployed by this rebuild.
