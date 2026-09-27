import type { APIRoute } from 'astro';
import { getArticles, escapeXml, site } from '../lib/content';

export const GET: APIRoute = async () => {
  const articles = (await getArticles()).slice(0, 10);
  const items = articles.map(({ data }) => `<item><title>${escapeXml(data.title)}</title><description>${escapeXml(data.description)}</description><pubDate>${new Date(data.published).toUTCString()}</pubDate><link>${site}${data.url}</link><guid isPermaLink="true">${escapeXml(data.guid)}</guid><category>${escapeXml(data.topic)}</category></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Copilot Lab</title><description>Artikelen van Johan Veldhuis over werken met Copilot.</description><link>${site}/</link><atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
