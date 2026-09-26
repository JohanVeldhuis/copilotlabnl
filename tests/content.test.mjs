import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, cp, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import matter from 'gray-matter';
import { loadSource, root, videoPattern } from '../scripts/prepare-content.mjs';

const { stories, videos, manifest } = await loadSource();

test('all legacy posts are archived at URLs verified against the deployed sitemap', () => {
  const legacy = stories.filter((story) => story.status === 'archived');
  assert.equal(legacy.length, 11);
  assert.deepEqual(legacy.map((story) => story.url).sort(), manifest.map(([, url]) => url).sort());
  assert.ok(legacy.every((story) => story.published.startsWith('2024-')));
  assert.equal(new Set(stories.map((story) => story.url)).size, stories.length);
});

test('all 13 original video placements survive in their original order', async () => {
  let placements = 0;
  for (const story of stories.filter((story) => story.status === 'archived')) {
    const { content, data } = matter(await readFile(path.join(root, '_posts', story.source), 'utf8'));
    const originalIds = [...content.matchAll(videoPattern)].map((match) => match[1]);
    const migratedIds = [...story.body.matchAll(/<!-- video:([A-Za-z0-9_-]{11}) -->/g)].map((match) => match[1]);
    assert.deepEqual(migratedIds, originalIds);
    assert.equal(story.published, new Date(data.date).toISOString());
    assert.equal(story.originalTitle, String(data.title));
    assert.equal(story.body.replace(/<!-- video:[A-Za-z0-9_-]{11} -->/g, '').replace(/\s+/g, ' ').trim(),
      content.replace(videoPattern, '').replace(/\s+/g, ' ').trim());
    assert.ok(originalIds.every((id) => videos.some((video) => video.youtubeId === id)));
    placements += migratedIds.length;
  }
  assert.equal(placements, 13);
  assert.equal(videos.length, 13);
});

test('refreshed editions remain separate and distinguish editorial work from testing', () => {
  const refreshed = stories.filter((story) => story.status === 'refreshed' && !story.draft);
  assert.equal(refreshed.length, 2);
  for (const story of refreshed) {
    assert.ok(stories.some((original) => original.url === story.originalUrl && original.status === 'archived'));
    assert.match(story.body, /niet opnieuw.*getest/);
    assert.equal(story.videoIds.length, 0);
  }
});

test('legacy GUIDs, .html suffixes and the date mismatch are preserved', () => {
  for (const story of stories.filter((story) => story.status === 'archived')) {
    assert.equal(story.guid, `http://copilotlab.nl${story.url}`);
    assert.ok(story.url.endsWith('.html'));
  }
  assert.ok(stories.find((story) => story.id === 'gebruik-copilot-om-data-te-analyseren').url.includes('/2024/08/14/'));
});

test('new stories and standalone videos support drafts without requiring an archived predecessor', async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), 'copilotlab-content-'));
  try {
    await cp(path.join(root, '_posts'), path.join(fixture, '_posts'), { recursive: true });
    await cp(path.join(root, 'docs/baseline'), path.join(fixture, 'docs/baseline'), { recursive: true });
    await cp(path.join(root, 'src/content/stories'), path.join(fixture, 'src/content/stories'), { recursive: true });
    await mkdir(path.join(fixture, 'src/content/videos'), { recursive: true });
    const videoFile = path.join(fixture, 'src/content/videos/new-video.md');
    const storyFile = path.join(fixture, 'src/content/stories/new-story.md');
    const video = (draft) => `---\nyoutubeId: AbCdEfGhI12\ntitle: Test video\ndescription: Fixture only\ntopic: copilot\nart: data\ndraft: ${draft}\n---\nReviewed notes.\n`;
    const story = (draft) => `---\ntitle: Test story\ndescription: Fixture only\npublished: "2026-09-26T19:00:00Z"\ntopic: copilot\nart: workflow\ndraft: ${draft}\n---\n<!-- video:AbCdEfGhI12 -->\n`;
    await writeFile(videoFile, video(true));
    await writeFile(storyFile, story(true));
    const drafts = await loadSource(fixture);
    assert.equal(drafts.stories.find((item) => item.id === 'new-story').draft, true);
    assert.equal(drafts.videos.find((item) => item.id === 'AbCdEfGhI12').draft, true);
    await writeFile(storyFile, story(false));
    await assert.rejects(loadSource(fixture), /Missing or unpublished video/);
    await writeFile(videoFile, video(false));
    const published = await loadSource(fixture);
    const newStory = published.stories.find((item) => item.id === 'new-story');
    assert.equal(newStory.status, 'published');
    assert.equal(newStory.originalUrl, undefined);
    assert.deepEqual(newStory.videoIds, ['AbCdEfGhI12']);
    assert.equal(published.videos.find((item) => item.id === 'AbCdEfGhI12').url, '/videos/AbCdEfGhI12/');
  } finally {
    await rm(fixture, { recursive: true });
  }
});
