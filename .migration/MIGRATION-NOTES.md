# Fréscopa Home Page — Migration Notes

Migration of the Figma "Frescopa 2026 Summit" home page to Edge Delivery Services.
Page content: `content/frescopa-home.plain.html` (preview at `/content/frescopa-home`).

---

## ⚠️ Header & Footer wiring (read before publishing)

The `header` and `footer` blocks load their content from **content fragments**, not
from the page body. By default `header.js` loads `/nav` and `footer.js` loads
`/footer`. Our Fréscopa content lives at **`/content/nav`** and **`/content/footer`**
(because the local dev server runs with `--html-folder content`, so everything is
served under `/content/`).

To point the blocks at the right fragments, the page carries a **metadata block** at
the end of `content/frescopa-home.plain.html`:

```
| metadata |          |
| -------- | -------- |
| nav      | /content/nav    |
| footer   | /content/footer |
```

This renders as `<meta name="nav" content="/content/nav">` /
`<meta name="footer" content="/content/footer">` in the page head, which
`getMetadata('nav')` / `getMetadata('footer')` read.

**At publish time**, confirm the nav/footer fragments live at paths that match this
metadata (or update the metadata to the real published paths, e.g. `/nav` and
`/footer` if the fragments are published at the site root). Without correct metadata,
the header/footer fall back to `/nav` and `/footer`, which may proxy stale/default
content.

### Block code changes (beyond boilerplate)
- **`blocks/header/header.js`** — added an optional **announcement bar**: a 4th nav
  section (the "Free shipping…" strip) is extracted *before* the hamburger is
  prepended (to avoid a child-index shift) and rendered as `.nav-announcement-bar`
  above the nav.
- **`blocks/footer/footer.js`** — labels the three top-level fragment sections as
  `.footer-brand`, `.footer-links`, `.footer-legal` *after* load. Footer content is
  kept **classless** on purpose: class names on `div.section > div > div` are treated
  as EDS block names by the decorator and would 404.
- **`blocks/header/header-tokens.css`**, **`blocks/footer/footer-tokens.css`** — new
  design-token files for the Fréscopa header/footer styling.

---

## Placeholder images (need real assets)

Image export from Figma was rate-limited during migration, so **all imagery is
placeholder SVGs** in `content/images/frescopa-home/`. Replace before launch:

| Placeholder file | Real asset needed |
| ---------------- | ----------------- |
| `hero-atelier-bg.svg` | Hero espresso-machine photo |
| `store-locator-map.svg` | Chicago store-locator map |
| `product-house-blend.svg`, `product-smart-machine.svg`, `product-travel-thermos.svg` | Top-seller product photos |
| `quiz-banner-bg.svg` | Coffee-quiz sunset photo |
| `icon-machines.svg`, `icon-bagged-coffee.svg`, `icon-coffee-pods.svg`, `icon-bundles.svg`, `icon-accessories.svg` | Category line-art icons |
| `feature-morning-muse.svg`, `feature-doorstep.svg` | Feature-panel photos |
| `rewards-gift.svg` | Rewards gift graphic |

---

## CTA links

All CTA links currently point to `#` placeholders (Hero, Store Locator Search,
Shop Now buttons, Coffee Quiz, Show All Products, feature CTAs, Claim Rewards).
Wire real destination URLs before launch.

---

## Blocks created (5 total for 7 body sections)

| Block | Section(s) | Notes |
| ----- | ---------- | ----- |
| `hero-atelier` | Hero | Full-bleed image + dark scrim + two pill CTAs |
| `columns-locator` | Store Locator | Terracotta promo panel + map (2-col) |
| `cards-product` | Top Sellers **and** Feature columns | `.feature` modifier for 2-up flat panels |
| `cards-category` | Shop all products | Compact icon cards |
| `hero-quiz` | Coffee Quiz banner **and** Rewards banner | `.rewards` modifier for full-width teal band |

Card blocks use shadow-based cards (no borders), per design review.

## Other

- **Store Locator zip input**: the Figma design has a text input beside the Search
  button. Authored EDS content doesn't produce form fields, so the Search CTA is a
  button. A working zip search would need a small custom form enhancement.
