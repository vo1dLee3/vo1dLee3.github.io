import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { slug } from './utils/slug';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => slug(entry),
  }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().optional(),
    })
    .passthrough(),
});

export const collections = { blog };
