# CLAUDE.md: Upgrade My Run

Conventions and how-tos for agents working on this repo.

## Overview

**Upgrade My Run** (https://upgrademyrun.com) is a static running-gear reviews magazine covering shoes, GPS watches, headphones/audio and apparel. Content is MDX in Astro content collections. The site earns money through affiliate links.

**Stack:** Astro 7 (static), TypeScript strict, MDX, hand-written CSS with custom-property design tokens (`src/styles/`), Fontsource self-hosted fonts (Anton, Inter, Source Serif 4), `astro:assets` images, `@astrojs/sitemap`, `@astrojs/rss`. Node 24 (`.nvmrc`).

**Commands:**

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # -> dist/
npm run preview
npm run check     # astro check: types + content schema validation
```

### Verify checklist (before every commit)

1. `npm run check && npm run build` must pass with **zero errors**. Treat warnings as worth fixing.
2. Optional: run `npm run preview` and take Playwright screenshots of the pages you touched, at mobile (390px) and desktop (1440px) widths, in both dark and light schemes.
3. Make sure every internal link ends with `/` (see SEO conventions).
4. Do not push or deploy without operator review.

## Key files

| Path                                | Purpose                                                    |
| ----------------------------------- | ---------------------------------------------------------- |
| `src/content.config.ts`             | zod schemas for `reviews` and `roundups` (source of truth) |
| `src/content/reviews/<slug>.mdx`    | Reviews, served at `/reviews/<slug>/`                      |
| `src/content/roundups/<slug>.mdx`   | Roundups, served at `/best/<slug>/`                        |
| `src/data/categories.ts`            | `CATEGORY_SLUGS` + `CATEGORIES` metadata                   |
| `src/site.ts`                       | `SITE` metadata and `NAV`                                  |
| `src/assets/images/`                | All raster images (processed by `astro:assets`)            |
| `src/layouts/BaseLayout.astro`      | HTML shell, `<head>`, canonical/OG/meta                    |
| `src/components/ReviewCard.astro`   | Review teaser card used in grids                           |
| `src/components/BuyButtons.astro`   | Affiliate buy buttons + disclosure                         |
| `src/lib/jsonld.ts`                 | JSON-LD structured-data helpers                            |
| `src/lib/content.ts`                | Collection helpers (getReviews, getRoundups, related reviews, formatters) — always use these so drafts are excluded |
| `src/components/ArtDirectedPicture.astro` | Art-directed <picture> (mobile/desktop crops, AVIF+WebP) for heroes |
| `src/styles/global.css`             | Design tokens + global styles                              |

---

## How to add a review

### 1. Create the file

`src/content/reviews/<slug>.mdx`. The filename is the slug, and the URL becomes `/reviews/<slug>/`. Use lowercase kebab-case, e.g. `acme-tempo-3.mdx`.

### 2. Add the hero image

- Path: `src/assets/images/review-<slug>.webp`
- **4:3** studio product shot, **at least 1600px wide**, WebP
- Follow the art direction below (Higgsfield-generated, blue-hour, single orange accent)

### 3. Frontmatter

Every field, matching `src/content.config.ts`:

```yaml
---
title: 'Acme Tempo 3 Review: Punchy Headline Here'   # required
description: 'One-sentence summary for SEO/cards.'   # required, aim for ≤160 chars (schema hard max 170)
category: shoes                                      # required: shoes | watches | audio | apparel
brand: 'Acme'                                        # required
productName: 'Acme Tempo 3'                          # required
rating: 8.7                                          # required, 0–10, one decimal place max
price: 140                                           # required, USD, number (no "$")
priceNote: 'MSRP; often on sale'                     # optional
pros:                                                # required, at least 1 (aim for 4–5)
  - 'Lively, stable cushioning'
cons:                                                # required, at least 1 (aim for 3)
  - 'Runs slightly narrow'
specs:                                               # optional (defaults to []), list of {label, value}
  - label: 'Weight'                                  # keep labels consistent across reviews (see below)
    value: '9.6 oz (272 g), US M9'
  - label: 'Drop'
    value: '8 mm'
affiliateLinks:                                      # optional (defaults to []), list of {retailer, url, price?}
  - retailer: 'Retailer Name'
    url: 'https://retailer.example/product?tag=xyz'  # must be a valid absolute URL
    price: 134.95                                    # optional, USD
heroImage: ../../assets/images/review-acme-tempo-3.webp  # required, path relative to this file
heroAlt: 'Studio shot of ... in blue-hour light'     # required, descriptive alt text
date: 2026-11-19                                     # required, publish date (YYYY-MM-DD)
updated: 2026-12-01                                  # optional, last meaningful update
verdict: 'One strong paragraph summing up the call.' # required
bestFor: 'High-mileage runners'                      # optional, short phrase
featured: false                                      # optional (default false)
draft: false                                         # optional (default false)
sample: false                                        # optional (default false); true shows a "Sample" badge
---
```

**Spec label conventions.** Roundup comparison tables look up specs by exact `label`, so reuse these spellings:

- All categories: `Weight`, `Water Rating`, `Best For`
- Shoes: `Stack Height`, `Drop`, `Midsole`, `Outsole`, `Upper`
- Watches: `Display`, `Battery (GPS)`, `Battery (Smartwatch)`, `GPS`, `Sensors`
- Audio: `Type`, `Battery`, `Charging Case`, `Connectivity`, `Controls`

### 4. Body structure

The page renders the title, so **no H1** in the body. Plain MDX, about 450–900 words:

1. **Lede.** One short paragraph, magazine voice.
2. `## Fit & Feel`
3. `## On the Run`
4. One or two category-specific H2s, e.g. `## Durability` (shoes), `## Battery & GPS` (watches), `## Sound & Awareness` (audio), `## Weather Protection` (apparel)
5. `## Who It's For`

### 5. Affiliate links

- **Always put purchase links in frontmatter `affiliateLinks`.** `BuyButtons` renders them with `rel="sponsored nofollow noopener"` and `target="_blank"`, and shows the affiliate disclosure automatically next to the buttons.
- If you need an inline affiliate link in the body, write the HTML by hand with the same attributes:
  ```html
  <a href="https://retailer.example/..." rel="sponsored nofollow noopener" target="_blank">Retailer</a>
  ```
  Never use a bare Markdown link for an affiliate URL.

### 6. Flags

- **`featured: true`** puts the review in the home page featured grid. Keep **2–4** reviews featured at any time.
- **`draft: true`** removes the review from every page, category listing, the sitemap and RSS. Its URL is not generated.
- **`sample: true`** marks placeholder content. **Remove it (or set it to `false`) for real reviews**, along with any "Sample review" note in the body.

### 7. Add it to a roundup (optional)

Add an entry to a roundup's `picks`:

```yaml
picks:
  - review: acme-tempo-3        # review slug (filename without .mdx)
    award: 'Best Tempo Shoe'
    blurb: 'One or two sentences on why it earned the spot.'
```

### 8. Verify

`npm run check && npm run build`. Schema errors (bad category, rating like `8.75`, invalid URL, missing image) fail the check.

---

## How to add a roundup

File: `src/content/roundups/<slug>.mdx` is served at **`/best/<slug>/`**.

```yaml
---
title: 'Best Running Shoes for Daily Training'
description: '≤160 chars for SEO/cards.'
category: shoes            # shoes | watches | audio | apparel | mixed (cross-category kit guides)
heroImage: ../../assets/images/<image>.webp   # 16:9 recommended
heroAlt: '...'
date: 2026-11-19
updated: 2026-12-01        # optional
intro: '2–3 sentence intro shown above the picks.'
picks:                     # at least 1; each `review` must be an existing review slug
  - review: acme-tempo-3
    award: 'Best Overall'
    blurb: '1–2 sentences.'
comparisonFields:          # optional; spec labels to show as comparison-table columns
  - 'Weight'
  - 'Drop'
featured: false
draft: false
sample: false
---
```

- `comparisonFields` must **exactly match** `specs[].label` values in the picked reviews (case and punctuation included). A pick without that label shows an em dash (—). For mixed-category roundups, choose labels shared across categories (`Weight`, `Water Rating`, `Best For`).
- Body: about 250–600 words, with H2s such as `## How We Chose` and `## What to Look For`. No H1.
- A `review` reference to a missing slug fails the build.

---

## How to add a category

1. In `src/data/categories.ts`:
   - Add the slug to `CATEGORY_SLUGS` (the zod `category` enum in `content.config.ts` is derived from it automatically).
   - Add an entry to `CATEGORIES` with `slug`, `name`, `shortName`, `tagline`, `description`, `banner` and `bannerAlt`.
   - Import its banner: a **16:9** image at `src/assets/images/cat-<slug>.webp`.
2. Add a nav link to `NAV` in `src/site.ts`: `{ href: '/<slug>/', label: '...' }` (with the trailing slash).
3. The category page `/<slug>/` is generated automatically from `CATEGORY_SLUGS`, so you don't need a new page file.
4. Run `npm run check && npm run build`.

---

## Image art direction

- All imagery is **generated in Higgsfield**. No stock photos.
- Look: **cinematic blue-hour dawn**, deep navy/slate shadows (`#0B1220`), **one safety-orange accent** (`#FF5A1F`), subtle film grain, editorial magazine feel.
- **No real brand logos, no real products.** Products are generic and unbranded.
- Formats: product/review shots **4:3** studio; category banners and roundup heroes **16:9**. WebP, at least 1600px wide.
- Naming: `review-<slug>.webp`, `cat-<slug>.webp`, descriptive kebab-case for everything else.
- **Always render through `astro:assets` `<Image>` / `<Picture>`.** Never use a raw `<img>` for raster files in `src/assets/`.
- Loading: the **hero/LCP image** gets `loading="eager"` and `fetchpriority="high"`. **Everything else is lazy** (the default).
- Always write meaningful `alt` text (`heroAlt`, `bannerAlt`).

## Design tokens & front-end conventions

- Colors, type scale, spacing and radii are CSS custom properties in **`src/styles/global.css`**. Use tokens and don't hard-code values in components.
- Themes: **dark is the default** (navy `#0B1220`), with a **light "paper" theme** (`#F4EFE6`).
- **Orange is used sparingly**: one accent per view (CTA, rating, key highlight).
- Typography: Anton for display headlines, Inter for UI/labels, Source Serif 4 for long-form body.
- Respect **`prefers-reduced-motion`**. Gate non-essential animation and transitions behind it.
- **Minimal JS**, as progressive enhancement only. Every page must work with JavaScript disabled.
- Component styles are scoped `<style>` blocks in `.astro` files. Global rules belong only in `src/styles/`.

## SEO conventions

- `trailingSlash: 'always'`: **every internal link must end with `/`** (`/reviews/`, `/best/<slug>/`, `/shoes/`).
- Canonical URLs, Open Graph and Twitter meta come from **`BaseLayout`** props (`title`, `description`, `image`, etc.). Don't hand-write `<meta>` tags in pages.
- Structured data (Review, Product, ItemList, BreadcrumbList, and so on) comes from helpers in **`src/lib/jsonld.ts`**. Reuse them and don't inline JSON-LD by hand.
- Keep `description` at 160 characters or fewer. One H1 per page (rendered by the layout or page from `title`).
- Drafts are excluded from the sitemap and RSS.

## Deployment

- Hosted on **Netlify**. `netlify.toml` builds with `npm run build` and publishes `dist`.
- CI: `.github/workflows/ci.yml` runs `npm run check` and `npm run build`.
- **Do not push, merge or deploy without operator review.**
- Domains: `upgrademyrun.com` is primary (apex). `www.upgrademyrun.com`, `upgrademyruns.com` and `www.upgrademyruns.com` 301 to the apex through `netlify.toml` redirects. Both `upgrademyrun.com` and `upgrademyruns.com` must be added to the Netlify site (primary domain + domain alias) for the redirects to work.

## Don'ts

- Don't use real brand names or real retailer names in sample/placeholder content.
- Don't put affiliate URLs in plain Markdown links.
- Don't use raw `<img>` for files in `src/assets/`.
- Don't commit secrets (`.env`, tokens) or `dist/`.

## Screenshots (optional visual QA)

`npm run build && npx astro preview`, then use Playwright (via `npx`, not a project dependency) to capture `/`, a review, a category, a roundup and `/404/` at 1440×900 and 390×844 in both `colorScheme: 'dark'` and `'light'`. Check for horizontal overflow (`document.documentElement.scrollWidth > innerWidth`) — note that absolutely-positioned `.sr-only` elements inside scroll containers need a positioned ancestor.
