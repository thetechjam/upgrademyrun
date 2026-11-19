# Upgrade My Run

**[upgrademyrun.com](https://upgrademyrun.com)**: independent running gear reviews and recommendations. Shoes, GPS watches, headphones and apparel, tested on real miles at dawn.

The site is a statically generated magazine. Reviews and "best of" roundups are MDX files in content collections. Affiliate links come from each review's frontmatter.

## Stack

- **[Astro 7](https://astro.build)**, static output (`output: 'static'`)
- **TypeScript** in strict mode
- **MDX** content collections (`@astrojs/mdx`), with schemas validated by zod in `src/content.config.ts`
- **Hand-written CSS** using custom-property design tokens in `src/styles/`. No CSS framework.
- **Fontsource** self-hosted fonts: Anton (display), Inter (UI/sans), Source Serif 4 (body copy)
- **`astro:assets`** for responsive, optimized images (`<Image>` / `<Picture>`)
- **`@astrojs/sitemap`** for the sitemap and **`@astrojs/rss`** for the RSS feed

## Requirements

- **Node 24** (pinned in `.nvmrc`; run `nvm use`)
- npm

## Commands

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm install`     | Install dependencies                                  |
| `npm run dev`     | Start the dev server at `http://localhost:4321`       |
| `npm run build`   | Build the static site into `dist/`                    |
| `npm run preview` | Serve the built `dist/` locally                       |
| `npm run check`   | Type-check `.astro`/`.ts` files and validate content |

## Project structure

```
.
├── public/                    # Static files copied as-is (favicon, robots.txt, OG fallback)
├── src/
│   ├── assets/images/         # Source raster images, processed by astro:assets
│   ├── components/            # Reusable .astro components (ReviewCard, BuyButtons, ...)
│   ├── content/
│   │   ├── reviews/           # One MDX file per review  -> /reviews/<slug>/
│   │   └── roundups/          # One MDX file per roundup -> /best/<slug>/
│   ├── content.config.ts      # Collection schemas (zod)
│   ├── data/categories.ts     # Category slugs, names, banners
│   ├── layouts/               # Page layouts (BaseLayout, ...)
│   ├── lib/                   # Helpers (JSON-LD, sorting, formatting)
│   ├── pages/                 # File-based routes
│   ├── styles/                # Global CSS and design tokens
│   └── site.ts                # Site metadata and navigation
├── astro.config.mjs
├── netlify.toml
└── .github/workflows/ci.yml
```

See [`CLAUDE.md`](./CLAUDE.md) for step-by-step guides to adding reviews, roundups and categories.

## Deployment

The site is hosted on **Netlify**.

- `netlify.toml` sets the build command `npm run build` and the publish directory `dist`.
- CI (`.github/workflows/ci.yml`) runs `npm run check` and `npm run build` on every push and pull request.

### Domains

- **Primary:** `upgrademyrun.com` (apex)
- `www.upgrademyrun.com`, `upgrademyruns.com` and `www.upgrademyruns.com` all **301-redirect to the apex** through redirect rules in `netlify.toml`.

> **Important:** Netlify only applies these redirects if **both** `upgrademyrun.com` and `upgrademyruns.com` are added to the Netlify site, as the primary domain and as a domain alias. Without the alias, requests to `upgrademyruns.com` never reach the site.

## Content note

The reviews and roundup in the repo right now are **samples** (`sample: true`) about a fictional brand, "Example Co.". They exist to exercise layouts and should be replaced or removed before launch.
