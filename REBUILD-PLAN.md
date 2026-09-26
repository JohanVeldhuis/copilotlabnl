# Copilot Lab rebuild plan

Status: local design-review checkpoint implemented; no production deployment made.
Prepared: 26 September 2026.
Implementation assistant: GPT 6 Astra, as requested by Johan; this plan does not assume image-generation capabilities or a particular tool integration.

### Approved decisions and implementation checkpoint

Johan approved Astro, Dutch-first, Git-based publishing and the launch scope, then approved selective refresh plus an accessible historical archive rather than mass deletion.

The local implementation now includes the editorial homepage, story/video detail pages, topic pages, archives, search, RSS, locally generated artwork, and two separate refreshed prompting editions. Original articles and video placements remain intact. New Markdown stories and standalone videos are supported; drafts are excluded from generated public collections.

See [the publishing guide](docs/PUBLISHING.md) for local commands and [migration details](docs/MIGRATION.md) for the verified baseline, limitations and remaining release gates.

The next gate is visual/editorial review of the working preview. Deployment, domain settings, current video verification, a production hosting/privacy review and final performance certification remain pending. Do not treat this checkpoint as authorization to deploy.

## 1. Outcome and decision gates

Rebuild Copilot Lab as a high-quality personal publication for Johan Veldhuis: practical stories, YouTube videos and first-hand experiments about Copilot and working with AI.

The site should feel familiar to a Microsoft Copilot audience without looking like an official Microsoft property. Content and Johan's perspective lead; visual effects support them.

### Agreed direction

- Use the refined "Copilot-inspired editorial" concept, not the original olive editorial or dark/lime lab concept.
- Light surfaces, clean sans-serif typography, subtle blue/lilac gradients, rounded cards and original dimensional illustrations.
- Give stories and videos equal importance.
- Create illustrations during development/build without an image-service subscription.
- Prepare a design and implementation handoff for an AI-led rebuild.

### Defaults approved before implementation

1. **Platform:** Astro, TypeScript, Markdown/MDX and GitHub Pages.
2. **Language:** Dutch-first launch; translation-ready structure, with selected English editions later.
3. **Publishing:** Git-based content editing through local files or GitHub, not a CMS at launch.
4. **Scope:** launch the pages and features below; defer analytics, newsletter, comments and automatic YouTube imports.

These defaults were confirmed when Johan approved proceeding. Reconfirm only if the scope changes.

## 2. Current site and migration facts

Repository inspection establishes:

| Surface | Current state | Rebuild obligation |
|---|---|---|
| Framework | Jekyll below version 4 in [Gemfile](Gemfile) | Replace only after migration coverage is established |
| Content | 11 Markdown articles in [_posts](_posts/) | Preserve all articles, dates, prompts and meaningful structure |
| Video | 13 YouTube include occurrences across 10 articles | Preserve every ID, placement and association |
| Hosting | GitHub Pages workflow in [jekyll.yml](.github/workflows/jekyll.yml), deploying pushes to `main` | Keep Pages unless deliberately changed |
| Archives | [posts.md](posts.md), category/tag archives and home pagination | Inventory generated routes and existing fragment IDs |
| Feed | [feed.xml](feed.xml), latest 10 posts | Keep this endpoint and prevent avoidable duplicate feed items |
| Identity | [_config.yml](_config.yml), [over.md](over.md), local avatar/logo assets | Verify current biography; retain asset rights and attribution |

Migration hazards:

- Some filenames contain spaces or `copy`. Do not derive new URLs by simply cleaning filenames.
- The data-analysis article has a filename date different from its front-matter date, plus a trailing quote in its title. Record the generated URL before any metadata correction.
- An article can contain several videos. A single optional video ID on a story is insufficient.
- Existing embeds use Liquid includes; these must become supported content components, not remain visible text.
- Existing configuration uses an HTTP site URL. Confirm the actual HTTPS host and hostname redirects before setting production canonicals.
- The local workflow indicates intended deployment, not proof of live Pages settings, custom-domain configuration or successful current builds.

Before replacing Jekyll, build the legacy site using its existing setup and capture its generated URL/content inventory. Cross-check against the live sitemap and public site. If that build is blocked, document the failure and establish the inventory from deployed output before proceeding. Never guess old slugs.

## 3. Design specification

### Reference and identity

Visual source: the approved `copilot-lab-editorial-refined.html` design study supplied alongside this plan. Attach that HTML file when handing this plan to another AI session. The implementation must not depend on its local session path.

