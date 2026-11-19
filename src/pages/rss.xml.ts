import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../site';
import { CATEGORIES } from '../data/categories';

export async function GET(context: APIContext): Promise<Response> {
  const reviews = (await getCollection('reviews', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: reviews.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/reviews/${entry.id}/`,
      categories: [CATEGORIES[entry.data.category].name],
    })),
    customData: '<language>en-us</language>',
  });
}
