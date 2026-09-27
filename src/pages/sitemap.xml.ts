import type { APIRoute } from 'astro';
import { getArticles, topics, escapeXml, site } from '../lib/content';

export const GET: APIRoute = async () => {
  const paths = ['/', '/artikelen/', '/over/', '/privacy/',
    ...topics.map((topic) => `/onderwerpen/${topic.slug}/`),
    ...(await getArticles()).map((article) => article.data.url)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXml(site + path)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