The design study is a direction, not production code: its example links, video labels, initials avatar and concept copy require real content. Expand the design to article, video and archive pages before considering it complete.

- Own wordmark and symbol; no imitation of the Copilot ribbon logo.
- Use genuine Johan photography after review; retain initials if no suitable photo is approved.
- Keep a clear personal-publication disclosure in the footer.
- Use Dutch copy that sounds like Johan, not generic software marketing.
- Do not imply Microsoft sponsorship or endorsement. Review applicable branding requirements before launch.

### Starting design tokens

These come from the concept, not official Microsoft brand tokens.

| Token | Initial value / rule |
|---|---|
| Page | `#FBFCFF` |
| Main text / primary button | `#182139` |
| Secondary text | `#586277` |
| Borders | `#DDE3EF` |
| Links | `#3D45B5` |
| Highlight headline | `#5551AD` |
| Background accents | Pale blue `#E6F2FF`, lilac `#EEEBFC`, restrained peach |
| Type | System sans stack initially; no external font requests |
| Content container | Maximum outer width 1336px, approximately 1208px inner width at desktop |
| Reading column | Approximately 65-75 characters, independent of the wider page grid |
| Body type | 17-18px for articles, line-height around 1.7 |
| Spacing | Consistent 4/8px-based scale |
| Cards | 16-18px corner radius, subtle border, limited shadow |
| Buttons | Rounded primary and clearly visible secondary styles |
| Motion | Short functional transitions only; respect reduced motion |

Validate contrast in the actual combinations. Increase the prototype's small labels and footer text where necessary; do not copy its typography mechanically.

### Layout and components

- Desktop: two-column hero; three-column card grid.
- Tablet: adjust hero and cards according to content fit, not only device names.
- Mobile: single-column hero and cards, readable titles and usable navigation.
- Navigation: brand, Verhalen, Video's, Over Johan, YouTube; search accessible from content listings.
- Shared components: site header/footer, story/video cards, metadata, topic links, breadcrumbs, prompt block, video facade, related-content section and pagination.
- Topics are links to real topic pages, not inert chips resembling filters.
- Card actions point to the specific story or video; no prototype links to a generic archive.
- Use actual verified titles and dates. Never invent durations, view counts, testimonials or performance claims.

## 4. Launch information architecture

| Page | Proposed route | Required content and behavior |
|---|---|---|
| Homepage | `/` | Hero, latest mixed content, highlighted video, topics, introduction to Johan |
| Stories | `/verhalen/` | Story cards, topic filtering, pagination, search entry |
| Story | Existing URL for migrated articles; `/verhalen/{slug}/` for new ones | Title, summary, author/date, readable body, prompts, associated videos, related content |
| Videos | `/videos/` | Verified video library with topics and dates when known |
| Video detail | `/videos/{slug}/` | Video facade, description, linked stories, optional reviewed notes/transcript |
| Topic | `/onderwerpen/{slug}/` | Stories and videos for one topic |
| About | `/over/` | Current approved biography, photo, purpose, YouTube link, personal-publication disclosure |
| Search | `/zoeken/` | Static search results, format distinction, empty/error states |
| Privacy | `/privacy/` | Actual video-loading and third-party behavior, no generic unverifiable promises |
| Utility | `/404.html`, `/feed.xml`, `/sitemap.xml`, `/robots.txt` | Useful recovery, feed continuity and discoverability |

Compatibility:

- Keep legacy article routes as their canonical URLs where feasible. New friendly routes do not justify breaking old links.
- Preserve `/posts/` as a usable compatibility archive, including existing category fragment IDs.
- Serve old generated category/tag and pagination paths with meaningful content or explicit compatibility pages.
- GitHub Pages does not provide arbitrary server-side 301 rules. Do not promise redirects via an unsupported configuration file. Prefer preserving routes; where unavoidable, use tested static redirect pages with a visible link and canonical target, acknowledging they are not HTTP 301s.
- Do not create two separately indexable copies of the same article.

## 5. Content model and language

Use Astro content collections with strict validation and explicit stable IDs. Keep plain Markdown for ordinary stories; use MDX only for trusted, repository-authored interactive content components.

