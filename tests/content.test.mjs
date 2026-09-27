import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { loadSource, root } from '../scripts/prepare-content.mjs';
import { isArticleVisible } from '../src/lib/publication.ts';
import { isTopic, topicLabel, topics } from '../src/lib/topics.ts';

const { articles } = await loadSource();

test('topic definitions provide navigation, validation and labels from one registry', () => {
  assert.deepEqual(topics, [{ slug: 'prompting', label: 'Slimmer prompten' }]);
  assert.equal(isTopic('prompting'), true);
  assert.equal(isTopic('unknown'), false);
  assert.equal(topicLabel('prompting'), 'Slimmer prompten');
});

test('article visibility requires a released draft and a reached publication date', () => {
  const now = new Date('2026-09-27T10:00:00Z');
  assert.equal(isArticleVisible({ draft: false, published: '2026-09-27T09:59:59Z' }, now), true);
  assert.equal(isArticleVisible({ draft: false, published: '2026-09-27T10:00:01Z' }, now), false);
  assert.equal(isArticleVisible({ draft: true, published: '2026-09-27T09:59:59Z' }, now), false);
});

test('the public collection contains only the two current prompting articles', () => {
  assert.equal(articles.length, 2);
  assert.deepEqual(articles.map((article) => article.id).sort(), [
    'een-goede-prompt',
    'samen-je-prompt-verbeteren',
  ]);
  assert.ok(articles.every((article) => article.status === 'published'));
  assert.ok(articles.every((article) => article.topic === 'prompting'));
  assert.ok(articles.every((article) => article.url === `/artikelen/${article.id}/`));
  assert.ok(articles.every((article) => article.guid === `https://copilotlab.nl${article.url}`));
});

test('articles contain no archive or video references', () => {
  const combined = articles.map((article) => article.body).join('\n');
  assert.match(combined, /\/artikelen\/een-goede-prompt\//);
  assert.doesNotMatch(combined, /2024|\/posts\/|\/videos\/|<!--\s*video:/i);
});

test('draft articles are excluded from the public collection', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'copilotlab-content-'));
  try {
    await mkdir(path.join(fixture, 'src/content'), { recursive: true });
    await cp(path.join(root, 'src/content/articles'), path.join(fixture, 'src/content/articles'), { recursive: true });
    const file = path.join(fixture, 'src/content/articles/new-article.md');
    const article = (draft) => `---
title: "Test article"
description: "Fixture only"
published: "2026-09-26T19:00:00Z"
topic: "prompting"
art: "workflow"
status: "published"
draft: ${draft}
---

Test body.
`;
    await writeFile(file, article(true));
    const drafts = await loadSource(fixture);
    assert.equal(drafts.articles.find((item) => item.id === 'new-article').draft, true);
    await writeFile(file, article(false));
    const published = await loadSource(fixture);
    assert.equal(published.articles.find((item) => item.id === 'new-article').url, '/artikelen/new-article/');
  } finally {
    await rm(fixture, { recursive: true });
  }
});

test('unsupported legacy metadata and video markers are rejected', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'copilotlab-content-'));
  try {
    await mkdir(path.join(fixture, 'src/content/articles'), { recursive: true });
    const file = path.join(fixture, 'src/content/articles/legacy.md');
    await writeFile(file, `---
title: "Legacy"
description: "Fixture only"
published: "2024-01-01T00:00:00Z"
topic: "prompting"
art: "prompt"
status: "archived"
draft: false
---

<!-- video:TmdXWvRIGu0 -->
`);
    await assert.rejects(loadSource(fixture), /Unsupported article status/);
    await writeFile(file, `---
title: "Video marker"
description: "Fixture only"
published: "2026-01-01T00:00:00Z"
topic: "prompting"
art: "prompt"
status: "published"
draft: false
---

<!-- video:TmdXWvRIGu0 -->
`);
    await assert.rejects(loadSource(fixture), /Unsupported template or video marker/);
  } finally {
    await rm(fixture, { recursive: true });
  }
});
