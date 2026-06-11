import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import remarkWikiLink from "./src/lib/remark-wiki-link";
import { getPermalinks } from "./src/lib/wiki";

export default defineConfig({
  // TODO: set to the real domain before deploying (used for sitemap + RSS)
  site: "https://jvalenteros.github.io/jvblog/",
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [[remarkWikiLink, { permalinks: getPermalinks() }]],
  },
});