| Record | Fields |
|---|---|
| Story | Stable `id`, language, slug, optional exact `legacyPath`, title, description, publication date, optional updated/reviewed dates, author, topic IDs, draft status, optional featured order, cover reference, body |
| Video | Stable `id`, unique YouTube ID, language, slug, verified title/description, optional verified publication date/duration, topics, poster reference, draft status, optional notes/transcript |
| Translation | Optional shared translation key on stories/videos; at most one record per key and language |
| Artwork | Asset ID, template, fixed seed/composition parameters, palette, title/topic input, alt text or decorative flag, output dimensions, provenance |

Use one source of truth for story/video associations: ordered video references in story content, with reverse related-story links derived from them. Represent all four videos in the prompting article, not just a "primary video".

Build validation must reject duplicate paths, invalid references, unsupported languages, invalid YouTube IDs, missing required artwork and published placeholder content. Missing optional metadata must remain omitted, not fabricated.

### Language policy

- Proposed launch language: Dutch, including interface, navigation and dates.
- Preserve root-level Dutch URLs; reserve `/en/` for future English content.
- Do not display a language switch until actual published equivalents exist.
- Later, link a switch to the equivalent article, not silently to a homepage.
- Add correct page language, self-canonical URL and reciprocal `hreflang` only for actual translation pairs.
- English entries must not leak into Dutch listings, search or feeds.
- Keep display strings centrally manageable without building an elaborate translation framework.
- Use reviewed subtitles before committing to recording every video in two languages.
- Do not automatically redirect visitors based on geography or browser language.

## 6. Recommended technical foundation

| Concern | Recommendation | Reason |
|---|---|---|
| Framework | Astro static output, TypeScript strict mode | Content-first pages with little browser JavaScript |
| Styling | CSS custom properties and component styles | Close control over the approved design without a large UI framework |
| Content | Local Markdown/MDX and validated collections | Portable and compatible with an AI-assisted Git workflow |
| Hosting | Existing GitHub Pages through Actions | No application server or database needed |
| Search | Pagefind over generated public pages | No hosted search subscription |
| Graphics | Local SVG generation plus local raster conversion | Deterministic, no image API dependency |
| Tests | Small validator tests, Playwright, automated accessibility checks | Cover routes, rendering and key interactions |
| Package management | npm with committed lockfile; supported Node LTS selected at implementation | Reproducible local and CI builds |

Do not introduce React, an authentication system, a database or an external CMS without a concrete requirement. Check current official package APIs and supported versions when implementing; this plan intentionally does not pin unverified future versions.

Proposed organization:

```text
src/
  components/
  layouts/
  pages/
  content/
    stories/
    videos/
  data/
  styles/
scripts/
  artwork/
public/
tests/
docs/
```

Expected build order: validate content and route manifest -> generate/optimize images -> check types -> build static site -> generate search index -> check output links/assets and run browser checks. Explicitly exclude drafts, compatibility duplicates and utility pages from search.

Static content and navigation must work without JavaScript. Enhance only search, copy buttons, filters and video activation. Provide a browsable alternative to JavaScript-only search.

## 7. Images without a subscription

### Launch approach

1. Build a small family of original SVG illustrations: sculptural hero, prompt cards, dialogue shapes, data diagrams and workflow shapes.
2. GPT 6 Astra helps author the graphics generator and select compositions during development. Regular site builds do not call the model.
3. Store reviewed art direction as local metadata with stable seeds and explicit template choices.
4. Generate required SVG assets locally during the build; identical inputs produce identical outputs.
5. Generate raster social cards locally, using a supported library such as Sharp after checking SVG/font rendering requirements.
6. Use Johan's actual screenshots and owned video thumbnails where they add information; optimize them locally.

No paid image API, hosted stock service or cloud generation account is required. SVG is code-generated illustration, not diffusion-generated photography. This avoids per-image charges, but does not remove normal development, hardware, domain or applicable CI/hosting costs.

### Quality and safety rules

- Establish at least three distinct compositions and an art-directed hero; avoid one recolored image on every article.
- Make editorial subject matter recognizable without fake product screenshots.
- Use real screenshots only after removing personal, tenant and customer information.
- Do not synthesize a photo of Johan; use an approved photograph.
- Escape text inputs and prohibit scripts, remote references and embedded untrusted markup in generated SVGs.
- Prefer HTML text outside artwork. Where text must be rasterized, use a properly licensed local font and include its license.
- Serve covers with correct intrinsic dimensions, responsive sizing and meaningful alt text; mark purely decorative art accordingly.
- Generate social cards at 1200 x 630. Use 16:9 for video posters.
- Missing required artwork fails the build; do not quietly substitute a broken or irrelevant image.
- Review hero and representative covers at mobile size as well as desktop.

