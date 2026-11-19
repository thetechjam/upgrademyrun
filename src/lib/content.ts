import { getCollection, type CollectionEntry } from 'astro:content';
import type { CategorySlug } from '../data/categories';

export type Review = CollectionEntry<'reviews'>;
export type Roundup = CollectionEntry<'roundups'>;

const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) => b.data.date.valueOf() - a.data.date.valueOf();

export async function getReviews(category?: CategorySlug): Promise<Review[]> {
  const all = await getCollection('reviews', ({ data }) => !data.draft && (!category || data.category === category));
  return all.sort(byDateDesc);
}

export async function getRoundups(): Promise<Roundup[]> {
  const all = await getCollection('roundups', ({ data }) => !data.draft);
  return all.sort(byDateDesc);
}

/** Related reviews: same category first, then most recent others. */
export async function getRelatedReviews(review: Review, limit = 3): Promise<Review[]> {
  const others = (await getReviews()).filter((r) => r.id !== review.id);
  const same = others.filter((r) => r.data.category === review.data.category);
  const rest = others.filter((r) => r.data.category !== review.data.category);
  return [...same, ...rest].slice(0, limit);
}

export const reviewUrl = (id: string) => `/reviews/${id}/`;
export const roundupUrl = (id: string) => `/best/${id}/`;

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(d);

export const formatRating = (n: number) => n.toFixed(1);

export function specValue(review: Review, label: string): string | undefined {
  return review.data.specs.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value;
}
