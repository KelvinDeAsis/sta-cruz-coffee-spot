export function deploymentSettings(env = process.env) {
  if (env.CF_PAGES === "1" && !env.SITE_URL) {
    throw new Error("Set SITE_URL in Cloudflare Pages to your actual HTTPS site address before building.");
  }

  const site = new URL(env.SITE_URL || "http://localhost:4321");
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(site.hostname);
  if ((!local && site.protocol !== "https:") || !["http:", "https:"].includes(site.protocol)
    || site.username || site.password || site.pathname !== "/" || site.search || site.hash
    || (env.CF_PAGES === "1" && local)) {
    throw new Error("SITE_URL must be the site's HTTPS origin, with no path, query, or credentials.");
  }
  if (env.NOINDEX && !["true", "false"].includes(env.NOINDEX)) {
    throw new Error("NOINDEX must be true or false.");
  }

  return { site: site.origin, noindex: local || env.NOINDEX === "true" };
}
