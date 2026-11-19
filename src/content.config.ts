import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_SLUGS } from './data/categories';

const categoryEnum = z.enum(CATEGORY_SLUGS);

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(170),
      category: categoryEnum,
      brand: z.string(),
      productName: z.string(),
      rating: z.number().min(0).max(10).multipleOf(0.1),
      price: z.number().nonnegative(),
      priceNote: z.string().optional(),
      pros: z.array(z.string()).min(1),
      cons: z.array(z.string()).min(1),
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      affiliateLinks: z
        .array(
          z.object({
            retailer: z.string(),
            url: z.url(),
            price: z.number().nonnegative().optional(),
          }),
        )
        .default([]),
      heroImage: image(),
      heroAlt: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      verdict: z.string(),
      bestFor: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      /** Renders a "Sample review — placeholder content" badge. */
      sample: z.boolean().default(false),
    }),
});

const roundups = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/roundups' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(170),
      /** Primary category, or "mixed" for cross-category kit guides. */
      category: z.union([categoryEnum, z.literal('mixed')]),
      heroImage: image(),
      heroAlt: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      intro: z.string(),
      picks: z
        .array(
          z.object({
            review: reference('reviews'),
            award: z.string(),
            blurb: z.string(),
          }),
        )
        .min(1),
      /** Spec labels (matching reviews' specs[].label) to show as comparison-table columns. */
      comparisonFields: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      sample: z.boolean().default(false),
    }),
});

export const collections = { reviews, roundups };
