# Sta. Cruz Coffee Spot

A fast, accessible cafe website built with Astro and designed for static deployment on Cloudflare Pages. The homepage introduces the cafe; the separate `/menu/` page lists every item and price.

## Run locally

Use Node.js **24.19.0**, also pinned in `.node-version`. Open a terminal in this project:

```bash
npm ci
npm run dev
```

Open **http://localhost:4321/**. Keep the terminal running; Ctrl+C stops it. `localhost` works only on this computer—it is not a public website address.

To check and preview the production files, stop the development server first (this also avoids simultaneous Vite cache access on Windows):

```bash
npm run release:check
npm run preview
```

The preview prints its address. See [the deployment checklist](DEPLOYMENT.md) before publishing.

## Update cafe content

Business details, hours, story copy, and menu content live in `src/data/site.ts`.

The menu in `menuItems` was transcribed from the cafe menu photo supplied on 2026-09-23. Edit names, descriptions, prices, and availability there when the printed menu changes. The short descriptions are drafts based on item names and notes visible in the photo; confirm them with the cafe before publishing. These descriptions are not allergen information. The `bestseller` flags are retained in the data but are not displayed on the site. Example shape:

```ts
{
  name: "Owner-approved name",
  description: "Owner-approved short description.",
  price: "₱160",
  category: "Coffee",
  bestseller: true,
  available: true,
}
```

The hero, Story section, and Follow Along gallery use the supplied cafe photos, optimized into responsive AVIF/WebP files at build time. The Menu page is intentionally a compact text menu with no product images or placeholders until individual product photos are supplied. Coffee opens first, All items remains available, and native disclosures support hover, click/tap, and keyboard. With JavaScript disabled, all categories and item descriptions remain accessible. Fonts are local/system fonts, with no external font requests.

The footer links to the `/privacy/` notice. Review its contact, hosting, analytics, and email-handling statements with the cafe before launch, and reassess policies/consent if forms, embeds, cookies, or advertising trackers are added. No new cookie banner or Terms of Use page has been added in this release.

## Canonical URL and deployment

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `SITE_URL=https://your-final-domain.example`
- Preview builds: `NOINDEX=true`; approved production builds: `NOINDEX=false`

Set `SITE_URL` to the actual assigned Pages address or custom domain before the production build so canonical links, the sitemap, robots file, and structured data agree. A Cloudflare build fails if the value is missing. Local builds fall back to `http://localhost:4321` with `noindex`; there is no assumed public domain. For local domain testing, copy `.env.example` to `.env` and replace its example address. Never put credentials in this URL.

Enable privacy-first analytics in **Cloudflare Dashboard → Workers & Pages → project → Metrics → Web Analytics**. Cloudflare injects the beacon automatically after the next deployment. Cloudflare Web Analytics does not currently support custom click events, so `data-analytics` labels are present as stable future instrumentation hooks but do not transmit data.

## Security

Astro generates a hash-based Content Security Policy in every page. Cloudflare Pages reads additional response-header rules and fingerprinted asset caching from `public/_headers`. Astro's local preview does not apply that Cloudflare file, so verify the actual HTTP headers after deployment. The site has no forms, accounts, API keys, database, booking flow, or user-generated content. Keep secrets out of the repository; `.env` files and source maps are not published.

`npm run release:check` runs content/configuration tests, Astro/TypeScript checks, a static build, generated-page checks, and a dependency audit. The generated-page tests validate links/anchors/assets, all menu prices, unique IDs, metadata, structured data, sitemap, CSP, and unwanted public files. Also perform the manual browser checks in [DEPLOYMENT.md](DEPLOYMENT.md).
