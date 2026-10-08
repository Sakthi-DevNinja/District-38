# District 38 catalog extractor

Turns the products on one or more source websites into a **staging folder**
that the VEYONN import engine loads (`npm run import -- all --dir …` in the
backend). Nothing here talks to VEYONN; it only reads the source sites.

```
source sites ──► extract.mjs ──► catalog-data/staging/*.csv + images/
                                  │ owner reviews in Google Sheets,
                                  │ sets status NEW → APPROVED / SKIP
                                  ▼
                       backend: npm run import -- all --dir catalog-data/staging
```

Requires Node 20+. No packages to install.

## 1. Check a site first

```bash
node tools/catalog-extractor/extract.mjs recon https://some-shop.in --contact district38ops@gmail.com
```

Prints the shop platform (Shopify, WooCommerce, or "any site" via its
sitemap), five sample products with price, sizes, image count and category,
and how many requests robots.txt blocked.

## 2. Configure

Copy the examples next to each other and edit:

- `sources.json` (from `sources.example.json`): the sites, in priority order.
  When the same product is on more than one site, the first site's listing
  is kept and the others are skipped (`reports/skipped-duplicates.csv`).
  `adapter` is `auto`, `shopify`, `woocommerce` or `jsonld`. For `jsonld`,
  `productUrlPattern` picks product pages out of the sitemap.
- `category-map.json`: source category name → District 38 category path
  (`"Riding Jackets": "Riding Gear > Jackets"`), optionally with an HSN code.
  Unmapped categories are listed in `reports/unmapped-categories.csv`.
- `brand-map.json`: fixes brand spellings (`"AXOR": "Axor"`).
- In `sources.json` also:
  - `titleCase: true` on a source whose names are ALL CAPS ("AZ HELMET LOCK" →
    "AZ Helmet Lock"; codes like LS2, KTM, ECE, GP stay in capitals).
  - `knownBrands`: brands to recognise when a product's brand field is empty,
    from its categories or the start of its name. Nothing else is guessed;
    products with no recognisable brand keep a blank brand.
  - `fitmentCategories`: bike-model categories ("KTM", "ROYAL ENFIELD") turned into
    tags like `fits-ktm` instead of being treated as brands or product types.
    Use an object to fix a name: `{ "APRILLA": "Aprilia" }`.
- In `category-map.json`, `""` ignores a category ("Flash sale"), and
  `refine` picks a subcategory by keyword, e.g. helmets into Full Face,
  Modular, Open Face, Off-Road & Adventure or Kids.

## 3. Extract

```bash
node tools/catalog-extractor/extract.mjs run --config tools/catalog-extractor/sources.json --limit 20
node tools/catalog-extractor/extract.mjs run --config tools/catalog-extractor/sources.json
```

`--limit` is for a quick trial. Output goes to `catalog-data/` (git-ignored):

| Path | What |
|---|---|
| `staging/brands.csv … images.csv` | The six import sheets, exact template columns, every row `status=NEW` |
| `staging/images/<productCode>/01.jpg…` | Every gallery image, in site order; `01` is the main image |
| `reports/needs-review.csv` | Products missing a brand, category, price, images, sizes or certification, and possible duplicates |
| `reports/needs-photo.csv` | Products with no photo on any source: they import as unpublished drafts until staff add one |
| `reports/skipped-duplicates.csv` | Listings skipped because the product was already taken from an earlier site, with both prices |
| `reports/unmapped-categories.csv` | Source categories to add to `category-map.json` |
| `snapshots/<site>-<time>.json` | What each site showed on that run (evidence) |
| `raw/` | Cached responses; re-runs don't hit the sites again (`--refresh` to re-fetch) |

Re-running is safe: cached pages and downloaded images are reused.

## How it behaves on the source sites

- One request at a time, 1.5 s apart by default (`delayMs`), images 0.5 s.
- Identifies itself as `District38CatalogBot/1.0 (+contact)`.
- Honours robots.txt `Disallow` rules; blocked pages are skipped and counted.
- Retries server errors and 429s with growing pauses.

## What it fills in, and what the owner checks

- **Duplicates:** the same brand with the same significant words (any order,
  ignoring filler like "helmet", "motorcycle", "new") is one product, taken
  whole from the first site; the others are skipped and reported. Similar
  but not identical names (Matt vs Gloss Black) are kept and flagged as
  "possible duplicate of …" for the owner.
- **productCode** from the key (`AXOR-APEX-PRO`); **SKU** from the site, or
  `PRODUCTCODE-COLOUR-SIZE`.
- **Sizes** normalised (`Medium` → `M`, `2XL` → `XXL`); numeric sizes kept.
- **Price rule (D3):** the site's price is the selling price; MRP only when
  the site shows a higher crossed-out price. No discount is ever invented.
- **Certification** suggested from the text (`22.06` → `ECE 22.06`) and the
  matching collection tag added (`ece-22.06`). Owner confirms.
- **Descriptions** are copied as plain text. Rewrite them in our own words
  before approving unless the source site has given permission (D4).
- **Status** is `NEW` on every row. Only `APPROVED` rows are imported, so
  nothing reaches the shop until the owner approves it.

Collection tags for the storefront (`touring`, `monsoon`, `city`,
`adventure`, `track`, `ece-22.06`) go in the products' `tags` column; see
`src/lib/collections.ts`.

## Products without a website

`templates/` has the six sheets with one example row each. Fill them in by
hand (or in Google Sheets → File → Download → CSV) and put images in
`images/<productCode>/01.jpg, 02.jpg…` next to them.

## Tests

```bash
node --test tools/catalog-extractor/test/extract.test.mjs
```

Runs fake local Shopify and plain-HTML shops through the whole pipeline
(merging, prices, sizes, images, robots.txt) without using the internet.
