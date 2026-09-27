import { getCollection } from 'astro:content';
import { isArticleVisible } from './publication';
export { topicLabel, topics } from './topics';

export const channel = 'https://www.youtube.com/channel/UC1oJD2I_ZahduVkdOLyG-iQ/';
export const site = 'https://copilotlab.nl';
export const dateLabel = (date: string) => new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'Europe/Amsterdam' }).format(new Date(date));
export async function getArticles() {
  return (await getCollection('articles', ({ data }) => isArticleVisible(data)))
    .sort((a, b) => b.data.published.localeCompare(a.data.published) || a.id.localeCompare(b.id));
}
export const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);
