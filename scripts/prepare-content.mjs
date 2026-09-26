import { readdir, readFile, mkdir, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const videoPattern = /\{%\s*include youtube\.html id="([A-Za-z0-9_-]{11})"\s*%\}/g;
const manifest = [
  ['2024-06-14-welkom-op-copilotlabs.markdown', '/informatie/2024/06/14/welkom-op-copilotlabs.html'],
  ['2024-06-16-wat-is-een-goed-prompt copy.markdown', '/informatie/2024/06/16/wat-is-een-goed-prompt-copy.html'],
  ['2024-06-19-genereer-een-rfp-template.markdown', '/word/2024/06/19/genereer-een-rfp-template.html'],
  ['2024-06-22-excel-vlookup.markdown', '/excel/2024/06/22/excel-vlookup.html'],
  ['2024-06-24-excel-kolom-toevoegen-dynamische-waarde.markdown', '/excel/2024/06/24/excel-kolom-toevoegen-dynamische-waarde.html'],
  ['2024-07-02-vraag-copilot-om-gamepc-advies.markdown', '/copilot/2024/07/02/vraag-copilot-om-gamepc-advies.html'],
  ['2024-07-07-excel-handelingen-automatiseren copy.markdown', '/excel/2024/07/07/excel-handelingen-automatiseren-copy.html'],
  ['2024-07-09-laat-copilot-je-helpen-met-je-prompt.markdown', '/copilot/2024/07/09/laat-copilot-je-helpen-met-je-prompt.html'],
  ['2024-07-11-quiz-maken-met-copilot.markdown', '/copilot/2024/07/11/quiz-maken-met-copilot.html'],
  ['2024-08-15-gebruik-copilot-om-data-te-analyseren.markdown', '/copilot/2024/08/14/gebruik-copilot-om-data-te-analyseren.html'],
  ['2024-08-27-gebruik-copilot-om-de-beste-titel-te kiezen-voor-een-pers-aankondiging.markdown', '/copilot/2024/08/27/gebruik-copilot-om-de-beste-titel-te-kiezen-voor-een-pers-aankondiging.html'],
];
const refresh = {
  'wat-is-een-goed-prompt-copy': '/verhalen/een-goede-prompt/',
  'laat-copilot-je-helpen-met-je-prompt': '/verhalen/samen-je-prompt-verbeteren/',
};

export async function loadSource(contentRoot = root) {
  const read = (file) => readFile(path.join(contentRoot, file), 'utf8');
  const sitemap = await read('docs/baseline/legacy-sitemap.xml');
  const feed = await read('docs/baseline/legacy-feed.xml');
  const originals = (await readdir(path.join(contentRoot, '_posts'))).filter((file) => file.endsWith('.markdown'));
  if (originals.length !== manifest.length || originals.some((file) => !manifest.some(([source]) => source === file))) {
    throw new Error('Legacy sources differ from the verified migration manifest. Review the manifest before building.');
  }
  const stories = [];
  const videos = [];
  for (const [source, url] of manifest) {
    if (!sitemap.includes(`http://copilotlab.nl${url}</loc>`)) throw new Error(`Route not in deployed sitemap: ${url}`);
    const { data, content } = matter(await read(`_posts/${source}`));
    const id = path.posix.basename(url, '.html');
    const videoIds = [...content.matchAll(videoPattern)].map((match) => match[1]);
    const body = content.replace(videoPattern, (_, videoId) => `\n\n<!-- video:${videoId} -->\n\n`);
    if (/\{%|\{\{/.test(body)) throw new Error(`Unconverted Liquid in ${source}`);
    const title = String(data.title).replace(/"$/, '');
    const published = new Date(data.date).toISOString();
    const topic = String(data.categories).toLowerCase();
    stories.push({
      id, title, url, published, topic, language: 'nl', status: 'archived', draft: false,
      description: `${title}. Een praktijkvoorbeeld uit het Copilot Lab-archief van 2024.`,
      body, videoIds, source, originalTitle: String(data.title),
      guid: `http://copilotlab.nl${url}`, art: topic === 'excel' ? 'data' : topic === 'word' ? 'workflow' : 'prompt',
      refreshedUrl: refresh[id],
    });
    for (const [index, youtubeId] of videoIds.entries()) {
      if (videos.some((video) => video.youtubeId === youtubeId)) continue;
      videos.push({
        id: youtubeId, youtubeId, title: `${title}${videoIds.length > 1 ? ` - voorbeeld ${index + 1}` : ''}`,
        description: 'Historische demonstratie bij dit artikel. De titel is een redactioneel label, niet de geverifieerde YouTube-titel.',
        url: `/videos/${youtubeId}/`, topic, language: 'nl', status: 'archived', draft: false,
        art: topic === 'excel' ? 'data' : 'workflow', storyUrl: url, storyTitle: title, body: '',
      });
    }
  }
  for (const file of (await readdir(path.join(contentRoot, 'src/content/stories'))).filter((file) => file.endsWith('.md'))) {
    const { data, content } = matter(await read(`src/content/stories/${file}`));
    const id = path.basename(file, '.md');
    if (!data.title || !data.description || !data.published) throw new Error(`Incomplete editorial metadata: ${file}`);
    if (typeof data.draft !== 'boolean') throw new Error(`draft must be true or false: ${file}`);
    const status = data.status ?? 'published';
    if (status === 'refreshed' && !data.originalUrl) throw new Error(`Refreshed edition needs originalUrl: ${file}`);
    if (/\{%|\{\{/.test(content)) throw new Error(`Unsupported Liquid in new story: ${file}`);
    const videoIds = [...content.matchAll(/<!-- video:([A-Za-z0-9_-]{11}) -->/g)].map((match) => match[1]);
    stories.push({
      ...data, id, url: `/verhalen/${id}/`, published: new Date(data.published).toISOString(),
      language: 'nl', status, draft: Boolean(data.draft),
      body: content, videoIds, guid: `https://copilotlab.nl/verhalen/${id}/`,
    });
  }
  for (const file of (await readdir(path.join(contentRoot, 'src/content/videos'))).filter((file) => file.endsWith('.md'))) {
    const { data, content } = matter(await read(`src/content/videos/${file}`));
    if (!/^[A-Za-z0-9_-]{11}$/.test(data.youtubeId ?? '') || !data.title || !data.description) throw new Error(`Incomplete video metadata: ${file}`);
    if (typeof data.draft !== 'boolean') throw new Error(`draft must be true or false: ${file}`);
    if (videos.some((video) => video.youtubeId === data.youtubeId)) throw new Error(`Duplicate YouTube ID in ${file}`);
    videos.push({
      ...data, id: data.youtubeId, url: `/videos/${data.youtubeId}/`, language: 'nl',
      status: 'published', draft: Boolean(data.draft), body: content,
      published: data.published ? new Date(data.published).toISOString() : undefined,
    });
  }
  const urls = stories.map((story) => story.url);
  if (new Set(urls).size !== urls.length) throw new Error('Duplicate story URLs');
  for (const story of stories) {
    if (story.refreshedUrl && !stories.some((candidate) => candidate.url === story.refreshedUrl && !candidate.draft)) throw new Error(`Missing refreshed edition: ${story.id}`);
    if (story.originalUrl && !urls.includes(story.originalUrl)) throw new Error(`Missing archive reference: ${story.id}`);
    if (!['archived', 'refreshed', 'published'].includes(story.status)) throw new Error(`Invalid editorial status: ${story.id}`);
    if ((story.body.match(/<!--\s*video:/g) ?? []).length !== story.videoIds.length) throw new Error(`Malformed video marker in ${story.id}`);
    for (const videoId of story.videoIds) {
      if (!videos.some((video) => video.youtubeId === videoId && (story.draft || !video.draft))) throw new Error(`Missing or unpublished video ${videoId} in ${story.id}`);
    }
  }
  const feedGuids = [...feed.matchAll(/<guid[^>]*>([^<]+)<\/guid>/g)].map((match) => match[1]);
  if (feedGuids.some((guid) => !stories.some((story) => story.guid === guid))) throw new Error('A legacy RSS GUID was lost');
  return { stories, videos, manifest };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { stories, videos } = await loadSource();
  await mkdir(path.join(root, '.generated'), { recursive: true });
  await writeFile(path.join(root, '.generated/stories.json'), JSON.stringify(stories, null, 2));
  await writeFile(path.join(root, '.generated/videos.json'), JSON.stringify(videos, null, 2));
  await mkdir(path.join(root, 'public'), { recursive: true });
  await cp(path.join(root, 'assets'), path.join(root, 'public/assets'), { recursive: true });
  console.log(`Validated ${stories.length} stories (${stories.filter((story) => story.status === 'archived').length} archived), ${videos.length} videos and legacy feed GUIDs.`);
}
