import type { APIRoute } from 'astro';
import { getStories, getVideos, topicLabels, escapeXml, site } from '../lib/content';

export const GET: APIRoute = async () => {
  const paths = ['/', '/verhalen/', '/videos/', '/over/', '/privacy/', '/posts/',
    ...Object.keys(topicLabels).map((topic) => `/onderwerpen/${topic}/`),
    ...(await getStories()).map((story) => story.data.url),
    ...(await getVideos()).map((video) => video.data.url)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXml(site + path)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
