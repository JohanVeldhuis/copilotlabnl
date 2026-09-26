import { getCollection } from 'astro:content';

export const channel = 'https://www.youtube.com/channel/UC1oJD2I_ZahduVkdOLyG-iQ/';
export const site = 'https://copilotlab.nl';
export const topicLabels: Record<string, string> = {
  prompting: 'Slimmer prompten', informatie: 'De basis', copilot: 'Copilot', excel: 'Excel', word: 'Word',
};
export const topicLabel = (topic: string) => topicLabels[topic] ?? topic;
export const dateLabel = (date: string) => new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'Europe/Amsterdam' }).format(new Date(date));
export async function getStories() {
  return (await getCollection('stories', ({ data }) => !data.draft))
    .sort((a, b) => b.data.published.localeCompare(a.data.published) || a.id.localeCompare(b.id));
}
export const getVideos = () => getCollection('videos', ({ data }) => !data.draft);
export const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);
