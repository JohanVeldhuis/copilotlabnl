import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';

const stories = defineCollection({
  loader: file('.generated/stories.json'),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.string().startsWith('/'),
    published: z.iso.datetime(),
    topic: z.enum(['prompting', 'informatie', 'copilot', 'excel', 'word']),
    language: z.literal('nl'),
    status: z.enum(['archived', 'refreshed', 'published']),
    draft: z.boolean(),
    body: z.string(),
    videoIds: z.array(z.string().regex(/^[A-Za-z0-9_-]{11}$/)),
    guid: z.url(),
    art: z.enum(['prompt', 'dialogue', 'data', 'workflow']),
    source: z.string().optional(),
    originalTitle: z.string().optional(),
    originalUrl: z.string().optional(),
    refreshedUrl: z.string().optional(),
  }),
});
const videos = defineCollection({
  loader: file('.generated/videos.json'),
  schema: z.object({
    youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
    title: z.string(),
    description: z.string(),
    url: z.string().startsWith('/'),
    topic: z.enum(['prompting', 'informatie', 'copilot', 'excel', 'word']),
    language: z.literal('nl'),
    status: z.enum(['archived', 'published']),
    draft: z.boolean(),
    published: z.iso.datetime().optional(),
    body: z.string(),
    art: z.enum(['prompt', 'dialogue', 'data', 'workflow']),
    storyUrl: z.string().optional(),
    storyTitle: z.string().optional(),
  }),
});

export const collections = { stories, videos };
