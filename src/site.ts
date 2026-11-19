export const SITE = {
  name: 'Upgrade My Run',
  url: 'https://upgrademyrun.com',
  tagline: 'Gear that earns its miles.',
  description:
    'Independent running gear reviews and recommendations — shoes, GPS watches, headphones and apparel, tested on real miles at dawn.',
  locale: 'en_US',
  ogDefault: '/og-default.jpg',
  themeColorDark: '#0B1220',
  themeColorLight: '#F4EFE6',
} as const;

export const NAV = [
  { href: '/reviews/', label: 'Reviews' },
  { href: '/shoes/', label: 'Shoes' },
  { href: '/watches/', label: 'Watches' },
  { href: '/audio/', label: 'Audio' },
  { href: '/apparel/', label: 'Apparel' },
  { href: '/best/', label: 'Best Of' },
] as const;
