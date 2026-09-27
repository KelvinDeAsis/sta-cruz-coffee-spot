import { defineConfig } from "astro/config";
import { loadEnvFile } from "node:process";
import { deploymentSettings } from "./config/deployment.mjs";

try { loadEnvFile(); } catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const deployment = deploymentSettings();

export default defineConfig({
  site: deployment.site,
  trailingSlash: "always",
  output: "static",
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      scriptDirective: { resources: ["'self'", "https://static.cloudflareinsights.com"] },
      directives: [
        "default-src 'self'", "base-uri 'none'", "object-src 'none'", "form-action 'none'",
        "img-src 'self' data:", "font-src 'self'", "connect-src 'self' https://cloudflareinsights.com",
        "frame-src 'none'", "media-src 'none'", "worker-src 'none'",
      ],
    },
  },
  build: {
    inlineStylesheets: "never",
  },
  vite: {
    define: { "import.meta.env.SITE_NOINDEX": JSON.stringify(deployment.noindex) },
    build: {
      sourcemap: false,
    },
  },
});
