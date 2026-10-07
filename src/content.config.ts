import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kind: z.enum(['Essay', 'Explainer', 'Comparison', 'Notes']),
    date: z.coerce.date(),
    /** Drafts render in `astro dev` only. */
    draft: z.boolean().default(false),
  }),
});

const learn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/learn' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, learn };
