import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import remarkWikiLink from "./src/lib/remark-wiki-link";
import { getPermalinks } from "./src/lib/wiki";
import { BASE } from "./src/lib/site";

export default defineConfig({
  // GitHub Pages project site: served from <user>.github.io/jvblog/.
  // `site` is the origin only; the subpath lives in `base` (see src/lib/site).
  site: "https://jvalenteros.github.io",
  base: BASE,
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [[remarkWikiLink, { permalinks: getPermalinks() }]],
  },
});
