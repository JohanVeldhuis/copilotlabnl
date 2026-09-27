import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';
import { isTopic } from './lib/topics';

const articles = defineCollection({
  loader: file('.generated/articles.json'),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.string().startsWith('/'),
    published: z.iso.datetime(),
    topic: z.string().refine(isTopic, 'Unknown article topic'),
    language: z.literal('nl'),
    status: z.literal('published'),
    draft: z.boolean(),
    body: z.string(),
    guid: z.url(),
    art: z.enum(['prompt', 'dialogue', 'data', 'workflow']),
  }),
});

export const collections = { articles };