Local diffusion generation can be explored later if photographic imagery is genuinely needed, but is not a launch dependency. Check hardware needs and model/weight licenses before selecting it.

## 8. Video and interaction behavior

- First-party poster and explicit play control; no YouTube iframe, remote thumbnail, preconnect or player script before activation.
- Explain that activating playback contacts YouTube. After activation use a privacy-enhanced embed where supported, without claiming this eliminates tracking.
- Always provide a direct YouTube link; playback restrictions or blocked embeds must not trap visitors.
- Keep aspect ratio stable, give the iframe an accessible title and allow keyboard activation.
- No autoplay on page load and no automatic API polling.
- Store video metadata locally. Verify actual titles, availability and associations; the channel alone is not proof of a specific episode.
- Make each video detail page useful with unique reviewed notes and related articles, rather than duplicating the entire story.
- Implement copyable prompt blocks with an announced success or failure state. Preserve manual text selection when Clipboard API access fails.
- Use URL-based topic/filter state where helpful; support back navigation, pagination reset after filter changes and useful empty states.

## 9. Migration, SEO and publishing

### Migration procedure

1. Capture legacy generated routes, titles, dates, headings/fragments, category links, asset references, feed GUIDs and all 13 video placements.
2. Map each source article to one new content record and an explicit route.
3. Convert Liquid/Kramdown constructs deliberately. Compare rendered paragraphs, code blocks, lists, links and video order.
4. Preserve original publication dates and wording. Track suggested editorial corrections separately for Johan's approval.
5. Extract distinct video records; verify titles and metadata rather than inventing them from the surrounding article.
6. Add appropriate covers and summaries without changing the claims in old articles.
7. Record stale examples and product terminology for editorial review; do not label 2024 content as newly published.
8. Retain necessary licenses/attribution; remove unused theme files only once the replacement is verified.

### SEO and feed

- Unique page titles/descriptions, canonical URLs, social images, sitemap and useful 404.
- `Article` and `BreadcrumbList` structured data where applicable; `VideoObject` only when required facts are verified.
- Preserve `/feed.xml`; retain legacy GUID values where possible even when canonical links become HTTPS.
- Generate absolute links with the confirmed production host; ensure drafts and compatibility redirects are absent from sitemap and feed.
- Test route casing, encoded spaces, trailing slashes, fragments and base-path behavior.

### Ongoing publishing

Provide a concise contributor guide and validated templates:

1. Create a draft story or video record.
2. Add reviewed copy, actual video ID and any first-party images.
3. Select an artwork composition and run the local build.
4. Preview desktop/mobile pages; review generated images, links and facts.
5. Open a pull request; CI validates without publishing.
6. Merge approved content to publish.

Do not fetch YouTube metadata during every production build. A failed external service should not break unrelated publishing.

## 10. Delivery phases and acceptance gates

Run these phases sequentially. Parallelize only genuinely independent work after shared content contracts and design tokens are fixed.

### Phase 0 - Confirm and preserve

Deliver: confirmed defaults, deployment settings check, legacy route/content manifest and baseline screenshots.

Gate: all 11 articles and 13 embeds accounted for; domain/HTTPS behavior recorded; an explicit rollback deployment procedure exists. Do not switch the live workflow yet.

### Phase 1 - Establish the design system

Deliver: Astro foundation, shared tokens/components, header/footer and art direction. Design a homepage, long article, multi-video article, video detail and listing at desktop and mobile widths.

Gate: Johan approves representative pages against the refined design, including type, whitespace, image character and mobile navigation. Remove prototype-only labels and generic destination links.

### Phase 2 - Build the content model and migrate

Deliver: validated collections, migration mapping, all stories, linked video records, preserved URLs and basic feed.

Gate: migration assertions pass; no unconverted Liquid; prompts and video placement match; unresolved content issues are reported rather than silently corrected.

### Phase 3 - Implement the complete reading experience

Deliver: all launch routes, search, topics, pagination, prompt copy, video facade, related content and privacy/about pages.

Gate: real links and keyboard flows work, no-JavaScript reading works, empty/error states are useful, and privacy behavior is verified in browser network requests.

### Phase 4 - Complete artwork and metadata

Deliver: deterministic graphics pipeline, reviewed per-content assets, social cards, canonical metadata, sitemap and structured data.

Gate: clean-checkout build generates required images without a model/API; repeat builds reproduce artwork; no missing images or invented metadata.

