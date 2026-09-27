import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { menuItems } from "../src/data/site.ts";
import { deploymentSettings } from "../config/deployment.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("business details use the verified launch information", async () => {
  const source = await read("src/data/site.ts");

  assert.match(source, /2115 Dapitan St\., Sampaloc, Manila/);
  assert.match(source, /0915 128 7026/);
  assert.match(source, /stacruzcoffeespot@gmail\.com/);
  assert.match(source, /10:00 AM–10:00 PM/);
  assert.match(source, /11:00 AM–10:00 PM/);
  assert.match(source, /2:00 PM–10:00 PM/);
});

test("the photographed menu and three owner-named drinks have the right prices", () => {
  assert.equal(menuItems.length, 41);
  assert.ok(menuItems.every((item) => item.description.trim().length > 0));
  assert.deepEqual(
    menuItems.filter((item) => item.bestseller).map(({ name, price }) => [name, price]),
    [
      ["Spanish Latte", "₱160"],
      ["Caramel Latte", "₱160"],
      ["Matcha Latte", "₱170"],
    ],
  );
  assert.equal(menuItems.find((item) => item.name === "Chocolate Oat Milk")?.price, "₱200");
  assert.equal(menuItems.find((item) => item.name === "Open-faced Sourdough Toast — Tuna & Egg Salad")?.price, "₱105");
});

test("security headers deny framing and sensitive browser capabilities", async () => {
  const headers = await read("public/_headers");

  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/);
  assert.match(headers, /camera=\(\)/);
  assert.match(headers, /geolocation=\(\)/);
  assert.match(headers, /microphone=\(\)/);
});

test("the home page links to the separate menu without a bestseller section", async () => {
  const source = await read("src/pages/index.astro");

  for (const section of ["story"]) {
    assert.match(source, new RegExp(`id=\\"${section}\\"`));
  }

  assert.match(source, /href="\/menu\/"/);
  assert.doesNotMatch(source, /id="bestsellers"/);
  const menu = await read("src/pages/menu.astro");
  assert.match(menu, /id="menu"/);
  assert.match(menu, /data-filter/);
  assert.match(menu, /data-menu-section/);
  assert.match(menu, /\{item.price\}/);
  assert.match(menu, /menu-sidebar/);
  assert.doesNotMatch(menu, /bestseller-tag/);
  assert.doesNotMatch(menu, /category-visual/);
  assert.doesNotMatch(menu, /<Image/);
  assert.doesNotMatch(menu, /product-media--placeholder|menu-item-indicator/);
  const header = await read("src/components/Header.astro");
  assert.match(header, /href="\/menu\/"/);
  assert.doesNotMatch(header, /#bestsellers/);
  const footer = await read("src/components/Footer.astro");
  assert.match(footer, /id="visit"/);
});

test("deployment URLs fail safely and local previews are not indexed", () => {
  assert.deepEqual(deploymentSettings({}), { site: "http://localhost:4321", noindex: true });
  assert.deepEqual(deploymentSettings({ SITE_URL: "https://cafe.example/" }), { site: "https://cafe.example", noindex: false });
  assert.equal(deploymentSettings({ SITE_URL: "https://cafe.example", NOINDEX: "true" }).noindex, true);
  assert.throws(() => deploymentSettings({ CF_PAGES: "1" }), /Set SITE_URL/);
  for (const SITE_URL of ["http://cafe.example", "https://cafe.example/menu/", "https://user:pass@cafe.example", "https://cafe.example/?test=1", "javascript:alert(1)"]) {
    assert.throws(() => deploymentSettings({ SITE_URL }));
  }
  assert.throws(() => deploymentSettings({ CF_PAGES: "1", SITE_URL: "http://localhost:4321" }));
  assert.throws(() => deploymentSettings({ NOINDEX: "yes" }), /NOINDEX/);
});

test("the sitemap includes the menu page", async () => {
  const sitemap = await read("src/pages/sitemap.xml.ts");
  assert.match(sitemap, /\/menu\//);
  assert.match(sitemap, /\/privacy\//);
});

test("the privacy notice is linked from every page footer and describes the current site", async () => {
  const footer = await read("src/components/Footer.astro");
  const notice = await read("src/pages/privacy.astro");

  assert.match(footer, /href="\/privacy\/"/);
  assert.match(notice, /Cloudflare Web Analytics/);
  assert.match(notice, /does not set cookies/);
  assert.match(notice, /no booking,/i);
  assert.match(notice, /mailto:/);
});
