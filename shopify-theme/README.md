# Karji Premium — Shopify Online Store 2.0 Homepage Theme

A premium, fully-responsive Shopify **Online Store 2.0** homepage built to match the
Karji / House of Karji design reference. Everything is JSON-template driven and fully
customizable from the **Theme Editor** — no hardcoded content.

## What's included

| Layer | Files |
|-------|-------|
| **Layout** | `layout/theme.liquid` |
| **Template** | `templates/index.json` (homepage) |
| **Section groups** | `sections/header-group.json`, `sections/footer-group.json` |
| **Sections** | `header`, `hero-banner`, `categories`, `featured-products`, `promotional-banner`, `bestsellers`, `service-features`, `perfume-needs` (dual banners), `brand-slider`, `about-section`, `newsletter`, `footer` |
| **Snippets** | `product-card`, `quick-view-modal` |
| **Assets** | `base.css`, `theme.js` |
| **Config** | `settings_schema.json`, `settings_data.json` |
| **Locales** | `locales/en.default.json` |

## Sections → reference layout

1. **Header** — announcement bar, sticky header, centered search, account / wishlist / cart icons, mega-menu nav, mobile drawer.
2. **Hero banner** — autoplay carousel with arrows + dots, per-slide image, text position & CTA.
3. **Categories** — "Shop by Categories" 4-up grid, pulls collection image/title or custom overrides.
4. **Featured products** — "Our Products" horizontal product slider with View All.
5. **Promotional banner** — large brand banner (e.g. BDK Parfums) + 3 mini image tiles.
6. **Bestsellers** — second product slider bound to a collection.
7. **Service features** — dark bar: Fast Delivery / Secure Payment / Customer Support.
8. **Dual banners** — "All Your Perfume Needs" two large linked banners.
9. **Brand slider** — "Top Brands" logo carousel with grayscale hover.
10. **About section** — "Welcome to The House of Karji" richtext with Read More toggle.
11. **Newsletter** — email capture using Shopify's native `customer` form.
12. **Footer** — dark footer with menu columns, contact, social, payment icons, app badges.

## Features

- ✅ Online Store 2.0 JSON templates + section groups
- ✅ Every section editable in the Theme Editor (schema settings + blocks + presets)
- ✅ Dynamic Shopify data — `collection.products`, `linklists` menus, collection images, brand logos, payment icons
- ✅ Sticky header, product sliders, hover effects
- ✅ Wishlist icon (localStorage-backed, live header count)
- ✅ Quick view modal
- ✅ Sale / sold-out badges with automatic discount %
- ✅ Lazy-loaded, responsive `srcset` images (hero uses `fetchpriority="high"`)
- ✅ Fully responsive: desktop / tablet / mobile with a slide-in mobile menu
- ✅ Floating WhatsApp button (theme setting)

## Installation

These files drop into a Shopify theme's standard folders:

```
assets/  config/  layout/  locales/  sections/  snippets/  templates/
```

**Option A — Shopify CLI (recommended)**
```bash
cd shopify-theme
shopify theme push          # push to a dev/unpublished theme
shopify theme dev           # local preview
```

**Option B — Add to an existing theme**
Copy each file into the matching folder of your theme (Admin → Themes → Edit code),
or merge into a theme ZIP. Existing files are **not** overwritten — only add the ones
you're missing. The homepage renders from `templates/index.json`.

## Theme Editor setup

1. **Online Store → Navigation** — create menus `main-menu` and `footer`.
2. **Theme settings** — set logo, colors, fonts, WhatsApp number.
3. **Homepage sections** — assign a collection to *Our Products* and *Bestsellers*,
   pick category collections, upload hero slides, brand logos, promo banners,
   payment icons, and app-store badges.

All copy in `templates/index.json` (headings, service text, about copy) is placeholder
content you can edit inline in the editor.

> Note: this package delivers the homepage experience. To ship a complete storefront
> you'd add the remaining OS 2.0 templates (`product`, `collection`, `cart`, etc.),
> which reuse the same `base.css`, `theme.js`, and `product-card` snippet.
