import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import test from "node:test";
import { parse } from "parse5";
import { menuItems, openingHours, siteInfo } from "../../src/data/site.ts";

const dist = new URL("../../dist/", import.meta.url);
const pages = ["index.html", "menu/index.html", "privacy/index.html", "404.html"];
const attr = (node, key) => node?.attrs?.find(({ name }) => name === key)?.value;
const text = (node) => node.value ?? (node.childNodes ?? []).map(text).join("");
const walk = (node) => [node, ...(node.childNodes ?? []).flatMap(walk)];
const documents = new Map(await Promise.all(pages.map(async (path) => {
  const errors = [];
  const html = await readFile(new URL(path, dist), "utf8");
  const nodes = walk(parse(html, { onParseError: (error) => errors.push(error) }));
  return [path, { html, nodes, errors }];
})));
const meta = (nodes, name) => attr(nodes.find((node) => node.tagName === "meta" && attr(node, "name") === name), "content");
const origin = new URL(attr(documents.get("index.html").nodes.find((node) => attr(node, "rel") === "canonical"), "href")).origin;

test("generated pages have valid HTML, unique IDs, landmarks and search metadata", () => {
  const titles = new Set();
  for (const [path, { nodes, errors }] of documents) {
    assert.deepEqual(errors, [], `${path}: HTML parsing errors`);
    assert.equal(nodes.filter((node) => node.tagName === "h1").length, 1, path);
    assert.equal(nodes.filter((node) => node.tagName === "main").length, 1, path);
    const ids = nodes.map((node) => attr(node, "id")).filter(Boolean);
    assert.equal(ids.length, new Set(ids).size, `${path}: duplicate IDs`);
    for (const node of nodes) {
      for (const key of ["aria-controls", "aria-labelledby", "aria-describedby"]) {
        for (const id of (attr(node, key) ?? "").split(" ").filter(Boolean)) assert.ok(ids.includes(id), `${path}: ${key} ${id}`);
      }
    }
    const title = text(nodes.find((node) => node.tagName === "title"));
    assert.ok(title.length > 10 && !titles.has(title), `${path}: unique title`);
    titles.add(title);
    assert.ok(meta(nodes, "description")?.length > 30, path);
    assert.equal(attr(nodes.find((node) => node.tagName === "html"), "lang"), "en");
    if (path === "404.html") assert.match(meta(nodes, "robots"), /noindex/);
    assert.equal(nodes.filter((node) => ["iframe", "form"].includes(node.tagName)).length, 0, path);
  }
});

test("every local link, anchor, stylesheet, script and responsive image resolves", async () => {
  for (const [path, { nodes }] of documents) {
    const base = new URL(path.replace(/index\.html$/, ""), `${origin}/`);
    for (const node of nodes) {
      const references = [attr(node, "href"), attr(node, "src")];
      if (attr(node, "srcset")) references.push(...attr(node, "srcset").split(",").map((entry) => entry.trim().split(/\s+/)[0]));
      for (const reference of references.filter(Boolean)) {
        const url = new URL(reference, base);
        assert.ok(["http:", "https:", "mailto:", "tel:"].includes(url.protocol), `${path}: unexpected link ${reference}`);
        if (url.origin !== origin) continue;
        const target = decodeURIComponent(url.pathname).slice(1) || "index.html";
        const file = target.endsWith("/") ? `${target}index.html` : target;
        assert.ok((await stat(new URL(file, dist))).isFile(), `${path}: missing ${reference}`);
        if (url.hash && documents.has(file)) assert.ok(documents.get(file).nodes.some((candidate) => attr(candidate, "id") === decodeURIComponent(url.hash.slice(1))), `${path}: broken anchor ${reference}`);
      }
      if (attr(node, "target") === "_blank") assert.match(attr(node, "rel"), /noopener/, path);
      if (node.tagName === "img") {
        assert.ok(attr(node, "alt")?.trim(), `${path}: missing alt`);
        assert.ok(Number(attr(node, "width")) > 0 && Number(attr(node, "height")) > 0, `${path}: image dimensions`);
      }
    }
  }
});

test("published menu preserves all approved prices and usable no-JavaScript disclosures", () => {
  const nodes = documents.get("menu/index.html").nodes;
  const cards = nodes.filter((node) => node.tagName === "details");
  const items = menuItems.filter(({ available }) => available);
  assert.equal(cards.length, items.length);
  items.forEach((item, index) => {
    const summary = cards[index].childNodes.find((node) => node.tagName === "summary");
    assert.ok(text(summary).includes(item.name) && text(summary).includes(item.price), item.name);
    assert.ok(text(cards[index]).includes(item.description), item.name);
    assert.equal(walk(cards[index]).filter((node) => node.tagName === "img").length, 0);
  });
});

test("structured data, sitemap and robots all use the same configured address", async () => {
  for (const { nodes } of documents.values()) {
    const data = JSON.parse(text(nodes.find((node) => attr(node, "type") === "application/ld+json")));
    assert.equal(data["@type"], "CafeOrCoffeeShop");
    assert.equal(data.name, siteInfo.name);
    assert.equal(data.telephone, siteInfo.phoneHref);
    assert.equal(data.email, siteInfo.email);
    assert.equal(data.description, siteInfo.description);
    assert.equal(data.url, origin);
    assert.equal(data.hasMenu, `${origin}/menu/`);
    assert.deepEqual(data.openingHoursSpecification.map(({ opens, closes }) => [opens, closes]), openingHours.map(({ opens, closes }) => [opens, closes]));
  }
  const sitemap = await readFile(new URL("sitemap.xml", dist), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls, [`${origin}/`, `${origin}/menu/`, `${origin}/privacy/`]);
  assert.ok((await readFile(new URL("robots.txt", dist), "utf8")).includes(`${origin}/sitemap.xml`));
});

test("production CSP permits only hashed inline scripts; no secrets or source maps are published", async () => {
  for (const [path, { nodes }] of documents) {
    const policy = attr(nodes.find((node) => attr(node, "http-equiv") === "content-security-policy"), "content");
    assert.ok(policy, `${path}: CSP missing`);
    assert.doesNotMatch(policy, /unsafe-inline|unsafe-eval/);
    assert.match(policy, /object-src 'none'/);
    for (const node of nodes) {
      assert.ok(!(node.attrs ?? []).some(({ name }) => /^on[a-z]+$/.test(name) || name === "style"), `${path}: inline handler/style`);
      if (node.tagName !== "script" || attr(node, "src")) continue;
      const contents = text(node);
      assert.ok(["sha256", "sha384", "sha512"].some((algorithm) => policy.includes(`${algorithm}-${createHash(algorithm).update(contents).digest("base64")}`)), `${path}: inline script blocked by CSP`);
    }
  }
  const headers = await readFile(new URL("_headers", dist), "utf8");
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /\/_astro\/\*/);
  for (const file of await readdir(dist, { recursive: true })) {
    assert.ok(!/\.map$|(^|[\\/])\.env|(^|[\\/])node_modules|\.astro$|\.ts$/.test(file), `Unwanted public file: ${file}`);
  }
});
