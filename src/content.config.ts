import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { slugifyPath } from "./lib/wiki";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./content/posts",
    generateId: ({ entry }) => slugifyPath(entry.replace(/\.md$/, "")),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const worlds = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./content/worlds",
    // A world's index.md gets the world slug itself as its id, so landing
    // pages are exactly the entries whose id has no "/".
    generateId: ({ entry }) =>
      slugifyPath(entry.replace(/\.md$/, "")).replace(/\/index$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    type: z
      .enum(["world", "character", "location", "lore", "page"])
      .default("page"),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, worlds };
