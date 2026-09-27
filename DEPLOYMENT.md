# Deployment checklist

Use this when publishing the cafe website or updating an existing release. You need the owner's content approval, a repository you control, and access to the Cloudflare Pages project. Local checks do not publish the website.

## Before uploading

- [ ] Owner approves the 41 menu items/prices and draft drink descriptions.
- [ ] Owner confirms current contact details, opening hours, and permission to publish all supplied photos.
- [ ] Owner reviews the privacy notice, including email handling and the chosen analytics setup.
- [ ] Stop the development server, then run `npm ci` and `npm run release:check` with Node.js 24.19.0. Resolve failures before publishing.
- [ ] Run `npm run preview`. Check Home, Menu, Privacy, and a missing page at phone and desktop sizes. Test keyboard navigation, menu filters, descriptions, scrolling-text pause, and phone/email/directions links. Product images are intentionally absent.

## First Cloudflare Pages setup

1. Connect the Git repository in Cloudflare Pages and select your production branch.
2. Choose Astro; use `npm run build` as the build command and `dist` as the output directory. No adapter or application server is required.
3. The runtime is pinned by `.node-version`. If the dashboard overrides it, set `NODE_VERSION=24.19.0` too.
4. Set `SITE_URL` in the build environment to the project's real HTTPS address. Use the assigned `https://…pages.dev` address initially, or a connected custom domain. Do not leave the example address from `.env.example` in production.
5. Set `NOINDEX=true` for Preview environments. Keep Production at `NOINDEX=true` until review is finished, then change it to `false` and rebuild. Noindex prevents indexing; it does **not** restrict access to a public preview URL.
6. Deploy and review a preview before publishing the production branch. When you change domains, update `SITE_URL` and redeploy. Configure a redirect from the old public address to the chosen canonical address.

## Check the hosted release

- [ ] HTTPS works without warnings on the chosen domain.
- [ ] Home, `/menu/`, and `/privacy/` load. A nonexistent URL returns HTTP **404**, not a successful response with the homepage.
- [ ] `/sitemap.xml`, `/robots.txt`, canonical links, and social metadata use the chosen public address.
- [ ] Production pages allow indexing only after approval; 404 and previews stay unindexed.
- [ ] Check response headers: CSP with framing protection, HSTS, nosniff, referrer policy, and restrictive browser permissions. Check the HTML's generated CSP too. Cloudflare applies `_headers`; the local Astro preview does not.
- [ ] No blocked scripts, broken photos, unexpected cookies, form requests, or console errors. Test navigation and filters again under the production security policy.
- [ ] If enabling Cloudflare Web Analytics, verify exactly one beacon and aggregate visits. The existing `data-analytics` labels do not record custom CTA clicks. Revisit the privacy notice if the analytics setup changes.
- [ ] Run Lighthouse against hosted Home and Menu pages, targeting 90+ in each category. Complete keyboard and screen-reader smoke tests; local structural tests are not a full accessibility audit.
- [ ] Submit the public sitemap in Google Search Console after indexing is enabled.

## Roll back a failed release

In **Cloudflare Pages → Deployments**, choose a known-good production deployment and use **Rollback**. No database rollback is needed. Check the restored menu, contact links, images, and domain, then fix the problem locally and repeat the checks above. On the first release there is no known-good production version: keep it unindexed until sign-off and do not share it as the finished site.

References: [Astro deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [runtime versions](https://developers.cloudflare.com/pages/configuration/build-image/), [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/), [Astro CSP](https://docs.astro.build/en/reference/configuration-reference/#securitycsp), [rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/).
