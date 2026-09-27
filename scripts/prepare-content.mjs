import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';

export const root = fileURLToPath(new URL('../', import.meta.url));

export async function loadSource(contentRoot = root) {
  const articles = [];
  const contentDirectory = path.join(contentRoot, 'src/content/articles');
  for (const file of (await readdir(contentDirectory)).filter((entry) => entry.endsWith('.md'))) {
    const { data, content } = matter(await readFile(path.join(contentDirectory, file), 'utf8'));
    const id = path.basename(file, '.md');
    if (!data.title || !data.description || !data.published) throw new Error(`Incomplete article metadata: ${file}`);
    if (typeof data.draft !== 'boolean') throw new Error(`draft must be true or false: ${file}`);
    const status = data.status ?? 'published';
    if (status !== 'published') throw new Error(`Unsupported article status: ${status} in ${file}`);
    if (/\{%|\{\{|<!--\s*video:/.test(content)) throw new Error(`Unsupported template or video marker in article: ${file}`);
    articles.push({
      ...data,
      id,
      url: `/artikelen/${id}/`,
      published: new Date(data.published).toISOString(),
      language: 'nl',
      status,
      draft: Boolean(data.draft),
      body: content,
      guid: `https://copilotlab.nl/artikelen/${id}/`,
    });
  }
  const urls = articles.map((article) => article.url);
  if (new Set(urls).size !== urls.length) throw new Error('Duplicate article URLs');
  return { articles };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { articles } = await loadSource();
  await mkdir(path.join(root, '.generated'), { recursive: true });
  await writeFile(path.join(root, '.generated/articles.json'), JSON.stringify(articles, null, 2));
  console.log(`Validated ${articles.length} articles.`);
}