### Phase 5 - Quality and editorial approval

Deliver: automated checks, screenshot comparison, link audit and manual reading review.

Gate: the release checklist below passes. Johan approves biography, branding disclosure, language choice, video metadata and launch content.

### Phase 6 - Deploy and verify

Deliver: Astro Pages workflow, publishing guide and rollback instructions.

Gate: production smoke checks pass on the real custom domain. Disable competing Jekyll deployment only at cutover; remove obsolete dependencies after approval.

## 11. Release checklist

### Correctness and content

- [ ] All 11 original stories remain reachable through their exact existing URLs.
- [ ] All 13 original video placements resolve to the correct video records.
- [ ] Old archive fragments, categories and pagination are covered by the manifest.
- [ ] Build, content validation, type checks and targeted tests pass from a clean checkout.
- [ ] No broken internal links, missing images, duplicate canonical pages or exposed drafts.
- [ ] RSS endpoint and legacy GUID continuity are tested.
- [ ] Search returns real results and excludes drafts/duplicate compatibility pages.
- [ ] No placeholder episodes, fake duration labels, dead buttons or generic archive links masquerading as story links.

### Accessibility and responsive design

- [ ] Check 320, 390, 768, 1024 and 1440px widths without unintended horizontal overflow.
- [ ] Check keyboard navigation, skip link, focus visibility, logical headings and 200% zoom.
- [ ] WCAG 2.2 AA contrast and minimum target-size requirements are met; aim for 44px primary controls.
- [ ] Automated accessibility checks report no serious/critical issues on representative templates; manually inspect the rest.
- [ ] Tables/code scroll within their containers; long Dutch titles and multiple embeds remain usable.
- [ ] Reduced motion and no-JavaScript reading are supported.

### Performance and privacy

- [ ] Run Lighthouse against built production pages, not the development server; use three mobile runs and record the median.
- [ ] Target Lighthouse performance >= 95 and accessibility >= 95 on home, story, video and listing templates before video activation.
- [ ] Target lab LCP <= 2.5s and CLS <= 0.1; do not claim field Core Web Vitals from local tests. Assess field INP <= 200ms once enough real traffic exists.
- [ ] Initial first-party compressed JavaScript <= 50KB per representative page, excluding deferred search data and user-activated YouTube.
- [ ] Homepage initial transfer <= 800KB before interaction; optimize real photos if they threaten the budget.
- [ ] No third-party media requests before play activation; verify in a fresh browser context.
- [ ] Clipboard denial, no search results and unavailable video behavior provide useful recovery.

### Production and rollback

- [ ] Verify Pages source, custom domain, HTTPS and asset base path; do not assume a committed CNAME file exists.
- [ ] PR checks cannot publish; only approved default-branch changes deploy.
- [ ] Home, an old article, a multi-video story, video detail, search, 404, RSS and sitemap work on production.
- [ ] Preserve the previous known-good source revision and record how to redeploy it through Actions.
- [ ] If smoke checks fail, restore the known-good deployment instead of leaving a partial cutover live.

## 12. AI implementation handoff

Use this plan together with the approved HTML visual reference and repository access. Do not ask the model to redesign the site from scratch in one unconstrained prompt.

Suggested initial instruction:

> Rebuild Copilot Lab according to REBUILD-PLAN.md and the attached refined editorial HTML reference. First read the repository and complete Phase 0. Confirm the proposed platform, language, publishing workflow and launch scope before scaffolding. Preserve all existing article URLs, content, video associations and the RSS endpoint. Use the approved visual identity consistently across every template. Generate original graphics locally without an image API or subscription. Work phase by phase, test each acceptance gate, and show representative desktop/mobile screenshots before advancing beyond design approval. Do not invent content facts, rewrite historical articles without approval, deploy to production, change domain settings or delete legacy files prematurely. Report what is verified and what remains blocked.

At each milestone, require:

- Working implementation rather than screenshots alone.
- Actual commands/checks run, their results and any blockers.
- Short comparison against the approved visual reference.
- A small, reviewable diff and a clear next phase.

## 13. Explicitly deferred

- Complete English translation and bilingual publishing operations.
- Newsletter infrastructure, accounts, comments, memberships and commerce.
- Hosted CMS, analytics collection and YouTube API synchronization.
- Runtime AI chatbot or paid inference/image service.
- Dark mode and elaborate animations.

These are not prerequisites for a polished publication. Revisit them only after the core reading and publishing experience is working well.
