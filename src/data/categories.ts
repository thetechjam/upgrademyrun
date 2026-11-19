import type { ImageMetadata } from 'astro';
import catShoes from '../assets/images/cat-shoes.webp';
import catWatches from '../assets/images/cat-watches.webp';
import catAudio from '../assets/images/cat-audio.webp';
import catApparel from '../assets/images/cat-apparel.webp';

export const CATEGORY_SLUGS = ['shoes', 'watches', 'audio', 'apparel'] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  banner: ImageMetadata;
  bannerAlt: string;
}

export const CATEGORIES: Record<CategorySlug, Category> = {
  shoes: {
    slug: 'shoes',
    name: 'Running Shoes',
    shortName: 'Shoes',
    tagline: 'Every mile starts at the ground.',
    description:
      'Daily trainers, tempo shoes and race-day rockets — tested for fit, ride and durability across hundreds of real miles.',
    banner: catShoes,
    bannerAlt: 'Running shoes on wet asphalt in blue pre-dawn light with an orange accent glow',
  },
  watches: {
    slug: 'watches',
    name: 'GPS Watches',
    shortName: 'Watches',
    tagline: 'Know your pace. Own your data.',
    description:
      'GPS accuracy, battery life, training metrics and everyday wearability — the watches worth strapping on before sunrise.',
    banner: catWatches,
    bannerAlt: 'A GPS running watch on a runner’s wrist in cool blue-hour light',
  },
  audio: {
    slug: 'audio',
    name: 'Headphones & Audio',
    shortName: 'Audio',
    tagline: 'Your soundtrack, locked in.',
    description:
      'Open-ear, bone-conduction and sport earbuds judged on fit, stability, sound and situational awareness on the road.',
    banner: catAudio,
    bannerAlt: 'Sport headphones resting on a running track at dawn',
  },
  apparel: {
    slug: 'apparel',
    name: 'Apparel',
    shortName: 'Apparel',
    tagline: 'Dressed for the dark miles.',
    description:
      'Jackets, layers, shorts and visibility kit for runners who head out before the sun does.',
    banner: catApparel,
    bannerAlt: 'Running apparel in deep navy tones with reflective orange details',
  },
};

export const CATEGORY_LIST: Category[] = CATEGORY_SLUGS.map((s) => CATEGORIES[s]);

export function getCategory(slug: CategorySlug): Category {
  return CATEGORIES[slug];
}
