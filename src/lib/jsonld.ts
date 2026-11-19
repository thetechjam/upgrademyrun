import { SITE } from '../site';

/** A JSON-LD node: a plain, JSON-serializable object. */
export type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

/** Resolve a path (or already-absolute URL) against the site origin. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE.url}/`).href;
}

function isoDate(date: Date): string {
  return date.toISOString();
}

export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon-512.png'),
      width: 512,
      height: 512,
    },
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Absolute URL or site-relative path. */
  url: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export interface OfferInput {
  retailer: string;
  url: string;
  price?: number;
}

export interface ReviewProductArgs {
  name: string;
  brand: string;
  description: string;
  /** Absolute URL (relative paths are resolved against the site). */
  image: string;
  url: string;
  rating: number;
  reviewBody?: string;
  datePublished: Date;
  dateModified?: Date;
  title: string;
  offers?: OfferInput[];
  /** Fallback/list price in USD, used when offers carry no prices. */
  price: number;
}

const IN_STOCK = 'https://schema.org/InStock';

function buildOffers(args: ReviewProductArgs, pageUrl: string): JsonLd {
  const priced = (args.offers ?? []).filter(
    (o): o is OfferInput & { price: number } => typeof o.price === 'number',
  );

  if (priced.length > 1) {
    const prices = priced.map((o) => o.price);
    return {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: priced.length,
      availability: IN_STOCK,
      url: pageUrl,
    };
  }

  const single = priced[0];
  const firstOffer = args.offers?.[0];
  return {
    '@type': 'Offer',
    price: single?.price ?? args.price,
    priceCurrency: 'USD',
    url: absoluteUrl(single?.url ?? firstOffer?.url ?? pageUrl),
    availability: IN_STOCK,
    ...(single ? { seller: { '@type': 'Organization', name: single.retailer } } : {}),
  };
}

export function reviewProductJsonLd(args: ReviewProductArgs): JsonLd {
  const pageUrl = absoluteUrl(args.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: args.name,
    brand: { '@type': 'Brand', name: args.brand },
    image: absoluteUrl(args.image),
    description: args.description,
    url: pageUrl,
    review: {
      '@type': 'Review',
      name: args.title,
      url: pageUrl,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: args.rating,
        bestRating: 10,
        worstRating: 0,
      },
      author: { '@type': 'Organization', name: SITE.name, url: absoluteUrl('/') },
      publisher: { '@id': ORG_ID },
      datePublished: isoDate(args.datePublished),
      ...(args.dateModified ? { dateModified: isoDate(args.dateModified) } : {}),
      ...(args.reviewBody ? { reviewBody: args.reviewBody } : {}),
    },
    offers: buildOffers(args, pageUrl),
  };
}

export interface ItemListArgs {
  name: string;
  url: string;
  items: { name: string; url: string; image?: string }[];
}

export function itemListJsonLd(args: ItemListArgs): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: args.name,
    url: absoluteUrl(args.url),
    numberOfItems: args.items.length,
    itemListElement: args.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.url),
      ...(item.image ? { image: absoluteUrl(item.image) } : {}),
    })),
  };
}
